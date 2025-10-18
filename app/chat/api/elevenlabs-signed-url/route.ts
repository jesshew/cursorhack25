import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { agentId } = await req.json();

  if (!process.env.ELEVENLABS_API_KEY) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  if (!agentId) {
    return NextResponse.json({ error: 'Agent ID is required' }, { status: 400 });
  }

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${agentId}`, {
      method: 'GET',
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('ElevenLabs API Error:', errorData);
      return NextResponse.json({ error: errorData }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ signed_url: data.signed_url });

  } catch (error) {
    console.error('Failed to fetch signed URL:', error);
    return NextResponse.json({ error: 'Failed to fetch signed URL' }, { status: 500 });
  }
}
