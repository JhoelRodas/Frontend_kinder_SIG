import apiClient from './api-client';

export type ChildResponse = {
    id: string;
    full_name: string;
    birth_date: string | null;
    device_id: string | null;
    photo_url: string | null;
    user_id: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
};

export type ChildCreate = {
    full_name: string;
    birth_date?: string;
    photo_url?: string;
    user_id: string;
};

export type ChildUpdate = {
    full_name?: string;
    birth_date?: string;
    photo_url?: string;
    is_active?: boolean;
    user_id?: string;
};

export type DeviceTokenResponse = {
    child_id: string;
    device_token: string;
    token_created_at: string;
    message: string;
};

export const childService = {
    async getChildren(): Promise<ChildResponse[]> {
        const response = await apiClient.get('/children/');
        return response;
    },

    async getChild(id: string): Promise<ChildResponse> {
        const response = await apiClient.get(`/children/${id}`);
        return response;
    },

    async createChild(data: ChildCreate): Promise<ChildResponse> {
        const response = await apiClient.post('/children/', data);
        return response;
    },

    async updateChild(id: string, data: ChildUpdate): Promise<ChildResponse> {
        const response = await apiClient.request(`/children/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
        return response;
    },

    async generateToken(id: string): Promise<DeviceTokenResponse> {
        const response = await apiClient.post(`/children/${id}/generate-token`, {});
        return response;
    },
};
