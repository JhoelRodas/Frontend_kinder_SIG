import type { InstitutionResponse } from 'src/api/institution';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';

import { Iconify } from 'src/components/iconify';

type InstitutionItemProps = {
  institution: InstitutionResponse;
  onEdit: (institution: InstitutionResponse) => void;
  onDelete: (id: string) => void;
  onView: (institution: InstitutionResponse) => void;
};

export function InstitutionItem({ institution, onEdit, onDelete, onView }: InstitutionItemProps) {
  return (
    <Card>
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="h6" noWrap>
            {institution.nombre}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Iconify icon="solar:home-angle-bold-duotone" width={18} />
            <Typography variant="body2" color="text.secondary" noWrap>
              {institution.direccion}
            </Typography>
          </Stack>
          {institution.area?.coordinates?.[0] && (
            <Stack direction="row" spacing={1} alignItems="center">
              <Iconify icon="solar:shield-keyhole-bold-duotone" width={18} />
              <Typography variant="caption" color="text.secondary">
                {institution.area.coordinates[0].length} puntos en el área
              </Typography>
            </Stack>
          )}
        </Stack>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Button
          size="small"
          startIcon={<Iconify icon="solar:eye-bold" />}
          onClick={() => onView(institution)}
        >
          Ver Mapa
        </Button>
        <Stack direction="row" spacing={1}>
          <IconButton size="small" onClick={() => onEdit(institution)}>
            <Iconify icon="solar:pen-bold" width={20} />
          </IconButton>
          <IconButton size="small" color="error" onClick={() => onDelete(institution.id)}>
            <Iconify icon="solar:trash-bin-trash-bold" width={20} />
          </IconButton>
        </Stack>
      </CardActions>
    </Card>
  );
}
