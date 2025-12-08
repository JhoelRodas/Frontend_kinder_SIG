import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import Autocomplete from '@mui/material/Autocomplete';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';

import { DashboardContent } from 'src/layouts/dashboard';
import { userService, type UserResponse } from 'src/api/user';
import { childService, type ChildResponse } from 'src/api/child';

import { Iconify } from 'src/components/iconify';

import { ChildItem } from '../child-item';
import { ChildToolbar } from '../child-toolbar';
import { ChildEditDialog } from '../child-edit-dialog';

// ----------------------------------------------------------------------

export function ChildView() {
    const [children, setChildren] = useState<ChildResponse[]>([]);
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterName, setFilterName] = useState('');

    // Create Child Dialog State
    const [openCreate, setOpenCreate] = useState(false);
    const [newChildName, setNewChildName] = useState('');
    const [newChildDeviceId, setNewChildDeviceId] = useState('');
    const [newTutor, setNewTutor] = useState<string | null>(null);

    // Edit Child Dialog State
    const [editChild, setEditChild] = useState<ChildResponse | null>(null);

    const fetchChildren = useCallback(async () => {
        try {
            const data = await childService.getNinos();
            setChildren(data);
        } catch (error) {
            console.error('Failed to fetch children', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchUsers = useCallback(async () => {
        try {
            const data = await userService.getUsers();
            setUsers(data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        }
    }, []);

    useEffect(() => {
        fetchChildren();
        fetchUsers();
    }, [fetchChildren, fetchUsers]);

    const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterName(event.target.value);
    };

    const filteredChildren = children.filter((child) =>
        child.nombre.toLowerCase().includes(filterName.toLowerCase())
    );

    const handleGenerateToken = async (id: string) => {
        try {
            console.log('Generate token for child:', id);
            // Este método será implementado cuando tu backend lo tenga disponible
        } catch (error) {
            console.error('Failed to generate token', error);
        }
    };

    const handleCreateChild = async () => {
        if (!newChildName || !newChildDeviceId || !newTutor) {
            console.error('Todos los campos son requeridos');
            return;
        }

        try {
            await childService.createNino({
                nombre: newChildName,
                device_id: newChildDeviceId,
                tutor: parseInt(newTutor),
                institucion: 1,
            });
            setOpenCreate(false);
            setNewChildName('');
            setNewChildDeviceId('');
            setNewTutor(null);
            fetchChildren();
        } catch (error) {
            console.error('Failed to create child', error);
        }
    };

    const handleEdit = (child: ChildResponse) => {
        setEditChild(child);
    };

    const handleUpdateChild = async (id: number, data: any) => {
        try {
            await childService.updateNino(id, data);
            setEditChild(null);
            fetchChildren();
        } catch (error) {
            console.error('Failed to update child', error);
        }
    };

    const handleDeleteChild = async (id: number) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este niño?')) {
            try {
                await childService.deleteNino(id);
                fetchChildren();
            } catch (error) {
                console.error('Failed to delete child', error);
            }
        }
    };

    return (
        <DashboardContent>
            <Box
                sx={{
                    mb: 5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <Typography variant="h4">
                    Niños
                </Typography>
                <Button
                    variant="contained"
                    color="inherit"
                    startIcon={<Iconify icon="mingcute:add-line" />}
                    onClick={() => setOpenCreate(true)}
                >
                    Nuevo niño
                </Button>
            </Box>

            <ChildToolbar filterName={filterName} onFilterName={handleFilterName} />

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {filteredChildren.map((child) => (
                        <Grid key={child.id} size={{ xs: 12, sm: 6, md: 3 }}>
                            <ChildItem
                                child={child}
                                onEdit={handleEdit}
                                onDelete={handleDeleteChild}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}

            {!loading && filteredChildren.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 5 }}>
                    <Typography variant="h6" color="text.secondary">
                        No children found
                    </Typography>
                </Box>
            )}

            {/* Create Child Dialog */}
            <Dialog open={openCreate} onClose={() => setOpenCreate(false)}>
                <DialogTitle>Nuevo Niño</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Nombre"
                        fullWidth
                        variant="outlined"
                        value={newChildName}
                        onChange={(e) => setNewChildName(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Device ID"
                        fullWidth
                        variant="outlined"
                        value={newChildDeviceId}
                        onChange={(e) => setNewChildDeviceId(e.target.value)}
                        helperText="ID único del dispositivo del niño"
                    />
                    <Autocomplete
                        fullWidth
                        options={users}
                        getOptionLabel={(option) => `${option.full_name} (${option.email})`}
                        value={users.find(u => u.id === newTutor) || null}
                        onChange={(event, newValue) => {
                            setNewTutor(newValue?.id || null);
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                margin="dense"
                                label="Tutor"
                                placeholder="Buscar por nombre o correo"
                            />
                        )}
                        noOptionsText="No se encontraron usuarios"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenCreate(false)}>Cancelar</Button>
                    <Button onClick={handleCreateChild} variant="contained">Crear</Button>
                </DialogActions>
            </Dialog>

            {/* Edit Child Dialog */}
            <ChildEditDialog
                open={!!editChild}
                child={editChild}
                onClose={() => setEditChild(null)}
                onSave={handleUpdateChild}
            />
        </DashboardContent>
    );
}
