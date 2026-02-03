import type { ComponentProps } from 'react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface SettingsCardRootProps extends ComponentProps<typeof Card> {}

function SettingsCardRoot({ className, ...props }: SettingsCardRootProps) {
  return (
    <Card className={cn('rounded bg-zinc-900/60 p-0', className)} {...props} />
  )
}

interface SettingsCardContentProps extends ComponentProps<typeof CardContent> {}

function SettingsCardContent({
  className,
  ...props
}: SettingsCardContentProps) {
  return <CardContent className={cn('p-4! pb-0!', className)} {...props} />
}

interface SettingsCardHeaderProps extends ComponentProps<typeof CardHeader> {}

function SettingsCardHeader({ className, ...props }: SettingsCardHeaderProps) {
  return <CardHeader className={cn('p-0', className)} {...props} />
}

interface SettingsCardTitleProps extends ComponentProps<typeof CardTitle> {}

function SettingsCardTitle({ className, ...props }: SettingsCardTitleProps) {
  return <CardTitle className={cn('p-0', className)} {...props} />
}

interface SettingsCardDescriptionProps extends ComponentProps<
  typeof CardDescription
> {}

function SettingsCardDescription({
  className,
  ...props
}: SettingsCardDescriptionProps) {
  return <CardDescription className={cn('p-0', className)} {...props} />
}

interface SettingsCardFooterProps extends ComponentProps<typeof CardFooter> {}

function SettingsCardFooter({ className, ...props }: SettingsCardFooterProps) {
  return (
    <CardFooter
      className={cn(
        'p-4 pt-4! border-t border-zinc-800 bg-zinc-950/50 flex justify-end',
        className,
      )}
      {...props}
    />
  )
}

interface SettingsCardFooterDescriptionProps extends ComponentProps<'span'> {}

function SettingsCardFooterDescription({
  className,
  ...props
}: SettingsCardFooterDescriptionProps) {
  return <span className={cn('text-sm text-zinc-500', className)} {...props} />
}

interface SettingsCardFooterActionProps extends ComponentProps<typeof Button> {}

function SettingsCardFooterAction({
  className,
  ...props
}: SettingsCardFooterActionProps) {
  return <Button className={cn('', className)} {...props} />
}

interface SettingsCardFooterActionTextProps extends ComponentProps<'span'> {}

function SettingsCardFooterActionText({
  className,
  ...props
}: SettingsCardFooterActionTextProps) {
  return (
    <span
      className={cn('text-sm font-medium text-zinc-900', className)}
      {...props}
    />
  )
}

interface SettingsCardFooterActionIconProps extends ComponentProps<'div'> {}

function SettingsCardFooterActionIcon({
  className,
  ...props
}: SettingsCardFooterActionIconProps) {
  return <div className={cn('text-zinc-900', className)} {...props} />
}

interface SettingsCardFormProps extends ComponentProps<'form'> {}

function SettingsCardForm({ className, ...props }: SettingsCardFormProps) {
  return <form className={cn('', className)} {...props} />
}

export const SettingsCard = {
  Root: SettingsCardRoot,
  Content: SettingsCardContent,
  Header: SettingsCardHeader,
  Title: SettingsCardTitle,
  Description: SettingsCardDescription,
  Footer: SettingsCardFooter,
  FooterDescription: SettingsCardFooterDescription,
  Action: SettingsCardFooterAction,
  ActionText: SettingsCardFooterActionText,
  ActionIcon: SettingsCardFooterActionIcon,
  Form: SettingsCardForm,
}
