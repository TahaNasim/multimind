import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY!;

const MODEL_MAPPING: { [key: string]: string } = {
  'google': 'google/gemma-3n-e2b-it:free',
  'deepseek': 'tngtech/deepseek-r1t-chimera:free',
  'meta-llama': 'meta-llama/llama-3.2-3b-instruct:free',
  'qwen': 'qwen/qwen3-14b:free',     // ← this was wrong before
  'mistralai': 'mistralai/mistral-nemo:free', // already working

  // Premium (keep as-is)
  'gpt-5': 'openai/gpt-4o',
  'claude-4-sonnet': 'anthropic/claude-3.5-sonnet',
  'gemini-pro': 'google/gemini-pro-2.0',
  'deepseek-pro': 'deepseek/deepseek-r1-distill-70b',
  'perplexity-pro': 'perplexity/sonar-pro',
  'grok-2': 'xai/grok-beta',
};

// CORS headers
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

export async function POST(request: NextRequest) {
  try {
    const headers = corsHeaders();
    const { message, models } = await request.json();

    console.log(`🚀 Frontend sent: "${message?.substring(0, 50)}..." | Models: [${models.join(', ')}]`); // Terminal log

    if (!message || !models || !Array.isArray(models)) {
      return new NextResponse(JSON.stringify({ error: 'Invalid request' }), { status: 400, headers });
    }

    if (!OPENROUTER_API_KEY) {
      console.error('❌ API KEY MISSING — Check .env.local');
      return new NextResponse(JSON.stringify({ error: 'API key missing' }), { status: 500, headers });
    }

    const responsePromises = models.map(async (modelId: string) => {
      const openRouterModel = MODEL_MAPPING[modelId];
      if (!openRouterModel) {
        console.error(`❌ No mapping for ${modelId}`);
        return { modelId, error: `Model ${modelId} not mapped` };
      }

      try {
        console.log(`🔄 Calling OpenRouter: ${modelId} → ${openRouterModel}`);
        const response = await fetch(OPENROUTER_API_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://multimind-ai.vercel.app',
            'X-Title': 'MultiMind',
          },
          body: JSON.stringify({
            model: openRouterModel,
            messages: [{ role: 'user', content: message }],
            max_tokens: 600,
            temperature: 0.7,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error(`❌ OpenRouter failed ${modelId}: ${response.status} - ${errorData.error?.message || 'Unknown'}`);
          return { modelId, error: errorData.error?.message || 'API failed' };
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || 'Empty response';
        console.log(`✅ ${modelId} replied: ${content.substring(0, 50)}...`);
        return { modelId, content };
      } catch (error) {
        console.error(`💥 Crash ${modelId}:`, error);
        return { modelId, error: 'Network error' };
      }
    });

    const results = await Promise.all(responsePromises);
    console.log(`🎉 Sending back:`, results);

    return new NextResponse(JSON.stringify({ responses: results }), { status: 200, headers });
  } catch (error) {
    console.error('💥 API Route Error:', error);
    return new NextResponse(JSON.stringify({ error: 'Server error' }), { status: 500, headers: corsHeaders() });
  }
}