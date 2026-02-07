'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

import type { AuthSession } from '@/lib/better-auth/auth'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { authClient } from '@/lib/auth-client'
import { getUsernameInitial } from '@/utils/get-initials'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { SettingBlock } from './setting-block'

const nameSchema = z.object({
  name: z.string().min(1, 'Name is required').max(32, 'Use 32 characters at maximum'),
})

const imageSchema = z.object({
  image: z.string().url('Must be a valid URL').optional().or(z.literal('')),
})

type NameSchema = z.infer<typeof nameSchema>
type ImageSchema = z.infer<typeof imageSchema>

interface GeneralSettingsProps {
  user: AuthSession['user']
}

export function GeneralSettings({ user }: GeneralSettingsProps) {
  const displayName = user.name ?? user.email ?? 'User'

  return (
    <div className="space-y-0">
      {/* Display Name – modular block with own Save */}
      <DisplayNameBlock
        defaultValue={user.name ?? ''}
        onSuccess={() => toast.success('Display name updated')}
      />

      {/* Email – read-only, no Save */}
      <SettingBlock
        title="Email"
        description="Your email is managed by your sign-in provider. Contact support to change it."
      >
        <Input
          value={user.email ?? ''}
          disabled
          className="bg-card/50 text-muted-foreground"
        />
      </SettingBlock>

      {/* Profile picture – modular block with own Save */}
      <ProfilePictureBlock
        defaultValue={user.image ?? ''}
        displayName={displayName}
        onSuccess={() => toast.success('Profile picture updated')}
      />
    </div>
  )
}

function DisplayNameBlock({
  defaultValue,
  onSuccess,
}: {
  defaultValue: string
  onSuccess: () => void
}) {
  const form = useForm<NameSchema>({
    resolver: zodResolver(nameSchema),
    defaultValues: { name: defaultValue },
  })

  async function onSubmit(values: NameSchema) {
    const id = toast.loading('Saving...')
    try {
      const { error } = await authClient.updateUser({ name: values.name })
      if (error) {
        toast.error(error.message ?? 'Failed to update name', { id })
        return
      }
      toast.success('Display name updated', { id })
      onSuccess()
    } catch {
      toast.error('Failed to update name', { id })
    }
  }

  return (
    <SettingBlock
      title="Display Name"
      description="This is your visible name within the app. For example, the name you use in reports or shared views."
      hint="Please use 32 characters at maximum."
      action={
        <Button
          size="sm"
          disabled={form.formState.isSubmitting}
          onClick={form.handleSubmit(onSubmit)}
        >
          {form.formState.isSubmitting ? (
            <LoaderIcon className="size-4 animate-spin" />
          ) : (
            'Save'
          )}
        </Button>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder="Your name" className="max-w-md" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </SettingBlock>
  )
}

function ProfilePictureBlock({
  defaultValue,
  displayName,
  onSuccess,
}: {
  defaultValue: string
  displayName: string
  onSuccess: () => void
}) {
  const form = useForm<ImageSchema>({
    resolver: zodResolver(imageSchema),
    defaultValues: { image: defaultValue },
  })

  const imageUrl = form.watch('image')?.trim() || undefined

  async function onSubmit(values: ImageSchema) {
    const id = toast.loading('Saving...')
    try {
      const { error } = await authClient.updateUser({
        image: values.image?.trim() || undefined,
      })
      if (error) {
        toast.error(error.message ?? 'Failed to update picture', { id })
        return
      }
      toast.success('Profile picture updated', { id })
      onSuccess()
    } catch {
      toast.error('Failed to update picture', { id })
    }
  }

  return (
    <SettingBlock
      title="Profile Picture"
      description="This is your profile picture. Enter a URL to use a custom image."
      hint="Please use a valid image URL."
      action={
        <Button
          size="sm"
          disabled={form.formState.isSubmitting}
          onClick={form.handleSubmit(onSubmit)}
        >
          {form.formState.isSubmitting ? (
            <LoaderIcon className="size-4 animate-spin" />
          ) : (
            'Save'
          )}
        </Button>
      }
    >
      <div className="flex items-center gap-4">
        <Avatar size="lg" className="size-16 shrink-0">
          <AvatarImage src={imageUrl} alt={displayName} />
          <AvatarFallback className="bg-primary text-primary-foreground text-lg">
            {getUsernameInitial(displayName)}
          </AvatarFallback>
        </Avatar>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 space-y-2 max-w-md"
          >
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
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
          </form>
        </Form>
      </div>
    </SettingBlock>
  )
}
