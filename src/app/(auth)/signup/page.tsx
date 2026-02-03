import Link from 'next/link'

import { SignUpForm } from './_components/signup-form'

export default async function SignUpPage() {
  return (
    <div className="w-full max-w-sm rounded bg-zinc-950 p-6 shadow-lg ring-1 ring-zinc-800">
      <h1 className="text-xl font-semibold text-zinc-100">Create account</h1>
      <p className="mt-1 text-sm text-zinc-400">
        Enter your name, email and password to sign up.
      </p>

      <SignUpForm />

      <p className="mt-4 text-center text-sm text-zinc-400">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-medium text-zinc-200 underline hover:text-zinc-100"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}
