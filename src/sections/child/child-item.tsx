import type { ChildResponse } from 'src/api/child';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function ChildItem({
    child,
    onGenerateToken,
    onEdit
}: {
    child: ChildResponse;
    onGenerateToken: (id: string) => void;
    onEdit: (child: ChildResponse) => void;
}) {
    const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

    const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        setOpenPopover(event.currentTarget);
    }, []);

    const handleClosePopover = useCallback(() => {
        setOpenPopover(null);
    }, []);

    const handleGenerateToken = useCallback(() => {
        handleClosePopover();
        onGenerateToken(child.id);
    }, [child.id, onGenerateToken, handleClosePopover]);

    const handleEdit = useCallback(() => {
        handleClosePopover();
        onEdit(child);
    }, [child, onEdit, handleClosePopover]);

    const renderStatus = (
        <Label
            variant="inverted"
            color={(child.is_active ? 'success' : 'error')}
            sx={{
                zIndex: 9,
                top: 16,
                right: 16,
                position: 'absolute',
                textTransform: 'uppercase',
            }}
        >
            {child.is_active ? 'Active' : 'Inactive'}
        </Label>
    );

    const renderImg = (
        <Box
            component="img"
            alt={child.full_name}
            src={child.photo_url || `/assets/images/avatars/avatar_${Math.floor(Math.random() * 25) + 1}.jpg`}
            sx={{
                top: 0,
                width: 1,
                height: 1,
                objectFit: 'cover',
                position: 'absolute',
            }}
        />
    );

    return (
        <Card>
            <Box sx={{ pt: '100%', position: 'relative' }}>
                {renderStatus}
                {renderImg}
            </Box>

            <Stack spacing={2} sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Link color="inherit" underline="hover" variant="subtitle2" noWrap>
                        {child.full_name}
                    </Link>

                    <IconButton onClick={handleOpenPopover}>
                        <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                </Box>

                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {child.birth_date || 'No birth date'}
                </Typography>
            </Stack>

            <Popover
                open={!!openPopover}
                anchorEl={openPopover}
                onClose={handleClosePopover}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuItem onClick={handleGenerateToken}>
                    <Iconify icon="solar:bell-bing-bold-duotone" sx={{ mr: 2 }} />
                    Generate Token
                </MenuItem>

                <MenuItem onClick={handleEdit}>
                    <Iconify icon="solar:pen-bold" sx={{ mr: 2 }} />
                    Edit
                </MenuItem>
            </Popover>
        </Card>
    );
}
