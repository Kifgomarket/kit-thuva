import { NextRequest } from "next/server";
import { z, ZodType } from "zod";

// Define the output type for pagination params
type PaginationParams = {
  page: number;
  size: number;
};

type PaginationSchema = ZodType<PaginationParams, any, any>;

const defaultPaginationSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Page must be a positive number",
    }),
  size: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 25))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Size must be a positive number",
    }),
});

type GetPaginationParamsOptions = {
  request: NextRequest;
  schema?: PaginationSchema;
  pageKey?: string;
  sizeKey?: string;
};

/**
 * Extracts and validates pagination parameters from a NextRequest.
 * @param options - Object containing the request, optional schema, and optional query keys.
 * @param options.request - The NextRequest object containing query parameters.
 * @param options.schema - Optional custom Zod schema to validate pagination params.
 * @param options.pageKey - Optional custom query key for page (defaults to "page").
 * @param options.sizeKey - Optional custom query key for size (defaults to "size").
 * @returns Validated pagination parameters (page and size).
 * @throws ZodError if validation fails.
 */
export default function getPaginationParams({
  request,
  schema,
  pageKey = "page",
  sizeKey = "size",
}: GetPaginationParamsOptions): PaginationParams {
  // Extract raw query parameters using custom or default keys
  const rawParams = {
    page: request.nextUrl.searchParams.get(pageKey) ?? undefined,
    size: request.nextUrl.searchParams.get(sizeKey) ?? undefined,
  };

  const schemaToBeUsed = schema ?? defaultPaginationSchema;
  const validatedParams = schemaToBeUsed.parse(rawParams);

  return validatedParams;
}
