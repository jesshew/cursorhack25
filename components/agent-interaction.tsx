'use client';

import { useConversation } from '@elevenlabs/react';
import { useCallback, useEffect, useState } from 'react';
import { Phone, Mic } from 'lucide-react';
import { useRouter } from 'next/navigation';

const AudioVisualizer = ({ audioLevel }: { audioLevel: number }) => {
  const barCount = 40;
  const bars = Array.from({ length: barCount });
  const maxBarHeight = 32;
  const dampingFactor = 0.2; // Increase damping for more stability

  return (
    <div className="flex items-center justify-center gap-1 h-10 w-48">
      {bars.map((_, i) => {
        // Center the wave and create a bell curve effect
        const distanceFromCenter = Math.abs(i - barCount / 2);
        const variance = Math.max(
          0,
          1 - (distanceFromCenter / (barCount / 2)) * dampingFactor,
        );

        // Use a sine wave for a smoother, more organic animation
        const sinWave = Math.sin(i / 4 + Date.now() / 200) * variance;
        const barHeight =
          maxBarHeight / 2 + (sinWave * maxBarHeight * audioLevel) / 2;

        return (
          <span
            key={i}
            className="w-1 bg-white rounded-full"
            style={{
              height: `${Math.max(2, barHeight)}px`,
              transition: 'height 0.1s ease-out',
              opacity: variance,
            }}
          />
        );
      })}
    </div>
  );
};

type AgentInteractionProps = {
  agentId: string;
};

type CallStatus = 'idle' | 'countingDown' | 'active' | 'ended';

export function AgentInteraction({ agentId }: AgentInteractionProps) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(3);
  const [showUI, setShowUI] = useState(false);
  const [status, setStatus] = useState<CallStatus>('countingDown');
  const router = useRouter();

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
    },
    onConnect: () => console.log('Connected'),
    onDisconnect: () => console.log('Disconnected'),
    onError: (error) => console.error('Error:', error),
  });

  const startConversation = useCallback(async () => {
    try {
      if (!conversation.startSession) return;
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await conversation.startSession({
        agentId: agentId,
        connectionType: 'websocket',
      });
      setStatus('active');
    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  }, [conversation, agentId]);

  useEffect(() => {
    if (status === 'countingDown') {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      }
      if (countdown === 0) {
        const fadeTimer = setTimeout(() => {
          startConversation();
          setShowUI(true);
        }, 500);
        return () => clearTimeout(fadeTimer);
      }
    }
  }, [countdown, startConversation, status]);

  const stopConversation = useCallback(async () => {
    if (conversation.endSession) {
      await conversation.endSession();
      setStatus('ended');
      router.push('/');
    }
  }, [conversation, router]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full text-white">
      {countdown > 0 && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
          <h1 className="text-5xl font-bold text-white transition-opacity duration-500">
            Starting call in... {countdown}
          </h1>
        </div>
      )}

      <div
        className={`transition-opacity duration-500 ${showUI ? 'opacity-100' : 'opacity-0'}`}
      >
        {conversation.status !== 'connected' ? (
          <button
            onClick={startConversation}
            disabled={!signedUrl}
            className="px-6 py-3 bg-black bg-opacity-50 rounded-full flex items-center gap-2 text-lg hover:bg-opacity-70 disabled:opacity-50"
          >
            <Phone size={20} />
            Start Call
          </button>
        ) : (
          <div className="w-full max-w-md mx-auto">
            <div className="p-4 bg-black bg-opacity-50 rounded-full flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Mic size={24} />
                {/* <AudioVisualizer audioLevel={conversation.audioLevel ?? 0} /> */}
              </div>
              <button
                onClick={stopConversation}
                className="p-3 bg-red-600 rounded-full hover:bg-red-700"
              >
                <Phone size={20} />
              </button>
            </div>
            <div className="mt-4 text-center text-gray-400">
              <p>Status: {conversation.status}</p>
              <p>
                Agent is {conversation.isSpeaking ? 'speaking' : 'listening'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
