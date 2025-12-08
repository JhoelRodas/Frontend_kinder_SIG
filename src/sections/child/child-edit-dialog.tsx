import type { UserResponse } from 'src/api/user';
import type { ChildResponse } from 'src/api/child';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import Autocomplete from '@mui/material/Autocomplete';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormControlLabel from '@mui/material/FormControlLabel';

import { userService } from 'src/api/user';

// ----------------------------------------------------------------------

type ChildEditDialogProps = {
    open: boolean;
    child: ChildResponse | null;
    onClose: () => void;
    onSave: (id: string, data: {
        full_name?: string;
        birth_date?: string;
        photo_url?: string;
        is_active?: boolean;
        user_id?: string;
    }) => Promise<void>;
};

export function ChildEditDialog({ open, child, onClose, onSave }: ChildEditDialogProps) {
    const [fullName, setFullName] = useState(child?.full_name || '');
    const [birthDate, setBirthDate] = useState(child?.birth_date || '');
    const [photoUrl, setPhotoUrl] = useState(child?.photo_url || '');
    const [isActive, setIsActive] = useState(child?.is_active ?? true);
    const [newUser, setNewUser] = useState(child?.user_id || '');
    const [users, setUsers] = useState<UserResponse[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await userService.getUsersLegacy();
                setUsers(data);
            } catch (error) {
                console.error('Failed to fetch users', error);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        if (child) {
            setFullName(child.full_name);
            setBirthDate(child.birth_date || '');
            setPhotoUrl(child.photo_url || '');
            setIsActive(child.is_active);
            setNewUser(child.user_id || '');
        }
    }, [child]);

    const handleSave = async () => {
        if (!child) return;

        await onSave(child.id, {
            full_name: fullName,
            birth_date: birthDate || undefined,
            photo_url: photoUrl || undefined,
            user_id: newUser || undefined,
            is_active: isActive,
        });
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Editar Niño</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    <TextField
                        label="Nombre Completo"
                        fullWidth
                        variant="outlined"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                    <TextField
                        label="Fecha de Nacimiento"
                        type="date"
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                    />
                    <TextField
                        label="URL de Foto"
                        fullWidth
                        variant="outlined"
                        value={photoUrl}
                        onChange={(e) => setPhotoUrl(e.target.value)}
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
                    <FormControlLabel
                        control={
                            <Switch
                                checked={isActive}
                                onChange={(e) => setIsActive(e.target.checked)}
                            />
                        }
                        label="Activo"
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={handleSave} variant="contained">
                    Guardar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
