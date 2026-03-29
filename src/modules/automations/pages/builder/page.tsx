import {useCallback, useEffect, useState} from "react";
import { ArrowLeft, Save } from "lucide-react";
import {useNavigate, useParams} from "react-router-dom";
import {useToast} from "@/hooks/use-toast.ts";
import {Button} from "@/components/ui/button.tsx";
import { WorkflowBuilder } from "@/modules/automations/components/workflow-builder";
import { useHeaderSlot } from '@/layout/components/header-slot-context';
import { Content } from '@/layout/components/content';

export default function WorkflowBuilderPage() {
    const { id } = useParams<{ id: string }>();
    console.log(id)
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);

    const returnPath = '/automations/automations';

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

    const { setHeaderSlot } = useHeaderSlot();
    useEffect(() => {
        setHeaderSlot(
            <>
                <div className="flex items-center gap-4">
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
                <div className="flex items-center gap-2"></div>
                <div className="flex items-center gap-2">
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
            </>
        );

        return () => setHeaderSlot(null);
    }, [handleBack, handleSave, isSaving, setHeaderSlot])

    return (
        <>
            <div className="container-fluid">
                <Content className="block py-0">
                    <WorkflowBuilder />
                </Content>
            </div>
        </>
    );
}
