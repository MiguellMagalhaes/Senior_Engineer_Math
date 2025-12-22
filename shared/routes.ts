import { z } from 'zod';
import { insertCalculationSchema, calculations, paginatedResponseSchema, statisticsSchema } from './schema';

export const api = {
  calculations: {
    create: {
      method: 'POST' as const,
      path: '/api/calculations',
      input: insertCalculationSchema,
      responses: {
        201: z.custom<typeof calculations.$inferSelect>(),
        400: z.object({ message: z.string() }),
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/calculations',
      responses: {
        200: paginatedResponseSchema,
      },
    },
    statistics: {
      method: 'GET' as const,
      path: '/api/calculations/statistics',
      responses: {
        200: statisticsSchema,
      },
    },
    export: {
      method: 'GET' as const,
      path: '/api/calculations/export',
      responses: {
        200: z.object({
          csv: z.string(),
          json: z.array(z.custom<typeof calculations.$inferSelect>()),
        }),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      } else {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }
  return url;
}
