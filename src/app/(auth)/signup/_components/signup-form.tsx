'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
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

import { GitHubButton } from '../../_components/github-button'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type Schema = z.infer<typeof schema>

export function SignUpForm() {
  const router = useRouter()

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
  })

  async function handleSignUpOnPlatform(schema: Schema) {
    const toastId = toast.loading('Signing up...')
    try {
      const { data, error: signUpError } = await authClient.signUp.email({
        name: schema.name,
        email: schema.email,
        password: schema.password,
        callbackURL: '/dashboard',
      })

      if (signUpError) {
        toast.error(signUpError.message ?? 'Sign up failed', { id: toastId })
        return
      }

      if (data) {
        toast.success('Signed up successfully', { id: toastId })
        router.push('/dashboard')
      }
    } catch {
      toast.error('Sign up failed', { id: toastId })
    }
  }

  async function handleSignUpWithGithub() {
    const toastId = toast.loading('Signing up with GitHub...')
    try {
      const { data, error: signInError } = await authClient.signIn.social({
        provider: 'github',
        callbackURL: '/dashboard',
      })

      if (signInError) {
        toast.error(signInError.message ?? 'Sign in failed', { id: toastId })
        return
      }

      if (data) {
        toast.success('Signed in successfully', { id: toastId })
        router.push('/dashboard')
      }
    } catch {
      toast.error('Sign in with GitHub failed', { id: toastId })
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSignUpOnPlatform)}
        className="mt-4 space-y-4 w-full h-full"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-foreground">
                Name
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="Your name" />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-foreground">
                Email
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="Your email" />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-foreground">
                Password
              </FormLabel>
              <FormControl>
                <Input {...field} type="password" placeholder="Your password" />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            className="w-full text-foreground"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting && (
              <LoaderIcon className="size-4 animate-spin" />
            )}
            {form.formState.isSubmitting ? 'Signing up...' : 'Sign up'}
          </Button>
        </div>
      </form>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">or</span>
        </div>
      </div>

      <GitHubButton onClick={handleSignUpWithGithub} />
    </Form>
  )
}
