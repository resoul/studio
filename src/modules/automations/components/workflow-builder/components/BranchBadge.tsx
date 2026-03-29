export function BranchBadge({ label, color }: { label: string; color: string }) {
    return (
        <div style={{
            width: 40, height: 40, borderRadius: "50%", background: "#fff",
            border: `2px solid ${color}`, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 13, fontWeight: 700, color, flexShrink: 0,
        }}>
            {label}
        </div>
    );
}
