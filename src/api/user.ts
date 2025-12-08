import apiClient from './api-client';

// Tipo que coincide con la estructura real del backend
export interface Usuario {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    telefono: string;
    es_tutor: boolean;
    es_admin_institucion: boolean;
    is_active: boolean;
}

// Tipo legacy (para compatibilidad con children)
export type UserResponse = {
    id: string;
    email: string;
    full_name: string;
    phone: string | null;
    is_active: boolean;
    created_at: string;
};

// Tipos adicionales para operaciones CRUD
export interface UsuarioCreate {
    username: string;
    password: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    telefono?: string;
    es_tutor?: boolean;
    es_admin_institucion?: boolean;
    is_active?: boolean;
}

export interface UsuarioUpdate {
    username?: string;
    password?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    telefono?: string;
    es_tutor?: boolean;
    es_admin_institucion?: boolean;
    is_active?: boolean;
}

export const userService = {
    // Listar todos los usuarios (tipo real del backend)
    async getUsers(): Promise<Usuario[]> {
        console.log('🔵 [userService] Llamando a GET /usuarios');
        const response = await apiClient.get('/usuarios');
        console.log('✅ [userService] Respuesta de GET /usuarios:', response);
        return response;
    },

    // Obtener un usuario por ID
    async getUser(id: number): Promise<Usuario> {
        console.log('🔵 [userService] Llamando a GET /usuarios/' + id);
        const response = await apiClient.get(`/usuarios/${id}/`);
        console.log('✅ [userService] Respuesta de GET /usuarios/' + id + ':', response);
        return response;
    },

    // Crear un nuevo usuario
    async createUser(data: UsuarioCreate): Promise<Usuario> {
        console.log('🔵 [userService] Llamando a POST /usuarios con data:', data);
        const response = await apiClient.post('/usuarios/', data);
        console.log('✅ [userService] Usuario creado:', response);
        return response;
    },

    // Actualizar un usuario existente
    async updateUser(id: number, data: UsuarioUpdate): Promise<Usuario> {
        console.log('🔵 [userService] Llamando a PUT /usuarios/' + id + ' con data:', data);
        const response = await apiClient.put(`/usuarios/${id}/`, data);
        console.log('✅ [userService] Usuario actualizado:', response);
        return response;
    },

    // Eliminar un usuario
    async deleteUser(id: number): Promise<void> {
        console.log('🔵 [userService] Llamando a DELETE /usuarios/' + id);
        const response = await apiClient.delete(`/usuarios/${id}/`);
        console.log('✅ [userService] Usuario eliminado:', response);
        return response;
    },

    // Método legacy para children (mantiene compatibilidad)
    async getUsersLegacy(): Promise<UserResponse[]> {
        console.log('🔵 [userService] Llamando a GET /usuarios (legacy)');
        const response = await apiClient.get('/usuarios');
        console.log('✅ [userService] Respuesta de GET /usuarios (legacy):', response);
        return response;
    },
};
