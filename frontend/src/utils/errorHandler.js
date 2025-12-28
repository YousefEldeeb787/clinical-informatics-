/**
 * Error Handling Utility
 * Provides consistent error handling across the application
 */

/**
 * Extract error message from error object
 * @param {Error} error - The error object
 * @returns {string} - User-friendly error message
 */
export const getErrorMessage = (error) => {
  // Check if it's an axios error with response
  if (error.response) {
    const { status, data } = error.response;
    
    // If there's a specific message from the API
    if (data?.message) {
      return data.message;
    }
    
    // If there are validation errors
    if (data?.errors) {
      if (typeof data.errors === 'object') {
        // Extract first error message from validation errors object
        const firstError = Object.values(data.errors)[0];
        if (Array.isArray(firstError)) {
          return firstError[0];
        }
        return firstError;
      }
      return data.errors;
    }
    
    // Default messages based on status code
    switch (status) {
      case 400:
        return 'Invalid request. Please check your input.';
      case 401:
        return 'You are not authorized. Please login again.';
      case 403:
        return 'Access denied. You do not have permission to perform this action.';
      case 404:
        return 'Resource not found.';
      case 409:
        return 'A conflict occurred. The resource may already exist.';
      case 422:
        return 'Validation failed. Please check your input.';
      case 500:
        return 'Server error. Please try again later.';
      case 503:
        return 'Service temporarily unavailable. Please try again later.';
      default:
        return `An error occurred (${status}). Please try again.`;
    }
  }
  
  // Network error or request failed
  if (error.request) {
    return 'Network error. Please check your internet connection.';
  }
  
  // Generic error
  return error.message || 'An unexpected error occurred.';
};

/**
 * Show user-friendly error notification
 * @param {Error} error - The error object
 * @param {Function} notificationFn - Function to show notification (e.g., toast)
 */
export const handleError = (error, notificationFn) => {
  const message = getErrorMessage(error);
  
  if (notificationFn) {
    notificationFn(message, 'error');
  } else {
    console.error('Error:', message);
  }
  
  return message;
};

/**
 * Check if error is authentication error
 * @param {Error} error - The error object
 * @returns {boolean}
 */
export const isAuthError = (error) => {
  return error.response?.status === 401;
};

/**
 * Check if error is authorization error
 * @param {Error} error - The error object
 * @returns {boolean}
 */
export const isAuthorizationError = (error) => {
  return error.response?.status === 403;
};

/**
 * Check if error is validation error
 * @param {Error} error - The error object
 * @returns {boolean}
 */
export const isValidationError = (error) => {
  return error.response?.status === 422 || error.response?.status === 400;
};

/**
 * Check if error is network error
 * @param {Error} error - The error object
 * @returns {boolean}
 */
export const isNetworkError = (error) => {
  return !error.response && error.request;
};

/**
 * Format validation errors for display
 * @param {Error} error - The error object
 * @returns {Object} - Formatted validation errors
 */
export const formatValidationErrors = (error) => {
  if (!error.response?.data?.errors) {
    return {};
  }
  
  const errors = error.response.data.errors;
  
  if (typeof errors === 'object' && !Array.isArray(errors)) {
    return errors;
  }
  
  return { general: errors };
};

export default {
  getErrorMessage,
  handleError,
  isAuthError,
  isAuthorizationError,
  isValidationError,
  isNetworkError,
  formatValidationErrors,
};
