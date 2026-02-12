import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

import { Button } from './ui/button'

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
    <p
      className={cn('mt-1 text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}

type PageListRootProps = ComponentProps<'div'>

function PageListRoot({ className, ...props }: PageListRootProps) {
  return <div className={cn('space-y-4 mt-4', className)} {...props} />
}

type PageListTableContainerProps = ComponentProps<'div'>

function PageListTableContainer({
  className,
  ...props
}: PageListTableContainerProps) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded border border-border bg-card/50',
        className,
      )}
      {...props}
    />
  )
}

type PageListPaginationRootProps = ComponentProps<'div'>

function PageListPaginationRoot({
  className,
  ...props
}: PageListPaginationRootProps) {
  return (
    <div
      className={cn('flex items-center justify-between', className)}
      {...props}
    />
  )
}

type PageListPaginationCurrentPageProps = ComponentProps<'div'>

function PageListPaginationCurrentPage({
  className,
  ...props
}: PageListPaginationCurrentPageProps) {
  return (
    <div
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

type PageListPaginationActionsWrapperProps = ComponentProps<'div'>

function PageListPaginationActionsWrapper({
  className,
  ...props
}: PageListPaginationActionsWrapperProps) {
  return (
    <div className={cn('flex items-center space-x-2', className)} {...props} />
  )
}

type PageListPaginationActionProps = ComponentProps<typeof Button>

function PageListPaginationAction({
  className,
  ...props
}: PageListPaginationActionProps) {
  return <Button variant="outline" className={className} {...props} />
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

export const PageList = {
  Root: PageListRoot,
  TableContainer: PageListTableContainer,
}

export const PageListPagination = {
  Root: PageListPaginationRoot,
  CurrentPage: PageListPaginationCurrentPage,
  ActionsWrapper: PageListPaginationActionsWrapper,
  Action: PageListPaginationAction,
}
