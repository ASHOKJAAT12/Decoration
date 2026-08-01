const API_BASE = '/api/admin';
const PUBLIC_BASE = '/api/public';

interface FetchOptions extends RequestInit {
    skipAuth?: boolean;
}

// Token management
const getAccessToken = () => typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
const getRefreshToken = () => typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
const setTokens = (accessToken: string, refreshToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
};
const clearTokens = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('admin');
};

// Custom fetch with auto-refresh
async function apiFetch(endpoint: string, options: FetchOptions = {}): Promise<Response> {
    const { skipAuth, ...fetchOptions } = options;
    const headers: Record<string, string> = {
        ...(fetchOptions.headers as Record<string, string> || {}),
    };

    // Don't set Content-Type for FormData (let browser set boundary)
    if (!(fetchOptions.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    if (!skipAuth) {
        const token = getAccessToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    let response = await fetch(`${API_BASE}${endpoint}`, {
        ...fetchOptions,
        headers,
    });

    // If token expired, try to refresh
    if (response.status === 401 && !skipAuth) {
        const data = await response.json();
        if (data.expired) {
            const refreshed = await refreshAccessToken();
            if (refreshed) {
                headers['Authorization'] = `Bearer ${getAccessToken()}`;
                response = await fetch(`${API_BASE}${endpoint}`, {
                    ...fetchOptions,
                    headers,
                });
            }
        }
    }

    return response;
}

async function refreshAccessToken(): Promise<boolean> {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return false;

    try {
        const res = await fetch(`${API_BASE}/refresh-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
        });

        if (!res.ok) {
            clearTokens();
            return false;
        }

        const data = await res.json();
        localStorage.setItem('accessToken', data.accessToken);
        return true;
    } catch {
        clearTokens();
        return false;
    }
}

// ========================
// Auth API
// ========================
export const authAPI = {
    login: async (email: string, password: string) => {
        const res = await apiFetch('/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            skipAuth: true,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setTokens(data.accessToken, data.refreshToken);
        localStorage.setItem('admin', JSON.stringify(data.admin));
        return data;
    },

    forgotPassword: async (email: string) => {
        const res = await apiFetch('/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email }),
            skipAuth: true,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    },

    resetPassword: async (token: string, password: string) => {
        const res = await apiFetch('/reset-password', {
            method: 'POST',
            body: JSON.stringify({ token, password }),
            skipAuth: true,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    },

    getMe: async () => {
        const res = await apiFetch('/me');
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    },

    logout: async () => {
        try {
            await apiFetch('/logout', { method: 'POST' });
        } catch { /* ignore */ }
        clearTokens();
    },
};

// ========================
// Events API (Admin)
// ========================
export const eventsAPI = {
    getAll: async () => {
        const res = await apiFetch('/events');
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    },

    create: async (formData: FormData) => {
        const res = await apiFetch('/events', {
            method: 'POST',
            body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    },

    update: async (id: string, formData: FormData) => {
        const res = await apiFetch(`/events/${id}`, {
            method: 'PUT',
            body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    },

    delete: async (id: string) => {
        const res = await apiFetch(`/events/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    },
};

// ========================
// Photos API (Admin)
// ========================
export const photosAPI = {
    getByEvent: async (eventId: string) => {
        const res = await apiFetch(`/photos/${eventId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    },

    upload: async (eventId: string, files: File[], onProgress?: (percent: number) => void) => {
        const formData = new FormData();
        formData.append('eventId', eventId);
        files.forEach((file) => formData.append('photos', file));

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', `${API_BASE}/photos`);

            const token = getAccessToken();
            if (token) {
                xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            }

            xhr.upload.onprogress = (e) => {
                if (e.lengthComputable && onProgress) {
                    onProgress(Math.round((e.loaded / e.total) * 100));
                }
            };

            xhr.onload = () => {
                const data = JSON.parse(xhr.responseText);
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(data);
                } else {
                    reject(new Error(data.message || 'Upload failed'));
                }
            };

            xhr.onerror = () => reject(new Error('Network error'));
            xhr.send(formData);
        });
    },

    delete: async (photoId: string) => {
        const res = await apiFetch(`/photos/${photoId}`, { method: 'DELETE' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    },

    getStats: async () => {
        const res = await apiFetch('/photos/stats');
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    },
};

// ========================
// Gallery API (Admin)
// ========================
export const adminGalleryAPI = {
    getAll: async () => {
        const res = await apiFetch('/gallery');
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    },

    upload: async (files: File[], onProgress?: (percent: number) => void) => {
        const formData = new FormData();
        files.forEach((file) => formData.append('photos', file));

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', `${API_BASE}/gallery`);

            const token = getAccessToken();
            if (token) {
                xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            }

            xhr.upload.onprogress = (e) => {
                if (e.lengthComputable && onProgress) {
                    onProgress(Math.round((e.loaded / e.total) * 100));
                }
            };

            xhr.onload = () => {
                const data = JSON.parse(xhr.responseText);
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(data);
                } else {
                    reject(new Error(data.message || 'Upload failed'));
                }
            };

            xhr.onerror = () => reject(new Error('Network error'));
            xhr.send(formData);
        });
    },

    delete: async (id: string) => {
        const res = await apiFetch(`/gallery/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    },
};

// ========================
// Public API
// ========================
export const publicAPI = {
    getPhotosByEventSlug: async (slug: string) => {
        const res = await fetch(`${PUBLIC_BASE}/events/${slug}/photos`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    },

    getAllEvents: async () => {
        const res = await fetch(`${PUBLIC_BASE}/events`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    },

    getGallery: async () => {
        const res = await fetch(`${PUBLIC_BASE}/gallery`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    },
};

export { clearTokens, getAccessToken };
