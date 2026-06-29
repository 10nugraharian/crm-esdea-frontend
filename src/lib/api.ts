import Cookies from 'js-cookie';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = Cookies.get('auth_token');

  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  headers.set('Accept', 'application/json');
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
      Cookies.remove('auth_token');
      Cookies.remove('user_data');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    throw new Error(data.error || data.message || 'An error occurred');
  }

  return data;
}
