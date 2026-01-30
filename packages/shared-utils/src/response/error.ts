/**
 * Error Response Formatter
 */

export interface ErrorResponse {
  success: false
  error: {
    message: string
    code?: string
    field?: string
  }
}

/**
 * Format error response
 * @param message - Error message
 * @param code - Error code
 * @param field - Field name (for validation errors)
 * @returns Formatted error response
 */
export function errorResponse(
  message: string,
  code?: string,
  field?: string,
): ErrorResponse {
  const error: ErrorResponse['error'] = { message }
  
  if (code !== undefined) {
    error.code = code
  }
  
  if (field !== undefined) {
    error.field = field
  }

  return {
    success: false,
    error,
  }
}
