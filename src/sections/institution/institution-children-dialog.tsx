import type { ChildResponse } from 'src/api/child';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import CardContent from '@mui/material/CardContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type InstitutionChildrenDialogProps = {
  open: boolean;
  institutionId: string | null;
  institutionName: string;
  onClose: () => void;
};

export function InstitutionChildrenDialog({
  open,
  institutionId,
  institutionName,
  onClose,
}: InstitutionChildrenDialogProps) {
  const [children, setChildren] = useState<ChildResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterName, setFilterName] = useState('');

  useEffect(() => {
    if (open && institutionId) {
      fetchChildren();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, institutionId]);

  const fetchChildren = async () => {
    if (!institutionId) return;

    setLoading(true);
    try {
      // TODO: Descomentar cuando el backend esté listo
      // const data = await institutionService.getInstitutionChildren(institutionId);

      // DATOS DE PRUEBA - REMOVER cuando tengas datos reales
      const data = [
        {
          id: 1,
          nombre: "Juan Pérez",
          device_id: "android123",
          tutor: 5,
          institucion: 1,
          activo: true,
          last_status: "Dentro del Kinder",
          ultima_ubicacion: { lat: -17.7838, lng: -63.1821 },
          ultima_actualizacion: "2025-12-08T15:30:00Z"
        },
        {
          id: 2,
          nombre: "Ana López",
          device_id: "android456",
          tutor: 3,
          institucion: 1,
          activo: true,
          last_status: "Fuera del área",
          ultima_ubicacion: { lat: -17.7840, lng: -63.1825 },
          ultima_actualizacion: "2025-12-08T15:25:00Z"
        },
        {
          id: 3,
          nombre: "Luis Cruz",
          device_id: "android789",
          tutor: 8,
          institucion: 1,
          activo: true,
          last_status: "Dentro del Kinder",
          ultima_ubicacion: { lat: -17.7835, lng: -63.1819 },
          ultima_actualizacion: "2025-12-08T15:29:00Z"
        },
        {
          id: 4,
          nombre: "María García",
          device_id: "android321",
          tutor: 2,
          institucion: 1,
          activo: false,
          last_status: "Fuera del área",
          ultima_ubicacion: { lat: -17.7842, lng: -63.1830 },
          ultima_actualizacion: "2025-12-08T14:15:00Z"
        }
      ];

      setChildren(data);
    } catch (error) {
      console.error('Error al cargar niños:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredChildren = children.filter((child) =>
    child.nombre.toLowerCase().includes(filterName.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    if (status.toLowerCase().includes('dentro')) return 'success';
    if (status.toLowerCase().includes('fuera')) return 'warning';
    return 'default';
  };

  const getStatusIcon = (status: string) => {
    if (status.toLowerCase().includes('dentro')) return 'solar:check-circle-bold';
    if (status.toLowerCase().includes('fuera')) return 'solar:restart-bold';
    return 'solar:eye-bold';
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Justo ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Hace ${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    return `Hace ${diffDays}d`;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="solar:chat-round-dots-bold" width={24} />
          <Typography variant="h6">Niños de {institutionName}</Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3}>
          {/* Buscador */}
          <TextField
            fullWidth
            placeholder="Buscar niño..."
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            InputProps={{
              startAdornment: <Iconify icon="eva:search-fill" width={20} sx={{ mr: 1 }} />,
            }}
          />

          {/* Loading */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
              <CircularProgress />
            </Box>
          )}

          {/* Grid de Cards */}
          {!loading && filteredChildren.length > 0 && (
            <Grid container spacing={2}>
              {filteredChildren.map((child) => (
                <Grid key={child.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card
                    sx={{
                      height: '100%',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: (theme) => theme.shadows[8],
                      },
                    }}
                  >
                    <CardContent>
                      <Stack spacing={2}>
                        {/* Nombre del niño */}
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              bgcolor: 'primary.lighter',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Iconify icon="solar:pen-bold" width={24} color="primary.main" />
                          </Box>
                          <Typography variant="subtitle1" fontWeight="600" noWrap>
                            {child.nombre}
                          </Typography>
                        </Stack>

                        {/* Estado */}
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Iconify
                            icon={getStatusIcon(child.last_status)}
                            width={18}
                            color={
                              getStatusColor(child.last_status) === 'success'
                                ? 'success.main'
                                : 'warning.main'
                            }
                          />
                          <Chip
                            label={child.last_status}
                            color={getStatusColor(child.last_status)}
                            size="small"
                            sx={{ fontWeight: 500 }}
                          />
                        </Stack>

                        {/* Ubicación */}
                        {child.ultima_ubicacion && (
                          <Stack direction="row" alignItems="flex-start" spacing={1}>
                            <Iconify icon="solar:share-bold" width={18} sx={{ mt: 0.3 }} />
                            <Typography variant="caption" color="text.secondary">
                              {child.ultima_ubicacion.lat.toFixed(4)},{' '}
                              {child.ultima_ubicacion.lng.toFixed(4)}
                            </Typography>
                          </Stack>
                        )}

                        {/* Tutor */}
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Iconify icon="solar:eye-bold" width={18} />
                          <Typography variant="caption" color="text.secondary">
                            Tutor ID: {child.tutor}
                          </Typography>
                        </Stack>

                        {/* Última actualización */}
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Iconify icon="solar:clock-circle-outline" width={18} />
                          <Typography variant="caption" color="text.secondary">
                            {formatTime(child.ultima_actualizacion)}
                          </Typography>
                        </Stack>

                        {/* Device ID */}
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Iconify icon="solar:cart-3-bold" width={18} />
                          <Typography variant="caption" color="text.secondary" noWrap>
                            {child.device_id}
                          </Typography>
                        </Stack>

                        {/* Estado activo */}
                        <Box>
                          <Chip
                            label={child.activo ? 'Activo' : 'Inactivo'}
                            color={child.activo ? 'info' : 'default'}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Sin resultados */}
          {!loading && filteredChildren.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 5 }}>
              <Iconify
                icon="solar:eye-closed-bold"
                width={64}
                sx={{ mb: 2, opacity: 0.5 }}
              />
              <Typography variant="h6" color="text.secondary">
                {filterName
                  ? 'No se encontraron niños con ese nombre'
                  : 'No hay niños registrados en esta institución'}
              </Typography>
            </Box>
          )}

          {/* Estadísticas */}
          {!loading && filteredChildren.length > 0 && (
            <Box
              sx={{
                borderTop: 1,
                borderColor: 'divider',
                pt: 2,
                display: 'flex',
                gap: 2,
                flexWrap: 'wrap',
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <Iconify icon="solar:chat-round-dots-bold" width={20} />
                <Typography variant="body2" color="text.secondary">
                  <strong>{children.length}</strong> niños totales
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Iconify icon="solar:check-circle-bold" width={20} color="success.main" />
                <Typography variant="body2" color="text.secondary">
                  <strong>
                    {children.filter((c) => c.last_status.toLowerCase().includes('dentro')).length}
                  </strong>{' '}
                  dentro
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Iconify icon="solar:restart-bold" width={20} color="warning.main" />
                <Typography variant="body2" color="text.secondary">
                  <strong>
                    {children.filter((c) => c.last_status.toLowerCase().includes('fuera')).length}
                  </strong>{' '}
                  fuera
                </Typography>
              </Stack>
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}
