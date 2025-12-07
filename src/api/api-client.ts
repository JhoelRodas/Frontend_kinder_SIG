const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const apiClient = {
  async request(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('accessToken');

    // Mantener un objeto literal hace más fácil modificar headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/sign-in';
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || 'Error en la solicitud');
    }

    // Si la respuesta es 204 No Content, no hay JSON para parsear
    if (response.status === 204) {
      return null;
    }

    return response.json();
  },

  get(endpoint: string) {
    return this.request(endpoint, { method: 'GET' });
  },

  post(endpoint: string, body: unknown) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },
};

export default apiClient;
