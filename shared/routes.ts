import { z } from 'zod';
import { insertCalculationSchema, calculations, paginatedResponseSchema, statisticsSchema, projectStatisticsSchema, registerSchema, loginSchema, updateProfileSchema, forgotPasswordSchema, resetPasswordSchema, users } from './schema';

export const api = {
  auth: {
    register: {
      method: 'POST' as const,
      path: '/api/auth/register',
      input: registerSchema,
      responses: {
        201: z.custom<typeof users.$inferSelect>(),
        400: z.object({ message: z.string() }),
      },
    },
    login: {
      method: 'POST' as const,
      path: '/api/auth/login',
      input: loginSchema,
      responses: {
        200: z.object({ user: z.custom<typeof users.$inferSelect>() }),
        401: z.object({ message: z.string() }),
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/auth/logout',
      responses: {
        200: z.object({ message: z.string() }),
      },
    },
    me: {
      method: 'GET' as const,
      path: '/api/auth/me',
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: z.object({ message: z.string() }),
      },
    },
    updateProfile: {
      method: 'PUT' as const,
      path: '/api/auth/profile',
      input: updateProfileSchema,
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        400: z.object({ message: z.string() }),
      },
    },
    forgotPassword: {
      method: 'POST' as const,
      path: '/api/auth/forgot-password',
      input: forgotPasswordSchema,
      responses: {
        200: z.object({ message: z.string() }),
      },
    },
    resetPassword: {
      method: 'POST' as const,
      path: '/api/auth/reset-password',
      input: resetPasswordSchema,
      responses: {
        200: z.object({ message: z.string() }),
        400: z.object({ message: z.string() }),
      },
    },
  },
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
  public: {
    projectStatistics: {
      method: 'GET' as const,
      path: '/api/public/statistics',
      responses: {
        200: projectStatisticsSchema,
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
