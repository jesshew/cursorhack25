import { AgentInteraction } from '@/components/agent-interaction';

export default function AgentPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-6">
        </h1>
        {/* <AgentInteraction agentId="agent_8001k7whb8d5e3dty81n8md8bq1w" /> */}
        <AgentInteraction agentId="agent_8101k7whnjv7f8nr89e20j22180t" />
      </div>
    </div>
  );
}
