import apiClient from './api-client';

export type ChildResponse = {
    id: number;
    nombre: string;
    device_id: string;
    tutor: string | number;
    institucion: string | number;
    activo: boolean;
    last_status: string;
    ultima_ubicacion: {
        lat: number;
        lng: number;
    } | null;
    ultima_actualizacion: string;
};

export type ChildCreate = {
    nombre: string;
    device_id: string;
    tutor: number;
    institucion: number;
};

export type ChildUpdate = {
    nombre?: string;
    device_id?: string;
    tutor?: number;
    institucion?: number;
    activo?: boolean;
};

export type DeviceTokenResponse = {
    child_id: string;
    device_token: string;
    token_created_at: string;
    message: string;
};

export type ChildMonitoring = {
    id: number;
    nombre: string;
    device_id: string;
    ultima_ubicacion: {
        lat: number;
        lng: number;
    };
    last_status: string;
    ultima_actualizacion: string;
};

export type MapLocation = {
    lat: number;
    lng: number;
};

export type MapResponse = {
    nombre_nino: string;
    ultima_actualizacion: string;
    estado: string;
    ubicacion_actual: MapLocation;
    poligono_kinder: MapLocation[];
    nombre_kinder: string;
};

export type LocationHistory = {
    lat: number;
    lng: number;
    hora: string;
    bateria: number;
};

export type DashboardChild = {
    id: number;
    nombre: string;
    estado: string;
    ubicacion_actual: MapLocation;
    ultima_actualizacion: string;
};

export const childService = {
    // CRUD para Admin
    async getNinos(): Promise<ChildResponse[]> {
        const response = await apiClient.get('/monitoreo/ninos/');
        return response;
    },

    async getNino(id: number): Promise<ChildResponse> {
        const response = await apiClient.get(`/monitoreo/ninos/${id}/`);
        return response;
    },

    async createNino(data: ChildCreate): Promise<ChildResponse> {
        const response = await apiClient.post('/monitoreo/ninos/', data);
        return response;
    },

    async updateNino(id: number, data: ChildUpdate): Promise<ChildResponse> {
        const response = await apiClient.request(`/monitoreo/ninos/${id}/`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
        return response;
    },

    async deleteNino(id: number): Promise<void> {
        await apiClient.request(`/monitoreo/ninos/${id}/`, {
            method: 'DELETE',
        });
    },

    // Monitoreo para Padres
    async getMyChildren(): Promise<ChildMonitoring[]> {
        const response = await apiClient.get('/monitoreo/mis-hijos/');
        return response;
    },

    async getMapData(deviceId: string): Promise<MapResponse> {
        const response = await apiClient.get(`/monitoreo/mapa-padre/?device_id=${deviceId}`);
        return response;
    },

    async getLocationHistory(deviceId: string, fecha?: string): Promise<LocationHistory[]> {
        const query = fecha ? `?fecha=${fecha}` : '';
        const response = await apiClient.get(`/monitoreo/historial/${deviceId}/${query}`);
        return response;
    },

    async getUnifiedDashboard(): Promise<DashboardChild[]> {
        const response = await apiClient.get('/monitoreo/dashboard-unificado/');
        return response;
    },
};
