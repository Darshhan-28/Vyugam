import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

function resolveApiRoute(urlPath: string): { filePath: string; params: Record<string, string> } | null {
  const rootApiDir = path.join(process.cwd(), 'api');
  const relativePath = urlPath.replace(/^\/api\//, '');
  const directFile = path.join(rootApiDir, `${relativePath}.ts`);

  if (fs.existsSync(directFile)) {
    return { filePath: directFile, params: {} };
  }

  const parts = relativePath.split('/');
  if (parts.length > 1) {
    const parentDir = path.join(rootApiDir, ...parts.slice(0, -1));
    const paramVal = parts[parts.length - 1];

    if (fs.existsSync(parentDir)) {
      const files = fs.readdirSync(parentDir);
      const dynamicFile = files.find((f) => f.startsWith('[') && f.endsWith('].ts'));
      if (dynamicFile) {
        const paramName = dynamicFile.slice(1, -3);
        return {
          filePath: path.join(parentDir, dynamicFile),
          params: { [paramName]: paramVal },
        };
      }
    }
  }

  return null;
}

export default defineConfig(({ mode }) => {
  // Load .env and .env.local into process.env so API handlers can read UPSTASH_REDIS_REST_URL etc.
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

            const urlPath = req.url.split('?')[0];
            const route = resolveApiRoute(urlPath);

            if (!route) {
              return next();
            }

            try {
              const mod = await server.ssrLoadModule(route.filePath);
              const handler = mod.default;

              if (typeof handler !== 'function') {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: `API route ${urlPath} does not export default handler` }));
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

              // Parse query parameters and combine with dynamic route params
              const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
              const query: Record<string, string> = { ...route.params };
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

              await handler(req, res);
            } catch (err: any) {
              console.error(`[API Dev Error] ${urlPath}:`, err);
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
