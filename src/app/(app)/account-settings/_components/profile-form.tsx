'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

import type { AuthSession } from '@/api/infra/auth'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { authClient } from '@/lib/auth-client'
import { getUsernameInitial } from '@/utils/get-initials'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  image: z.string().url('Must be a valid URL').optional().or(z.literal('')),
})

type ProfileSchema = z.infer<typeof profileSchema>

interface ProfileFormProps {
  user: AuthSession['user']
}

export function ProfileForm({ user }: ProfileFormProps) {
  const form = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name ?? '',
      image: user.image ?? '',
    },
  })

  async function onSubmit(values: ProfileSchema) {
    const toastId = toast.loading('Updating profile...')
    try {
      const { error } = await authClient.updateUser({
        name: values.name,
        image: values.image?.trim() || undefined,
      })

      if (error) {
        toast.error(error.message ?? 'Failed to update profile', { id: toastId })
        return
      }

      toast.success('Profile updated', { id: toastId })
    } catch {
      toast.error('Failed to update profile', { id: toastId })
    }
  }

  const displayName = user.name ?? user.email ?? 'User'

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar size="lg" className="size-16">
            <AvatarImage src={user.image ?? undefined} alt={displayName} />
            <AvatarFallback className="bg-primary text-primary-foreground text-lg">
              {getUsernameInitial(displayName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Update your display name and profile picture URL.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 max-w-md"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Your name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {user.email && (
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">
                  Email
                </label>
                <Input
                  value={user.email}
                  disabled
                  className="bg-muted/50 text-muted-foreground"
                />
                <p className="text-muted-foreground text-xs">
                  Email is managed by your sign-in provider. Contact support to
                  change it.
                </p>
              </div>
            )}

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile picture URL</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting && (
                <LoaderIcon className="size-4 animate-spin" />
              )}
              {form.formState.isSubmitting ? 'Saving...' : 'Save changes'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
