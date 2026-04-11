import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const apiKey = process.env.OPENAI_API_KEY;

const client = apiKey
    ? new OpenAI({ apiKey })
    : null;

export async function POST(req: Request) {
    try {
        if (!apiKey || !client) {
            return NextResponse.json(
                { error: 'OPENAI_API_KEY is missing.' },
                { status: 500 }
            );
        }

        const body = await req.json();
        const mood = body?.mood ?? '';
        const tags = Array.isArray(body?.tags) ? body.tags : [];

        const context = [
            mood ? `Selected mood: ${mood}` : '',
            tags.length ? `Tags: ${tags.join(', ')}` : '',
        ]
            .filter(Boolean)
            .join('\n');

        const response = await client.responses.create({
            model: 'gpt-4.1-mini',
            input: [
                {
                    role: 'system',
                    content:
                        "You write calm, warm, human journaling prompts. Return exactly one short question under 20 words. Keep it natural and conversational. Do not use instructions like 'describe', 'reflect', or 'explain'.",
                },
                {
                    role: 'user',
                    content: `Generate one short journaling prompt.\n\nMood: ${mood || 'none'}\nTags: ${tags?.join(', ') || 'none'}\n\nStyle:\n- calm, warm, human\n- sounds natural and conversational\n- ask a simple question\n- no instructions like "describe", "reflect", or "explain"\n- under 20 words`,
                },
            ],
            max_output_tokens: 60,
        });

        const prompt = response.output_text?.trim();

        if (!prompt) {
            console.error('OpenAI response had no output_text:', response);
            return NextResponse.json(
                { error: 'No prompt generated.' },
                { status: 500 }
            );
        }

        return NextResponse.json({ prompt });
    } catch (error) {
        console.error('journal-prompt route error:', error);
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : 'Failed to generate prompt.',
            },
            { status: 500 }
        );
    }
}
