import Link from 'next/link'

import { SignInForm } from './_components/signin-form'

export default async function LoginPage() {
  return (
    <div className="w-full max-w-sm rounded bg-card p-6 shadow-lg ring-1 ring-border">
      <h1 className="text-xl font-semibold text-foreground">Sign in</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Enter your email and password to continue.
      </p>

      <SignInForm />

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link
          href="/signup"
          className="font-medium text-foreground underline hover:text-foreground"
        >
          Sign up
        </Link>
      </p>
    </div>
  )
}
