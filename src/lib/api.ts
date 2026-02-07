import ky from 'ky'

import { env } from '@/env'

export const api = ky.extend({
  prefixUrl: `${env.NEXT_PUBLIC_API_URL}/api`,
  credentials: 'include',
})
