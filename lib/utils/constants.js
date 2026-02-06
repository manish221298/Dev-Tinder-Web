// Get baseUrl - now uses Next.js API routes
export const getBaseUrl = () => {
  // Use relative path for API routes in Next.js
  return '/api';
};

// Export baseUrl - for components that use it directly in template literals
// Now uses Next.js API routes instead of external server
export const baseUrl = '/api';

// Get token from localStorage - matches original React code
export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};
