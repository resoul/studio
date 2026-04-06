import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from '@/hooks/useTranslation';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/api';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';

const profileSchema = z.object({
    first_name: z.string().min(2, 'First name is too short'),
    last_name: z.string().min(2, 'Last name is too short'),
    avatar: z.any().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function OnboardingProfilePage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { workspaces } = useAuth();
    const [searchParams] = useSearchParams();
    const returnTo = searchParams.get('return_to') ?? '';

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            first_name: '',
            last_name: '',
        },
    });

    const onSubmit = async (values: ProfileFormValues) => {
        try {
            const formData = new FormData();
            formData.append('first_name', values.first_name);
            formData.append('last_name', values.last_name);
            if (values.avatar && values.avatar[0]) {
                formData.append('avatar', values.avatar[0]);
            }

            await api.patch('/user/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            toast.success('Profile updated successfully');
            await queryClient.invalidateQueries({ queryKey: ['api-user'] });

            // If there's a pending invite, go accept it
            if (returnTo && returnTo.startsWith('/invites/')) {
                navigate(returnTo, { replace: true });
                return;
            }

            // User already has workspaces (joined via invite before onboarding)
            const hasWorkspaces = workspaces && workspaces.length > 0;
            if (hasWorkspaces) {
                navigate('/onboarding/workspace-select', { replace: true });
            } else {
                navigate('/onboarding/workspace', { replace: true });
            }
        } catch (error) {
            toast.error('Failed to update profile');
            console.error(error);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
            <Card className="w-full max-w-md shadow-lg border-none">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight">
                        {t('onboarding.profile.title')}
                    </CardTitle>
                    <CardDescription>
                        {t('onboarding.profile.description')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="first_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('onboarding.profile.firstName')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="last_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('onboarding.profile.lastName')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="avatar"
                                render={({ field: { value, onChange, ...field } }) => (
                                    <FormItem>
                                        <FormLabel>{t('onboarding.profile.avatar')}</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => onChange(e.target.files)}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting ? 'Saving...' : t('onboarding.profile.save')}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
