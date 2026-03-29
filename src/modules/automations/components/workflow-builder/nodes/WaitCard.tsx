import { useState } from "react";
import { Clock, Trash2 } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { WorkflowNode } from "../types.ts";
import { STYLES } from "../constants.ts";

export function WaitCard({ node, onDelete, onClick }: { node: WorkflowNode; onDelete: () => void; onClick: () => void }) {
    const [hov, setHov] = useState(false);
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: node.id,
        data: { node },
    });

    const style = {
        ...STYLES.card,
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 999 : 1,
        cursor: "grab",
    };

    return (
        <div 
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            onClick={onClick} 
            style={style} 
            onMouseEnter={() => setHov(true)} 
            onMouseLeave={() => setHov(false)}
        >
            {hov && !isDragging && (
                <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(); }} 
                    style={{ 
                        position: "absolute", top: 8, right: 8,
                        background: "#fff", border: "1px solid #e2e8f0", borderRadius: "50%", 
                        width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", color: "#ef4444", boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
                    }}
                >
                    <Trash2 size={12} />
                </button>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#0f2544", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Clock size={18} color="#fff" />
                </div>
                <div style={{ fontSize: 14, fontWeight: 500, color: "#1e293b" }}>
                    Wait for{" "}
                    <span style={{ background: "#e0f2fe", color: "#0369a1", borderRadius: 4, padding: "2px 8px", fontSize: 13, fontWeight: 600 }}>
                        {node.config?.amount} {node.config?.unit}
                    </span>
                </div>
            </div>
        </div>
    );
}
