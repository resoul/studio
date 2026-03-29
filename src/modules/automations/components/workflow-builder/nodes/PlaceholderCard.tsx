import { useState } from "react";

export function PlaceholderCard({ onClick }: { onClick: () => void }) {
    const [hov, setHov] = useState(false);
    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                background: "transparent", border: `2px dashed ${hov ? "#3b82f6" : "#94a3b8"}`,
                borderRadius: 8, padding: "14px 24px", cursor: "pointer",
                color: hov ? "#3b82f6" : "#64748b", fontSize: 14, fontWeight: 500,
                display: "flex", alignItems: "center", gap: 8, transition: "all 0.15s",
            }}
        >
            Add a start trigger
        </button>
    );
}
