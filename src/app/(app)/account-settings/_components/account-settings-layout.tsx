'use client'

import {
  Bell,
  Github,
  Shield,
  User,
} from 'lucide-react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import type { AuthSession } from '@/lib/better-auth/auth'

import type { UserAccount } from '../actions'

import { ChangePasswordForm } from './change-password-form'
import { ConnectedAccountsSection } from './connected-accounts-section'
import { NotificationsSection } from './notifications-section'
import { ProfileForm } from './profile-form'

interface AccountSettingsLayoutProps {
  session: AuthSession
  initialAccounts: UserAccount[]
}

export function AccountSettingsLayout({
  session,
  initialAccounts,
}: AccountSettingsLayoutProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Account Settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your profile, connected accounts, and preferences.
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="profile" className="gap-2">
            <User className="size-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="accounts" className="gap-2">
            <Github className="size-4" />
            <span className="hidden sm:inline">Accounts</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="size-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="size-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <ProfileForm user={session.user} />
        </TabsContent>

        <TabsContent value="accounts" className="mt-6">
          <ConnectedAccountsSection initialAccounts={initialAccounts} />
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <ChangePasswordForm />
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <NotificationsSection />
        </TabsContent>
      </Tabs>
    </div>
  )
}
