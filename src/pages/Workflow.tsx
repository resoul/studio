import {useCallback, useState} from "react";
import {
    Plus, X, ChevronLeft, Clock, GitBranch, Mail, Globe,
    List, FileText, Eye, MousePointer, Video, Share2,
    Tag, Trash2, Search, ChevronDown, Link2, Forward,
    Reply, ArrowRight, Zap, Users, BarChart2, BellRing, ArrowLeft, Save
} from "lucide-react";
import {useNavigate, useParams} from "react-router-dom";
import {useToast} from "@/hooks/use-toast.ts";
import {Button} from "@/components/ui/button.tsx";

// ── ID generator ────────────────────────────────────────────────────────
let _uid = 0;
const uid = () => `n${++_uid}`;

// ── Tree helpers ─────────────────────────────────────────────────────────
const mapNode = (root, id, fn) => {
    if (!root) return null;
    if (root.id === id) return fn(root);
    return {
        ...root,
        next: mapNode(root.next, id, fn),
        yes: root.yes ? mapNode(root.yes, id, fn) : null,
        no: root.no ? mapNode(root.no, id, fn) : null,
    };
};

const makeEnd = () => ({ id: uid(), type: "end" });

const insertAfterNode = (root, afterId, type, config) =>
    mapNode(root, afterId, (node) => {
        if (type === "ifelse") {
            return { ...node, next: { id: uid(), type, config, yes: makeEnd(), no: makeEnd() } };
        }
        return { ...node, next: { id: uid(), type, config, next: node.next } };
    });

const insertBranchStart = (root, ifelseId, branch, type, config) =>
    mapNode(root, ifelseId, (node) => ({
        ...node,
        [branch]: { id: uid(), type, config, next: node[branch] },
    }));

const deleteNode = (root, targetId) => {
    if (!root) return null;
    if (root.next?.id === targetId) return { ...root, next: root.next.type === "ifelse" ? makeEnd() : (root.next.next || makeEnd()) };
    if (root.yes?.id === targetId) return { ...root, yes: root.yes.next || makeEnd() };
    if (root.no?.id === targetId) return { ...root, no: root.no.next || makeEnd() };
    return {
        ...root,
        next: deleteNode(root.next, targetId),
        yes: deleteNode(root.yes, targetId),
        no: deleteNode(root.no, targetId),
    };
};

const createInitial = () => ({ id: uid(), type: "placeholder", config: {}, next: makeEnd() });

// ── Static data ──────────────────────────────────────────────────────────
const TRIGGER_CATS = ["View All","Behaviors & Actions","E-Commerce","Email & Messages","Sales & CRM","Web Properties"];

const TRIGGERS = [
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

const TRIGGER_LABEL = {
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

const ACTION_TABS = ["Suggested","Sending","Workflow","Contacts","CRM","Apps"];

const ALL_ACTIONS = [
    { id: "wait",       label: "Wait",          desc: "Wait for a period of time, a specific date, or for conditions", tabs: ["Workflow","Suggested"], Icon: Clock,     bg: "#0f2544", iconColor: "#fff" },
    { id: "ifelse",     label: "If/Else",        desc: "Split the automation based on conditions",                     tabs: ["Workflow","Suggested"], Icon: GitBranch, bg: "#374151", iconColor: "#fff" },
    { id: "send_email", label: "Send an email",  desc: "A marketing email for subscribed contacts",                    tabs: ["Sending","Suggested"],  Icon: Mail,      bg: "#1d4ed8", iconColor: "#fff" },
    { id: "webhook",    label: "Webhook",        desc: "Post contact data to a URL of your choice",                   tabs: ["Apps"],                 Icon: Link2,     bg: "#0e7490", iconColor: "#fff" },
    { id: "add_tag",    label: "Add a tag",      desc: "Add a tag to the contact",                                    tabs: ["Contacts"],             Icon: Tag,       bg: "#6d28d9", iconColor: "#fff" },
    { id: "notify",     label: "Notify",         desc: "Send an internal notification",                               tabs: ["CRM"],                  Icon: BellRing,  bg: "#b45309", iconColor: "#fff" },
];

const WAIT_UNITS = ["minute(s)", "hour(s)", "day(s)", "week(s)"];

const COND_FIELDS = ["Email Address","First Name","Last Name","Phone","City","Country","Tag","Custom Field"];
const COND_OPS    = ["Is","Is not","Contains","Does not contain","Starts with","Is empty","Is not empty"];

// ── Shared styles ─────────────────────────────────────────────────────────
const line = { width: 2, background: "#cbd5e1", flexShrink: 0, alignSelf: "center" };
const card = {
    background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8,
    boxShadow: "0 1px 3px rgba(0,0,0,0.07)", minWidth: 240, maxWidth: 280,
};
const btn = (bg, color = "#fff") => ({
    background: bg, color, border: "none", borderRadius: 6, padding: "8px 18px",
    fontSize: 13, fontWeight: 500, cursor: "pointer",
});

// ── Sub-components ────────────────────────────────────────────────────────

function Line({ h = 28 }) {
    return <div style={{ ...line, height: h }} />;
}

function AddBtn({ onClick, active }) {
    const [hov, setHov] = useState(false);
    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                width: 30, height: 30, borderRadius: "50%",
                border: `2px solid ${hov || active ? "#3b82f6" : "#b0bec5"}`,
                background: hov || active ? "#3b82f6" : "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: hov || active ? "#fff" : "#607d8b",
                transition: "all 0.15s", flexShrink: 0,
            }}
        >
            <Plus size={14} />
        </button>
    );
}

