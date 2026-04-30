import React, { useState, useEffect, useCallback } from "react";
import { Container, Typography, Button, Card, CardActions, CardContent, Grid, IconButton, Box, TextField, Dialog, DialogContent, DialogTitle, DialogActions, Paper, CircularProgress } from '@mui/material';
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from "@mui/icons-material/Edit";
import CategoryIcon from "@mui/icons-material/Category";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import { adminApi, commonApi } from "../../api/index";
import ConfirmModal from "../../components/ConfirmModal";

const AdminOffices = () => {
    const navigate = useNavigate();
    const [offices, setOffices] = useState([]);
    const [loading, setLoading] = useState(false);

    // Состояния для добавления офиса
    const [open, setOpen] = useState(false);
    const [newOfficeAddress, setNewOfficeAddress] = useState('');

    // Состояния для редактирования офиса
    const [editOpen, setEditOpen] = useState(false);
    const [editAddress, setEditAddress] = useState('');
    const [selectedOfficeId, setSelectedOfficeId] = useState(null);

    // Состояние для модального окна подтверждения/успеха
    const [modal, setModal] = useState({
        open: false,
        title: '',
        message: '',
        type: 'success',
        onConfirm: null
    });

    // Загрузка офисов
    const fetchOffices = useCallback(async () => {
        setLoading(true);
        try {
            const response = await commonApi.officesGet();
            const sorted = (response.data || []).sort((a, b) => a.id - b.id);
            setOffices(sorted);
        } catch {
            console.error('Ошибка при загрузке офисов');
        } finally {
            setLoading(false);
        }
    }, [])
    
    useEffect(() => { fetchOffices(); }, [fetchOffices]);

    const showModal = (title, message, type = 'success', onConfirm = null) => {
        setModal({ open: true, title, message, type, onConfirm });
    };

    // Добавление офиса
    const handleAddOffice = async () => {
        try {
            await adminApi.adminOfficesPost({ address: newOfficeAddress});
            setOpen(false);
            setNewOfficeAddress('');
            fetchOffices();
            showModal('Готово', 'Новый офис успешно добавлен', 'success');
        } catch {
            alert("Ошибка: Офис с таким адресом уже существует или данные неверны");
        }
    }

    // Редактирование офиса
    const handleOpenEdit = (office) => {
        setSelectedOfficeId(office.id);
        setEditAddress(office.address);
        setEditOpen(true);
    }

    const handleUpdateOffice = async () => {
        try {
            await adminApi.adminOfficesIdPut(selectedOfficeId, { address: editAddress });
            setEditOpen(false);
            fetchOffices();
            showModal('Обновлено', 'Адрес офиса успешно изменен', 'success');
        } catch {
            alert("Ошибка при обновлении адреса");
        }
    }

    // Удаление офиса
    const handleDeleteClick = (office) => {
        showModal(
            'Удаление офиса',
            `Вы уверены? Все категории и места в офисе "${office.address}" будут удалены навсегда.`,
            'confirm',
            () => confirmDelete(office.id)
        );
    }

    const confirmDelete = async (id) => {
        try {
            await adminApi.adminOfficesIdDelete(id);
            fetchOffices();
            showModal('Удалено', 'Офис полностью удален из системы', 'success');
        } catch {
            console.error('Ошибка при удалении офиса');
        }
    }

    const closeModal = () => setModal(prev => ({ ...prev, open: false }));

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h5" fontWeight="700" color="text.primary">Управление офисами</Typography>
                <Button 
                    variant="contained" 
                    startIcon={<AddIcon />} 
                    onClick={() => setOpen(true)}
                >
                    Добавить офис
                </Button>
            </Box>

            {loading ? (
                <Box display="flex" justifyContent="center" my={5}><CircularProgress /></Box>
            ) : offices.length === 0 ? (
                <Paper 
                    sx={{ 
                        p: 5, 
                        textAlign: 'center', 
                        borderRadius: 4, 
                        bgcolor: '#f8f9fa', 
                        border: '1px dashed #e0e0e0',
                        mt: 4,
                        boxShadow: 'none'
                    }}
                >
                    <Typography variant="h6" fontWeight="600" color="text.secondary" gutterBottom>
                        Список офисов пуст
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
                        В систему еще не добавили ни одного офиса. Нажмите кнопку выше, чтобы создать.
                    </Typography>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {offices.map((office) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={office.id}>
                            <Card 
                                variant="outlined"
                                sx={{ 
                                    borderRadius: 3,
                                    height: '100%', 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    transition: '0.3s',
                                    '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }
                                }}
                            >
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                        <Typography 
                                            variant="h6"
                                            gutterBottom 
                                            sx={{ lineHeight: 1.2, mr: 1, wordBreak: 'break-word', flexGrow: 1, fontWeight: 600 }}
                                        >
                                            {office.address}
                                        </Typography>

                                        <IconButton 
                                            size="small" 
                                            color="primary" 
                                            onClick={() => handleOpenEdit(office)}
                                            sx={{ mt: -0.5, mr: -0.5 }}
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                    </Box>

                                    <Typography variant="body2" color="text.secondary">
                                        ID офиса: {office.id}
                                    </Typography>
                                </CardContent>

                                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2, flexWrap: 'wrap', gap: 1 }}>
                                    <Box display="flex" gap={1} flexWrap="wrap">
                                        <Button 
                                            size="small" 
                                            variant="outlined" 
                                            color="primary" 
                                            startIcon={<CategoryIcon />}
                                            onClick={() => navigate(`/admin/offices/${office.id}/categories`, { 
                                                state: { officeAddress: office.address } 
                                            })}
                                            sx={{ textTransform: 'none', borderRadius: 2 }}
                                        >
                                            Категории
                                        </Button>
                                        
                                        <Button 
                                            size="small" 
                                            variant="outlined" 
                                            color="secondary" 
                                            startIcon={<DirectionsCarIcon />}
                                            onClick={() => navigate(`/admin/offices/${office.id}/spots`)}
                                            sx={{ textTransform: 'none', borderRadius: 2 }}
                                        >
                                            Места
                                        </Button>
                                    </Box>

                                    <IconButton color="error" onClick={() => handleDeleteClick(office)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Модальное окно добавления */}
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
                <DialogTitle sx={{ fontWeight: 800 }}>Новый офис</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Адрес офиса"
                        fullWidth
                        variant="outlined"
                        value={newOfficeAddress}
                        onChange={(e) => setNewOfficeAddress(e.target.value)}
                        sx={{ mt: 1 }}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpen(false)}>Отмена</Button>
                    <Button onClick={handleAddOffice} variant="contained" disabled={!newOfficeAddress.trim()}>
                        Создать
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Модальное окно редактирования */}
            <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="xs">
                <DialogTitle sx={{ fontWeight: 800 }}>Редактировать адрес</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Новый адрес"
                        fullWidth
                        variant="outlined"
                        value={editAddress}
                        onChange={(e) => setEditAddress(e.target.value)}
                        sx={{ mt: 1 }}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setEditOpen(false)}>Отмена</Button>
                    <Button 
                        onClick={handleUpdateOffice} 
                        variant="contained"
                        disabled={!editAddress || editAddress.trim() === ''}
                    >
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Модальное окно подтверждения/успеха */}
            <ConfirmModal 
                open={modal.open}
                onClose={closeModal}
                onConfirm={modal.onConfirm}
                title={modal.title}
                message={modal.message}
                type={modal.type}
                confirmText={modal.type === 'confirm' ? "Да, удалить" : "Понятно"}
            />
        </Container>
    )
}

export default AdminOffices