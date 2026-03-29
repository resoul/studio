import { WorkflowNode, ActionOption } from "../types.ts";
import { Line } from "./Line.tsx";
import { AddBtn } from "./AddBtn.tsx";
import { EndNode } from "./EndNode.tsx";
import { BranchBadge } from "./BranchBadge.tsx";
import { TriggerCard } from "../nodes/TriggerCard.tsx";
import { WaitCard } from "../nodes/WaitCard.tsx";
import { IfElseCard } from "../nodes/IfElseCard.tsx";
import { ActionCard } from "../nodes/ActionCard.tsx";
import { PlaceholderCard } from "../nodes/PlaceholderCard.tsx";
import { ALL_ACTIONS } from "../constants.ts";
import { Zap } from "lucide-react";

interface RenderChainProps {
    node: WorkflowNode | null | undefined;
    onAddTrigger: () => void;
    onAddAction: (ctx: any) => void;
    onDelete: (id: string) => void;
    onEdit: (node: WorkflowNode) => void;
}

export function RenderChain({ node, onAddTrigger, onAddAction, onDelete, onEdit }: RenderChainProps) {
    if (!node) return null;

    if (node.type === "end") return <EndNode />;

    if (node.type === "workflow") {
        const triggers = node.triggers || [];
        const hasTriggers = triggers.length > 0;
        const BW = 280; // block width
        const GAP = 24;
        const totalWidth = triggers.length * BW + (triggers.length - 1) * GAP;

        return (
            <>
                <div style={{ display: "flex", gap: GAP, alignItems: "flex-end" }}>
                    {hasTriggers ? (
                        triggers.map((t) => (
                            <TriggerCard key={t.id} node={t} onDelete={() => onDelete(t.id)} onClick={() => onEdit(t)} />
                        ))
                    ) : (
                        <PlaceholderCard onClick={onAddTrigger} />
                    )}
                </div>

                {hasTriggers && (
                    <div style={{ position: "relative", width: totalWidth, display: "flex", flexDirection: "column", alignItems: "center" }}>
                        {triggers.length > 1 ? (
                            <>
                                <div style={{ display: "flex", width: "100%", justifyContent: "space-between", padding: `0 ${BW / 2}px` }}>
                                    {triggers.map((t) => <div key={t.id} style={{ width: 2, background: "#cbd5e1", flexShrink: 0, alignSelf: "center", height: 20 }} />)}
                                </div>
                                <div style={{
                                    position: "absolute", top: 20, left: BW / 2, right: BW / 2, height: 2, background: "#cbd5e1"
                                }} />
                                <div style={{ width: 2, background: "#cbd5e1", flexShrink: 0, alignSelf: "center", height: 20 }} />
                            </>
                        ) : (
                            <Line />
                        )}
                    </div>
                )}
                {!hasTriggers && <Line />}

                <AddBtn 
                    id={`add-after-${node.id}`} 
                    onClick={() => onAddAction({ afterId: node.id })} 
                    data={{ afterId: node.id }}
                />
                <Line />
                <RenderChain node={node.next} onAddTrigger={onAddTrigger} onAddAction={onAddAction} onDelete={onDelete} onEdit={onEdit} />
            </>
        );
    }

    if (node.type === "trigger") {
        return (
            <>
                <TriggerCard node={node} onDelete={() => onDelete(node.id)} onClick={() => onEdit(node)} />
                <Line />
                <AddBtn 
                    id={`add-after-${node.id}`} 
                    onClick={() => onAddAction({ afterId: node.id })} 
                    data={{ afterId: node.id }}
                />
                <Line />
                <RenderChain node={node.next} onAddTrigger={onAddTrigger} onAddAction={onAddAction} onDelete={onDelete} onEdit={onEdit} />
            </>
        );
    }

    if (node.type === "wait") {
        return (
            <>
                <WaitCard node={node} onDelete={() => onDelete(node.id)} onClick={() => onEdit(node)} />
                <Line />
                <AddBtn 
                    id={`add-after-${node.id}`} 
                    onClick={() => onAddAction({ afterId: node.id })} 
                    data={{ afterId: node.id }}
                />
                <Line />
                <RenderChain node={node.next} onAddTrigger={onAddTrigger} onAddAction={onAddAction} onDelete={onDelete} onEdit={onEdit} />
            </>
        );
    }

    if (node.type === "ifelse") {
        const BW = 260; // branch width
        const GAP = 100;
        return (
            <>
                <IfElseCard node={node} onDelete={() => onDelete(node.id)} onClick={() => onEdit(node)} />
                {/* Fork lines */}
                <div style={{ position: "relative", width: (BW * 2) + GAP, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: 2, background: "#cbd5e1", height: 24 }} />
                    <div style={{
                        position: "absolute", top: 24, left: BW / 2, right: BW / 2, height: 2, background: "#cbd5e1",
                    }} />
                    {/* Vertical stubs connecting to Yes/No circles */}
                    <div style={{ display: "flex", width: "100%", justifyContent: "space-between", padding: `0 ${BW / 2}px` }}>
                        <div style={{ width: 2, background: "#cbd5e1", height: 16 }} />
                        <div style={{ width: 2, background: "#cbd5e1", height: 16 }} />
                    </div>
                </div>
                {/* Branch columns */}
                <div style={{ display: "flex", gap: GAP, alignItems: "flex-start", marginTop: -2 }}>
                    {/* YES */}
                    <div style={{ width: BW, display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <BranchBadge label="Yes" color="#16a34a" />
                        <Line />
                        <AddBtn 
                            id={`add-ifelse-${node.id}-yes`} 
                            onClick={() => onAddAction({ ifelseId: node.id, branch: "yes" })} 
                            data={{ ifelseId: node.id, branch: "yes" }}
                        />
                        <Line />
                        <RenderChain node={node.yes} onAddTrigger={onAddTrigger} onAddAction={onAddAction} onDelete={onDelete} onEdit={onEdit} />
                    </div>
                    {/* NO */}
                    <div style={{ width: BW, display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <BranchBadge label="No" color="#dc2626" />
                        <Line />
                        <AddBtn 
                            id={`add-ifelse-${node.id}-no`} 
                            onClick={() => onAddAction({ ifelseId: node.id, branch: "no" })} 
                            data={{ ifelseId: node.id, branch: "no" }}
                        />
                        <Line />
                        <RenderChain node={node.no} onAddTrigger={onAddTrigger} onAddAction={onAddAction} onDelete={onDelete} onEdit={onEdit} />
                    </div>
                </div>
            </>
        );
    }

    // Generic action (send_email, webhook, add_tag, notify)
    const actionMeta = ALL_ACTIONS.find((a) => a.id === node.type) || { Icon: Zap, bg: "#374151" };
    const Icon = actionMeta.Icon;
    const labelMap: Record<string, string> = {
        send_email: "Send an email:", webhook: "Webhook:", add_tag: "Add tag:", notify: "Notify:",
    };
    return (
        <>
            <ActionCard
                node={node}
                icon={Icon}
                bg={actionMeta.bg}
                label={labelMap[node.type] || node.type}
                sub={node.config?.name || node.config?.url || node.config?.tag || "Configured"}
                onDelete={() => onDelete(node.id)}
                onClick={() => onEdit(node)}
            />
            <Line />
            <AddBtn 
                id={`add-after-${node.id}`} 
                onClick={() => onAddAction({ afterId: node.id })} 
                data={{ afterId: node.id }}
            />
            <Line />
            <RenderChain node={node.next} onAddTrigger={onAddTrigger} onAddAction={onAddAction} onDelete={onDelete} onEdit={onEdit} />
        </>
    );
}
