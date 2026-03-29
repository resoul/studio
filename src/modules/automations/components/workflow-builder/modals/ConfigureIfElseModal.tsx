import { useState } from "react";
import { GitBranch, X, ChevronLeft, ChevronDown, ArrowRight } from "lucide-react";
import { ModalBox } from "../components/ModalShared.tsx";
import { STYLES, COND_FIELDS, COND_OPS } from "../constants.ts";
import { NodeConfig } from "../types.ts";

interface ConfigureIfElseModalProps {
    config?: NodeConfig;
    onSave: (config: any) => void;
    onBack: () => void;
    onClose: () => void;
}

export function ConfigureIfElseModal({ config, onSave, onBack, onClose }: ConfigureIfElseModalProps) {
    const [field, setField] = useState(config?.field || "Email Address");
    const [op, setOp] = useState(config?.op || "Is");
    const [value, setValue] = useState(config?.value || "");
    return (
        <ModalBox style={{ width: 680 }}>
            <div style={{ display: "flex", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid #f1f5f9", gap: 12 }}>
                {!config && (
                    <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: "#3b82f6", display: "flex", alignItems: "center", gap: 4, fontSize: 14 }}>
                        <ChevronLeft size={16} /> Back
                    </button>
                )}
                <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#374151", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <GitBranch size={18} color="#fff" />
                        </div>
                        <div>
                            <div style={{ fontSize: 18, fontWeight: 600, color: "#0f172a" }}>{config ? "Edit conditions" : "Does contact match these conditions?"}</div>
                            <div style={{ fontSize: 13, color: "#64748b" }}>Split the automation based on conditions</div>
                        </div>
                    </div>
                </div>
                <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><X size={20} /></button>
            </div>
            <div style={{ padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
                    <button style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: 13 }}>Clear all conditions</button>
                </div>
                <div style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: 16, marginBottom: 16 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <div style={{ position: "relative", flex: 2 }}>
                            <select value={field} onChange={(e) => setField(e.target.value)}
                                    style={{ width: "100%", padding: "10px 12px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 13, appearance: "none" }}>
                                {COND_FIELDS.map((f) => <option key={f}>{f}</option>)}
                            </select>
                            <ChevronDown size={14} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#94a3b8" }} />
                        </div>
                        <div style={{ position: "relative", flex: 1 }}>
                            <select value={op} onChange={(e) => setOp(e.target.value)}
                                    style={{ width: "100%", padding: "10px 12px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 13, appearance: "none" }}>
                                {COND_OPS.map((o) => <option key={o}>{o}</option>)}
                            </select>
                            <ChevronDown size={14} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#94a3b8" }} />
                        </div>
                        <input placeholder="Enter value..." value={value} onChange={(e) => setValue(e.target.value)}
                               style={{ flex: 2, padding: "10px 12px", border: "1px solid #3b82f6", borderRadius: 6, fontSize: 13 }} />
                    </div>
                    <button style={{ background: "none", border: "none", color: "#3b82f6", fontSize: 13, cursor: "pointer", marginTop: 8 }}>
                        + Add another condition
                    </button>
                </div>
                <button style={{ ...STYLES.btn("#f1f5f9", "#374151"), width: "auto", marginBottom: 20 }}>Add condition group</button>
                <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 16 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "#374151", marginBottom: 10 }}>Select a segment to use its conditions</div>
                    <div style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: "12px 16px", display: "flex", alignItems: "center", gap: 8, color: "#374151", cursor: "pointer" }}>
                        <ArrowRight size={16} color="#94a3b8" />
                        <span style={{ fontSize: 14 }}>Saved Segments</span>
                    </div>
                </div>
            </div>
            <div style={{ borderTop: "1px solid #f1f5f9", padding: "16px 24px", display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button onClick={onClose} style={{ ...STYLES.btn("#f1f5f9", "#374151") }}>Cancel</button>
                <button onClick={() => onSave({ field, op, value })} style={{ ...STYLES.btn("#3b82f6") }}>{config ? "Save Changes" : "Save"}</button>
            </div>
        </ModalBox>
    );
}
