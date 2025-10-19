import { tool } from 'ai'
import { z } from 'zod'

export const startPhoneCall = tool({
  description:
    'Starts a phone call with LKY (Lee Kuan Yew). Use this tool when the user wants to call or talk to LKY.',
  inputSchema: z.object({}),
  execute: async () => {
    return {
      redirectUrl: '/agent',
    }
  },
})
