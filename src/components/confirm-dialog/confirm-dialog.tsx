import type { ReactNode } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

// ----------------------------------------------------------------------

export type ConfirmDialogProps = {
  open: boolean;
  title?: string;
  content?: ReactNode;
  action?: ReactNode;
  onClose: () => void;
};

export function ConfirmDialog({
  open,
  title = '¿Estás seguro?',
  content,
  action,
  onClose
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ pb: 2 }}>{title}</DialogTitle>

      {content && <DialogContent sx={{ typography: 'body2' }}>{content}</DialogContent>}

      <DialogActions>
        {action || (
          <>
            <Button variant="outlined" color="inherit" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="contained" color="error" onClick={onClose}>
              Eliminar
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
