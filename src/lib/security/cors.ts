import { env } from '../env';

export function getCorsHeaders(origin: string | null): HeadersInit {
  const allowedOrigins = env.ALLOWED_ORIGINS.split(',').map(o => o.trim());
  
  if (!origin || !allowedOrigins.includes(origin)) {
    return {};
  }

  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

export function handleCors(request: Request): Response | null {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: getCorsHeaders(request.headers.get('origin')),
    });
  }
  return null;
}
