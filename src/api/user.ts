import apiClient from './api-client';

export type UserResponse = {
    id: string;
    email: string;
    full_name: string;
    phone: string | null;
    is_active: boolean;
    created_at: string;
};

export const userService = {
    async getUsers(): Promise<UserResponse[]> {
        const response = await apiClient.get('/usuarios');
        return response;
    },

    async getUser(id: string): Promise<UserResponse> {
        const response = await apiClient.get(`/usuarios/${id}`);
        return response;
    },
};