function EndNode() {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#94a3b8", fontSize: 13, fontWeight: 500, padding: "4px 0" }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid #94a3b8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 10, height: 2, background: "#94a3b8", borderRadius: 2 }} />
            </div>
            Automation ends
        </div>
    );
}

function PlaceholderCard({ onClick }) {
    const [hov, setHov] = useState(false);
    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                background: "transparent", border: `2px dashed ${hov ? "#3b82f6" : "#94a3b8"}`,
                borderRadius: 8, padding: "14px 24px", cursor: "pointer",
                color: hov ? "#3b82f6" : "#64748b", fontSize: 14, fontWeight: 500,
                display: "flex", alignItems: "center", gap: 8, transition: "all 0.15s",
            }}
        >
            Add a start trigger
        </button>
    );
}

function TriggerCard({ node, onDelete }) {
    const [hov, setHov] = useState(false);
    const t = TRIGGERS.find((t) => t.id === node.config.triggerId);
    const Icon = t?.Icon || Eye;
    return (
        <div
            style={{ ...card, position: "relative" }}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
        >
            {hov && (
                <div style={{ position: "absolute", top: -32, right: 0, display: "flex", gap: 4, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 6, padding: "4px 8px" }}>
                    <button onClick={onDelete} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", display: "flex" }}>
                        <Trash2 size={14} />
                    </button>
                </div>
            )}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#1e3a5f", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={16} color="#fff" />
                </div>
                <div>
                    <div style={{ fontSize: 12, color: "#64748b", marginBottom: 2 }}>Start automation when</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>{TRIGGER_LABEL[node.config.triggerId]}</div>
                </div>
            </div>
        </div>
    );
}

