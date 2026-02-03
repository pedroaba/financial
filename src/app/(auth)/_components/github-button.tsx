import { Github, LoaderIcon } from 'lucide-react'
import { type ComponentProps, type MouseEvent, useTransition } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface GitHubButtonProps extends Omit<
  ComponentProps<'button'>,
  'children'
> {}

export function GitHubButton({
  onClick,
  className,
  disabled,
  ...props
}: GitHubButtonProps) {
  const [isGithubLoading, startGithubAction] = useTransition()

  async function handleGithubAction(event: MouseEvent<HTMLButtonElement>) {
    startGithubAction(async () => {
      await onClick?.(event)
    })
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleGithubAction}
      className={cn('w-full', className)}
      disabled={isGithubLoading || disabled}
      {...props}
    >
      {isGithubLoading ? (
        <LoaderIcon className="size-4 animate-spin" />
      ) : (
        <Github className="size-4" />
      )}
      <span className="ml-2">
        {isGithubLoading ? 'Redirecting...' : 'Continue with GitHub'}
      </span>
    </Button>
  )
}
