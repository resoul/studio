import { useState } from "react";
import { Eye, Trash2 } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { WorkflowNode } from "../types.ts";
import { TRIGGERS, TRIGGER_LABEL, STYLES } from "../constants.ts";

export function TriggerCard({ node, onDelete, onClick }: { node: WorkflowNode; onDelete: () => void; onClick: () => void }) {
    const [hov, setHov] = useState(false);
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: node.id,
        data: { node },
    });

    const triggerConfigId = node.config?.triggerId;
    const t = TRIGGERS.find((t) => t.id === triggerConfigId);
    const Icon = t?.Icon || Eye;

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
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "16px 20px" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#1e3a5f", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={18} color="#fff" />
                </div>
                <div>
                    <div style={{ fontSize: 12, color: "#64748b", marginBottom: 2 }}>Start automation when</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", lineHeight: 1.4 }}>
                        {triggerConfigId ? TRIGGER_LABEL[triggerConfigId] : "Unknown trigger"}
                    </div>
                </div>
            </div>
        </div>
    );
}
