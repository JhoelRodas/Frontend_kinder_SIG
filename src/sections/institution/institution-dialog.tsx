import type { GeoJSONPolygon, InstitutionResponse } from 'src/api/institution';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { MapDrawer } from './institution-map-drawer';

type InstitutionDialogProps = {
  open: boolean;
  institution: InstitutionResponse | null;
  onClose: () => void;
  onSave: (data: { nombre: string; direccion: string; area: GeoJSONPolygon }) => Promise<void>;
};

export function InstitutionDialog({ open, institution, onClose, onSave }: InstitutionDialogProps) {
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [area, setArea] = useState<GeoJSONPolygon | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (institution) {
      setNombre(institution.nombre);
      setDireccion(institution.direccion);
      setArea(institution.area);
    } else {
      setNombre('');
      setDireccion('');
      setArea(null);
    }
    setError('');
  }, [institution, open]);

  const handleSave = async () => {
    // Validaciones
    if (!nombre.trim()) {
      setError('El nombre es requerido');
      return;
    }
    if (!direccion.trim()) {
      setError('La dirección es requerida');
      return;
    }
    if (!area) {
      setError('Debe dibujar el área en el mapa');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSave({ nombre, direccion, area });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar la institución');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {institution ? 'Editar Institución' : 'Nueva Institución'}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
          <TextField
            fullWidth
            label="Nombre de la Institución"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Kinder Arcoiris"
            required
          />

          <TextField
            fullWidth
            label="Dirección"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            placeholder="Ej: Calle 123, La Paz"
            required
          />

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Área de la Institución
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
              Use las herramientas de dibujo en el mapa para definir el área. Haga clic en los puntos
              del mapa para crear un polígono.
            </Typography>
            <MapDrawer
              existingPolygon={area}
              onPolygonChange={setArea}
              readOnly={false}
            />
          </Box>

          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
