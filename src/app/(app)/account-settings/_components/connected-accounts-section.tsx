'use client'

import { Github, LoaderIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import type { UserAccount } from '@/app/(app)/account-settings/actions'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import { cn } from '@/lib/utils'

import { getLinkedAccounts } from '../actions'
import { SettingBlock } from './setting-block'

const providerLabels: Record<string, string> = {
  github: 'GitHub',
  credential: 'Email & Password',
}

const providerIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  github: Github,
}

interface ConnectedAccountsSectionProps {
  initialAccounts: UserAccount[]
}

export function ConnectedAccountsSection({
  initialAccounts,
}: ConnectedAccountsSectionProps) {
  const [accounts, setAccounts] = useState<UserAccount[]>(initialAccounts)
  const [linkingProvider, setLinkingProvider] = useState<string | null>(null)
  const [unlinkingId, setUnlinkingId] = useState<string | null>(null)

  async function loadAccounts() {
    const list = await getLinkedAccounts()
    setAccounts(list)
  }

  async function handleLinkGitHub() {
    setLinkingProvider('github')
    const id = toast.loading('Redirecting to GitHub...')
    try {
      const { error } = await authClient.linkSocial({
        provider: 'github',
        callbackURL: '/account-settings/accounts',
      })
      if (error) {
        toast.error(error.message ?? 'Failed to connect GitHub', { id })
      }
    } catch {
      toast.error('Failed to connect GitHub', { id })
    } finally {
      setLinkingProvider(null)
    }
  }

  async function handleUnlink(account: UserAccount) {
    setUnlinkingId(account.id)
    const id = toast.loading('Disconnecting account...')
    try {
      const { error } = await (
        authClient as {
          unlinkAccount?: (opts: {
            body: { providerId: string; accountId?: string }
          }) => Promise<{ error?: { message?: string } }>
        }
      ).unlinkAccount?.({
        body: { providerId: account.providerId, accountId: account.id },
      })
      if (error) {
        toast.error(error.message ?? 'Failed to disconnect account', { id })
        return
      }
      toast.success('Account disconnected', { id })
      await loadAccounts()
    } catch {
      toast.error('Failed to disconnect account', { id })
    } finally {
      setUnlinkingId(null)
    }
  }

  const hasGitHub = accounts.some((a) => a.providerId === 'github')
  const canUnlink = accounts.length > 1

  return (
    <SettingBlock
      title="Connected accounts"
      description="Link or unlink sign-in providers. You need at least one way to sign in."
    >
      <div className="space-y-3">
        <ul className="space-y-3">
          {accounts.map((account) => {
            const label =
              providerLabels[account.providerId] ?? account.providerId
            const Icon = providerIcons[account.providerId]
            const isUnlinking = unlinkingId === account.id
            return (
              <li
                key={account.id}
                className={cn(
                  'flex items-center justify-between rounded-lg border px-4 py-3',
                  'border-border bg-card/50',
                )}
              >
                <div className="flex items-center gap-3">
                  {Icon ? (
                    <Icon className="size-5 text-muted-foreground" />
                  ) : (
                    <span className="size-5 rounded-full bg-muted" />
                  )}
                  <span className="font-medium text-foreground">{label}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  disabled={!canUnlink || isUnlinking}
                  onClick={() => handleUnlink(account)}
                >
                  {isUnlinking ? (
                    <LoaderIcon className="size-4 animate-spin" />
                  ) : (
                    'Disconnect'
                  )}
                </Button>
              </li>
            )
          })}
        </ul>

        {!hasGitHub && (
          <div className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleLinkGitHub}
              disabled={linkingProvider !== null}
            >
              {linkingProvider === 'github' ? (
                <LoaderIcon className="size-4 animate-spin" />
              ) : (
                <Github className="size-4" />
              )}
              <span className="ml-2">Connect GitHub</span>
            </Button>
          </div>
        )}
      </div>
    </SettingBlock>
  )
}
