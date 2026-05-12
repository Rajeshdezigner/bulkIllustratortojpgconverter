const express = require('express');

const router = express.Router();

const SYSTEM = `You are an expert Adobe Illustrator ExtendScript (JSX) author for Illustrator CC on Windows.

The host application already opens the user's document and exposes it as the variable doc (Adobe Illustrator Document). Do NOT call app.open again. Assume doc exists and matches app.activeDocument.

Requirements:
- Use ExtendScript-compatible ES3 only: var, function, no arrow functions, no const/let, no template literals, no optional chaining.
- Target app.documents API, PathItems, Layers, SpotColor, RGBColor, CMYKColor as appropriate.
- After visible changes, call app.redraw() so users can see progression on screen when steps run.
- Optionally use a tiny busy-wait pause between logical steps ONLY if requested (simple while loop against Date milliseconds; keep total pause under ~2 seconds unless user asks otherwise).
- Put short English comments above each logical block indicating the step number and what happens (e.g. // Step 1: Draw circle …).
- The script fragment must NOT include try/catch around the entire user intent unless necessary; isolated try/catch for optional properties is OK.
- Do not call doc.close(). Saving is handled by the host.

You must respond with a single JSON object and nothing before or after it. No markdown fences.
Shape:
{"steps":["Step 1: ...","Step 2: ..."],"jsx":"<the script body placed inside an IIFE on the server; omit outer wrapper>"}

steps: 3–12 concise lines an end user could read before running.
jsx: ONLY the inner script body statements (no enclosing function declaration).`;

function stripJsonFence(text) {
  if (!text) return text;
  const m = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  return m ? m[1].trim() : text.trim();
}

function extractFirstJsonObject(text) {
  if (!text) return null;
  const s = String(text);
  const start = s.indexOf('{');
  const end = s.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) return null;
  return s.slice(start, end + 1);
}

function parseStepsFromText(text) {
  const lines = String(text || '').split(/\r?\n/);
  const steps = [];
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i].trim();
    const m = l.match(/^(?:Step\s*)?(\d+)[\.\)]\s*(.+)$/i);
    if (m && m[2]) steps.push(`Step ${m[1]}: ${m[2].trim()}`);
  }
  return steps.slice(0, 12);
}

function extractFirstCodeFence(text) {
  const s = String(text || '');
  const m = s.match(/```(?:jsx|javascript|js)?\s*([\s\S]*?)```/i);
  return m ? m[1].trim() : '';
}

function parseGeneratePayload(raw) {
  const cleaned = stripJsonFence(raw);
  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (e1) {
    const maybeJson = extractFirstJsonObject(cleaned);
    if (!maybeJson) throw e1;
    parsed = JSON.parse(maybeJson);
  }
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Invalid response shape');
  }
  const steps = Array.isArray(parsed.steps)
    ? parsed.steps.map(String).filter(Boolean)
    : [];
  const jsx = typeof parsed.jsx === 'string' ? parsed.jsx.trim() : '';
  if (!jsx) {
    // Fallback: models sometimes return Steps + code fence instead of JSON fields.
    const fence = extractFirstCodeFence(cleaned);
    if (!fence) throw new Error('Missing jsx in response');
    return { steps: steps.length ? steps : parseStepsFromText(cleaned), jsx: fence };
  }
  return { steps, jsx };
}

/**
 * Pick a chat provider. No OpenAI key required if you use Ollama, LM Studio, or AI_CHAT_URL.
 */
function getChatProvider() {
  const provider = (process.env.AI_PROVIDER || '').toLowerCase().trim();

  if (provider === 'ollama' || process.env.OLLAMA_MODEL || process.env.OLLAMA_HOST) {
    const base = (process.env.OLLAMA_HOST || 'http://127.0.0.1:11434').replace(/\/$/, '');
    return {
      name: 'ollama',
      url: `${base}/v1/chat/completions`,
      apiKey: process.env.OLLAMA_API_KEY || null,
      model: process.env.OLLAMA_MODEL || 'llama3.2',
      jsonMode: process.env.AI_JSON_MODE === '1'
    };
  }

  if (provider === 'lmstudio' || provider === 'lm_studio') {
    const base = (process.env.LMSTUDIO_HOST || 'http://127.0.0.1:1234').replace(/\/$/, '');
    return {
      name: 'lmstudio',
      url: `${base}/v1/chat/completions`,
      apiKey: process.env.LMSTUDIO_API_KEY || null,
      model: process.env.LMSTUDIO_MODEL || process.env.AI_MODEL || 'local-model',
      jsonMode: process.env.AI_JSON_MODE === '1'
    };
  }

  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey) {
    const base = (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
    return {
      name: 'openai',
      url: `${base}/chat/completions`,
      apiKey: openaiKey,
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      jsonMode: process.env.AI_JSON_MODE !== '0'
    };
  }

  const chatUrl = process.env.AI_CHAT_URL || process.env.OPENAI_COMPATIBLE_URL;
  if (chatUrl) {
    const normalized = chatUrl.replace(/\/$/, '');
    const url = normalized.includes('/chat/completions')
      ? normalized
      : `${normalized}/chat/completions`;
    return {
      name: 'custom',
      url,
      apiKey: process.env.AI_CHAT_API_KEY || null,
      model: process.env.AI_MODEL || 'default',
      jsonMode: process.env.AI_JSON_MODE === '1'
    };
  }

  return null;
}

