import { Input } from '@/components/ui/input'

import { SettingsCard } from '../../_components/settings-card'

interface EmailEditProps {
  email: string
}

export async function EmailEdit({ email }: EmailEditProps) {
  return (
    <SettingsCard.Root>
      <SettingsCard.Content>
        <SettingsCard.Header>
          <SettingsCard.Title>Email</SettingsCard.Title>
          <SettingsCard.Description>
            This is your email address. You can change it if you want to.
          </SettingsCard.Description>
        </SettingsCard.Header>

        <Input
          value={email}
          disabled
          placeholder="Your email address"
          type="email"
          className="bg-zinc-900/50 text-zinc-400 max-w-md mt-4"
        />
      </SettingsCard.Content>

      <SettingsCard.Footer className="justify-between gap-2 flex-col sm:flex-row">
        <SettingsCard.FooterDescription>
          Email is managed by your sign-in provider. Contact support to change
          it.
        </SettingsCard.FooterDescription>
      </SettingsCard.Footer>
    </SettingsCard.Root>
  )
}
