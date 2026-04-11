import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const apiKey = process.env.OPENAI_API_KEY;

const client = apiKey
  ? new OpenAI({ apiKey })
  : null;

const SPARSE_DATA_MESSAGE =
  'There is not quite enough mood data yet to notice a clear pattern, but each entry you add will help build a fuller picture over time.';

type MoodInsightPayload = {
  totalEntries?: number;
  thisMonth?: {
    month?: string;
    totalEntries?: number;
    mostCommonMood?: string | null;
    moodCounts?: Record<string, number>;
  };
  recentMonths?: Array<{
    month?: string;
    moods?: Record<string, number>;
  }>;
};

function isSparseData(payload: MoodInsightPayload) {
  const totalEntries = payload.totalEntries ?? 0;
  const thisMonthEntries = payload.thisMonth?.totalEntries ?? 0;
  const thisMonthMoodCount = Object.keys(payload.thisMonth?.moodCounts ?? {}).length;
  return totalEntries < 3 || thisMonthEntries < 2 || thisMonthMoodCount === 0;
}

export async function POST(req: Request) {
  try {
    if (!apiKey || !client) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY is missing.' },
        { status: 500 }
      );
    }

    const payload = (await req.json()) as MoodInsightPayload;

    if (isSparseData(payload)) {
      return NextResponse.json({ insight: SPARSE_DATA_MESSAGE });
    }

    const response = await client.responses.create({
      model: 'gpt-4.1-mini',
      input: [
        {
          role: 'system',
          content:
            'You are a gentle and supportive journaling assistant. You help users reflect on emotional patterns in a calm, thoughtful, and non-clinical way.',
        },
        {
          role: 'user',
          content: `Write a short mood insight using this summary.

Rules:
- Write 2-4 sentences.
- Use a soft, encouraging tone.
- Focus on monthly patterns first.
- If possible, mention the most common mood this month.
- If data is limited, say that gently.
- Do not diagnose, exaggerate, or sound clinical.
- Do not invent information not present in the summary.

Summary:
${JSON.stringify(payload, null, 2)}`,
        },
      ],
      max_output_tokens: 180,
    });

    const insight = response.output_text?.trim();

    if (!insight) {
      return NextResponse.json({ insight: SPARSE_DATA_MESSAGE });
    }

    return NextResponse.json({ insight });
  } catch (error) {
    console.error('mood-insight route error:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to generate mood insight.',
      },
      { status: 500 }
    );
  }
}
