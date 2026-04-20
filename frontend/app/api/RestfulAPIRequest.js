/**
 * Centralized API request handler for all RESTful API calls
 */

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

/**
 * Custom error class for API errors
 */
class APIError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Main API request function
 * @param {string} endpoint - API endpoint (e.g., '/pokemon/moves')
 * @param {Object} options - Request options
 * @param {string} options.method - HTTP method (GET, POST, PUT, DELETE, PATCH)
 * @param {Object} options.body - Request body (will be JSON stringified)
 * @param {Object} options.headers - Additional headers
 * @param {AbortSignal} options.signal - Abort signal for cancellation
 * @param {boolean} options.cache - Next.js cache option
 * @returns {Promise<any>} Response data
 */
async function RestfulAPIRequest(endpoint, options = {}) {
  const {
    method = 'GET',
    body = null,
    headers = {},
    signal = null,
    cache = 'no-store',
  } = options;

  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    method,
    headers: { ...defaultHeaders, ...headers },
    cache,
  };

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  if (signal) {
    config.signal = signal;
  }

  try {
    const response = await fetch(url, config);

    // Handle error responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new APIError(
        errorData.message || `HTTP Error ${response.status}`,
        response.status,
        errorData
      );
    }

    // Return parsed JSON
    return await response.json();
  } catch (error) {
    // Re-throw API errors
    if (error instanceof APIError) {
      throw error;
    }

    // Handle fetch errors (network issues, etc.)
    if (error.name === 'AbortError') {
      throw new Error('Request was cancelled');
    }

    throw new Error(error.message || 'Network request failed');
  }
}

/**
 * Convenience methods for common HTTP verbs
 */
export const api = {
  /**
   * GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Additional options
   */
  get: (endpoint, options = {}) => {
    return RestfulAPIRequest(endpoint, { ...options, method: 'GET' });
  },

  /**
   * POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} body - Request body
   * @param {Object} options - Additional options
   */
  post: (endpoint, body, options = {}) => {
    return RestfulAPIRequest(endpoint, { ...options, method: 'POST', body });
  },

  /**
   * PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} body - Request body
   * @param {Object} options - Additional options
   */
  put: (endpoint, body, options = {}) => {
    return RestfulAPIRequest(endpoint, { ...options, method: 'PUT', body });
  },

  /**
   * PATCH request
   * @param {string} endpoint - API endpoint
   * @param {Object} body - Request body
   * @param {Object} options - Additional options
   */
  patch: (endpoint, body, options = {}) => {
    return RestfulAPIRequest(endpoint, { ...options, method: 'PATCH', body });
  },

  /**
   * DELETE request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Additional options
   */
  delete: (endpoint, options = {}) => {
    return RestfulAPIRequest(endpoint, { ...options, method: 'DELETE' });
  },
};

export default RestfulAPIRequest;
export { APIError };
