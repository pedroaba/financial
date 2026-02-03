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
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type Schema = z.infer<typeof schema>

export function SignInForm() {
  const router = useRouter()

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
  })

  async function handleSignInOnPlatform(schema: Schema) {
    const toastId = toast.loading('Signing up...')
    try {
      const { data, error: signInError } = await authClient.signIn.email({
        email: schema.email,
        password: schema.password,
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
      toast.error('Sign in failed', { id: toastId })
    }
  }

  async function handleSignInWithGithub() {
    const toastId = toast.loading('Signing in with GitHub...')
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
        onSubmit={form.handleSubmit(handleSignInOnPlatform)}
        className="mt-4 space-y-4 w-full h-full"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-zinc-300">
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
              <FormLabel className="text-sm font-medium text-zinc-300">
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
            className="w-full text-zinc-950"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting && (
              <LoaderIcon className="size-4 animate-spin" />
            )}
            {form.formState.isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </div>
      </form>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-zinc-700" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-zinc-950 px-2 text-zinc-500">or</span>
        </div>
      </div>

      <GitHubButton onClick={handleSignInWithGithub} />
    </Form>
  )
}
