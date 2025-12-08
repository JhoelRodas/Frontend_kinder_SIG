import apiClient from './api-client';

// Tipo GeoJSON para el área geográfica
export type GeoJSONPolygon = {
  type: 'Polygon';
  coordinates: number[][][]; // [[[lon, lat], [lon, lat], ...]]
};

// Respuesta completa de una institución
export type InstitutionResponse = {
  id: string;
  nombre: string;
  direccion: string;
  area: GeoJSONPolygon;
  created_at: string;
  updated_at: string;
};

// Datos para crear una institución
export type InstitutionCreate = {
  nombre: string;
  direccion: string;
  area: GeoJSONPolygon;
};

// Datos para actualizar una institución
export type InstitutionUpdate = {
  nombre?: string;
  direccion?: string;
  area?: GeoJSONPolygon;
};

export const institutionService = {
  async getInstitutions(): Promise<InstitutionResponse[]> {
    const response = await apiClient.get('/monitoreo/instituciones/');

    // Si el backend devuelve un GeoJSON FeatureCollection
    if (response.type === 'FeatureCollection' && response.features) {
      return response.features.map((feature: any) => ({
        id: String(feature.id),
        nombre: feature.properties.nombre,
        direccion: feature.properties.direccion,
        area: feature.geometry,
        created_at: feature.properties.created_at || new Date().toISOString(),
        updated_at: feature.properties.updated_at || new Date().toISOString(),
      }));
    }

    // Si devuelve un array directo
    return response;
  },

  async getInstitution(id: string): Promise<InstitutionResponse> {
    const response = await apiClient.get(`/monitoreo/instituciones/${id}/`);
    return response;
  },

  async createInstitution(data: InstitutionCreate): Promise<InstitutionResponse> {
    const response = await apiClient.post('/monitoreo/instituciones/', data);
    return response;
  },

  async updateInstitution(id: string, data: InstitutionUpdate): Promise<InstitutionResponse> {
    const response = await apiClient.request(`/monitoreo/instituciones/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response;
  },

  async deleteInstitution(id: string): Promise<void> {
    await apiClient.request(`/monitoreo/instituciones/${id}/`, {
      method: 'DELETE',
    });
  },

  async getInstitutionChildren(id: string): Promise<any[]> {
    const response = await apiClient.get(`/monitoreo/instituciones/${id}/ninos/`);
    return response;
  },
};
