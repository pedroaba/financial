import Link from 'next/link'

import { SignInForm } from './_components/signin-form'

export default async function LoginPage() {
  return (
    <div className="w-full max-w-sm rounded bg-zinc-950 p-6 shadow-lg ring-1 ring-zinc-800">
      <h1 className="text-xl font-semibold text-zinc-100">Sign in</h1>
      <p className="mt-1 text-sm text-zinc-400">
        Enter your email and password to continue.
      </p>

      <SignInForm />

      <p className="mt-4 text-center text-sm text-zinc-400">
        Don&apos;t have an account?{' '}
        <Link
          href="/signup"
          className="font-medium text-zinc-200 underline hover:text-zinc-100"
        >
          Sign up
        </Link>
      </p>
    </div>
  )
}
