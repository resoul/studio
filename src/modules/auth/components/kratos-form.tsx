import { UiContainer, UiNode, UiNodeInputAttributes } from '@ory/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

interface KratosFormProps {
    ui: UiContainer;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    loading?: boolean;
    className?: string;
}

const KratosNode = ({ node }: { node: UiNode }) => {
    const { attributes, meta, messages, type } = node;

    if (type !== 'input') {
        // Handle other types if needed (e.g., script, img, text)
        return null;
    }

    const inputAttrs = attributes as UiNodeInputAttributes;

    // Don't render hidden fields (Kratos uses them for CSRF, etc.)
    if (inputAttrs.type === 'hidden') {
        return (
            <input
                type="hidden"
                name={inputAttrs.name}
                value={inputAttrs.value as string}
            />
        );
    }

    const label = meta.label?.text;
    const isButton = inputAttrs.type === 'submit' || inputAttrs.type === 'button';

    if (isButton) {
        return (
            <Button
                type={inputAttrs.type as 'submit' | 'button'}
                name={inputAttrs.name}
                value={inputAttrs.value as string}
                disabled={inputAttrs.disabled}
                className="w-full"
            >
                {label}
            </Button>
        );
    }

    return (
        <div className="space-y-2">
            {label && <Label htmlFor={inputAttrs.name}>{label}</Label>}
            <Input
                id={inputAttrs.name}
                name={inputAttrs.name}
                type={inputAttrs.type}
                defaultValue={inputAttrs.value as string}
                placeholder={label}
                disabled={inputAttrs.disabled}
                required={inputAttrs.required}
                aria-invalid={messages.length > 0}
            />
            {messages.map((message) => (
                <p
                    key={message.id}
                    className={cn(
                        'text-xs',
                        message.type === 'error' ? 'text-destructive' : 'text-muted-foreground'
                    )}
                >
                    {message.text}
                </p>
            ))}
        </div>
    );
};

export const KratosForm = ({ ui, onSubmit, className }: KratosFormProps) => {
    return (
        <form
            action={ui.action}
            method={ui.method}
            onSubmit={onSubmit}
            className={cn('space-y-4', className)}
        >
            {ui.messages?.map((message) => (
                <Alert
                    key={message.id}
                    variant={message.type === 'error' ? 'destructive' : 'secondary'}
                >
                    <AlertDescription>{message.text}</AlertDescription>
                </Alert>
            ))}

            {ui.nodes.map((node, index) => (
                <KratosNode key={index} node={node} />
            ))}
        </form>
    );
};
