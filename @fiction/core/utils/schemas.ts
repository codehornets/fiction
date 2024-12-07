import type { z } from 'zod'

// Limit recursion depth and handle arrays simply
type SchemaPrimitive = string | number | boolean | null | undefined

// Get object paths with limited depth
export type SchemaPathsWithDepth<T, Depth extends number = 4> = T extends SchemaPrimitive
  ? never
  : Depth extends 0
    ? never
    : T extends Array<infer U>
      ? `${number}` | `${number}.${SchemaPathsWithDepth<U, Depth>}`
      : T extends object
        ? {
            [K in keyof T & string]:
              | K
              | `${K}.${SchemaPathsWithDepth<T[K], [-1, 0, 1, 2][Depth]>}`
          }[keyof T & string]
        : never

// // Convert schema to bounded paths
export type SchemaFields<T extends z.ZodObject<any>> = SchemaPathsWithDepth<z.infer<T>>

/**
 * Type helper to validate paths against a schema
 * Returns the path with proper typing from schema
 */
export function pathCheck<T extends z.ZodType>(
  path: SchemaPathsWithDepth<z.infer<T>>,
  _schema?: T,
): SchemaPathsWithDepth<z.infer<T>> {
  return path
}
