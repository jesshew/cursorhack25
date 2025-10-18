'use client';

import { useConversation } from '@elevenlabs/react';
import { useCallback, useEffect, useState } from 'react';

type AgentInteractionProps = {
  agentId: string;
};

export function AgentInteraction({ agentId }: AgentInteractionProps) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [userTranscript, setUserTranscript] = useState('');
  const [agentTranscript, setAgentTranscript] = useState('');

  useEffect(() => {
    const fetchSignedUrl = async () => {
      try {
        const response = await fetch('/api/elevenlabs-signed-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ agentId }),
        });
        if (!response.ok) {
          throw new Error(`Failed to get signed URL: ${response.statusText}`);
        }
        const data = await response.json();
        if (data.signed_url) {
          setSignedUrl(data.signed_url);
        }
      } catch (error) {
        console.error('Failed to get signed URL', error);
      }
    };
    fetchSignedUrl();
  }, [agentId]);

  const conversation = useConversation({
    signedUrl: signedUrl ?? undefined,
    onMessage: (message) => {
      console.log('Message:', message);
      if (message.type === 'user_transcript') {
        setUserTranscript(
          (prev) => prev + ' ' + message.user_transcription_event.user_transcript,
        );
      } else if (message.type === 'agent_response') {
        setAgentTranscript(
          (prev) => prev + ' ' + message.agent_response_event.agent_response,
        );
      }
    },
    onConnect: () => console.log('Connected'),
    onDisconnect: () => console.log('Disconnected'),
    onError: (error) => console.error('Error:', error),
  });

  const startConversation = useCallback(async () => {
    try {
      if (!conversation.startSession) return;
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await conversation.startSession();
    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  }, [conversation]);

  const stopConversation = useCallback(async () => {
    if (conversation.endSession) {
      await conversation.endSession();
    }
  }, [conversation]);

  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-lg shadow-md">
      <div className="flex gap-2">
        <button
          onClick={startConversation}
          disabled={!signedUrl || conversation.status === 'connected'}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
        >
          Start Conversation
        </button>
        <button
          onClick={stopConversation}
          disabled={conversation.status !== 'connected'}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:bg-gray-400"
        >
          Stop Conversation
        </button>
      </div>

      <div className="flex flex-col items-center">
        <p>Status: {conversation.status}</p>
        <p>Agent is {conversation.isSpeaking ? 'speaking' : 'listening'}</p>
      </div>

      <div className="w-full mt-4">
        <div className="p-2 border rounded bg-gray-50">
          <h3 className="font-bold">You said:</h3>
          <p>{userTranscript}</p>
        </div>
        <div className="p-2 mt-2 border rounded bg-blue-50">
          <h3 className="font-bold">Agent said:</h3>
          <p>{agentTranscript}</p>
        </div>
      </div>
    </div>
  );
}
