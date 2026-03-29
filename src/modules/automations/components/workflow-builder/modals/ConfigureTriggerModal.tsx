import { useState } from "react";
import { ModalBox, ModalHeader } from "../components/ModalShared.tsx";
import { STYLES } from "../constants.ts";
import { TriggerOption, NodeConfig } from "../types.ts";

interface ConfigureTriggerModalProps {
    trigger: TriggerOption;
    config?: NodeConfig;
    onSave: (config: any) => void;
    onBack: () => void;
    onClose: () => void;
}

export function ConfigureTriggerModal({ trigger, config, onSave, onBack, onClose }: ConfigureTriggerModalProps) {
    const [runs, setRuns] = useState(config?.runs || "Once");
    // const Icon = trigger.Icon;
    return (
        <ModalBox style={{ width: 560 }}>
            <ModalHeader title={config ? "Edit trigger" : "Action option"} onBack={onBack} onClose={onClose} />
            <div style={{ padding: "8px 24px 0", color: "#64748b", fontSize: 14 }}>({trigger.label})</div>
            <div style={{ padding: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                    <label style={{ fontSize: 14, fontWeight: 500, width: 100 }}>Select email</label>
                    <select style={{ padding: "8px 12px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 13 }}>
                        <option>Any 1:1 email</option>
                    </select>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                    <label style={{ fontSize: 14, fontWeight: 500, width: 100 }}>Runs</label>
                    <select value={runs} onChange={(e) => setRuns(e.target.value)} style={{ padding: "8px 12px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 13 }}>
                        <option>Once</option>
                        <option>Many times</option>
                    </select>
                </div>
                <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 16, marginBottom: 24 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#3b82f6", marginBottom: 12 }}>ADVANCED</div>
                    <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#374151" }}>
                        <input type="checkbox" /> Segment the contacts entering this automation
                    </label>
                </div>
            </div>
            <div style={{ borderTop: "1px solid #f1f5f9", padding: "16px 24px", display: "flex", justifyContent: "space-between" }}>
                <button onClick={onBack} style={{ ...STYLES.btn("#f1f5f9", "#374151") }}>{config ? "Cancel" : "Back"}</button>
                <button onClick={() => onSave({ runs })} style={{ ...STYLES.btn("#3b82f6") }}>{config ? "Save Changes" : "Add Start"}</button>
            </div>
        </ModalBox>
    );
}
