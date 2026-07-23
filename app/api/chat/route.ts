import {
    streamText,
    UIMessage,
    convertToModelMessages,
    createUIMessageStreamResponse,
    toUIMessageStream,
} from 'ai';
import {anthropic} from '@ai-sdk/anthropic';
import { TLEVEL_KNOWLEDGE } from '@/app/knowledge';

// This turns the file into the web address POST /api/chat
export async function POST(req: Request) {
    // The chat page sends us the whole conversation so far.
    const { messages } : { messages: UIMessage[] } = await req.json();

    const result = streamText({
        //Which model to use for the chat.
        model:anthropic('claude-haiku-4-5'),

        //This is where prompt-stuffing RAG happens
        system: `You are the assistant for Tlevelled, a service that helps students with T-Levels.
        
        Rules:
        - Answer using ONLY the knowledge provided below.
        - If the answer isn't in the knowledge, say you don't have that info and suggest they contact Tlevelled directly. Never invent facts.
        - Be friendly, clear, and concise. You're talking to teenagers deciding their future, so be encouraging and plain-spoken.

        --- KNOWLEDGE ---
        ${TLEVEL_KNOWLEDGE}
        --- END KNOWLEDGE ---
        `,

        //Convert the UI messages into the format the model expects.
        messages: await convertToModelMessages(messages),
    });

    //Stream the answer back to the page word-by-word as it comes in from the model.
    return createUIMessageStreamResponse({
        stream: toUIMessageStream({ stream: result.stream }),
    });
}