import { QRCodeCanvas } from 'qrcode.react';
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
import DialogContentText from '@mui/material/DialogContentText';

import { DashboardContent } from 'src/layouts/dashboard';
import { userService, type UserResponse } from 'src/api/user';
import { childService, type ChildResponse } from 'src/api/child';

import { Iconify } from 'src/components/iconify';

import { useAuth } from 'src/sections/auth/auth-context';

import { ChildItem } from '../child-item';
import { ChildToolbar } from '../child-toolbar';
import { ChildEditDialog } from '../child-edit-dialog';

// ----------------------------------------------------------------------

export function ChildView() {
    const { user } = useAuth();
    const [children, setChildren] = useState<ChildResponse[]>([]);
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterName, setFilterName] = useState('');

    // Create Child Dialog State
    const [openCreate, setOpenCreate] = useState(false);
    const [newChildName, setNewChildName] = useState('');
    const [newChildDate, setNewChildDate] = useState('');
    const [newChildImage, setNewChildImage] = useState('');
    const [newUser, setNewUser] = useState('');

    // Edit Child Dialog State
    const [editChild, setEditChild] = useState<ChildResponse | null>(null);

    // Token Dialog State
    const [tokenDialog, setTokenDialog] = useState<{ open: boolean; childId: string; token: string; message: string }>({
        open: false,
        childId: '',
        token: '',
        message: '',
    });

    const fetchChildren = useCallback(async () => {
        try {
            const data = await childService.getChildren();
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
        child.full_name.toLowerCase().includes(filterName.toLowerCase())
    );

    const handleGenerateToken = async (id: string) => {
        try {
            const response = await childService.generateToken(id);
            setTokenDialog({
                open: true,
                childId: id,
                token: response.device_token,
                message: response.message,
            });
        } catch (error) {
            console.error('Failed to generate token', error);
        }
    };

    const handleCreateChild = async () => {
        if (!user) {
            console.error('User not authenticated');
            return;
        }

        try {
            await childService.createChild({
                full_name: newChildName,
                birth_date: newChildDate || undefined,
                photo_url: newChildImage || undefined,
                user_id: newUser,
            });
            setOpenCreate(false);
            setNewChildName('');
            setNewChildDate('');
            fetchChildren();
        } catch (error) {
            console.error('Failed to create child', error);
        }
    };

    const handleEdit = (child: ChildResponse) => {
        setEditChild(child);
    };

    const handleUpdateChild = async (id: string, data: any) => {
        try {
            await childService.updateChild(id, data);
            setEditChild(null);
            fetchChildren();
        } catch (error) {
            console.error('Failed to update child', error);
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
                                onGenerateToken={handleGenerateToken}
                                onEdit={handleEdit}
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
                        label="Nombre Completo"
                        fullWidth
                        variant="outlined"
                        value={newChildName}
                        onChange={(e) => setNewChildName(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Fecha de Nacimiento"
                        type="date"
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        value={newChildDate}
                        onChange={(e) => setNewChildDate(e.target.value)}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        label="URL de Foto"
                        fullWidth
                        variant="outlined"
                        value={newChildImage}
                        onChange={(e) => setNewChildImage(e.target.value)}
                    />
                    <Autocomplete
                        fullWidth
                        options={users}
                        getOptionLabel={(option) => `${option.full_name} (${option.email})`}
                        value={users.find(u => u.id === newUser) || null}
                        onChange={(event, newValue) => {
                            setNewUser(newValue?.id || '');
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

            {/* Token Dialog */}
            <Dialog
                open={tokenDialog.open}
                onClose={() => setTokenDialog({ ...tokenDialog, open: false })}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Token Generado</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        {tokenDialog.message}
                    </DialogContentText>

                    {/* Token Display */}
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Token:
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                fontFamily: 'monospace',
                                fontWeight: 'bold',
                                wordBreak: 'break-all'
                            }}
                        >
                            {tokenDialog.token}
                        </Typography>
                    </Box>

                    {/* QR Code Display */}
                    {tokenDialog.token && tokenDialog.childId && (
                        <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Código QR:
                            </Typography>
                            <Box
                                sx={{
                                    p: 2,
                                    bgcolor: 'white',
                                    borderRadius: 2,
                                    display: 'inline-block'
                                }}
                            >
                                <QRCodeCanvas
                                    value={JSON.stringify({
                                        child_id: tokenDialog.childId,
                                        token: tokenDialog.token
                                    })}
                                    size={200}
                                    level="H"
                                    includeMargin
                                />
                            </Box>
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                                Escanea este código QR para vincular el dispositivo
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setTokenDialog({ ...tokenDialog, open: false })}>Cerrar</Button>
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
