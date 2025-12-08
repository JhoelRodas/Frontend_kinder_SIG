import type { GeoJSONPolygon, InstitutionResponse } from 'src/api/institution';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';

import { DashboardContent } from 'src/layouts/dashboard';
import { institutionService } from 'src/api/institution';

import { ConfirmDialog } from 'src/components/confirm-dialog';

import { InstitutionItem } from '../institution-item';
import { MapDrawer } from '../institution-map-drawer';
import { InstitutionDialog } from '../institution-dialog';
import { InstitutionToolbar } from '../institution-toolbar';
import { InstitutionChildrenDialog } from '../institution-children-dialog';

export function InstitutionView() {
  const [institutions, setInstitutions] = useState<InstitutionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterName, setFilterName] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [editingInstitution, setEditingInstitution] = useState<InstitutionResponse | null>(null);
  const [viewingInstitution, setViewingInstitution] = useState<InstitutionResponse | null>(null);
  const [deletingInstitution, setDeletingInstitution] = useState<InstitutionResponse | null>(null);
  const [viewingChildren, setViewingChildren] = useState<InstitutionResponse | null>(null);

  const fetchInstitutions = useCallback(async () => {
    try {
      setError(null);
      const data = await institutionService.getInstitutions();
      console.log('📥 Instituciones recibidas del backend:', data);
      setInstitutions(data);
    } catch (err) {
      console.error('Failed to fetch institutions', err);
      setError('Error al cargar las instituciones');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInstitutions();
  }, [fetchInstitutions]);

  const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterName(event.target.value);
  };

  const filteredInstitutions = institutions.filter((institution) =>
    institution.nombre.toLowerCase().includes(filterName.toLowerCase()) ||
    institution.direccion.toLowerCase().includes(filterName.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditingInstitution(null);
    setOpenDialog(true);
  };

  const handleEdit = (institution: InstitutionResponse) => {
    setEditingInstitution(institution);
    setOpenDialog(true);
  };

  const handleView = (institution: InstitutionResponse) => {
    setViewingInstitution(institution);
  };

  const handleViewChildren = (institution: InstitutionResponse) => {
    setViewingChildren(institution);
  };

  const handleSave = async (data: { nombre: string; direccion: string; area: GeoJSONPolygon }) => {
    console.log('📤 Datos a enviar al backend:', data);
    if (editingInstitution) {
      // Actualizar
      console.log('🔄 Actualizando institución ID:', editingInstitution.id);
      await institutionService.updateInstitution(editingInstitution.id, data);
    } else {
      // Crear
      console.log('✨ Creando nueva institución');
      await institutionService.createInstitution(data);
    }
    fetchInstitutions();
  };

  const handleDelete = async (id: string) => {
    const institution = institutions.find(inst => inst.id === id);
    if (institution) {
      setDeletingInstitution(institution);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingInstitution) return;

    try {
      await institutionService.deleteInstitution(deletingInstitution.id);
      setDeletingInstitution(null);
      fetchInstitutions();
    } catch (err) {
      console.error('Failed to delete institution', err);
      setError('Error al eliminar la institución');
    }
  };

  if (loading) {
    return (
      <DashboardContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h4">Instituciones</Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <InstitutionToolbar
        filterName={filterName}
        onFilterName={handleFilterName}
        onOpenCreate={handleOpenCreate}
      />

      {filteredInstitutions.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Typography variant="h6" color="text.secondary">
            No se encontraron instituciones
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {filterName ? 'Intente con otro término de búsqueda' : 'Cree su primera institución'}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredInstitutions.map((institution) => (
            <Grid key={institution.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <InstitutionItem
                institution={institution}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
                onViewChildren={handleViewChildren}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog para crear/editar */}
      <InstitutionDialog
        open={openDialog}
        institution={editingInstitution}
        onClose={() => setOpenDialog(false)}
        onSave={handleSave}
      />

      {/* Dialog para ver mapa */}
      <Dialog
        open={!!viewingInstitution}
        onClose={() => setViewingInstitution(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{viewingInstitution?.nombre}</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {viewingInstitution?.direccion}
            </Typography>
          </Box>
          {viewingInstitution && (
            <MapDrawer
              existingPolygon={viewingInstitution.area}
              onPolygonChange={() => {}}
              readOnly
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewingInstitution(null)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
      {/* Dialog de confirmación de eliminación */}
      <ConfirmDialog
        open={!!deletingInstitution}
        title="Eliminar institución"
        content={`¿Está seguro de eliminar la institución "${deletingInstitution?.nombre}"? Esta acción no se puede deshacer.`}
        action={
          <>
            <Button variant="outlined" color="inherit" onClick={() => setDeletingInstitution(null)}>
              Cancelar
            </Button>
            <Button variant="contained" color="error" onClick={handleConfirmDelete}>
              Eliminar
            </Button>
          </>
        }
        onClose={() => setDeletingInstitution(null)}
      />

      {/* Dialog para ver niños */}
      <InstitutionChildrenDialog
        open={!!viewingChildren}
        institutionId={viewingChildren?.id || null}
        institutionName={viewingChildren?.nombre || ''}
        onClose={() => setViewingChildren(null)}
      />
    </DashboardContent>
  );
}
