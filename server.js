
/**
 * MediBridge - Secure Local Server & Gemini AI Proxy
 *
 * Functions:
 * 1. Securely loads GEMINI_API_KEY from .env.
 * 2. Proxies chat queries to Google Gemini API.
 * 3. Serves static HTML, CSS and JS files.
 * 4. Uses native Node.js without external npm dependencies.
 */

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

// Load environment variables from .env
function loadEnv() {
  const envPath = path.join(__dirname, '.env');

  if (fs.existsSync(envPath)) {
    try {
      const content = fs.readFileSync(envPath, 'utf8');

      for (const line of content.split(/\r?\n/)) {
        const trimmed = line.trim();

        if (!trimmed || trimmed.startsWith('#')) continue;

        const eqIdx = trimmed.indexOf('=');

        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim();
          let val = trimmed.slice(eqIdx + 1).trim();

          if (
            (val.startsWith('"') && val.endsWith('"')) ||
            (val.startsWith("'") && val.endsWith("'"))
          ) {
            val = val.slice(1, -1);
          }

          if (process.env[key] === undefined) {
            process.env[key] = val;
          }
        }
      }
    } catch (err) {
      console.warn('[Server] Could not parse .env:', err.message);
    }
  }
}

loadEnv();

const PORT = parseInt(process.env.PORT || '3000', 10);
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL =
  process.env.GEMINI_MODEL || 'gemini-3.8-flash';

