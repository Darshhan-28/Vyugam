import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  Object.assign(process.env, env);

  return {
    plugins: [
      react(),
      {
        name: 'vercel-api-dev-server',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (!req.url || !req.url.startsWith('/api/')) {
              return next();
            }

            const apiFilePath = path.join(process.cwd(), 'api', 'index.ts');

            try {
              const mod = await server.ssrLoadModule(apiFilePath);
              const handler = mod.default;

              if (typeof handler !== 'function') {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'api/index.ts does not export default handler' }));
                return;
              }

              // Parse body for POST/PUT/PATCH
              let body = {};
              if (['POST', 'PUT', 'PATCH'].includes(req.method || '')) {
                const buffers: Buffer[] = [];
                for await (const chunk of req) {
                  buffers.push(chunk);
                }
                const rawBody = Buffer.concat(buffers).toString('utf-8');
                if (rawBody) {
                  try {
                    body = JSON.parse(rawBody);
                  } catch {
                    body = rawBody;
                  }
                }
              }
              (req as any).body = body;

              // Parse query parameters
              const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
              const query: Record<string, string> = {};
              urlObj.searchParams.forEach((val, key) => { query[key] = val; });
              (req as any).query = query;

              // Polyfill Vercel Response helpers
              (res as any).status = function (code: number) {
                res.statusCode = code;
                return this;
              };
              (res as any).json = function (data: any) {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
                return this;
              };
              (res as any).redirect = function (statusOrUrl: number | string, url?: string) {
                const targetUrl = typeof statusOrUrl === 'string' ? statusOrUrl : url;
                const statusCode = typeof statusOrUrl === 'number' ? statusOrUrl : 307;
                res.statusCode = statusCode;
                res.setHeader('Location', targetUrl || '/');
                res.end();
                return this;
              };
              (res as any).send = function (data: any) {
                if (Buffer.isBuffer(data)) {
                  res.end(data);
                } else if (typeof data === 'object') {
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(data));
                } else {
                  res.end(String(data));
                }
                return this;
              };

              await handler(req, res);
            } catch (err: any) {
              console.error(`[API Dev Error] ${req.url}:`, err);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message || 'Internal API Error' }));
            }
          });
        },
      },
    ],
  };
});
