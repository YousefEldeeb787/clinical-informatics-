import axios from 'axios';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5160',
  timeout: 30000, // Increased timeout for slower connections
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request in development
    if (import.meta.env.DEV) {
      console.log('API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
      });
    }
    
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log('API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }
    return response;
  },
  (error) => {
    // Log error in development
    if (import.meta.env.DEV) {
      console.error('API Error:', {
        status: error.response?.status,
        url: error.config?.url,
        message: error.message,
        data: error.response?.data,
      });
    }

    if (error.response) {
      const { status, data } = error.response;
      
      // Handle specific error codes
      switch (status) {
        case 400:
          // Bad Request
          console.error('Bad Request:', data?.message || 'Invalid request');
          break;
          
        case 401:
          // Unauthorized - clear storage and redirect to login
          console.error('Unauthorized - redirecting to login');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('role');
          
          // Only redirect if not already on login page
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
          break;
          
        case 403:
          // Forbidden - access denied
          console.error('Access denied:', data?.message || 'You do not have permission to perform this action');
          break;
          
        case 404:
          // Not Found
          console.error('Resource not found:', data?.message || 'The requested resource was not found');
          break;
          
        case 409:
          // Conflict
          console.error('Conflict:', data?.message || 'A conflict occurred with the current state');
          break;
          
        case 422:
          // Unprocessable Entity (Validation Error)
          console.error('Validation Error:', data?.errors || data?.message);
          break;
          
        case 500:
          // Internal Server Error
          console.error('Server error:', data?.message || 'An internal server error occurred');
          break;
          
        case 503:
          // Service Unavailable
          console.error('Service unavailable:', 'The server is temporarily unavailable');
          break;
          
        default:
          console.error('An error occurred:', data?.message || error.message);
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response from server. Please check your internet connection.');
    } else {
      // Something happened in setting up the request
      console.error('Error setting up request:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Helper function to create query string from params
export const createQueryString = (params) => {
  const query = new URLSearchParams();
  
  Object.keys(params).forEach(key => {
    const value = params[key];
    if (value !== null && value !== undefined && value !== '') {
      query.append(key, value);
    }
  });
  
  return query.toString();
};

export default apiClient;
