import {
    List, FileText, Eye, MousePointer, Video, Share2,
    Tag, Clock, GitBranch, Mail, Link2, BellRing, Zap
} from "lucide-react";
import { TriggerOption, ActionOption } from "./types.ts";

export const TRIGGER_CATS = ["View All", "Behaviors & Actions", "E-Commerce", "Email & Messages", "Sales & CRM", "Web Properties"];

export const TRIGGERS: TriggerOption[] = [
    { id: "subscribes",    label: "Subscribes to a list",        cat: "Behaviors & Actions", Icon: List },
    { id: "unsubscribes",  label: "Unsubscribes from a list",    cat: "Behaviors & Actions", Icon: List },
    { id: "submits_form",  label: "Submits a form",              cat: "Behaviors & Actions", Icon: FileText },
    { id: "reads_email",   label: "Opens/reads an email",        cat: "Email & Messages",    Icon: Eye },
    { id: "clicks_link",   label: "Clicks a link in an email",   cat: "Email & Messages",    Icon: MousePointer },
    { id: "shares_email",  label: "Shares an email",             cat: "Email & Messages",    Icon: Share2 },
    { id: "forwards_email",label: "Forwards an email",           cat: "Email & Messages",    Icon: Forward },
    { id: "replies_email", label: "Replies to an email",         cat: "Email & Messages",    Icon: Reply },
    { id: "webpage_visit", label: "Web page is visited",         cat: "Web Properties",      Icon: Globe },
    { id: "event",         label: "Event is recorded",           cat: "Behaviors & Actions", Icon: Video },
    { id: "tag_added",     label: "Tag is added",                cat: "Behaviors & Actions", Icon: Tag },
    { id: "tag_removed",   label: "Tag is removed",              cat: "Behaviors & Actions", Icon: Tag },
];

// Helper to fix missing icons and imports in TRIGGERS
import { Globe, Forward, Reply } from "lucide-react";

export const TRIGGER_LABEL: Record<string, string> = {
    subscribes: "Contact subscribes to a list",
    unsubscribes: "Contact unsubscribes from a list",
    submits_form: "Contact submits a form",
    reads_email: "Contact reads any 1:1 email",
    clicks_link: "Contact clicks a link in an email",
    shares_email: "Contact shares an email",
    forwards_email: "Contact forwards an email",
    replies_email: "Contact replies to an email",
    webpage_visit: "Contact visits a web page",
    event: "Event is recorded for contact",
    tag_added: "Tag is added to contact",
    tag_removed: "Tag is removed from contact",
};

export const ACTION_TABS = ["Suggested", "Sending", "Workflow", "Contacts", "CRM", "Apps"];

export const ALL_ACTIONS: ActionOption[] = [
    { id: "wait",       label: "Wait",          desc: "Wait for a period of time, a specific date, or for conditions", tabs: ["Workflow", "Suggested"], Icon: Clock,     bg: "#0f2544", iconColor: "#fff" },
    { id: "ifelse",     label: "If/Else",        desc: "Split the automation based on conditions",                     tabs: ["Workflow", "Suggested"], Icon: GitBranch, bg: "#374151", iconColor: "#fff" },
    { id: "send_email", label: "Send an email",  desc: "A marketing email for subscribed contacts",                    tabs: ["Sending", "Suggested"],  Icon: Mail,      bg: "#1d4ed8", iconColor: "#fff" },
    { id: "webhook",    label: "Webhook",        desc: "Post contact data to a URL of your choice",                   tabs: ["Apps"],                 Icon: Link2,     bg: "#0e7490", iconColor: "#fff" },
    { id: "add_tag",    label: "Add a tag",      desc: "Add a tag to the contact",                                    tabs: ["Contacts"],             Icon: Tag,       bg: "#6d28d9", iconColor: "#fff" },
    { id: "notify",     label: "Notify",         desc: "Send an internal notification",                               tabs: ["CRM"],                  Icon: BellRing,  bg: "#b45309", iconColor: "#fff" },
];

export const WAIT_UNITS = ["minute(s)", "hour(s)", "day(s)", "week(s)"];

export const COND_FIELDS = ["Email Address", "First Name", "Last Name", "Phone", "City", "Country", "Tag", "Custom Field"];
export const COND_OPS    = ["Is", "Is not", "Contains", "Does not contain", "Starts with", "Is empty", "Is not empty"];

// ── Shared styles ─────────────────────────────────────────────────────────
export const STYLES = {
    line: { width: 2, background: "#cbd5e1", flexShrink: 0, alignSelf: "center" as const },
    card: {
        background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8,
        boxShadow: "0 1px 3px rgba(0,0,0,0.07)", minWidth: 260, maxWidth: 300,
        position: "relative" as const,
    },
    dropZone: {
        width: 300,
        height: 48,
        border: "2px dashed #3b82f6",
        borderRadius: 8,
        background: "rgba(59, 130, 246, 0.05)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        fontWeight: 500,
        color: "#3b82f6",
        margin: "8px 0",
    },
    btn: (bg: string, color = "#fff") => ({
        background: bg, color, border: "none", borderRadius: 6, padding: "8px 18px",
        fontSize: 13, fontWeight: 500, cursor: "pointer",
    }),
};
