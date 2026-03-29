import { useState } from "react";
import { Search, X } from "lucide-react";
import { ModalBox } from "../components/ModalShared.tsx";
import { TRIGGERS, TRIGGER_CATS, STYLES } from "../constants.ts";
import { TriggerOption } from "../types.ts";

interface SelectTriggerModalProps {
    onSelect: (trigger: TriggerOption) => void;
    onClose: () => void;
}

export function SelectTriggerModal({ onSelect, onClose }: SelectTriggerModalProps) {
    const [cat, setCat] = useState("View All");
    const [q, setQ] = useState("");
    const filtered = TRIGGERS.filter(
        (t) => (cat === "View All" || t.cat === cat) && t.label.toLowerCase().includes(q.toLowerCase())
    );
    return (
        <ModalBox style={{ width: 780, minHeight: 500 }}>
            <div style={{ display: "flex", alignItems: "center", padding: "20px 24px", gap: 16, borderBottom: "1px solid #f1f5f9" }}>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: "#0f172a", flex: 1 }}>Select a Trigger</h2>
                <div style={{ position: "relative" }}>
                    <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                    <input
                        placeholder="Search triggers"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        style={{ padding: "8px 12px 8px 32px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, width: 200 }}
                    />
                </div>
                <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><X size={20} /></button>
            </div>
            <div style={{ display: "flex" }}>
                {/* Sidebar */}
                <div style={{ width: 180, borderRight: "1px solid #f1f5f9", padding: "16px 0", flexShrink: 0 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", padding: "0 16px 8px", letterSpacing: "0.05em" }}>TRIGGER CATEGORIES</div>
                    {TRIGGER_CATS.map((c) => (
                        <button key={c} onClick={() => setCat(c)} style={{
                            display: "block", width: "100%", textAlign: "left", padding: "8px 16px",
                            background: cat === c ? "#f0f9ff" : "none", border: "none",
                            borderLeft: cat === c ? "3px solid #3b82f6" : "3px solid transparent",
                            color: cat === c ? "#1d4ed8" : "#374151", fontSize: 13, cursor: "pointer",
                        }}>{c}</button>
                    ))}
                </div>
                {/* Grid */}
                <div style={{ flex: 1, padding: 24, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, alignContent: "start" }}>
                    {filtered.map((t) => {
                        const Icon = t.Icon;
                        return (
                            <button key={t.id} onClick={() => onSelect(t)} style={{
                                display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
                                padding: "16px 8px", border: "1px solid #f1f5f9", borderRadius: 10,
                                background: "#fafafa", cursor: "pointer", transition: "all 0.15s",
                                fontSize: 12, color: "#374151", textAlign: "center", lineHeight: 1.4,
                            }}
                                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#3b82f6"; e.currentTarget.style.background = "#f0f9ff"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#f1f5f9"; e.currentTarget.style.background = "#fafafa"; }}
                            >
                                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <Icon size={20} color="#1d4ed8" />
                                </div>
                                {t.label}
                            </button>
                        );
                    })}
                </div>
            </div>
            <div style={{ borderTop: "1px solid #f1f5f9", padding: "16px 24px", display: "flex", justifyContent: "flex-end" }}>
                <button onClick={onClose} style={{ ...STYLES.btn("#3b82f6") }}>Start without a trigger</button>
            </div>
        </ModalBox>
    );
}
