import { useState } from "react";
import { Link2 } from "lucide-react";
import { ModalBox, ModalHeader } from "../components/ModalShared.tsx";
import { STYLES } from "../constants.ts";
import { NodeConfig } from "../types.ts";

interface ConfigureWebhookModalProps {
    config?: NodeConfig;
    onSave: (config: any) => void;
    onBack: () => void;
    onClose: () => void;
}

export function ConfigureWebhookModal({ config, onSave, onBack, onClose }: ConfigureWebhookModalProps) {
    const [url, setUrl] = useState(config?.url || "");
    return (
        <ModalBox style={{ width: 600 }}>
            <ModalHeader title={config ? "Edit Webhook" : "Webhook"} onBack={onBack} onClose={onClose} />
            <div style={{ padding: "8px 24px 0", color: "#64748b", fontSize: 13, marginBottom: 10 }}>Post contact data to a URL of your choice</div>
            <div style={{ padding: "18px 24px 80px" }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: "#374151", marginBottom: 10 }}>Enter the URL to post to</div>
                <input
                    placeholder="https://your-webhook-url.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    style={{ width: "100%", padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }}
                />
            </div>
            <div style={{ borderTop: "1px solid #f1f5f9", padding: "16px 24px", display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button onClick={onClose} style={{ ...STYLES.btn("#f1f5f9", "#374151") }}>Cancel</button>
                <button onClick={() => onSave({ url: url || "https://your-webhook-url.com" })} style={{ ...STYLES.btn("#3b82f6") }}>{config ? "Save Changes" : "Save"}</button>
            </div>
        </ModalBox>
    );
}
