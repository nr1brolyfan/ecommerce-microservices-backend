/**
 * Success Response Formatter
 */

export interface SuccessResponse<T> {
  success: true
  data: T
}

/**
 * Format success response
 * @param data - Response data
 * @returns Formatted success response
 */
export function successResponse<T>(data: T): SuccessResponse<T> {
  return {
    success: true,
    data,
  }
}
