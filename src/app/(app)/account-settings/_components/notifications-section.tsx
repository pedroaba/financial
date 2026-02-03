'use client'

import { LoaderIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

import { SettingBlock } from './setting-block'

export function NotificationsSection() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  async function handleEmailToggle(checked: boolean) {
    setEmailNotifications(checked)
    setIsSaving(true)
    // Placeholder: persist via API when you have user preferences storage
    await new Promise((r) => setTimeout(r, 500))
    setIsSaving(false)
    toast.success(
      checked ? 'Email notifications enabled' : 'Email notifications disabled',
    )
  }

  return (
    <SettingBlock
      title="Email notifications"
      description="Receive emails about important updates and summaries."
    >
      <div className="flex items-center gap-2">
        {isSaving && (
          <LoaderIcon className="size-4 animate-spin text-muted-foreground" />
        )}
        <Switch
          id="email-notifications"
          checked={emailNotifications}
          onCheckedChange={handleEmailToggle}
          disabled={isSaving}
        />
        <Label
          htmlFor="email-notifications"
          className="text-sm text-zinc-300 cursor-pointer"
        >
          Enable email notifications
        </Label>
      </div>
    </SettingBlock>
  )
}
