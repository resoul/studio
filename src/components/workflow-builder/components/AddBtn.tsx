import { useState } from "react";
import { Plus } from "lucide-react";
import { useDroppable, useDndContext } from "@dnd-kit/core";
import { STYLES } from "../constants";

interface AddBtnProps {
    id: string;
    onClick: () => void;
    active?: boolean;
    data?: any;
}

export function AddBtn({ id, onClick, active, data }: AddBtnProps) {
    const [hov, setHov] = useState(false);
    const { isOver, setNodeRef } = useDroppable({ id, data });
    const { active: activeDrag } = useDndContext();

    if (activeDrag) {
        return (
            <div
                ref={setNodeRef}
                style={{
                    ...STYLES.dropZone,
                    border: isOver ? "2px solid #3b82f6" : STYLES.dropZone.border,
                    background: isOver ? "rgba(59, 130, 246, 0.1)" : STYLES.dropZone.background,
                }}
            >
                {isOver ? "Drop here" : "Move here"}
            </div>
        );
    }

    return (
        <div style={{
            height: activeDrag ? 48 : 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "height 0.2s ease-in-out",
            overflow: "hidden"
        }}>
            <button
                ref={setNodeRef}
                onClick={onClick}
                onMouseEnter={() => setHov(true)}
                onMouseLeave={() => setHov(false)}
                style={{
                    width: 24, height: 24, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: `1px solid ${hov || active ? "#3b82f6" : "#e2e8f0"}`,
                    background: hov || active ? "#3b82f6" : "#fff",
                    color: hov || active ? "#fff" : "#94a3b8",
                    cursor: "pointer", transition: "all 0.15s",
                    boxShadow: hov || active ? "0 0 0 4px rgba(59, 130, 246, 0.1)" : "none"
                }}
            >
                <Plus size={12} />
            </button>
        </div>
    );
}
