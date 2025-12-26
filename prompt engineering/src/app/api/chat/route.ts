import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createAnthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';

export const runtime = 'edge';

// Simple validation schema
const RequestSchema = z.object({
    messages: z.array(z.object({
        role: z.enum(['user', 'assistant', 'system']),
        content: z.string()
    })),
    model: z.string(),
    apiKey: z.string().optional()
});

export async function POST(req: Request) {
    try {
        const { messages, model, apiKey } = await req.json();

        // Validate Input
        const payload = RequestSchema.parse({ messages, model, apiKey });

        // Choose Provider Logic
        let modelInstance;

        // Determine Provider based on Model ID Pattern
        const modelId = payload.model;

        if (modelId.startsWith('gemini')) {
            const google = payload.apiKey ? createGoogleGenerativeAI({ apiKey: payload.apiKey }) : createGoogleGenerativeAI();
            // Pass the exact model ID to the provider
            modelInstance = google(modelId);
        }
        else if (modelId.startsWith('gpt') || modelId.startsWith('o3')) {
            const openai = payload.apiKey ? createOpenAI({ apiKey: payload.apiKey }) : createOpenAI();
            modelInstance = openai(modelId);
        }
        else if (modelId.startsWith('claude')) {
            const anthropic = payload.apiKey ? createAnthropic({ apiKey: payload.apiKey }) : createAnthropic();
            // Anthropic SDK expects specific model naming, usually matches our IDs but checking:
            // Our IDs: claude-opus-4-20250514 -> SDK might need 'claude-3-opus-20240229' etc.
            // Assumption: The IDs in the CSV are the correct API IDs as requested by user.
            modelInstance = anthropic(modelId);
        }
        else if (modelId.startsWith('llama')) {
            // Mocking Meta/Llama support via OpenAI compatible endpoint or similar if needed? 
            // limitless-ai or similar provider usually. For now, we return error if no provider set up.
            // Assuming OpenAI compatible for "Open Weight Frontier" or just custom logic.
            // For this exercise, I will throw as it wasn't in original imports.
            return new Response('Meta Llama models not yet configured for inference backend', { status: 501 });
        }
        else {
            return new Response('Invalid model provider/ID', { status: 400 });
        }

        const result = await streamText({
            model: modelInstance,
            messages: payload.messages,
            system: "You are a helpful, precision-focused AI coding assistant. Be concise and accurate."
        });

        return result.toTextStreamResponse();

    } catch (error) {
        console.error("API Error:", error);
        return new Response(JSON.stringify({ error: 'Check API Key or Quota' }), { status: 500 });
    }
}