function demoResponse(res) {
  const steps = [
    'Step 1: Open your document in the automation app (already done when you run Execute).',
    'Step 2: Create an ellipse centered in the visible artboard area.',
    'Step 3: Turn on fill and set fill color to RGB red.',
    'Step 4: Turn off stroke, redraw the screen so changes are visible.'
  ];
  const jsx = [
    '// Step 1: Place a circle on the active artboard',
    'var ab = doc.artboards[doc.artboards.getActiveArtboardIndex()].artboardRect;',
    'var cx = (ab[0] + ab[2]) / 2;',
    'var cy = (ab[1] + ab[3]) / 2;',
    'var w = 120;',
    'var h = 120;',
    '',
    '// Illustrator ellipse(top, left, width, height) uses top-left of bounding box',
    'var ell = doc.pathItems.ellipse(cy + h / 2, cx - w / 2, w, h);',
    '',
    '// Step 2: Style — solid red fill, no stroke',
    'var red = new RGBColor();',
    'red.red = 220; red.green = 40; red.blue = 60;',
    'ell.fillColor = red;',
    'ell.filled = true;',
    'ell.stroked = false;',
    '',
    '// Step 3: Refresh so you can visually follow along',
    'app.redraw();'
  ].join('\n');

  return res.json({
    mode: 'demo',
    promptIgnored: true,
    message:
      'No AI backend is configured. Use a local model (Ollama) or another OpenAI-compatible server—see Setup Guide → AI Steps options. Until then this response stays the fixed red-circle sample.',
    steps,
    jsx
  });
}

router.get('/config', (req, res) => {
  const cfg = getChatProvider();
  if (!cfg) {
    return res.json({
      configured: false,
      provider: null,
      model: null,
      hint:
        'Set AI_PROVIDER=ollama and pull a model (e.g. ollama pull llama3.2), or AI_CHAT_URL for another OpenAI-compatible API. Optional: OPENAI_API_KEY for OpenAI.'
    });
  }
  res.json({
    configured: true,
    provider: cfg.name,
    model: cfg.model,
    hint: cfg.name === 'ollama'
      ? 'Using local Ollama. Run: ollama serve'
      : cfg.name === 'lmstudio'
        ? 'Using LM Studio server (Enable local server → OpenAI-compatible).'
        : null
  });
});

router.post('/from-prompt', async (req, res) => {
  const prompt = typeof req.body?.prompt === 'string' ? req.body.prompt.trim() : '';
  if (!prompt) {
    return res.status(400).json({ error: 'prompt is required (non-empty string)' });
  }

  const cfg = getChatProvider();
  if (!cfg) {
    return demoResponse(res);
  }

  try {
    const userContent = `${prompt}\n\nIf geometry is unspecified, assume current artboard centers and moderate sizes (~100–200pt). Prefer RGB colors unless CMYK print is explicitly requested.`;

    const headers = {
      'Content-Type': 'application/json'
    };
    if (cfg.apiKey && String(cfg.apiKey).trim()) {
      headers.Authorization = `Bearer ${cfg.apiKey}`;
    }

    const body = {
      model: cfg.model,
      temperature: 0.2,
      messages: [
        { role: 'system', content: SYSTEM },
        { role: 'user', content: userContent }
      ]
    };
    if (cfg.name === 'ollama') {
      body.stream = false;
    }
    if (cfg.jsonMode) {
      body.response_format = { type: 'json_object' };
    }

    const upstream = await fetch(cfg.url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    if (!upstream.ok) {
      const errBody = await upstream.text();
      console.error(`[ai/from-prompt] ${cfg.name} HTTP`, upstream.status, errBody.slice(0, 500));

      let extra = '';
      if (
        cfg.name === 'ollama' &&
        (errBody.includes('runner process has terminated') ||
          errBody.includes('api_error'))
      ) {
        extra =
          " Ollama's model runner crashed (GPU/VRAM/driver or bad model files). Try: close other apps; set system env OLLAMA_NUM_GPU=0 and restart Ollama for CPU; `ollama pull llama3.2` again; or set OLLAMA_MODEL=mistral in backend/.env.";
      }

      return res.status(502).json({
        error: `${cfg.name} request failed (${upstream.status}).${extra}`.trim(),
        status: upstream.status,
        hint: errBody.slice(0, 800)
      });
    }

    const data = await upstream.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content || typeof content !== 'string') {
      return res.status(502).json({
        error: 'Empty model response',
        hint: 'Try enabling AI_JSON_MODE=1 in backend/.env or a stronger instruct model.'
      });
    }

    let payload;
    try {
      payload = parseGeneratePayload(content);
    } catch (e) {
      console.error('[ai/from-prompt] JSON parse:', e.message, content.slice(0, 400));
      return res.status(502).json({
        error:
          'Could not parse model output into {steps, jsx}. Fixes: set AI_JSON_MODE=1 (strict JSON) OR use a model that follows instructions better (try OLLAMA_MODEL=mistral). Also keep prompts short and specific (shapes, colors, sizes).',
        rawPreview: content.slice(0, 800)
      });
    }

    res.json({
      mode: cfg.name,
      promptIgnored: false,
      model: cfg.model,
      steps: payload.steps,
      jsx: payload.jsx
    });
  } catch (err) {
    console.error('[ai/from-prompt]', err);
    res.status(500).json({ error: err.message || 'Generation failed' });
  }
});

module.exports = router;
