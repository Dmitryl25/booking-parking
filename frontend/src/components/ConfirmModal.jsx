import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const ConfirmModal = ({
    open,
    onClose,
    onConfirm,
    title,
    message,
    type = 'success', // 'success', 'error', 'warning', 'confirm'
    confirmText = 'Подтвердить',
    cancelText = 'Отмена'
}) => {
    const getIcon = () => {
        switch(type) {
            case 'success': return <CheckCircleOutlineIcon sx={{ fontSize: 60, color: 'success.main' }} />;
            case 'error': return <ErrorOutlineIcon sx={{ fontSize: 60, color: 'error.main' }} />;
            case 'confirm': return <HelpOutlineIcon sx={{ fontSize: 60, color: 'primary.main' }} />;
            default: return <CheckCircleOutlineIcon sx={{ fontSize: 60, color: 'success.main' }} />;
        }
    }

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            fullWidth
            maxWidth="xs"
        >
            <DialogContent sx={{ textAlign: 'center', pt: 4 }}>
                <Box sx={{ mb: 2 }}>
                    {getIcon()}
                </Box>
                <Typography variant="h5" fontWeight="800" gutterBottom>
                    {title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {message}
                </Typography>
            </DialogContent>

            <DialogActions sx={{ justifyContent: 'center', pb: 3, px: 3, gap: 1 }}>
                {type === 'confirm' && (
                    <Button 
                        onClick={onClose} 
                        variant="outlined" 
                        fullWidth
                    >
                        {cancelText}
                    </Button>
                )}
                
                <Button 
                    onClick={() => {
                        if (onConfirm) onConfirm();
                        onClose();
                    }} 
                    variant="contained" 
                    color={type === 'error' || title.toLowerCase().includes('удалить') ? 'error' : 'primary'}
                    fullWidth
                >
                    {type === 'confirm' ? confirmText : 'Понятно'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmModal