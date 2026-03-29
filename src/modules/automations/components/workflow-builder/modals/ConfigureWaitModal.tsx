import { useState } from "react";
import { Clock, X, ChevronLeft } from "lucide-react";
import { ModalBox } from "../components/ModalShared.tsx";
import { STYLES, WAIT_UNITS } from "../constants.ts";
import { NodeConfig } from "../types.ts";

interface ConfigureWaitModalProps {
    config?: NodeConfig;
    onSave: (config: any) => void;
    onBack: () => void;
    onClose: () => void;
}

export function ConfigureWaitModal({ config, onSave, onBack, onClose }: ConfigureWaitModalProps) {
    const [step, setStep] = useState(config ? "amount" : "type");
    const [amount, setAmount] = useState(config?.amount || 1);
    const [unit, setUnit] = useState(config?.unit || "day(s)");

    if (step === "type") {
        const opts = [
            { id: "period", label: "A set period of time", sub: "e.g. 2 weeks, 1 day, 6 hours, 1 hour and 30 minutes" },
            { id: "date", label: "Until a specific day and/or time", sub: "e.g. November 24th at 8:00 AM" },
            { id: "datefield", label: "Until a custom date field matches", sub: 'e.g. Until 3 days before "Webinar date"' },
            { id: "conditions", label: "Until specific conditions are met", sub: "Build a custom segment with any of your fields" },
        ];
        return (
            <ModalBox style={{ width: 600 }}>
                <div style={{ display: "flex", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid #f1f5f9", gap: 12 }}>
                    <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: "#3b82f6", display: "flex", alignItems: "center", gap: 4, fontSize: 14 }}>
                        <ChevronLeft size={16} /> Back
                    </button>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#0f2544", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Clock size={18} color="#fff" />
                            </div>
                            <div>
                                <div style={{ fontSize: 18, fontWeight: 600, color: "#0f172a" }}>Add a Wait Condition</div>
                                <div style={{ fontSize: 13, color: "#64748b" }}>Wait for a period of time, a specific date, or for conditions</div>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><X size={20} /></button>
                </div>
                <div style={{ padding: "20px 24px" }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "#1e293b", marginBottom: 16 }}>The contact will wait:</div>
                    {opts.map((o) => (
                        <button key={o.id} onClick={() => setStep(o.id)} style={{
                            display: "block", width: "100%", textAlign: "left", padding: "16px",
                            border: "1px solid #e2e8f0", borderRadius: 10, background: "#fff",
                            marginBottom: 10, cursor: "pointer",
                        }}
                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#3b82f6"; e.currentTarget.style.background = "#f0f9ff"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#fff"; }}
                        >
                            <div style={{ fontSize: 14, fontWeight: 500, color: "#1e293b" }}>{o.label}</div>
                            <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{o.sub}</div>
                        </button>
                    ))}
                </div>
                <div style={{ borderTop: "1px solid #f1f5f9", padding: "16px 24px", display: "flex", justifyContent: "flex-end", gap: 10 }}>
                    <button onClick={onClose} style={{ ...STYLES.btn("#f1f5f9", "#374151") }}>Cancel</button>
                    <button style={{ ...STYLES.btn("#e2e8f0", "#94a3b8") }} disabled>Save</button>
                </div>
            </ModalBox>
        );
    }
    return (
        <ModalBox style={{ width: 600 }}>
            <div style={{ display: "flex", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid #f1f5f9", gap: 12 }}>
                {!config && (
                    <button onClick={() => setStep("type")} style={{ background: "none", border: "none", cursor: "pointer", color: "#3b82f6", display: "flex", alignItems: "center", gap: 4, fontSize: 14 }}>
                        <ChevronLeft size={16} /> Back
                    </button>
                )}
                <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#0f2544", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Clock size={18} color="#fff" />
                        </div>
                        <div>
                            <div style={{ fontSize: 18, fontWeight: 600, color: "#0f172a" }}>{config ? "Edit Wait" : "Wait for a set period of time"}</div>
                            <div style={{ fontSize: 13, color: "#64748b" }}>e.g. 2 weeks, 1 day, 6 hours, 1 hour and 30 minutes</div>
                        </div>
                    </div>
                </div>
                <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><X size={20} /></button>
            </div>
            <div style={{ padding: "28px 24px 40px" }}>
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 12, color: "#374151" }}>Wait for</div>
                <div style={{ display: "flex", gap: 12 }}>
                    <input type="number" min={1} value={amount} onChange={(e) => setAmount(Number(e.target.value))}
                           style={{ width: 80, padding: "10px 12px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 14 }} />
                    <select value={unit} onChange={(e) => setUnit(e.target.value)}
                            style={{ padding: "10px 12px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 14 }}>
                        {WAIT_UNITS.map((u) => <option key={u}>{u}</option>)}
                    </select>
                </div>
            </div>
            <div style={{ borderTop: "1px solid #f1f5f9", padding: "16px 24px", display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button onClick={onClose} style={{ ...STYLES.btn("#f1f5f9", "#374151") }}>Cancel</button>
                <button onClick={() => onSave({ amount, unit })} style={{ ...STYLES.btn("#3b82f6") }}>{config ? "Save Changes" : "Save"}</button>
            </div>
        </ModalBox>
    );
}
