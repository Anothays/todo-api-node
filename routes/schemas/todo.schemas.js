import { z } from "zod";

/** POST /todos body: title required, description optional, status optional with default */
export const todoInput = z.object({
  title: z.string().min(1, "title is required"),
  description: z.string().nullable().optional(),
  status: z.string().optional().default("pending"),
});

/** PUT /todos body: all optional for partial update */
export const todoInputPartial = z.object({
  title: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  status: z.string().optional(),
});

/** GET /todos query: skip, limit */
export const queryList = z.object({
  skip: z.coerce.number().int().min(0).default(0),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

/** GET /todos/search/all query: q */
export const querySearch = z.object({
  q: z.string().optional().default(""),
});

/** Path param :id (integer positive) */
export const paramsId = z.object({
  id: z.coerce.number().int().positive("Invalid id"),
});

/**
 * Runs schema.safeParse(data). Returns { success, data, error }.
 * On failure, error is the Zod error (use .message for a single string).
 */
export function validate(schema, data) {
  const result = schema.safeParse(data);
  if (result.success) return { success: true, data: result.data };
  return { success: false, error: result.error };
}
