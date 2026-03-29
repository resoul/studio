import { useState } from "react";
import { ModalBox, ModalHeader } from "../components/ModalShared.tsx";
import { STYLES } from "../constants.ts";
import { NodeConfig } from "../types.ts";

interface ConfigureEmailModalProps {
    config?: NodeConfig;
    onSave: (config: any) => void;
    onBack: () => void;
    onClose: () => void;
}

export function ConfigureEmailModal({ config, onSave, onBack, onClose }: ConfigureEmailModalProps) {
    const [name, setName] = useState(config?.name || "New Campaign");
    const [subject, setSubject] = useState(config?.subject || "");
    return (
        <ModalBox style={{ width: 640 }}>
            <ModalHeader title={config ? "Edit email" : "Send an email"} onBack={onBack} onClose={onClose} />
            <div style={{ padding: "8px 24px 0", color: "#64748b", fontSize: 13, marginBottom: 16 }}>A marketing email for subscribed contacts</div>
            <div style={{ padding: "0 24px 24px" }}>
                {[
                    { label: "Email name", el: <input value={name} onChange={(e) => setName(e.target.value)} style={{ flex: 1, padding: "10px 12px", border: "none", fontSize: 14 }} /> },
                    { label: "Subject line", el: <input placeholder="Write your subject line" value={subject} onChange={(e) => setSubject(e.target.value)} style={{ flex: 1, padding: "10px 12px", border: "none", fontSize: 14 }} /> },
                    { label: "From", el: <span style={{ flex: 1, fontSize: 14, color: "#374151", padding: "10px 0" }}>user@example.com</span> },
                    { label: "Send", el: <div style={{ display: "flex", gap: 8, padding: "8px 0" }}><button style={{ ...STYLES.btn("#3b82f6"), borderRadius: 20 }}>Immediately</button><button style={{ ...STYLES.btn("#f1f5f9", "#374151"), borderRadius: 20 }}>Predictive Send</button></div> },
                ].map(({ label, el }) => (
                    <div key={label} style={{ display: "flex", alignItems: "center", borderBottom: "1px solid #f1f5f9", padding: "4px 0" }}>
                        <div style={{ width: 120, fontSize: 14, color: "#374151", fontWeight: 500 }}>{label}</div>
                        {el}
                    </div>
                ))}
                <div style={{ marginTop: 16, border: "1px solid #e2e8f0", borderRadius: 8, padding: 24, textAlign: "center", color: "#94a3b8", fontSize: 14 }}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: "#cbd5e1", marginBottom: 8 }}>LOGO</div>
                    <div style={{ fontWeight: 600, color: "#374151", marginBottom: 8 }}>Design your email here!</div>
                    <div style={{ fontSize: 13 }}>Click to open the email editor</div>
                </div>
            </div>
            <div style={{ borderTop: "1px solid #f1f5f9", padding: "16px 24px", display: "flex", justifyContent: "space-between" }}>
                <button style={{ ...STYLES.btn("#f1f5f9", "#374151") }}>Send a test</button>
                <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={onClose} style={{ ...STYLES.btn("#f1f5f9", "#374151") }}>Cancel</button>
                    <button style={{ ...STYLES.btn("#f1f5f9", "#94a3b8") }}>Save as draft</button>
                    <button onClick={() => onSave({ name, subject })} style={{ ...STYLES.btn("#3b82f6") }}>{config ? "Save Changes" : "Finish"}</button>
                </div>
            </div>
        </ModalBox>
    );
}
