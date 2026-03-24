import { WorkflowNode } from "../types";
import { uid, makeEnd } from "../utils";

export const WORKFLOW_RECIPES: Record<string, WorkflowNode> = {
    "welcome": {
        id: "root",
        type: "workflow",
        triggers: [
            { id: uid(), type: "trigger", config: { triggerId: "list_signup" } }
        ],
        next: {
            id: uid(),
            type: "send_email",
            config: { name: "Welcome Email", subject: "Welcome to our newsletter!" },
            next: {
                id: uid(),
                type: "wait",
                config: { amount: 1, unit: "days" },
                next: {
                    id: uid(),
                    type: "send_email",
                    config: { name: "Second Email", subject: "Here is your first tip" },
                    next: makeEnd()
                }
            }
        }
    },
    "abandoned-cart": {
        id: "root",
        type: "workflow",
        triggers: [
            { id: uid(), type: "trigger", config: { triggerId: "tag_added" } }
        ],
        next: {
            id: uid(),
            type: "wait",
            config: { amount: 1, unit: "hours" },
            next: {
                id: uid(),
                type: "send_email",
                config: { name: "Cart Reminder", subject: "Did you forget something?" },
                next: {
                    id: uid(),
                    type: "ifelse",
                    config: { name: "Check Purchase", field: "order_completed", op: "equals", value: "true" },
                    yes: makeEnd(),
                    no: {
                        id: uid(),
                        type: "wait",
                        config: { amount: 1, unit: "days" },
                        next: {
                            id: uid(),
                            type: "send_email",
                            config: { name: "Final Offer", subject: "Come back and get 10% off" },
                            next: makeEnd()
                        }
                    }
                }
            }
        }
    }
};
