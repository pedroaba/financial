import Link from 'next/link'

import { SignUpForm } from './_components/signup-form'

export default async function SignUpPage() {
  return (
    <div className="w-full max-w-sm rounded bg-card p-6 shadow-lg ring-1 ring-border">
      <h1 className="text-xl font-semibold text-foreground">Create account</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Enter your name, email and password to sign up.
      </p>

      <SignUpForm />

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-medium text-foreground underline hover:text-foreground"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}
