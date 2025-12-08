import { useCallback, useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import Autocomplete from '@mui/material/Autocomplete';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

import { DashboardContent } from 'src/layouts/dashboard';
import { userService, type UserResponse } from 'src/api/user';
import { childService, type ChildResponse } from 'src/api/child';
import { institutionService, type InstitutionResponse } from 'src/api/institution';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import { ChildToolbar } from '../child-toolbar';
import { ChildEditDialog } from '../child-edit-dialog';


// ----------------------------------------------------------------------

export function ChildView() {
    const [children, setChildren] = useState<ChildResponse[]>([]);
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [institutions, setInstitutions] = useState<InstitutionResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterName, setFilterName] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Create Child Dialog State
    const [openCreate, setOpenCreate] = useState(false);
    const [newChildName, setNewChildName] = useState('');
    const [newChildDeviceId, setNewChildDeviceId] = useState('');
    const [newTutor, setNewTutor] = useState<string | null>(null);
    const [newInstitucion, setNewInstitucion] = useState<string | null>(null);

    // Edit Child Dialog State
    const [editChild, setEditChild] = useState<ChildResponse | null>(null);

    const fetchChildren = useCallback(async () => {
        try {
            const data = await childService.getNinos();
            setChildren(data);
            console.log('Children loaded:', data);
        } catch (error) {
            console.error('Failed to fetch children', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchUsers = useCallback(async () => {
        try {
            const data = await userService.getUsersLegacy();
            setUsers(data);
            console.log('Users loaded:', data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        }
    }, []);

    const fetchInstitutions = useCallback(async () => {
        try {
            const data = await institutionService.getInstitutions();
            setInstitutions(data);
            console.log('Institutions loaded:', JSON.stringify(data, null, 2));
            console.log('Total institutions:', data.length);
            data.forEach((inst, idx) => console.log(`Institution ${idx}:`, inst.id, inst.nombre));
        } catch (error) {
            console.error('Failed to fetch institutions', error);
        }
    }, []);

    useEffect(() => {
        fetchChildren();
        fetchUsers();
        fetchInstitutions();
    }, [fetchChildren, fetchUsers, fetchInstitutions]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterName(event.target.value);
    };

    const handleCreateChild = async () => {
        if (!newChildName || !newChildDeviceId || !newTutor || !newInstitucion) {
            console.error('Todos los campos son requeridos');
            return;
        }

        try {
            await childService.createNino({
                nombre: newChildName,
                device_id: newChildDeviceId,
                tutor: parseInt(newTutor),
                institucion: parseInt(newInstitucion),
            });
            setOpenCreate(false);
            setNewChildName('');
            setNewChildDeviceId('');
            setNewTutor(null);
            setNewInstitucion(null);
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

    const filteredChildren = children.filter((child) =>
        child.nombre.toLowerCase().includes(filterName.toLowerCase())
    );

    const paginatedChildren = filteredChildren.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <DashboardContent>
            <Box
                sx={{
                    mb: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                        Niños
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Total: {filteredChildren.length} niños
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Iconify icon="mingcute:add-line" />}
                    onClick={() => setOpenCreate(true)}
                    sx={{ px: 3 }}
                >
                    Nuevo niño
                </Button>
            </Box>

            <ChildToolbar filterName={filterName} onFilterName={handleFilterName} />

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                    <CircularProgress />
                </Box>
            ) : filteredChildren.length === 0 ? (
                <Card sx={{ p: 5, textAlign: 'center' }}>
                    <Iconify icon="solar:cart-3-bold" sx={{ fontSize: 48, mb: 2, color: 'text.secondary', opacity: 0.5 }} />
                    <Typography variant="h6" color="text.secondary">
                        No hay niños registrados
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Crea el primer niño haciendo clic en &quot;Nuevo niño&quot;
                    </Typography>
                </Card>
            ) : (
                <Card sx={{ boxShadow: 'none', border: '1px solid #f0f0f0' }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ 
                                    backgroundColor: '#f9fafb',
                                    borderBottom: '2px solid #e0e0e0'
                                }}>
                                    <TableCell sx={{ fontWeight: 700, fontSize: '0.95rem' }}>Nombre</TableCell>
                                    <TableCell sx={{ fontWeight: 700, fontSize: '0.95rem' }}>Device ID</TableCell>
                                    <TableCell sx={{ fontWeight: 700, fontSize: '0.95rem' }}>Tutor</TableCell>
                                    <TableCell sx={{ fontWeight: 700, fontSize: '0.95rem' }}>Institución</TableCell>
                                    <TableCell sx={{ fontWeight: 700, fontSize: '0.95rem' }}>Estado</TableCell>
                                    <TableCell sx={{ fontWeight: 700, fontSize: '0.95rem', textAlign: 'center' }}>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedChildren.map((child) => (
                                    <TableRow 
                                        key={child.id} 
                                        hover 
                                        sx={{ 
                                            '&:last-child td': { borderBottom: 0 },
                                            '&:hover': { backgroundColor: '#f9fafb' }
                                        }}
                                    >
                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                {child.nombre}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
                                                {child.device_id}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {users.find(u => Number(u.id) === Number(child.tutor))?.full_name || child.tutor || 'N/A'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {(() => {
                                                    const inst = institutions.find(i => {
                                                        // Comparar como números primero
                                                        if (Number(i.id) === Number(child.institucion)) return true;
                                                        // Si no, comparar como strings
                                                        if (String(i.id) === String(child.institucion)) return true;
                                                        return false;
                                                    });
                                                    return inst?.nombre || child.institucion || 'N/A';
                                                })()}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Label
                                                variant="soft"
                                                color={child.activo ? 'success' : 'error'}
                                                sx={{ fontSize: '0.75rem' }}
                                            >
                                                {child.activo ? 'Activo' : 'Inactivo'}
                                            </Label>
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleEdit(child)}
                                                title="Editar"
                                                sx={{ color: 'info.main' }}
                                            >
                                                <Iconify icon="solar:pen-bold" width={18} />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDeleteChild(child.id)}
                                                title="Eliminar"
                                                sx={{ color: 'error.main' }}
                                            >
                                                <Iconify icon="solar:trash-bin-trash-bold" width={18} />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={filteredChildren.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage="Filas por página"
                    />
                </Card>
            )}

            {!loading && filteredChildren.length === 0 && (
                <Card sx={{ textAlign: 'center', py: 5 }}>
                    <Typography variant="h6" color="text.secondary">
                        No hay niños registrados
                    </Typography>
                </Card>
            )}

            {/* Create Child Dialog */}
            <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Nuevo Niño</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <TextField
                            autoFocus
                            label="Nombre"
                            fullWidth
                            variant="outlined"
                            value={newChildName}
                            onChange={(e) => setNewChildName(e.target.value)}
                        />
                        <TextField
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
                                    label="Tutor"
                                    placeholder="Buscar por nombre o correo"
                                />
                            )}
                            noOptionsText="No se encontraron usuarios"
                        />
                        <Autocomplete
                            fullWidth
                            options={institutions}
                            getOptionLabel={(option) => `${option.nombre}`}
                            value={institutions.find(i => String(i.id) === newInstitucion) || null}
                            onChange={(event, newValue) => {
                                setNewInstitucion(newValue?.id.toString() || null);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Institución"
                                    placeholder="Seleccionar institución"
                                />
                            )}
                            noOptionsText="No se encontraron instituciones"
                        />
                    </Box>
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
