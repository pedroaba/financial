import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

import { Button } from './ui/button'

interface ToolbarRootProps extends ComponentProps<'div'> {}

function ToolbarRoot({ className, ...props }: ToolbarRootProps) {
  return <div className={cn('', className)} {...props} />
}

interface ToolbarTitleProps extends ComponentProps<'h1'> {}

function ToolbarTitle({ className, ...props }: ToolbarTitleProps) {
  return <h1 className={cn('', className)} {...props} />
}

interface ToolbarDescriptionProps extends ComponentProps<'p'> {}

function ToolbarDescription({ className, ...props }: ToolbarDescriptionProps) {
  return <p className={cn('text-sm text-muted-foreground', className)} {...props} />
}

interface ToolbarContentProps extends ComponentProps<'div'> {}

function ToolbarContent({ className, ...props }: ToolbarContentProps) {
  return (
    <div
      className={cn('flex items-center justify-between', className)}
      {...props}
    />
  )
}

interface ToolbarActionProps extends ComponentProps<typeof Button> {}

function ToolbarAction({ className, ...props }: ToolbarActionProps) {
  return <Button className={className} {...props} />
}

export const Toolbar = {
  Root: ToolbarRoot,
  Title: ToolbarTitle,
  Description: ToolbarDescription,
  Content: ToolbarContent,
  Action: ToolbarAction,
}
