import { ElevenLabsClient } from "elevenlabs";
import {NextRequest} from "next/server";
import {env} from "process";
 
export async function POST(req: NextRequest) {
    console.log("POST /api/tts");
    const { text } = await req.json();
    console.log({ text });
    const elevenlabs = new ElevenLabsClient({
        apiKey: env.ELEVENLABS_API_KEY,
    });
 
    const audio = await elevenlabs.textToSpeech.stream("FiIlydOuhiFC0Z68HSQR", {  
        text: text,  
        modelId: "eleven_multilingual_v2", // optional but recommended  
    });
    console.log("streaming audio");
 
    return new Response(audio as any, {
        headers: {
            "Content-Type": "audio/mpeg",
        },
    });
}
