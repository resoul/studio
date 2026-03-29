import { useState } from "react";
import { Search } from "lucide-react";
import { ModalBox, ModalHeader } from "../components/ModalShared.tsx";
import { ALL_ACTIONS, ACTION_TABS } from "../constants.ts";
import { ActionOption } from "../types.ts";

interface AddActionModalProps {
    onSelect: (action: ActionOption) => void;
    onClose: () => void;
}

export function AddActionModal({ onSelect, onClose }: AddActionModalProps) {
    const [tab, setTab] = useState("Workflow");
    const [q, setQ] = useState("");
    const actions = ALL_ACTIONS.filter(
        (a) => a.tabs.includes(tab) && (a.label.toLowerCase().includes(q.toLowerCase()) || a.desc.toLowerCase().includes(q.toLowerCase()))
    );
    // dedupe by id for suggested tab
    const seen = new Set();
    const deduped = actions.filter((a) => { if (seen.has(a.id)) return false; seen.add(a.id); return true; });
    return (
        <ModalBox style={{ width: 600 }}>
            <ModalHeader title="Add an action" onClose={onClose} />
            <div style={{ padding: "16px 24px 0" }}>
                <div style={{ position: "relative", marginBottom: 16 }}>
                    <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                    <input
                        placeholder="Search for an action"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        style={{ width: "100%", padding: "10px 12px 10px 36px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }}
                    />
                </div>
                <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #f1f5f9" }}>
                    {ACTION_TABS.map((t) => (
                        <button key={t} onClick={() => setTab(t)} style={{
                            padding: "10px 14px", border: "none", background: "none",
                            borderBottom: tab === t ? "2px solid #3b82f6" : "2px solid transparent",
                            color: tab === t ? "#1d4ed8" : "#64748b", fontSize: 13, fontWeight: tab === t ? 600 : 400,
                            cursor: "pointer",
                        }}>{t}</button>
                    ))}
                </div>
            </div>
            <div style={{ padding: "12px 24px 24px" }}>
                {deduped.map((a) => {
                    const Icon = a.Icon;
                    return (
                        <button key={a.id + a.tabs[0]} onClick={() => onSelect(a)} style={{
                            display: "flex", alignItems: "center", gap: 16, width: "100%",
                            padding: "14px 0", borderBottom: "1px solid #f8fafc", border: "none",
                            background: "none", cursor: "pointer", textAlign: "left",
                        }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = "#f8fafc"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}
                        >
                            <div style={{ width: 44, height: 44, borderRadius: "50%", background: a.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <Icon size={20} color="#fff" />
                            </div>
                            <div>
                                <div style={{ fontSize: 15, fontWeight: 500, color: "#1e293b" }}>{a.label}</div>
                                <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>{a.desc}</div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </ModalBox>
    );
}
