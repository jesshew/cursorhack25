# KUAN-versations - Cursor Hackathon 25

This project is a submission for the Cursor Hackathon 25.
Bringing the wisdom, voice, and spirit of Lee Kuan Yew to life with AI.  
A multimodal Retrieval-Augmented Generation (RAG) system that enables users to *converse with*, *learn from*, and *experience the stories and recipes* of Singapore’s founding father — reimagined through modern AI technology.


## The Vision

We have cloned the wisdom of Lee Kuan Yew into an AI. This allows you to interact with a digital version of one of history's most influential leaders.

## What you can do:

*   **Ask him anything:** Get his perspective on politics, economics, and life.
*   **Talk to him:** Have a conversation about your life and get his advice.
*   **Gain wisdom:** Learn from his vast experience and unique insights.

This is more than just a chatbot. It's an opportunity to engage with a great mind.

## 📚 Repositories

| Component | Description | Repository |
|------------|--------------|-------------|
| **Frontend** | Next.js app for the interactive UI | [cursorhack25 (Frontend)](https://github.com/jesshew/cursorhack25) |
| **Backend (RAG & Voice)** | FastAPI backend for document retrieval and voice orchestration | [cursorhack_be](https://github.com/jesshew/cursorhack_be) |
| **Backend (Image & Voice Gen)** | Dedicated microservice for image/video generation and TTS | [cursorhack_image_voice_gen](https://github.com/jesshew/cursorhack_image_voice_gen) |

---
## ⚙️ Tech Stack Overview

| Layer | Technology | Description |
|-------|-------------|-------------|
| **Frontend** | [Next.js](https://nextjs.org/) | Dynamic UI for chat, storybook, and recipe display. |
| **Backend (Core API)** | [FastAPI](https://fastapi.tiangolo.com/) | Main service handling RAG queries and response orchestration. |
| **Database & Vector Store** | [Supabase](https://supabase.com/) + [pgvector](https://github.com/pgvector/pgvector) | Stores document chunks and embeddings for retrieval. |
| **RAG Pipeline** | Docling + Custom RPC Functions | Handles text chunking, embedding, and semantic retrieval. |
| **Text Generation** | Groq, OpenAI, Anthropic | Multi-model orchestration for fast and contextual text generation. |
| **Embedding Model** | OpenAI Embeddings | Creates high-quality semantic representations for RAG. |
| **Image / Video Generation** | Gemini, Fal.ai | Generates storybook illustrations and visual scenes. |
| **Voice Cloning & TTS** | ElevenLabs | Produces realistic Lee Kuan Yew voice narration. |
| **Voice Agent** | ElevenLabs Real-Time Voice | Enables interactive, natural speech conversations. |


## 🧪 How It Works

1. **RAG Engine:**  
   - Enrichs chunks with document / chunk metadata 
   - Emdeb original chunks + metadata to improve retrieval 
   - Queries embeddings with semantic similarity via pgvector RPC functions.  
   - Returns the most contextually relevant file / chunk -> more context -> better generation 

2. **Text Generation:**  
   - Groq, used for metadata enriching during chunking process. fast inference -> ability to handles 1000s of chunks, at low cost 
   - Uses LLMs (Groq, OpenAI, Anthropic) to reconstruct responses in LKY’s voice and mannerisms.

3. **Image / Video Generation:**  
   - Gemini or Fal.ai creates visuals that accompany stories or recipes.

4. **Voice Generation:**  
   - ElevenLabs generates lifelike narration based on cloned LKY voice.
   - Real-time voice interaction through ElevenLabs Voice Agent API.

---