function WaitCard({ node, onDelete }) {
    const [hov, setHov] = useState(false);
    return (
        <div style={{ ...card, position: "relative" }} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
            {hov && (
                <div style={{ position: "absolute", top: -32, right: 0, display: "flex", gap: 4, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 6, padding: "4px 8px" }}>
                    <button onClick={onDelete} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", display: "flex" }}>
                        <Trash2 size={14} />
                    </button>
                </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#0f2544", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Clock size={16} color="#fff" />
                </div>
                <div style={{ fontSize: 14, fontWeight: 500, color: "#1e293b" }}>
                    Wait for{" "}
                    <span style={{ background: "#e0f2fe", color: "#0369a1", borderRadius: 4, padding: "2px 8px", fontSize: 13, fontWeight: 600 }}>
            {node.config.amount} {node.config.unit}
          </span>
                </div>
            </div>
        </div>
    );
}

function IfElseCard({ node, onDelete }) {
    const [hov, setHov] = useState(false);
    const c = node.config || {};
    return (
        <div style={{ ...card, position: "relative" }} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
            {hov && (
                <div style={{ position: "absolute", top: -32, right: 0, display: "flex", gap: 4, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 6, padding: "4px 8px" }}>
                    <button onClick={onDelete} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", display: "flex" }}>
                        <Trash2 size={14} />
                    </button>
                </div>
            )}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 16px" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#374151", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <GitBranch size={16} color="#fff" />
                </div>
                <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>Does contact match these conditions?</div>
                    {c.field && (
                        <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                            {c.field} {c.op?.toLowerCase()} {c.value}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function ActionCard({ node, onDelete, icon: Icon, bg, label, sub }) {
    const [hov, setHov] = useState(false);
    return (
        <div style={{ ...card, position: "relative" }} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
            {hov && (
                <div style={{ position: "absolute", top: -32, right: 0, display: "flex", gap: 4, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 6, padding: "4px 8px" }}>
                    <button onClick={onDelete} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", display: "flex" }}>
                        <Trash2 size={14} />
                    </button>
                </div>
            )}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 16px" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={16} color="#fff" />
                </div>
                <div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>{label}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>{sub}</div>
                </div>
            </div>
        </div>
    );
}

function BranchBadge({ label, color }) {
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

function SidePanelButton({ label }) {
    const [hov, setHov] = useState(false);
    return (
        <button style={{
            background: "transparent", border: `2px dashed ${hov ? "#3b82f6" : "#94a3b8"}`,
            borderRadius: 8, padding: "12px 20px", cursor: "pointer",
            color: hov ? "#3b82f6" : "#64748b", fontSize: 13, fontWeight: 500,
            transition: "all 0.15s", whiteSpace: "nowrap",
        }}
                onMouseEnter={() => setHov(true)}
                onMouseLeave={() => setHov(false)}
        >
            {label}
        </button>
    );
}

// ── Recursive flow renderer ───────────────────────────────────────────────
function RenderChain({ node, onAddTrigger, onAddAction, onDelete }) {
    if (!node) return null;

    if (node.type === "end") return <EndNode />;

    if (node.type === "placeholder") {
        return (
            <>
                <PlaceholderCard onClick={onAddTrigger} />
                <Line />
                <AddBtn onClick={() => onAddAction({ afterId: node.id })} />
                <Line />
                <RenderChain node={node.next} onAddTrigger={onAddTrigger} onAddAction={onAddAction} onDelete={onDelete} />
            </>
        );
    }

    if (node.type === "trigger") {
        return (
            <>
                <TriggerCard node={node} onDelete={() => onDelete(node.id)} />
                <Line />
                <AddBtn onClick={() => onAddAction({ afterId: node.id })} />
                <Line />
                <RenderChain node={node.next} onAddTrigger={onAddTrigger} onAddAction={onAddAction} onDelete={onDelete} />
            </>
        );
    }

    if (node.type === "wait") {
        return (
            <>
                <WaitCard node={node} onDelete={() => onDelete(node.id)} />
                <Line />
                <AddBtn onClick={() => onAddAction({ afterId: node.id })} />
                <Line />
                <RenderChain node={node.next} onAddTrigger={onAddTrigger} onAddAction={onAddAction} onDelete={onDelete} />
            </>
        );
    }

    if (node.type === "ifelse") {
        const BW = 260; // branch width
        const GAP = 80;
        return (
            <>
                <IfElseCard node={node} onDelete={() => onDelete(node.id)} />
                {/* Fork lines */}
                <div style={{ position: "relative", width: BW + GAP + BW, display: "flex", justifyContent: "center" }}>
                    <div style={{ ...line, height: 20, width: 2 }} />
                    <div style={{
                        position: "absolute", top: 20, left: BW / 2, right: BW / 2, height: 2, background: "#cbd5e1",
                    }} />
                </div>
                {/* Branch columns */}
                <div style={{ display: "flex", gap: GAP, alignItems: "flex-start" }}>
                    {/* YES */}
                    <div style={{ width: BW, display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <BranchBadge label="Yes" color="#16a34a" />
                        <Line />
                        <AddBtn onClick={() => onAddAction({ ifelseId: node.id, branch: "yes" })} />
                        <Line />
                        <RenderChain node={node.yes} onAddTrigger={onAddTrigger} onAddAction={onAddAction} onDelete={onDelete} />
                    </div>
                    {/* NO */}
                    <div style={{ width: BW, display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <BranchBadge label="No" color="#dc2626" />
                        <Line />
                        <AddBtn onClick={() => onAddAction({ ifelseId: node.id, branch: "no" })} />
                        <Line />
                        <RenderChain node={node.no} onAddTrigger={onAddTrigger} onAddAction={onAddAction} onDelete={onDelete} />
                    </div>
                </div>
            </>
        );
    }

    // Generic action (send_email, webhook, add_tag, notify)
    const actionMeta = ALL_ACTIONS.find((a) => a.id === node.type) || {};
    const Icon = actionMeta.Icon || Zap;
    const labelMap = {
        send_email: "Send an email:", webhook: "Webhook:", add_tag: "Add tag:", notify: "Notify:",
    };
    return (
        <>
            <ActionCard
                node={node}
                icon={Icon}
                bg={actionMeta.bg || "#374151"}
                label={labelMap[node.type] || node.type}
                sub={node.config?.name || node.config?.url || node.config?.tag || "Configured"}
                onDelete={() => onDelete(node.id)}
            />
            <Line />
            <AddBtn onClick={() => onAddAction({ afterId: node.id })} />
            <Line />
            <RenderChain node={node.next} onAddTrigger={onAddTrigger} onAddAction={onAddAction} onDelete={onDelete} />
        </>
    );
}

// ── Modals ────────────────────────────────────────────────────────────────
function ModalOverlay({ children, onClose }) {
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

function ModalBox({ children, style }) {
    return (
        <div style={{
            background: "#fff", borderRadius: 12, maxHeight: "90vh", overflow: "auto",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)", ...style,
        }}>
            {children}
        </div>
    );
}

function ModalHeader({ title, onBack, onClose }) {
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

function SelectTriggerModal({ onSelect, onClose }) {
    const [cat, setCat] = useState("View All");
    const [q, setQ] = useState("");
    const filtered = TRIGGERS.filter(
        (t) => (cat === "View All" || t.cat === cat) && t.label.toLowerCase().includes(q.toLowerCase())
    );
    return (
        <ModalBox style={{ width: 780, minHeight: 500 }}>
            <div style={{ display: "flex", alignItems: "center", padding: "20px 24px", gap: 16, borderBottom: "1px solid #f1f5f9" }}>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: "#0f172a", flex: 1 }}>Select a Trigger</h2>
                <div style={{ position: "relative" }}>
                    <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                    <input
                        placeholder="Search triggers"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        style={{ padding: "8px 12px 8px 32px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, width: 200 }}
                    />
                </div>
                <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><X size={20} /></button>
            </div>
            <div style={{ display: "flex" }}>
                {/* Sidebar */}
                <div style={{ width: 180, borderRight: "1px solid #f1f5f9", padding: "16px 0", flexShrink: 0 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", padding: "0 16px 8px", letterSpacing: "0.05em" }}>TRIGGER CATEGORIES</div>
                    {TRIGGER_CATS.map((c) => (
                        <button key={c} onClick={() => setCat(c)} style={{
                            display: "block", width: "100%", textAlign: "left", padding: "8px 16px",
                            background: cat === c ? "#f0f9ff" : "none", border: "none",
                            borderLeft: cat === c ? "3px solid #3b82f6" : "3px solid transparent",
                            color: cat === c ? "#1d4ed8" : "#374151", fontSize: 13, cursor: "pointer",
                        }}>{c}</button>
                    ))}
                </div>
                {/* Grid */}
                <div style={{ flex: 1, padding: 24, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, alignContent: "start" }}>
                    {filtered.map((t) => {
                        const Icon = t.Icon;
                        return (
                            <button key={t.id} onClick={() => onSelect(t)} style={{
                                display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
                                padding: "16px 8px", border: "1px solid #f1f5f9", borderRadius: 10,
                                background: "#fafafa", cursor: "pointer", transition: "all 0.15s",
                                fontSize: 12, color: "#374151", textAlign: "center", lineHeight: 1.4,
                            }}
                                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#3b82f6"; e.currentTarget.style.background = "#f0f9ff"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#f1f5f9"; e.currentTarget.style.background = "#fafafa"; }}
                            >
                                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <Icon size={20} color="#1d4ed8" />
                                </div>
                                {t.label}
                            </button>
                        );
                    })}
                </div>
            </div>
            <div style={{ borderTop: "1px solid #f1f5f9", padding: "16px 24px", display: "flex", justifyContent: "flex-end" }}>
                <button onClick={onClose} style={{ ...btn("#3b82f6") }}>Start without a trigger</button>
            </div>
        </ModalBox>
    );
}

function ConfigureTriggerModal({ trigger, onSave, onBack, onClose }) {
    const [runs, setRuns] = useState("Once");
    const Icon = trigger.Icon;
    return (
        <ModalBox style={{ width: 560 }}>
            <ModalHeader title="Action option" onBack={onBack} onClose={onClose} />
            <div style={{ padding: "8px 24px 0", color: "#64748b", fontSize: 14 }}>({trigger.label})</div>
            <div style={{ padding: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                    <label style={{ fontSize: 14, fontWeight: 500, width: 100 }}>Select email</label>
                    <select style={{ padding: "8px 12px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 13 }}>
                        <option>Any 1:1 email</option>
                    </select>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                    <label style={{ fontSize: 14, fontWeight: 500, width: 100 }}>Runs</label>
                    <select value={runs} onChange={(e) => setRuns(e.target.value)} style={{ padding: "8px 12px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 13 }}>
                        <option>Once</option>
                        <option>Many times</option>
                    </select>
                </div>
                <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 16, marginBottom: 24 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#3b82f6", marginBottom: 12 }}>ADVANCED</div>
                    <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#374151" }}>
                        <input type="checkbox" /> Segment the contacts entering this automation
                    </label>
                </div>
            </div>
            <div style={{ borderTop: "1px solid #f1f5f9", padding: "16px 24px", display: "flex", justifyContent: "space-between" }}>
                <button onClick={onBack} style={{ ...btn("#f1f5f9", "#374151") }}>Back</button>
                <button onClick={() => onSave({ runs })} style={{ ...btn("#3b82f6") }}>Add Start</button>
            </div>
        </ModalBox>
    );
}

function AddActionModal({ onSelect, onClose }) {
    const [tab, setTab] = useState("Workflow");
    const [q, setQ] = useState("");
    const actions = ALL_ACTIONS.filter(
        (a) => a.tabs.includes(tab) && (a.label.toLowerCase().includes(q.toLowerCase()) || a.desc.toLowerCase().includes(q.toLowerCase()))
    );
    // dedupe by id for suggested tab
    const seen = new Set();
    const deduped = actions.filter((a) => { if (seen.has(a.id)) return false; seen.add(a.id); return true; });
    return (
        <ModalBox style={{ width: 600 }}>
            <ModalHeader title="Add an action" onClose={onClose} />
            <div style={{ padding: "16px 24px 0" }}>
                <div style={{ position: "relative", marginBottom: 16 }}>
                    <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                    <input
                        placeholder="Search for an action"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        style={{ width: "100%", padding: "10px 12px 10px 36px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }}
                    />
                </div>
                <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #f1f5f9" }}>
                    {ACTION_TABS.map((t) => (
                        <button key={t} onClick={() => setTab(t)} style={{
                            padding: "10px 14px", border: "none", background: "none",
                            borderBottom: tab === t ? "2px solid #3b82f6" : "2px solid transparent",
                            color: tab === t ? "#1d4ed8" : "#64748b", fontSize: 13, fontWeight: tab === t ? 600 : 400,
                            cursor: "pointer",
                        }}>{t}</button>
                    ))}
                </div>
            </div>
            <div style={{ padding: "12px 24px 24px" }}>
                {deduped.map((a) => {
                    const Icon = a.Icon;
                    return (
                        <button key={a.id + a.tabs[0]} onClick={() => onSelect(a)} style={{
                            display: "flex", alignItems: "center", gap: 16, width: "100%",
                            padding: "14px 0", borderBottom: "1px solid #f8fafc", border: "none",
                            background: "none", cursor: "pointer", textAlign: "left",
                        }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = "#f8fafc"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}
                        >
                            <div style={{ width: 44, height: 44, borderRadius: "50%", background: a.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <Icon size={20} color="#fff" />
                            </div>
                            <div>
                                <div style={{ fontSize: 15, fontWeight: 500, color: "#1e293b" }}>{a.label}</div>
                                <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>{a.desc}</div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </ModalBox>
    );
}

function ConfigureWaitModal({ onSave, onBack, onClose }) {
    const [step, setStep] = useState("type");
    const [amount, setAmount] = useState(1);
    const [unit, setUnit] = useState("day(s)");
    if (step === "type") {
        const opts = [
            { id: "period", label: "A set period of time", sub: "e.g. 2 weeks, 1 day, 6 hours, 1 hour and 30 minutes" },
            { id: "date", label: "Until a specific day and/or time", sub: "e.g. November 24th at 8:00 AM" },
            { id: "datefield", label: "Until a custom date field matches", sub: 'e.g. Until 3 days before "Webinar date"' },
            { id: "conditions", label: "Until specific conditions are met", sub: "Build a custom segment with any of your fields" },
        ];
        return (
            <ModalBox style={{ width: 600 }}>
                <div style={{ display: "flex", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid #f1f5f9", gap: 12 }}>
                    <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: "#3b82f6", display: "flex", alignItems: "center", gap: 4, fontSize: 14 }}>
                        <ChevronLeft size={16} /> Back
                    </button>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#0f2544", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Clock size={18} color="#fff" />
                            </div>
                            <div>
                                <div style={{ fontSize: 18, fontWeight: 600, color: "#0f172a" }}>Add a Wait Condition</div>
                                <div style={{ fontSize: 13, color: "#64748b" }}>Wait for a period of time, a specific date, or for conditions</div>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><X size={20} /></button>
                </div>
                <div style={{ padding: "20px 24px" }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "#1e293b", marginBottom: 16 }}>The contact will wait:</div>
                    {opts.map((o) => (
                        <button key={o.id} onClick={() => setStep(o.id)} style={{
                            display: "block", width: "100%", textAlign: "left", padding: "16px",
                            border: "1px solid #e2e8f0", borderRadius: 10, background: "#fff",
                            marginBottom: 10, cursor: "pointer",
                        }}
                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#3b82f6"; e.currentTarget.style.background = "#f0f9ff"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#fff"; }}
                        >
                            <div style={{ fontSize: 14, fontWeight: 500, color: "#1e293b" }}>{o.label}</div>
                            <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{o.sub}</div>
                        </button>
                    ))}
                </div>
                <div style={{ borderTop: "1px solid #f1f5f9", padding: "16px 24px", display: "flex", justifyContent: "flex-end", gap: 10 }}>
                    <button onClick={onClose} style={{ ...btn("#f1f5f9", "#374151") }}>Cancel</button>
                    <button style={{ ...btn("#e2e8f0", "#94a3b8") }} disabled>Save</button>
                </div>
            </ModalBox>
        );
    }
    return (
        <ModalBox style={{ width: 600 }}>
            <div style={{ display: "flex", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid #f1f5f9", gap: 12 }}>
                <button onClick={() => setStep("type")} style={{ background: "none", border: "none", cursor: "pointer", color: "#3b82f6", display: "flex", alignItems: "center", gap: 4, fontSize: 14 }}>
                    <ChevronLeft size={16} /> Back
                </button>
                <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#0f2544", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Clock size={18} color="#fff" />
                        </div>
                        <div>
                            <div style={{ fontSize: 18, fontWeight: 600, color: "#0f172a" }}>Wait for a set period of time</div>
                            <div style={{ fontSize: 13, color: "#64748b" }}>e.g. 2 weeks, 1 day, 6 hours, 1 hour and 30 minutes</div>
                        </div>
                    </div>
                </div>
                <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><X size={20} /></button>
            </div>
            <div style={{ padding: "28px 24px 40px" }}>
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 12, color: "#374151" }}>Wait for</div>
                <div style={{ display: "flex", gap: 12 }}>
                    <input type="number" min={1} value={amount} onChange={(e) => setAmount(Number(e.target.value))}
                           style={{ width: 80, padding: "10px 12px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 14 }} />
                    <select value={unit} onChange={(e) => setUnit(e.target.value)}
                            style={{ padding: "10px 12px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 14 }}>
                        {WAIT_UNITS.map((u) => <option key={u}>{u}</option>)}
                    </select>
                </div>
            </div>
            <div style={{ borderTop: "1px solid #f1f5f9", padding: "16px 24px", display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button onClick={onClose} style={{ ...btn("#f1f5f9", "#374151") }}>Cancel</button>
                <button onClick={() => onSave({ amount, unit })} style={{ ...btn("#3b82f6") }}>Save</button>
            </div>
        </ModalBox>
    );
}

function ConfigureIfElseModal({ onSave, onBack, onClose }) {
    const [field, setField] = useState("Email Address");
    const [op, setOp] = useState("Is");
    const [value, setValue] = useState("");
    return (
        <ModalBox style={{ width: 680 }}>
            <div style={{ display: "flex", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid #f1f5f9", gap: 12 }}>
                <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: "#3b82f6", display: "flex", alignItems: "center", gap: 4, fontSize: 14 }}>
                    <ChevronLeft size={16} /> Back
                </button>
                <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#374151", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <GitBranch size={18} color="#fff" />
                        </div>
                        <div>
                            <div style={{ fontSize: 18, fontWeight: 600, color: "#0f172a" }}>Does contact match these conditions?</div>
                            <div style={{ fontSize: 13, color: "#64748b" }}>Split the automation based on conditions</div>
                        </div>
                    </div>
                </div>
                <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><X size={20} /></button>
            </div>
            <div style={{ padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
                    <button style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: 13 }}>Clear all conditions</button>
                </div>
                <div style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: 16, marginBottom: 16 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <div style={{ position: "relative", flex: 2 }}>
                            <select value={field} onChange={(e) => setField(e.target.value)}
                                    style={{ width: "100%", padding: "10px 12px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 13, appearance: "none" }}>
                                {COND_FIELDS.map((f) => <option key={f}>{f}</option>)}
                            </select>
                            <ChevronDown size={14} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#94a3b8" }} />
                        </div>
                        <div style={{ position: "relative", flex: 1 }}>
                            <select value={op} onChange={(e) => setOp(e.target.value)}
                                    style={{ width: "100%", padding: "10px 12px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 13, appearance: "none" }}>
                                {COND_OPS.map((o) => <option key={o}>{o}</option>)}
                            </select>
                            <ChevronDown size={14} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#94a3b8" }} />
                        </div>
                        <input placeholder="Enter value..." value={value} onChange={(e) => setValue(e.target.value)}
                               style={{ flex: 2, padding: "10px 12px", border: "1px solid #3b82f6", borderRadius: 6, fontSize: 13 }} />
                    </div>
                    <button style={{ background: "none", border: "none", color: "#3b82f6", fontSize: 13, cursor: "pointer", marginTop: 8 }}>
                        + Add another condition
                    </button>
                </div>
                <button style={{ ...btn("#f1f5f9", "#374151"), width: "auto", marginBottom: 20 }}>Add condition group</button>
                <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 16 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "#374151", marginBottom: 10 }}>Select a segment to use its conditions</div>
                    <div style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: "12px 16px", display: "flex", alignItems: "center", gap: 8, color: "#374151", cursor: "pointer" }}>
                        <ArrowRight size={16} color="#94a3b8" />
                        <span style={{ fontSize: 14 }}>Saved Segments</span>
                    </div>
                </div>
            </div>
            <div style={{ borderTop: "1px solid #f1f5f9", padding: "16px 24px", display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button onClick={onClose} style={{ ...btn("#f1f5f9", "#374151") }}>Cancel</button>
                <button onClick={() => onSave({ field, op, value })} style={{ ...btn("#3b82f6") }}>Save</button>
            </div>
        </ModalBox>
    );
}

function ConfigureEmailModal({ onSave, onBack, onClose }) {
    const [name, setName] = useState("New Campaign");
    const [subject, setSubject] = useState("");
    return (
        <ModalBox style={{ width: 640 }}>
            <ModalHeader title="Send an email" onBack={onBack} onClose={onClose} />
            <div style={{ padding: "8px 24px 0", color: "#64748b", fontSize: 13, marginBottom: 16 }}>A marketing email for subscribed contacts</div>
            <div style={{ padding: "0 24px 24px" }}>
                {[
                    { label: "Email name", el: <input value={name} onChange={(e) => setName(e.target.value)} style={{ flex: 1, padding: "10px 12px", border: "none", fontSize: 14 }} /> },
                    { label: "Subject line", el: <input placeholder="Write your subject line" value={subject} onChange={(e) => setSubject(e.target.value)} style={{ flex: 1, padding: "10px 12px", border: "none", fontSize: 14 }} /> },
                    { label: "From", el: <span style={{ flex: 1, fontSize: 14, color: "#374151", padding: "10px 0" }}>user@example.com</span> },
                    { label: "Send", el: <div style={{ display: "flex", gap: 8, padding: "8px 0" }}><button style={{ ...btn("#3b82f6"), borderRadius: 20 }}>Immediately</button><button style={{ ...btn("#f1f5f9", "#374151"), borderRadius: 20 }}>Predictive Send</button></div> },
                ].map(({ label, el }) => (
                    <div key={label} style={{ display: "flex", alignItems: "center", borderBottom: "1px solid #f1f5f9", padding: "4px 0" }}>
                        <div style={{ width: 120, fontSize: 14, color: "#374151", fontWeight: 500 }}>{label}</div>
                        {el}
                    </div>
                ))}
                <div style={{ marginTop: 16, border: "1px solid #e2e8f0", borderRadius: 8, padding: 24, textAlign: "center", color: "#94a3b8", fontSize: 14 }}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: "#cbd5e1", marginBottom: 8 }}>LOGO</div>
                    <div style={{ fontWeight: 600, color: "#374151", marginBottom: 8 }}>Design your email here!</div>
                    <div style={{ fontSize: 13 }}>Click to open the email editor</div>
                </div>
            </div>
            <div style={{ borderTop: "1px solid #f1f5f9", padding: "16px 24px", display: "flex", justifyContent: "space-between" }}>
                <button style={{ ...btn("#f1f5f9", "#374151") }}>Send a test</button>
                <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={onClose} style={{ ...btn("#f1f5f9", "#374151") }}>Cancel</button>
                    <button style={{ ...btn("#f1f5f9", "#94a3b8") }}>Save as draft</button>
                    <button onClick={() => onSave({ name, subject })} style={{ ...btn("#3b82f6") }}>Finish</button>
                </div>
            </div>
        </ModalBox>
    );
}

function ConfigureWebhookModal({ onSave, onBack, onClose }) {
    const [url, setUrl] = useState("");
    return (
        <ModalBox style={{ width: 600 }}>
            <div style={{ display: "flex", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid #f1f5f9", gap: 12 }}>
                <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: "#3b82f6", display: "flex", alignItems: "center", gap: 4, fontSize: 14 }}>
                    <ChevronLeft size={16} /> Back
                </button>
                <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#0e7490", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Link2 size={18} color="#fff" />
                        </div>
                        <div>
                            <div style={{ fontSize: 18, fontWeight: 600, color: "#0f172a" }}>Webhook</div>
                            <div style={{ fontSize: 13, color: "#64748b" }}>Post contact data to a URL of your choice</div>
                        </div>
                    </div>
                </div>
                <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><X size={20} /></button>
            </div>
            <div style={{ padding: "28px 24px 80px" }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: "#374151", marginBottom: 10 }}>Enter the URL to post to</div>
                <input
                    placeholder="https://your-webhook-url.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    style={{ width: "100%", padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }}
                />
            </div>
            <div style={{ borderTop: "1px solid #f1f5f9", padding: "16px 24px", display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button onClick={onClose} style={{ ...btn("#f1f5f9", "#374151") }}>Cancel</button>
                <button onClick={() => onSave({ url: url || "https://your-webhook-url.com" })} style={{ ...btn("#3b82f6") }}>Save</button>
            </div>
        </ModalBox>
    );
}

function WorkflowBuilder() {
    const [flow, setFlow] = useState(createInitial());
    const [modal, setModal] = useState(null);

    const openAddTrigger = () => setModal({ type: "select_trigger" });
    const openAddAction  = (ctx)  => setModal({ type: "add_action", ctx });
    const closeModal     = ()     => setModal(null);

    const handleSelectTrigger = (trigger) => setModal({ type: "configure_trigger", trigger });
    const handleSaveTrigger = (config) => {
        setFlow((f) => ({ ...f, type: "trigger", config: { triggerId: modal.trigger.id, ...config } }));
        closeModal();
    };

    const handleSelectAction = (action) => {
        const typeMap = {
            wait: "configure_wait", ifelse: "configure_ifelse",
            send_email: "configure_send_email", webhook: "configure_webhook",
            add_tag: "configure_send_email", notify: "configure_send_email",
        };
        setModal({ type: typeMap[action.id] || "add_action", ctx: modal.ctx, action });
    };

    const doInsert = (ctx, type, config) => {
        if (ctx.branch) {
            setFlow((f) => insertBranchStart(f, ctx.ifelseId, ctx.branch, type, config));
        } else {
            setFlow((f) => insertAfterNode(f, ctx.afterId, type, config));
        }
        closeModal();
    };

    const handleDelete = (id) => {
        setFlow((f) => deleteNode(f, id));
    };

    const hasRealTrigger = flow.type === "trigger";

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "700px", fontFamily: "system-ui, -apple-system, sans-serif", position: "relative" }}>
            {/* Header */}
            <div style={{ background: "#0f172a", color: "#fff", padding: "0 20px", height: 48, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14 }}>
                    <span style={{ color: "#64748b" }}>Automations</span>
                    <span style={{ color: "#64748b" }}>/</span>
                    <span style={{ color: "#e2e8f0" }}>New Automation</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <span style={{ fontSize: 12, color: "#64748b" }}>Saved</span>
                    <div style={{ display: "flex", borderRadius: 20, overflow: "hidden", border: "1px solid #334155" }}>
                        <button style={{ padding: "5px 14px", fontSize: 12, background: "#16a34a", color: "#fff", border: "none", cursor: "pointer", fontWeight: 500 }}>Active</button>
                        <button style={{ padding: "5px 14px", fontSize: 12, background: "transparent", color: "#64748b", border: "none", cursor: "pointer" }}>Inactive</button>
                    </div>
                </div>
            </div>

            {/* Canvas */}
            <div style={{
                flex: 1, minHeight: 640,
                background: "#f0f4f8",
                backgroundImage: "radial-gradient(circle, #c8d6e5 1.5px, transparent 1.5px)",
                backgroundSize: "24px 24px",
                display: "flex", justifyContent: "center", alignItems: "flex-start",
                padding: "60px 40px 80px", overflow: "auto", gap: 24,
            }}>
                {/* Main flow column */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <RenderChain
                        node={flow}
                        onAddTrigger={openAddTrigger}
                        onAddAction={openAddAction}
                        onDelete={handleDelete}
                    />
                </div>

                {/* Right side panels */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 0 }}>
                    {hasRealTrigger && <SidePanelButton label="Add another start trigger" />}
                    <SidePanelButton label="Add contacts to this automation" />
                </div>
            </div>

            {/* Modal layer */}
            {modal && (
                <ModalOverlay onClose={closeModal}>
                    {modal.type === "select_trigger" && (
                        <SelectTriggerModal onSelect={handleSelectTrigger} onClose={closeModal} />
                    )}
                    {modal.type === "configure_trigger" && (
                        <ConfigureTriggerModal
                            trigger={modal.trigger}
                            onSave={handleSaveTrigger}
                            onBack={() => setModal({ type: "select_trigger" })}
                            onClose={closeModal}
                        />
                    )}
                    {modal.type === "add_action" && (
                        <AddActionModal onSelect={handleSelectAction} onClose={closeModal} />
                    )}
                    {modal.type === "configure_wait" && (
                        <ConfigureWaitModal
                            onSave={(cfg) => doInsert(modal.ctx, "wait", cfg)}
                            onBack={() => setModal({ type: "add_action", ctx: modal.ctx })}
                            onClose={closeModal}
                        />
                    )}
                    {modal.type === "configure_ifelse" && (
                        <ConfigureIfElseModal
                            onSave={(cfg) => doInsert(modal.ctx, "ifelse", cfg)}
                            onBack={() => setModal({ type: "add_action", ctx: modal.ctx })}
                            onClose={closeModal}
                        />
                    )}
                    {modal.type === "configure_send_email" && (
                        <ConfigureEmailModal
                            onSave={(cfg) => doInsert(modal.ctx, "send_email", { ...cfg, name: cfg.name || "New Campaign" })}
                            onBack={() => setModal({ type: "add_action", ctx: modal.ctx })}
                            onClose={closeModal}
                        />
                    )}
                    {modal.type === "configure_webhook" && (
                        <ConfigureWebhookModal
                            onSave={(cfg) => doInsert(modal.ctx, "webhook", cfg)}
                            onBack={() => setModal({ type: "add_action", ctx: modal.ctx })}
                            onClose={closeModal}
                        />
                    )}
                </ModalOverlay>
            )}
        </div>
    );
}

export default function WorkflowBuilderPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);

    const returnPath = '/automations';

    const handleBack = useCallback(() => {
        navigate(returnPath);
    }, [navigate, returnPath]);

    const handleSave = useCallback(async () => {
        setIsSaving(true);
        try {
            /*
             * TODO: call exportToHtml(template) here, POST the HTML + JSON
             * to the API, then navigate back.
             *
             * For now we just simulate and navigate.
             *
             * Example:
             *   const html = exportToHtml(template);
             *   await api.campaigns.saveContent(campaignId, { html, templateJson: template });
             */
            await new Promise((r) => setTimeout(r, 600));
            toast({ description: 'Template saved.' });
            navigate(returnPath);
        } catch {
            toast({ description: 'Failed to save template.', variant: 'destructive' });
        } finally {
            setIsSaving(false);
        }
    }, [navigate, returnPath, toast]);

    return (
        <div className="flex h-screen flex-col overflow-hidden">
            {/* Top bar */}
            <div className="flex h-11 shrink-0 items-center justify-between border-b border-border bg-card px-4">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 gap-1.5 text-xs text-muted-foreground"
                        onClick={handleBack}
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Back to campaign
                    </Button>
                </div>

                <Button
                    size="sm"
                    className="h-7 gap-1.5 text-xs bg-accent hover:bg-accent/90 text-accent-foreground"
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    <Save className="h-3.5 w-3.5" />
                    {isSaving ? 'Saving…' : 'Save & continue'}
                </Button>
            </div>

            {/* Builder fills remaining height */}
            <div className="flex-1 overflow-hidden">
                <WorkflowBuilder />
            </div>
        </div>
    );
}