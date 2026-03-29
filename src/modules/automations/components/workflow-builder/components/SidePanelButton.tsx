import { useState } from "react";

export function SidePanelButton({ label, onClick }: { label: string; onClick?: () => void }) {
    const [hov, setHov] = useState(false);
    return (
        <button
            onClick={onClick}
            style={{
                background: "transparent", border: `2px dashed ${hov ? "#3b82f6" : "#94a3b8"}`,
                borderRadius: 8, padding: "12px 20px", cursor: "pointer",
                color: hov ? "#3b82f6" : "#64748b", fontSize: 13, fontWeight: 500,
                transition: "all 0.15s", whiteSpace: "nowrap",
            }}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
        >
            {label}
        </button>
    );
}
