'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { changeDisplayName } from '@/http/change-display-name'
import { authClient } from '@/lib/auth-client'

import { SettingsCard } from '../../_components/settings-card'

const schema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(32, 'Use 32 characters at maximum'),
})

type Schema = z.infer<typeof schema>

interface DisplayNameEditProps {
  displayName: string
}

export function DisplayNameEdit({ displayName }: DisplayNameEditProps) {
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: { name: displayName },
  })

  const { refetch: refetchSession } = authClient.useSession()

  async function handleChangeDisplayName(data: Schema) {
    const id = toast.loading('Updating display name...')
    try {
      await changeDisplayName({ display_name: data.name })
      toast.success('Display name updated', { id })

      refetchSession()
    } catch {
      toast.error('Failed to update display name', { id })
      form.reset({
        name: displayName,
      })
    }
  }

  return (
    <SettingsCard.Root>
      <SettingsCard.Content>
        <SettingsCard.Header>
          <SettingsCard.Title>Display Name</SettingsCard.Title>
          <SettingsCard.Description>
            This is your visible name within the app. For example, the name you
            use in reports or shared views.
          </SettingsCard.Description>
        </SettingsCard.Header>
        <Form {...form}>
          <SettingsCard.Form
            id="display-name-edit-form"
            onSubmit={form.handleSubmit(handleChangeDisplayName)}
            className="space-y-2 mt-4 max-w-md"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} placeholder="Your name" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </SettingsCard.Form>
        </Form>
      </SettingsCard.Content>

      <SettingsCard.Footer className="justify-between gap-2 flex-col sm:flex-row">
        <SettingsCard.FooterDescription>
          Please use 32 characters at maximum.
        </SettingsCard.FooterDescription>

        <SettingsCard.Action
          disabled={form.formState.isSubmitting}
          form="display-name-edit-form"
          type="submit"
        >
          {form.formState.isSubmitting && (
            <SettingsCard.ActionIcon>
              <Spinner />
            </SettingsCard.ActionIcon>
          )}
          <SettingsCard.ActionText>
            {form.formState.isSubmitting ? 'Saving...' : 'Save'}
          </SettingsCard.ActionText>
        </SettingsCard.Action>
      </SettingsCard.Footer>
    </SettingsCard.Root>
  )
}
