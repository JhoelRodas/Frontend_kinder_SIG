import type { Usuario, UsuarioCreate, UsuarioUpdate } from 'src/api/user';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormControlLabel from '@mui/material/FormControlLabel';

// ----------------------------------------------------------------------

type UserEditDialogProps = {
    open: boolean;
    user: Usuario | null;
    onClose: () => void;
    onCreate: (data: UsuarioCreate) => Promise<void>;
    onUpdate: (id: number, data: UsuarioUpdate) => Promise<void>;
};

export function UserEditDialog({ open, user, onClose, onCreate, onUpdate }: UserEditDialogProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [telefono, setTelefono] = useState('');
    const [esTutor, setEsTutor] = useState(false);
    const [esAdminInstitucion, setEsAdminInstitucion] = useState(false);
    const [isActive, setIsActive] = useState(true);

    const isEditing = !!user;

    useEffect(() => {
        if (user) {
            // Modo edición - cargar datos del usuario
            setUsername(user.username);
            setPassword(''); // No mostramos la contraseña actual
            setEmail(user.email);
            setFirstName(user.first_name);
            setLastName(user.last_name);
            setTelefono(user.telefono);
            setEsTutor(user.es_tutor);
            setEsAdminInstitucion(user.es_admin_institucion);
            setIsActive(user.is_active);
        } else {
            // Modo creación - limpiar campos
            setUsername('');
            setPassword('');
            setEmail('');
            setFirstName('');
            setLastName('');
            setTelefono('');
            setEsTutor(false);
            setEsAdminInstitucion(false);
            setIsActive(true);
        }
    }, [user, open]);

    const handleSave = async () => {
        if (isEditing && user) {
            // Actualizar usuario existente
            const updateData: UsuarioUpdate = {
                email,
                first_name: firstName,
                last_name: lastName,
                telefono,
                es_tutor: esTutor,
                es_admin_institucion: esAdminInstitucion,
                is_active: isActive,
            };

            // Solo incluir username y password si se modificaron
            if (username) updateData.username = username;
            if (password) updateData.password = password;

            await onUpdate(user.id, updateData);
        } else {
            // Crear nuevo usuario
            const createData: UsuarioCreate = {
                username,
                password,
                email,
                first_name: firstName,
                last_name: lastName,
                telefono,
                es_tutor: esTutor,
                es_admin_institucion: esAdminInstitucion,
                is_active: isActive,
            };

            await onCreate(createData);
        }
        onClose();
    };

    const isFormValid = () => {
        if (isEditing) {
            // En edición solo requerimos que haya algún campo
            return true;
        }
        // En creación requerimos username y password
        return username.trim() !== '' && password.trim() !== '';
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    <TextField
                        label="Username"
                        fullWidth
                        required={!isEditing}
                        variant="outlined"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        helperText={isEditing ? 'Dejar vacío para mantener el actual' : 'Requerido'}
                    />

                    <TextField
                        label="Contraseña"
                        type="password"
                        fullWidth
                        required={!isEditing}
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        helperText={isEditing ? 'Dejar vacío para mantener la actual' : 'Requerido'}
                    />

                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <TextField
                        label="Nombre"
                        fullWidth
                        variant="outlined"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />

                    <TextField
                        label="Apellido"
                        fullWidth
                        variant="outlined"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />

                    <TextField
                        label="Teléfono"
                        fullWidth
                        variant="outlined"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                    />

                    <FormControlLabel
                        control={
                            <Switch
                                checked={esTutor}
                                onChange={(e) => setEsTutor(e.target.checked)}
                            />
                        }
                        label="Es Tutor"
                    />

                    <FormControlLabel
                        control={
                            <Switch
                                checked={esAdminInstitucion}
                                onChange={(e) => setEsAdminInstitucion(e.target.checked)}
                            />
                        }
                        label="Es Admin de Institución"
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
                <Button
                    onClick={handleSave}
                    variant="contained"
                    disabled={!isFormValid()}
                >
                    {isEditing ? 'Actualizar' : 'Crear'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
