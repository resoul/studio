import { ReactNode } from "react";
import { X, ChevronLeft } from "lucide-react";

export function ModalOverlay({ children, onClose }: { children: ReactNode; onClose: () => void }) {
    return (
        <div
            onClick={(e) => e.target === e.currentTarget && onClose()}
            style={{
                position: "absolute", inset: 0, background: "rgba(15,23,42,0.55)",
                display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
            }}
        >
            {children}
        </div>
    );
}

export function ModalBox({ children, style }: { children: ReactNode; style?: any }) {
    return (
        <div style={{
            background: "#fff", borderRadius: 12, maxHeight: "90vh", overflow: "auto",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)", ...style,
        }}>
            {children}
        </div>
    );
}

export function ModalHeader({ title, onBack, onClose }: { title: string; onClose: () => void; onBack?: () => void }) {
    return (
        <div style={{ display: "flex", alignItems: "center", padding: "20px 24px 0", gap: 12 }}>
            {onBack && (
                <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: "#3b82f6", display: "flex", alignItems: "center", gap: 4, fontSize: 14 }}>
                    <ChevronLeft size={16} /> Back
                </button>
            )}
            <h2 style={{ flex: 1, margin: 0, fontSize: 20, fontWeight: 600, color: "#0f172a" }}>{title}</h2>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", display: "flex" }}>
                <X size={20} />
            </button>
        </div>
    );
}
