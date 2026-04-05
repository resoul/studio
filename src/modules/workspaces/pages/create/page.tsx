import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Building2, Upload, Loader2, Check } from 'lucide-react';
import { useWorkspaces } from '@/hooks/use-workspaces';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  description: z.string().optional(),
});

export function CreateWorkspacePage() {
  const navigate = useNavigate();
  const { createWorkspace, switchWorkspace } = useWorkspaces();
  const [logo, setLogo] = useState<File | null>(null);
  const [createdWorkspaceId, setCreatedWorkspaceId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    formData.append('name', values.name);
    if (values.description) formData.append('description', values.description);
    if (logo) formData.append('logo', logo);

    createWorkspace.mutate(formData, {
      onSuccess: (data: any) => {
        toast.success('Workspace created successfully!');
        setCreatedWorkspaceId(data.id);
      },
      onError: (error: any) => {
        toast.error('Failed to create workspace: ' + error.message);
      },
    });
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(e.target.files[0]);
    }
  };

  const handleSwitch = () => {
    if (createdWorkspaceId) {
      switchWorkspace(createdWorkspaceId);
      navigate('/dashboard');
    }
  };

  if (createdWorkspaceId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md text-center border-emerald-100 dark:border-emerald-900/30">
          <CardHeader>
            <div className="mx-auto bg-emerald-100 dark:bg-emerald-900/30 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Check className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <CardTitle>Workspace Created!</CardTitle>
            <CardDescription>
              Your new workspace "{form.getValues().name}" is ready to use.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button onClick={handleSwitch} className="w-full">
              Switch to New Workspace
            </Button>
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="w-full">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Building2 className="size-6 text-primary" />
            Create New Workspace
          </CardTitle>
          <CardDescription>
            Workspaces are shared environments where you can manage your team and projects.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workspace Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Corp" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What is this workspace for?"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>Workspace Logo</FormLabel>
                <div className="flex items-center gap-4 p-4 rounded-lg border bg-muted/30">
                  <div className="size-16 rounded-md border-2 border-dashed flex items-center justify-center bg-background overflow-hidden shrink-0">
                    {logo ? (
                      <img
                        src={URL.createObjectURL(logo)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Building2 className="size-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="inline-flex items-center gap-2 text-sm font-medium cursor-pointer hover:text-primary transition-colors"
                    >
                      <Upload className="size-4" />
                      Upload a logo
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Recommended: square image, max 2MB.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate(-1)}
                  disabled={createWorkspace.isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createWorkspace.isPending}>
                  {createWorkspace.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Workspace
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
