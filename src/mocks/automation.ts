import { WorkflowNode, RecipeTemplate } from "@/types/automation";
import { uid, makeEnd } from "@/utils/automation";

export const RECIPES: RecipeTemplate[] = [
    {
        id: 'welcome',
        name: 'Welcome Series',
        description: '3-email onboarding sequence that turns signups into engaged subscribers',
        icon: '👋',
        trigger: 'List signup',
        steps: 5,
        avgOpenRate: '48%',
        tags: ['Popular', 'Beginner'],
    },
    {
        id: 'abandoned-cart',
        name: 'Abandoned Cart',
        description: 'Recover lost sales with a perfectly timed 3-step recovery sequence',
        icon: '🛒',
        trigger: 'Tag: cart_abandoned',
        steps: 4,
        avgOpenRate: '45%',
        tags: ['E-commerce', 'Revenue'],
    },
    {
        id: 'birthday',
        name: 'Birthday Reward',
        description: 'Delight subscribers with a personalised birthday offer on their special day',
        icon: '🎂',
        trigger: 'Date field: birthday',
        steps: 2,
        avgOpenRate: '62%',
        tags: ['High ROI'],
    },
    {
        id: 'winback',
        name: 'Win-back',
        description: 'Re-engage subscribers who haven\'t opened in 90 days before removing them',
        icon: '🔄',
        trigger: 'Inactivity: 90 days',
        steps: 4,
        avgOpenRate: '28%',
        tags: ['Retention'],
    },
    {
        id: 'post-purchase',
        name: 'Post-purchase',
        description: 'Thank customers, collect reviews, and surface related products',
        icon: '📦',
        trigger: 'Tag: purchased',
        steps: 3,
        avgOpenRate: '55%',
        tags: ['E-commerce'],
    },
    {
        id: 'lead-nurture',
        name: 'Lead Nurture',
        description: 'Guide prospects through your sales funnel with educational content',
        icon: '🌱',
        trigger: 'Tag: lead',
        steps: 6,
        avgOpenRate: '38%',
        tags: ['B2B', 'Long-term'],
    },
    {
        id: 're-engagement',
        name: 'Re-engagement',
        description: 'Bring inactive contacts back with a delayed check and tailored follow-up email.',
        icon: '🔁',
        trigger: 'Email opened',
        steps: 3,
        avgOpenRate: '34%',
        tags: ['Retention'],
    },
    {
        id: 'lead-nurture-match',
        name: 'Lead Nurture Match',
        description: 'Route leads by country into localized onboarding branches.',
        icon: '🧭',
        trigger: 'Form submitted',
        steps: 4,
        avgOpenRate: '41%',
        tags: ['B2B', 'Match'],
    },
    {
        id: 'vip-routing',
        name: 'VIP Routing',
        description: 'Escalate VIP contacts to sales, add support tags, and sync with external systems.',
        icon: '⭐',
        trigger: 'Tag added: vip',
        steps: 4,
        avgOpenRate: '52%',
        tags: ['CRM', 'High-value'],
    },
    {
        id: 'webinar-reminder',
        name: 'Webinar Reminder',
        description: 'Send reminder sequence at 24h and 2h before the event.',
        icon: '🎥',
        trigger: 'Event recorded',
        steps: 5,
        avgOpenRate: '57%',
        tags: ['Events'],
    },
    {
        id: 'post-purchase-followup',
        name: 'Post-purchase Follow-up',
        description: 'Split customers by country and segment to personalize post-purchase messaging.',
        icon: '📬',
        trigger: 'Event recorded',
        steps: 5,
        avgOpenRate: '49%',
        tags: ['E-commerce', 'Match'],
    },
    {
        id: 'multi-trigger-escalation',
        name: 'Multi-trigger Escalation',
        description: 'Start from multiple triggers and route contacts through a four-branch match flow.',
        icon: '🧩',
        trigger: 'Multiple triggers',
        steps: 7,
        avgOpenRate: '44%',
        tags: ['Advanced', 'Multi-trigger'],
    },
];

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
    },
    "re-engagement": {
        id: "root",
        type: "workflow",
        triggers: [
            { id: uid(), type: "trigger", config: { triggerId: "reads_email" } }
        ],
        next: {
            id: uid(),
            type: "wait",
            config: { amount: 3, unit: "days" },
            next: {
                id: uid(),
                type: "ifelse",
                config: { field: "Last Name", op: "Is not empty", value: "" },
                yes: {
                    id: uid(),
                    type: "send_email",
                    config: { name: "Re-Engagement Personal", subject: "We picked this just for you" },
                    next: makeEnd()
                },
                no: {
                    id: uid(),
                    type: "send_email",
                    config: { name: "Re-Engagement Generic", subject: "We miss you — here is what is new" },
                    next: makeEnd()
                }
            }
        }
    },
    "lead-nurture-match": {
        id: "root",
        type: "workflow",
        triggers: [
            { id: uid(), type: "trigger", config: { triggerId: "submits_form" } }
        ],
        next: {
            id: uid(),
            type: "match",
            config: {
                field: "Country",
                op: "Is",
                value: "dynamic",
                cases: ["Romania", "Italy", "Other"]
            },
            matchBranches: [
                {
                    id: uid(),
                    label: "Romania",
                    next: {
                        id: uid(),
                        type: "send_email",
                        config: { name: "RO Welcome", subject: "Bine ai venit!" },
                        next: makeEnd()
                    }
                },
                {
                    id: uid(),
                    label: "Italy",
                    next: {
                        id: uid(),
                        type: "send_email",
                        config: { name: "IT Welcome", subject: "Benvenuto!" },
                        next: makeEnd()
                    }
                },
                {
                    id: uid(),
                    label: "Other",
                    next: {
                        id: uid(),
                        type: "send_email",
                        config: { name: "Global Welcome", subject: "Welcome to our community" },
                        next: makeEnd()
                    }
                }
            ]
        }
    },
    "vip-routing": {
        id: "root",
        type: "workflow",
        triggers: [
            { id: uid(), type: "trigger", config: { triggerId: "tag_added", tag: "vip" } }
        ],
        next: {
            id: uid(),
            type: "notify",
            config: { name: "Notify Sales Team" },
            next: {
                id: uid(),
                type: "add_tag",
                config: { tag: "priority-support" },
                next: {
                    id: uid(),
                    type: "webhook",
                    config: { url: "https://example.com/hooks/vip-contact" },
                    next: makeEnd()
                }
            }
        }
    },
    "webinar-reminder": {
        id: "root",
        type: "workflow",
        triggers: [
            { id: uid(), type: "trigger", config: { triggerId: "event" } }
        ],
        next: {
            id: uid(),
            type: "wait",
            config: { amount: 1, unit: "days" },
            next: {
                id: uid(),
                type: "send_email",
                config: { name: "Webinar Reminder 24h", subject: "Your webinar starts tomorrow" },
                next: {
                    id: uid(),
                    type: "wait",
                    config: { amount: 2, unit: "hours" },
                    next: {
                        id: uid(),
                        type: "send_email",
                        config: { name: "Webinar Reminder 2h", subject: "We start in 2 hours" },
                        next: makeEnd()
                    }
                }
            }
        }
    },
    "post-purchase-followup": {
        id: "root",
        type: "workflow",
        triggers: [
            { id: uid(), type: "trigger", config: { triggerId: "event" } }
        ],
        next: {
            id: uid(),
            type: "ifelse",
            config: { field: "Country", op: "Is", value: "Romania" },
            yes: {
                id: uid(),
                type: "match",
                config: { field: "Tag", op: "Contains", value: "customer", cases: ["VIP", "Standard"] },
                matchBranches: [
                    {
                        id: uid(),
                        label: "VIP",
                        next: {
                            id: uid(),
                            type: "send_email",
                            config: { name: "VIP Thank You", subject: "Thank you for your premium order" },
                            next: makeEnd()
                        }
                    },
                    {
                        id: uid(),
                        label: "Standard",
                        next: {
                            id: uid(),
                            type: "send_email",
                            config: { name: "Thank You", subject: "Thanks for your purchase" },
                            next: makeEnd()
                        }
                    }
                ]
            },
            no: {
                id: uid(),
                type: "webhook",
                config: { url: "https://example.com/hooks/post-purchase" },
                next: makeEnd()
            }
        }
    },
    "multi-trigger-escalation": {
        id: "root",
        type: "workflow",
        triggers: [
            { id: uid(), type: "trigger", config: { triggerId: "subscribes", runs: "Many times" } },
            { id: uid(), type: "trigger", config: { triggerId: "clicks_link", runs: "Once" } },
            { id: uid(), type: "trigger", config: { triggerId: "webpage_visit", runs: "Many times" } }
        ],
        next: {
            id: uid(),
            type: "match",
            config: {
                field: "Tag",
                op: "Contains",
                value: "segment",
                cases: ["Enterprise", "SMB", "Trial", "Other"]
            },
            matchBranches: [
                {
                    id: uid(),
                    label: "Enterprise",
                    next: {
                        id: uid(),
                        type: "notify",
                        config: { name: "Alert Enterprise CSM" },
                        next: {
                            id: uid(),
                            type: "send_email",
                            config: { name: "Enterprise Follow-up", subject: "Let’s plan your onboarding" },
                            next: makeEnd()
                        }
                    }
                },
                {
                    id: uid(),
                    label: "SMB",
                    next: {
                        id: uid(),
                        type: "wait",
                        config: { amount: 6, unit: "hours" },
                        next: {
                            id: uid(),
                            type: "send_email",
                            config: { name: "SMB Nurture", subject: "Get more from your account" },
                            next: makeEnd()
                        }
                    }
                },
                {
                    id: uid(),
                    label: "Trial",
                    next: {
                        id: uid(),
                        type: "ifelse",
                        config: { field: "Email Address", op: "Contains", value: "@company.com" },
                        yes: {
                            id: uid(),
                            type: "add_tag",
                            config: { tag: "trial-business" },
                            next: makeEnd()
                        },
                        no: {
                            id: uid(),
                            type: "webhook",
                            config: { url: "https://example.com/hooks/trial-lead" },
                            next: makeEnd()
                        }
                    }
                },
                {
                    id: uid(),
                    label: "Other",
                    next: {
                        id: uid(),
                        type: "send_email",
                        config: { name: "General Onboarding", subject: "Welcome — here’s where to start" },
                        next: makeEnd()
                    }
                }
            ]
        }
    }
};
