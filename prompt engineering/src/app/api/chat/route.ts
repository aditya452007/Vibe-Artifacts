import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createAnthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';
import { logInteraction } from '@/lib/db';

// Remove Edge Runtime to support SQLite logging
// export const runtime = 'edge';

const RequestSchema = z.object({
    messages: z.array(z.object({
        role: z.enum(['user', 'assistant', 'system']),
        content: z.string()
    })),
    model: z.string(),
    apiKey: z.string().optional()
});

export async function POST(req: Request) {
    let modelId = 'unknown';
    let providerName = 'unknown';
    let promptLen = 0;

    try {
        const body = await req.json();
        const { messages, model, apiKey } = RequestSchema.parse(body);

        modelId = model;
        promptLen = messages.reduce((acc, m) => acc + m.content.length, 0);

        // --- Provider Logic ---
        let modelInstance;

        if (model.startsWith('gemini')) {
            providerName = 'gemini';
            const google = apiKey ? createGoogleGenerativeAI({ apiKey }) : createGoogleGenerativeAI();
            modelInstance = google(model);
        }
        else if (model.startsWith('gpt') || model.startsWith('o')) { // o1, o3, etc
            providerName = 'openai';
            const openai = apiKey ? createOpenAI({ apiKey }) : createOpenAI();
            modelInstance = openai(model);
        }
        else if (model.startsWith('claude')) {
            providerName = 'claude';
            const anthropic = apiKey ? createAnthropic({ apiKey }) : createAnthropic();
            modelInstance = anthropic(model);
        }
        else if (model.startsWith('llama')) {
            providerName = 'meta';
            // Assuming use of a provider like Groq or generic OpenAI-compatible endpoint for Llama
            // For now, if no key/setup, error out.
            // If using Groq:
            if (apiKey) {
                 const openaiCompatible = createOpenAI({
                     baseURL: 'https://api.groq.com/openai/v1',
                     apiKey
                 });
                 modelInstance = openaiCompatible(model);
            } else {
                 throw new Error("Meta/Llama models require a compatible API Key (e.g., Groq)");
            }
        }
        else {
            throw new Error('Invalid model provider/ID');
        }

        const result = await streamText({
            model: modelInstance,
            messages,
            system: "You are a helpful, precision-focused AI coding assistant. Be concise and accurate. Output clean markdown.",
            onFinish: (completion) => {
                // Async Log to SQLite
                logInteraction({
                    provider: providerName,
                    model: modelId,
                    promptLength: promptLen,
                    responseLength: completion.text.length,
                    status: 'success'
                });
            }
        });

        return result.toTextStreamResponse();

    } catch (error) {
        console.error("API Error:", error);

        // Log Error
        logInteraction({
            provider: providerName,
            model: modelId,
            promptLength: promptLen,
            responseLength: 0,
            status: 'error'
        });

        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        return new Response(JSON.stringify({
            error: errorMessage || 'An error occurred during inference check API keys.'
        }), { status: 500 });
    }
}
