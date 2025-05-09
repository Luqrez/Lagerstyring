// This file contains configuration for API endpoints
// It uses environment variables from the .env file

// Get the backend URL from the environment variable or use a default value
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5212';

// Helper function to build API URLs
export const getApiUrl = (endpoint: string): string => {
  return `${BACKEND_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};

// Common API endpoints
export const API_ENDPOINTS = {
  BEHOLDNING: '/api/beholdning',
  OPTIONS: '/api/options',
  REALTIME: '/realtime/beholdning'
};