// Medical safety instructions
const SYSTEM_INSTRUCTION = `
You are BridgeBot, the friendly educational health assistant
for MediBridge ("Bridging People and Smarter Healthcare").

Your Primary Purpose:
- Provide general health education and lifestyle guidance.
- Explain common medical terms and laboratory tests.
- Help users prepare questions for doctor visits.
- Be friendly, empathetic and easy to understand.

Strict Safety Rules:
1. NEVER diagnose diseases or medical conditions.
2. NEVER prescribe medications or recommend drug dosages.
3. For diagnosis or prescription requests, explain that you
   are an educational assistant and recommend consulting
   a qualified healthcare professional.
4. For emergency symptoms such as crushing chest pain,
   difficulty breathing, sudden numbness, facial drooping,
   slurred speech or heavy bleeding, instruct users to
   seek emergency help immediately.
   In India, call 112 or visit the nearest emergency department.
5. Explain that your answers are educational and do not
   replace professional medical judgment.
6. Keep answers concise, warm and readable.
`;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8'
};

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(
    req.url,
    `http://${req.headers.host || 'localhost'}`
  );

  const pathname = parsedUrl.pathname;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type'
  );

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API Route 1: Gemini connection status
  if (req.method === 'GET' && pathname === '/api/status') {
    const isConfigured = Boolean(
      GEMINI_API_KEY &&
      GEMINI_API_KEY.trim() !== '' &&
      !GEMINI_API_KEY.includes('your_gemini_api_key_here')
    );

    res.writeHead(200, {
      'Content-Type': 'application/json'
    });

    res.end(JSON.stringify({
      configured: isConfigured,
      model: GEMINI_MODEL,
      status: isConfigured ? 'connected' : 'key_missing',
      message: isConfigured
        ? 'Gemini AI is configured and ready.'
        : 'GEMINI_API_KEY is not configured in .env.'
    }));

    return;
  }

  // API Route 2: Gemini Chat
  if (req.method === 'POST' && pathname === '/api/chat') {
    let body = '';

    req.on('data', chunk => {
      body += chunk;

      // Safety limit: 1 MB
      if (body.length > 1e6) {
        req.destroy();
      }
    });

    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');

        const userMessage =
          (payload.message || '').trim();

        const clientHistory =
          Array.isArray(payload.history)
            ? payload.history
            : [];

        if (!userMessage) {
          res.writeHead(400, {
            'Content-Type': 'application/json'
          });

          res.end(JSON.stringify({
            success: false,
            error: 'Message cannot be empty.'
          }));

          return;
        }

        // Check API key
        const isConfigured = Boolean(
          GEMINI_API_KEY &&
          GEMINI_API_KEY.trim() !== '' &&
          !GEMINI_API_KEY.includes('your_gemini_api_key_here')
        );

        if (!isConfigured) {
          res.writeHead(200, {
            'Content-Type': 'application/json'
          });

          res.end(JSON.stringify({
            success: false,
            fallback: true,
            error: 'Gemini API key is not configured.'
          }));

          return;
        }

        // Build conversation history
        const contents = [];

        const recentHistory = clientHistory.slice(-6);

        for (const msg of recentHistory) {
          if (
            !msg.content ||
            msg.id === 'msg-welcome' ||
            msg.type === 'emergency'
          ) {
            continue;
          }

          contents.push({
            role: msg.sender === 'bot' ? 'model' : 'user',
            parts: [{ text: msg.content }]
          });
        }

        // Add current message
        contents.push({
          role: 'user',
          parts: [{ text: userMessage }]
        });

        // Gemini API configuration
        let activeModel = GEMINI_MODEL;

        let geminiUrl =
          `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(activeModel)}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;

        const geminiRequestBody = {
          systemInstruction: {
            parts: [{ text: SYSTEM_INSTRUCTION }]
          },
          contents: contents,
          generationConfig: {
            temperature: 0.35,
            maxOutputTokens: 1000
          }
        };

        let geminiRes;
        let geminiData;
 let lastNetworkError = null;

        for (let attempt = 1; attempt <= 3; attempt++) {
          console.log(
            `[Server] Gemini request attempt ${attempt}/3`
          );

          try {
            geminiRes = await fetch(geminiUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(geminiRequestBody),
              signal: AbortSignal.timeout(30000)
            });

            geminiData = await geminiRes.json();
            lastNetworkError = null;

            if (
              geminiRes.ok ||
              ![429, 500, 502, 503, 504].includes(geminiRes.status)
            ) {
              break;
            }

            console.log(
              `[Server] Gemini returned HTTP ${geminiRes.status}`
            );

          } catch (err) {
            lastNetworkError = err;

            console.error(
              `[Server] Connection attempt ${attempt} failed:`,
              err.message
            );
          }

          if (attempt < 3) {
            console.log(
              '[Server] Retrying Gemini connection in 2 seconds...'
            );

            await new Promise(resolve =>
              setTimeout(resolve, 2000)
            );
          }
        }

        // Return a controlled error if all network attempts failed
        if (lastNetworkError) {
          throw lastNetworkError;
        }
        
        // Fallback model if configured model returns 404
        if (
          !geminiRes.ok &&
          geminiRes.status === 404 &&
          activeModel !== 'gemini-3.8-flash'
        ) {
          console.log(
            `[Server] Trying fallback model gemini-3.8-flash`
          );

          activeModel = 'gemini-3.8-flash';

          geminiUrl =
            `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(activeModel)}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;

          geminiRes = await fetch(geminiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(geminiRequestBody)
          });

          geminiData = await geminiRes.json();
        }

        // Handle Gemini API errors
        if (!geminiRes.ok) {
          console.error(
            '[Server] Gemini API error:',
            geminiData
          );

          const errorMsg =
            geminiData.error?.message ||
            `Gemini API returned status ${geminiRes.status}`;

          res.writeHead(200, {
            'Content-Type': 'application/json'
          });

          res.end(JSON.stringify({
            success: false,
            fallback: true,
            error: errorMsg
          }));

          return;
        }

        // Extract AI response
        const candidateText =
          geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!candidateText) {
          res.writeHead(200, {
            'Content-Type': 'application/json'
          });

          res.end(JSON.stringify({
            success: false,
            fallback: true,
            error: 'No text returned from Gemini candidate.'
          }));

          return;
        }

        // Successful Gemini response
        console.log(
          `[Server] Gemini response successful using ${activeModel}`
        );

        res.writeHead(200, {
          'Content-Type': 'application/json'
        });

        res.end(JSON.stringify({
          success: true,
          reply: candidateText,
          source: 'gemini',
          model: activeModel
        }));

      } catch (err) {
        console.error(
          '[Server] Request handling error:',
          err
        );

        // Prevent sending headers twice
        if (!res.headersSent) {
          res.writeHead(500, {
            'Content-Type': 'application/json'
          });

          res.end(JSON.stringify({
            success: false,
            fallback: true,
            error: `Server error: ${err.message}`
          }));

        } else if (!res.writableEnded) {
          res.end();
        }
      }
    });

    return;
  }

  // Static file serving
  let filePath =
    pathname === '/' ? '/index.html' : pathname;

  filePath = path.join(__dirname, filePath);

  // Prevent directory traversal
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403, {
      'Content-Type': 'text/plain'
    });

    res.end('Access Denied');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, {
        'Content-Type': 'text/plain'
      });

      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();

    const contentType =
      MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType
    });

    fs.createReadStream(filePath).pipe(res);
  });
});

// Start server
server.listen(PORT, () => {
  const isConfigured = Boolean(
    GEMINI_API_KEY &&
    GEMINI_API_KEY.trim() !== '' &&
    !GEMINI_API_KEY.includes('your_gemini_api_key_here')
  );

  console.log('====================================================');
  console.log(
    ` MediBridge Health App running at http://localhost:${PORT}`
  );
  console.log(` Gemini Model: ${GEMINI_MODEL}`);

  console.log(
    ` API Key Status: ${
      isConfigured
        ? 'CONFIGURED (Gemini AI Active)'
        : 'NOT CONFIGURED (Using Fallback Demo Engine)'
    }`
  );

  console.log('====================================================');
});
