import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

interface PageRootProps extends ComponentProps<'div'> {}

function PageRoot({ className, ...props }: PageRootProps) {
  return <div className={cn('p-6 flex flex-col gap-8', className)} {...props} />
}

interface PageContentProps extends ComponentProps<'div'> {}

function PageContent({ className, ...props }: PageContentProps) {
  return <div className={cn('', className)} {...props} />
}

interface PageHeaderRootProps extends ComponentProps<'div'> {}

function PageHeaderRoot({ className, ...props }: PageHeaderRootProps) {
  return <div className={cn('flex flex-col gap-1', className)} {...props} />
}

interface PageHeaderTitleProps extends ComponentProps<'h1'> {}

function PageHeaderTitle({ className, ...props }: PageHeaderTitleProps) {
  return (
    <h1
      className={cn('text-xl font-semibold text-foreground', className)}
      {...props}
    />
  )
}

interface PageHeaderDescriptionProps extends ComponentProps<'p'> {}

function PageHeaderDescription({
  className,
  ...props
}: PageHeaderDescriptionProps) {
  return (
    <p className={cn('mt-1 text-sm text-muted-foreground', className)} {...props} />
  )
}

export const PageHeader = {
  Root: PageHeaderRoot,
  Title: PageHeaderTitle,
  Description: PageHeaderDescription,
}

export const Page = {
  Root: PageRoot,
  Content: PageContent,
  Header: PageHeaderRoot,
  Title: PageHeaderTitle,
  Description: PageHeaderDescription,
}
