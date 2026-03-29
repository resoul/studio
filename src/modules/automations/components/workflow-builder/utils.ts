import { WorkflowNode, NodeConfig, NodeType } from "./types.ts";
import { uid as generateUid } from "@/utils/uid.ts";

export interface DropTarget {
    afterId?: string;
    ifelseId?: string;
    branch?: "yes" | "no";
}

export const uid = () => generateUid('n');

export const makeEnd = (): WorkflowNode => ({ id: uid(), type: "end" });

export const mapNode = (root: WorkflowNode | undefined | null, id: string, fn: (node: WorkflowNode) => WorkflowNode): WorkflowNode | null => {
    if (!root) return null;
    if (root.id === id) return fn(root);
    return {
        ...root,
        triggers: root.triggers ? root.triggers.map((t) => mapNode(t, id, fn) as WorkflowNode).filter(Boolean) : undefined,
        next: mapNode(root.next, id, fn) as WorkflowNode,
        yes: root.yes ? mapNode(root.yes, id, fn) as WorkflowNode : null,
        no: root.no ? mapNode(root.no, id, fn) as WorkflowNode : null,
    };
};

export const insertAfterNode = (root: WorkflowNode, afterId: string, type: NodeType, config: NodeConfig): WorkflowNode =>
    mapNode(root, afterId, (node) => {
        if (type === "ifelse") {
            return { ...node, next: { id: uid(), type, config, yes: makeEnd(), no: makeEnd() } };
        }
        return { ...node, next: { id: uid(), type, config, next: node.next } };
    }) as WorkflowNode;

export const insertBranchStart = (root: WorkflowNode, ifelseId: string, branch: "yes" | "no", type: NodeType, config: NodeConfig): WorkflowNode =>
    mapNode(root, ifelseId, (node) => ({
        ...node,
        [branch]: { id: uid(), type, config, next: node[branch] },
    })) as WorkflowNode;

export const deleteNode = (root: WorkflowNode | null | undefined, targetId: string): WorkflowNode | null => {
    if (!root) return null;
    if (root.type === "workflow") {
        const triggers = root.triggers || [];
        const filtered = triggers.filter((t) => t.id !== targetId);
        if (filtered.length !== triggers.length) return { ...root, triggers: filtered };
    }
    if (root.next?.id === targetId) return { ...root, next: root.next.type === "ifelse" ? makeEnd() : (root.next.next || makeEnd()) };
    if (root.yes?.id === targetId) return { ...root, yes: root.yes.next || makeEnd() };
    if (root.no?.id === targetId) return { ...root, no: root.no.next || makeEnd() };
    
    return {
        ...root,
        triggers: root.triggers ? root.triggers.map((t) => deleteNode(t, targetId) as WorkflowNode).filter(Boolean) : undefined,
        next: deleteNode(root.next, targetId) as WorkflowNode,
        yes: deleteNode(root.yes, targetId) as WorkflowNode,
        no: deleteNode(root.no, targetId) as WorkflowNode,
    };
};

export const findNode = (root: WorkflowNode | null | undefined, id: string): WorkflowNode | null => {
    if (!root) return null;
    if (root.id === id) return root;
    let found = findNode(root.next, id);
    if (found) return found;
    if (root.triggers) {
        for (const t of root.triggers) {
            found = findNode(t, id);
            if (found) return found;
        }
    }
    if (root.yes) found = findNode(root.yes, id);
    if (found) return found;
    if (root.no) found = findNode(root.no, id);
    return found;
};

export const moveNode = (root: WorkflowNode, nodeId: string, target: DropTarget): WorkflowNode => {
    // 1. Find the node to move
    const nodeToMove = findNode(root, nodeId);
    if (!nodeToMove) return root;

    // 2. Prevent dropping onto itself or its children
    if (target.afterId === nodeId || target.ifelseId === nodeId) return root;
    // (A more thorough check would be isDescendant(nodeToMove, target))

    // 3. Remove from old position
    const cleaned = deleteNode(root, nodeId) as WorkflowNode;

    // 4. Insert into new position
    if (target.branch && target.ifelseId) {
        return mapNode(cleaned, target.ifelseId, (n) => ({
            ...n,
            [target.branch!]: { ...nodeToMove, next: n[target.branch!] as WorkflowNode },
        })) as WorkflowNode;
    } else if (target.afterId) {
        return mapNode(cleaned, target.afterId, (n) => ({
            ...n,
            next: { ...nodeToMove, next: n.next as WorkflowNode },
        })) as WorkflowNode;
    }

    return cleaned;
};

export const createInitial = (): WorkflowNode => ({ id: "root", type: "workflow", triggers: [], next: makeEnd() });
