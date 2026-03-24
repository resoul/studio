package tracking

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"strings"
	"time"
)

// ─────────────────────────────────────────────────────────────────────────────
// Domain types
// ─────────────────────────────────────────────────────────────────────────────

// Event is a single tracking event emitted by tracker.js.
type Event struct {
	// Set by tracker.js
	Type      string         `json:"type"`      // "pageview" | "event" | "identify"
	Name      string         `json:"name"`      // event name (for type="event")
	Timestamp string         `json:"timestamp"` // ISO 8601
	SessionID string         `json:"sessionId"`
	VisitorID string         `json:"visitorId"`
	AccountID string         `json:"accountId"`

	// Identity
	Email         string         `json:"email,omitempty"`
	ContactFields map[string]any `json:"contactFields,omitempty"`

	// Page context (pageview + event)
	URL      string `json:"url,omitempty"`
	Path     string `json:"path,omitempty"`
	Search   string `json:"search,omitempty"`
	Hash     string `json:"hash,omitempty"`
	Title    string `json:"title,omitempty"`
	Referrer string `json:"referrer,omitempty"`

	// Browser context
	UserAgent string `json:"userAgent,omitempty"`
	Language  string `json:"language,omitempty"`
	Timezone  string `json:"timezone,omitempty"`

	// Arbitrary extra data (for type="event")
	Data map[string]any `json:"data,omitempty"`

	// Enriched server-side
	ReceivedAt time.Time `json:"receivedAt"`
	IP         string    `json:"ip"`
}

// Batch is the payload the tracker sends per HTTP request.
type Batch struct {
	AccountID string  `json:"accountId"`
	Events    []Event `json:"events"`
}

// ─────────────────────────────────────────────────────────────────────────────
// Handler
// ─────────────────────────────────────────────────────────────────────────────

// IngestHandler accepts POST /t from tracker.js and fans events out to the
// provided EventProcessor.
//
// Usage:
//
//	processor := &MyProcessor{}
//	http.Handle("/t", tracking.IngestHandler(processor))
func IngestHandler(proc EventProcessor) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// CORS — tracker.js runs on third-party domains
		origin := r.Header.Get("Origin")
		if origin != "" {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Vary", "Origin")
		} else {
			w.Header().Set("Access-Control-Allow-Origin", "*")
		}
		w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Access-Control-Max-Age", "86400")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		if r.Method != http.MethodPost {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}

		// Read body (limit to 1 MB)
		body, err := io.ReadAll(io.LimitReader(r.Body, 1<<20))
		if err != nil {
			http.Error(w, "failed to read body", http.StatusBadRequest)
			return
		}
		defer r.Body.Close()

		var batch Batch
		if err := json.Unmarshal(body, &batch); err != nil {
			http.Error(w, "invalid JSON", http.StatusBadRequest)
			return
		}

		if batch.AccountID == "" {
			http.Error(w, "accountId is required", http.StatusBadRequest)
			return
		}

		ip := extractIP(r)
		receivedAt := time.Now().UTC()

		enriched := make([]Event, 0, len(batch.Events))
		for _, ev := range batch.Events {
			// Basic sanity checks
			if ev.Type == "" {
				continue
			}
			// Server-side enrichment
			ev.ReceivedAt = receivedAt
			ev.IP = ip
			// Override accountId with the one in the envelope (trusted)
			ev.AccountID = batch.AccountID
			enriched = append(enriched, ev)
		}

		if len(enriched) == 0 {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		if err := proc.Process(r.Context(), enriched); err != nil {
			log.Printf("tracking: processor error: %v", err)
			// Still respond 202 — we don't want the client to retry
		}

		// 202 Accepted — fire-and-forget from the client's perspective
		w.WriteHeader(http.StatusAccepted)
	})
}

// extractIP pulls the real client IP, respecting common proxy headers.
func extractIP(r *http.Request) string {
	for _, h := range []string{"X-Forwarded-For", "X-Real-Ip", "CF-Connecting-IP"} {
		if v := r.Header.Get(h); v != "" {
			// X-Forwarded-For can be comma-separated; take the first
			return strings.TrimSpace(strings.SplitN(v, ",", 2)[0])
		}
	}
	// Strip port from RemoteAddr
	ip := r.RemoteAddr
	if colon := strings.LastIndex(ip, ":"); colon != -1 {
		ip = ip[:colon]
	}
	return ip
}

// ─────────────────────────────────────────────────────────────────────────────
// EventProcessor interface — implement this for your storage backend
// ─────────────────────────────────────────────────────────────────────────────

type EventProcessor interface {
	Process(ctx interface{ Done() <-chan struct{} }, events []Event) error
}

// ─────────────────────────────────────────────────────────────────────────────
// LogProcessor — reference implementation that logs events to stdout
// ─────────────────────────────────────────────────────────────────────────────

type LogProcessor struct{}

func (p *LogProcessor) Process(_ interface{ Done() <-chan struct{} }, events []Event) error {
	for _, ev := range events {
		data, _ := json.Marshal(ev)
		log.Printf("[tracking event] %s", data)
	}
	return nil
}

// ─────────────────────────────────────────────────────────────────────────────
// DispatchProcessor — routes events to typed handlers
// ─────────────────────────────────────────────────────────────────────────────

type Handlers struct {
	// OnPageview is called for type="pageview" events.
	OnPageview func(ev Event) error

	// OnIdentify is called for type="identify" events (contact matched by email).
	OnIdentify func(ev Event) error

	// OnEvent is called for type="event" custom events.
	OnEvent func(ev Event) error
}

type DispatchProcessor struct {
	h Handlers
}

func NewDispatchProcessor(h Handlers) *DispatchProcessor {
	return &DispatchProcessor{h: h}
}

func (p *DispatchProcessor) Process(_ interface{ Done() <-chan struct{} }, events []Event) error {
	for _, ev := range events {
		var err error
		switch ev.Type {
		case "pageview":
			if p.h.OnPageview != nil {
				err = p.h.OnPageview(ev)
			}
		case "identify":
			if p.h.OnIdentify != nil {
				err = p.h.OnIdentify(ev)
			}
		case "event":
			if p.h.OnEvent != nil {
				err = p.h.OnEvent(ev)
			}
		default:
			log.Printf("tracking: unknown event type %q", ev.Type)
		}
		if err != nil {
			log.Printf("tracking: handler error for %s/%s: %v", ev.Type, ev.Name, err)
		}
	}
	return nil
}