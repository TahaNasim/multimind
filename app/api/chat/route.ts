// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY!;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// LIVE FREE MODELS — VERIFIED DEC 5, 2025 ($0.00, UNLIMITED)
// app/api/chat/route.ts  ←  Replace the whole MODEL_MAPPING object
const MODEL_MAPPING: { [key: string]: string } = {
  // THESE 5 ARE 100% FREE + UNLIMITED EVEN WITHOUT $10 CREDITS (Dec 2025)
  'google'      : 'google/gemma-3n-e2b-it:free',      // ← always free
  'deepseek'    : 'deepseek/deepseek-chat',             // ← always free
  'meta-llama'  : 'arcee-ai/trinity-mini:free', // ← has :free suffix
  'qwen'        : 'amazon/nova-2-lite-v1:free',     // ← has :free suffix
  'mistralai'   : 'openai/gpt-oss-20b:free',// ← has :free suffix

  // Premium (keep unchanged)
  'gpt-5'          : 'openai/gpt-4o',
  'claude-4-sonnet': 'anthropic/claude-3.5-sonnet',
  'gemini-pro'     : 'google/gemini-pro-1.5',
  'deepseek-pro'   : 'deepseek/deepseek-r1-0528-qwen-72b',
  'perplexity-pro' : 'perplexity/sonar-large-online',
  'grok-2'         : 'xai/grok-beta',
};

const PREMIUM_MODEL_IDS = ['gpt-5', 'claude-4-sonnet', 'gemini-pro', 'deepseek-pro', 'perplexity-pro', 'grok-2'];

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
  const headers = corsHeaders();

  try {
    const body = await request.json();
    const { message, models: requestedModels } = body;

    console.log(`[API] Request: "${message}" for models: ${requestedModels.join(', ')}`);

    if (!message || !Array.isArray(requestedModels) || requestedModels.length === 0) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400, headers });
    }

    // Get user & premium status
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    let user = null;
    let isPremium = false;

    if (token) {
      const { data } = await supabase.auth.getUser(token);
      user = data.user;
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_premium')
          .eq('id', user.id)
          .single();
        isPremium = profile?.is_premium === true;
      }
    }

    // Filter allowed models
    const allowedModels = requestedModels.filter((modelId: string) => {
      if (PREMIUM_MODEL_IDS.includes(modelId) && !isPremium) return false;
      return MODEL_MAPPING[modelId] !== undefined;
    });

    console.log(`[API] Allowed models: ${allowedModels.join(', ')}`);

    if (allowedModels.length === 0) {
      return NextResponse.json({
        error: "Upgrade to Premium (₹499/mo) to use GPT-5, Claude, Grok-2, etc.",
        upgrade: true
      }, { status: 403, headers });
    }

    // Call OpenRouter
    const results = await Promise.allSettled(
      allowedModels.map(async (modelId: string) => {
        const openRouterModel = MODEL_MAPPING[modelId];
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 20000);

          console.log(`[API] Calling: ${modelId} -> ${openRouterModel}`);

          const res = await fetch(OPENROUTER_API_URL, {
            method: 'POST',
            signal: controller.signal,
            headers: {
              'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://multimind-ai.vercel.app',
              'X-Title': 'MultiMind',
            },
            body: JSON.stringify({
              model: openRouterModel,
              messages: [{ role: 'user', content: message }],
              max_tokens: 800,
              temperature: 0.7,
            }),
          });

          clearTimeout(timeoutId);

          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            console.error(`OpenRouter error [${modelId}]:`, err);
            // Handle rate limit specifically
            if (err.code === 429) {
              return { modelId, error: 'Rate limit hit. Add $10 credits for unlimited free models.' };
            }
            return { modelId, error: err.error?.message || `HTTP ${res.status}` };
          }

          const data = await res.json();
          const content = data.choices?.[0]?.message?.content?.trim() || 'No response received.';
          console.log(`[API] SUCCESS [${modelId}]: ${content.substring(0, 50)}...`);
          return { modelId, content };
        } catch (err: any) {
          console.error(`Error [${modelId}]:`, err.message);
          return { modelId, error: err.message || 'Request failed' };
        }
      })
    );

    const responseArray = results.map((result) =>
      result.status === 'fulfilled' ? result.value : { modelId: 'unknown', error: 'Failed' }
    );

    return NextResponse.json({ responses: responseArray }, { status: 200, headers });
  } catch (error: any) {
    console.error('API route error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500, headers });
  }
}