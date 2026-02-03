'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

import { Button } from '@/components/ui/button'
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

import { SettingBlock } from './setting-block'

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type ChangePasswordSchema = z.infer<typeof changePasswordSchema>

export function ChangePasswordForm() {
  const form = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(values: ChangePasswordSchema) {
    const id = toast.loading('Updating password...')
    try {
      const { error } = await authClient.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      })

      if (error) {
        toast.error(error.message ?? 'Failed to change password', { id })
        return
      }

      toast.success('Password updated', { id })
      form.reset()
    } catch {
      toast.error('Failed to change password', { id })
    }
  }

  return (
    <SettingBlock
      title="Password"
      description="Update your password. Use a strong password with at least 8 characters."
      hint="Please use at least 8 characters for your new password."
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
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 max-w-md"
        >
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" placeholder="••••••••" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" placeholder="••••••••" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm new password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" placeholder="••••••••" />
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
