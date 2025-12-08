import type { UserResponse } from 'src/api/user';
import type { InstitutionResponse } from 'src/api/institution';
import type { ChildResponse, ChildUpdate } from 'src/api/child';

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
import { institutionService } from 'src/api/institution';

// ----------------------------------------------------------------------

type ChildEditDialogProps = {
    open: boolean;
    child: ChildResponse | null;
    onClose: () => void;
    onSave: (id: number, data: ChildUpdate) => Promise<void>;
};

export function ChildEditDialog({ open, child, onClose, onSave }: ChildEditDialogProps) {
    const [nombre, setNombre] = useState(child?.nombre || '');
    const [deviceId, setDeviceId] = useState(child?.device_id || '');
    const [tutor, setTutor] = useState<string | null>(child?.tutor?.toString() || null);
    const [institucion, setInstitucion] = useState<string | null>(child?.institucion?.toString() || null);
    const [activo, setActivo] = useState(child?.activo ?? true);
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [institutions, setInstitutions] = useState<InstitutionResponse[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await userService.getUsersLegacy();
                setUsers(data);
            } catch (error) {
                console.error('Failed to fetch users', error);
            }
        };
        const fetchInstitutions = async () => {
            try {
                const data = await institutionService.getInstitutions();
                setInstitutions(data);
            } catch (error) {
                console.error('Failed to fetch institutions', error);
            }
        };
        fetchUsers();
        fetchInstitutions();
    }, []);

    useEffect(() => {
        if (child) {
            setNombre(child.nombre);
            setDeviceId(child.device_id);
            setTutor(child.tutor?.toString() || null);
            setInstitucion(child.institucion?.toString() || null);
            setActivo(child.activo);
        }
    }, [child]);

    const handleSave = async () => {
        if (!child) return;

        const updateData: ChildUpdate = {
            nombre,
            device_id: deviceId,
            tutor: tutor ? parseInt(tutor) : undefined,
            institucion: institucion ? parseInt(institucion) : undefined,
            activo,
        };

        await onSave(child.id, updateData);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Editar Niño</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    <TextField
                        label="Nombre"
                        fullWidth
                        variant="outlined"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />
                    <TextField
                        label="Device ID"
                        fullWidth
                        variant="outlined"
                        value={deviceId}
                        onChange={(e) => setDeviceId(e.target.value)}
                        helperText="ID único del dispositivo"
                    />
                    <Autocomplete
                        fullWidth
                        options={users}
                        getOptionLabel={(option) => `${option.full_name} (${option.email})`}
                        value={users.find(u => u.id === tutor) || null}
                        onChange={(event, newValue) => {
                            setTutor(newValue?.id || null);
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
                    <Autocomplete
                        fullWidth
                        options={institutions}
                        getOptionLabel={(option) => `${option.nombre}`}
                        value={institutions.find(i => String(i.id) === institucion) || null}
                        onChange={(event, newValue) => {
                            setInstitucion(newValue?.id.toString() || null);
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                margin="dense"
                                label="Institución"
                                placeholder="Seleccionar institución"
                            />
                        )}
                        noOptionsText="No se encontraron instituciones"
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={activo}
                                onChange={(e) => setActivo(e.target.checked)}
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
