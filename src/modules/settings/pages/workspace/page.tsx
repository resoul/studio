import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Upload, Loader2, Save } from 'lucide-react';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  description: z.string().optional(),
});

export function WorkspaceSettingsPage() {
  const { currentWorkspace, updateWorkspace } = useWorkspaces();
  const [logo, setLogo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  useEffect(() => {
    if (currentWorkspace) {
      form.reset({
        name: currentWorkspace.name,
        description: currentWorkspace.description,
      });
      setPreview(currentWorkspace.logo_url);
    }
  }, [currentWorkspace, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!currentWorkspace) return;

    const formData = new FormData();
    formData.append('name', values.name);
    if (values.description) formData.append('description', values.description);
    if (logo) formData.append('logo', logo);

    updateWorkspace.mutate({ id: currentWorkspace.id, formData }, {
      onSuccess: () => {
        toast.success('Workspace updated successfully!');
      },
      onError: (error) => {
        toast.error('Failed to update workspace: ' + error.message);
      },
    });
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogo(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  if (!currentWorkspace) return null;

  return (
    <div className="max-w-3xl mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Workspace Overview</CardTitle>
          <CardDescription>
            Update your workspace details and branding.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex items-center gap-6 pb-6 border-b border-border mb-6">
                <Avatar className="size-20 border-2 border-border shadow-sm">
                  <AvatarImage src={preview || ''} className="object-cover" />
                  <AvatarFallback className="text-xl font-bold bg-muted">
                    {currentWorkspace.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h4 className="font-medium">Workspace Logo</h4>
                  <p className="text-sm text-muted-foreground">
                    This will be displayed in the sidebar and emails.
                  </p>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                    id="logo-settings-upload"
                  />
                  <label
                    htmlFor="logo-settings-upload"
                    className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 border border-input rounded-md text-sm cursor-pointer hover:bg-accent"
                  >
                    <Upload className="size-4" />
                    Change Logo
                  </label>
                </div>
              </div>

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
                        placeholder="A short description of your team"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit" disabled={updateWorkspace.isPending}>
                  {updateWorkspace.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
