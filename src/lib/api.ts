const BASE_URL = '/api';

function getToken() {
  return localStorage.getItem('token');
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>)
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    const msg = data.message || (data.errors?.[0]?.msg) || 'Something went wrong';
    throw new Error(msg);
  }
  return data;
}

export const api = {
  auth: {
    register: (body: object) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
    login: (body: object) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
    me: () => request('/auth/me')
  },
  departments: {
    list: () => request('/departments'),
    create: (body: object) => request('/departments', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: object) => request(`/departments/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id: string) => request(`/departments/${id}`, { method: 'DELETE' })
  },
  clubs: {
    list: (params?: Record<string, string>) => {
      const q = params ? '?' + new URLSearchParams(params).toString() : '';
      return request(`/clubs${q}`);
    },
    get: (id: string) => request(`/clubs/${id}`),
    create: (body: object) => request('/clubs', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: object) => request(`/clubs/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id: string) => request(`/clubs/${id}`, { method: 'DELETE' }),
    myApplication: (clubId: string) => request(`/clubs/${clubId}/my-application`)
  },
  applications: {
    create: (body: object) => request('/applications', { method: 'POST', body: JSON.stringify(body) }),
    my: () => request('/applications/my'),
    forClub: (clubId: string) => request(`/applications/club/${clubId}`),
    update: (id: string, body: object) => request(`/applications/${id}`, { method: 'PUT', body: JSON.stringify(body) })
  },
  events: {
    forClub: (clubId: string) => request(`/events/club/${clubId}`),
    upcoming: () => request('/events/upcoming'),
    create: (body: object) => request('/events', { method: 'POST', body: JSON.stringify(body) }),
    delete: (id: string) => request(`/events/${id}`, { method: 'DELETE' })
  },
  admin: {
    stats: () => request('/admin/stats'),
    users: (params?: Record<string, string>) => {
      const q = params ? '?' + new URLSearchParams(params).toString() : '';
      return request(`/admin/users${q}`);
    },
    updateRole: (id: string, role: string) => request(`/admin/users/${id}/role`, { method: 'PUT', body: JSON.stringify({ role }) }),
    clubs: () => request('/admin/clubs'),
    assignLeader: (clubId: string, leaderId: string) =>
      request(`/admin/clubs/${clubId}/assign-leader`, { method: 'PUT', body: JSON.stringify({ leaderId }) })
  }
};
