import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

import type { GeoJSONPolygon } from 'src/api/institution';

import L from 'leaflet';
import { useRef, useEffect } from 'react';
import { EditControl } from 'react-leaflet-draw';
import { useMap, Polygon, TileLayer, MapContainer, FeatureGroup } from 'react-leaflet';

import Box from '@mui/material/Box';

// Fix para los iconos de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

type MapDrawerProps = {
  center?: [number, number];
  zoom?: number;
  existingPolygon?: GeoJSONPolygon | null;
  onPolygonChange: (polygon: GeoJSONPolygon | null) => void;
  readOnly?: boolean;
};

export function MapDrawer({
  center = [-17.7833, -63.1821], // La Paz, Bolivia
  zoom = 13,
  existingPolygon = null,
  onPolygonChange,
  readOnly = false,
}: MapDrawerProps) {
  const featureGroupRef = useRef<L.FeatureGroup>(null);

  // Convertir coordenadas GeoJSON [lon, lat] a Leaflet [lat, lon]
  const convertGeoJSONToLeaflet = (coords: number[][][]): [number, number][] => {
    if (!coords || coords.length === 0) return [];
    return coords[0].map(([lon, lat]) => [lat, lon]);
  };

  // Convertir coordenadas Leaflet [lat, lon] a GeoJSON [lon, lat]
  const convertLeafletToGeoJSON = (coords: L.LatLng[]): number[][] => {
    const positions = coords.map((coord) => [coord.lng, coord.lat]);
    // Cerrar el polígono (primer punto = último punto)
    if (positions.length > 0 && JSON.stringify(positions[0]) !== JSON.stringify(positions[positions.length - 1])) {
      positions.push(positions[0]);
    }
    return positions;
  };

  const handleCreated = (e: any) => {
    const layer = e.layer;
    const coords = layer.getLatLngs()[0];
    const geoJSON: GeoJSONPolygon = {
      type: 'Polygon',
      coordinates: [convertLeafletToGeoJSON(coords)],
    };
    onPolygonChange(geoJSON);
  };

  const handleEdited = (e: any) => {
    const layers = e.layers;
    layers.eachLayer((layer: any) => {
      const coords = layer.getLatLngs()[0];
      const geoJSON: GeoJSONPolygon = {
        type: 'Polygon',
        coordinates: [convertLeafletToGeoJSON(coords)],
      };
      onPolygonChange(geoJSON);
    });
  };

  const handleDeleted = () => {
    onPolygonChange(null);
  };

  useEffect(() => {
    // Limpiar polígonos existentes cuando cambia el modo de edición
    if (featureGroupRef.current) {
      featureGroupRef.current.clearLayers();
    }
  }, [readOnly]);

  // Componente interno para ajustar el mapa al polígono
  function FitBounds({ polygon }: { polygon: GeoJSONPolygon | null }) {
    const map = useMap();

    useEffect(() => {
      if (polygon?.coordinates?.[0]) {
        const leafletCoords = convertGeoJSONToLeaflet(polygon.coordinates);
        if (leafletCoords.length > 0) {
          const bounds = L.latLngBounds(leafletCoords);
          // Padding asimétrico: [top+bottom, left+right]
          // Modo edición necesita más espacio arriba (herramientas) y abajo
          const paddingValue: [number, number] = readOnly ? [50, 50] : [100, 60];
          map.fitBounds(bounds, { padding: paddingValue });
        }
      }
    }, [polygon, map]);

    return null;
  }

  return (
    <Box sx={{ height: 400, width: '100%', position: 'relative', borderRadius: 1, overflow: 'hidden' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Ajustar mapa al polígono existente */}
        <FitBounds polygon={existingPolygon} />

        <FeatureGroup ref={featureGroupRef}>
          {!readOnly && (
            <EditControl
              position="topright"
              onCreated={handleCreated}
              onEdited={handleEdited}
              onDeleted={handleDeleted}
              draw={{
                rectangle: false,
                circle: false,
                circlemarker: false,
                marker: false,
                polyline: false,
                polygon: {
                  allowIntersection: false,
                  shapeOptions: {
                    color: '#2196f3',
                    weight: 2,
                    fillOpacity: 0.3,
                  },
                  icon: new L.DivIcon({
                    iconSize: new L.Point(10, 10),
                    className: 'leaflet-div-icon leaflet-editing-icon leaflet-vertex-icon'
                  }),
                },
              }}
            />
          )}

          {existingPolygon && (
            <Polygon
              positions={convertGeoJSONToLeaflet(existingPolygon.coordinates)}
              pathOptions={{
                color: readOnly ? '#4caf50' : '#2196f3',
                weight: 2,
                fillOpacity: 0.3,
              }}
            />
          )}
        </FeatureGroup>
      </MapContainer>
    </Box>
  );
}
