package main

import (
	"context"
	"log"
	"net/http"

	"yourmodule/tracking"
)

func main() {
	proc := tracking.NewDispatchProcessor(tracking.Handlers{

		OnPageview: func(ev tracking.Event) error {
			log.Printf("pageview  account=%s visitor=%s path=%s",
				ev.AccountID, ev.VisitorID, ev.Path)
			// TODO: upsert into page_views table
			return nil
		},

		OnIdentify: func(ev tracking.Event) error {
			log.Printf("identify  account=%s email=%s visitor=%s",
				ev.AccountID, ev.Email, ev.VisitorID)
			// TODO: match/create contact, link visitorId → contact
			return nil
		},

		OnEvent: func(ev tracking.Event) error {
			log.Printf("event     account=%s name=%s visitor=%s",
				ev.AccountID, ev.Name, ev.VisitorID)
			// TODO: store in events table, trigger automations
			return nil
		},
	})

	http.Handle("/t", tracking.IngestHandler(proc))

	log.Println("ingest listening on :8090")
	log.Fatal(http.ListenAndServe(":8090", nil))
}

// ─── How to wire tracking.IngestHandler with a context.Context ───────────────
//
// The EventProcessor interface uses a minimal interface for the context
// so it doesn't force an import of "context" on implementors.
// If you need a real context.Context, use a type assertion:
//
//   func (p *MyProcessor) Process(ctx interface{ Done() <-chan struct{} }, events []tracking.Event) error {
//       realCtx, ok := ctx.(context.Context)
//       if !ok {
//           realCtx = context.Background()
//       }
//       return p.db.InsertEvents(realCtx, events)
//   }
//
// ─────────────────────────────────────────────────────────────────────────────

// processWithContext is a helper that wraps Process to accept context.Context.
func processWithContext(proc tracking.EventProcessor, ctx context.Context, events []tracking.Event) error {
	return proc.Process(ctx, events)
}