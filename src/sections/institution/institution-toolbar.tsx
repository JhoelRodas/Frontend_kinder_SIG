import type { ChangeEvent } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';

type InstitutionToolbarProps = {
  filterName: string;
  onFilterName: (event: ChangeEvent<HTMLInputElement>) => void;
  onOpenCreate: () => void;
};

export function InstitutionToolbar({ filterName, onFilterName, onOpenCreate }: InstitutionToolbarProps) {
  return (
    <Box
      sx={{
        mb: 3,
        gap: 2,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <TextField
        fullWidth
        value={filterName}
        onChange={onFilterName}
        placeholder="Buscar institución..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
        sx={{ maxWidth: 400 }}
      />

      <Button
        variant="contained"
        startIcon={<Iconify icon="mingcute:add-line" />}
        onClick={onOpenCreate}
      >
        Nueva Institución
      </Button>
    </Box>
  );
}
