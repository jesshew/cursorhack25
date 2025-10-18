import { AgentInteraction } from '@/components/agent-interaction';
import { createTool } from './utils';
import { z } from 'zod';
import { streamUI } from 'ai/rsc';

export const startAgentConversationTool = createTool({
  name: 'startAgentConversation',
  description: 'Starts a new voice conversation with an ElevenLabs agent.',
  parameters: z.object({
    agentId: z.string().describe('The ID of the agent to converse with.'),
  }),
  run: async function* ({ agentId }) {
    yield 'Initiating conversation...';
    const ui = <AgentInteraction agentId={agentId} />;
    await new Promise(resolve => setTimeout(resolve, 1000));
    return ui;
  },
});
