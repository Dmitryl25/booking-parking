import React, { useState, useEffect, useCallback } from "react";
import { Container, Typography, Button, Card, CardActions, CardContent, Grid, IconButton, Box, TextField, Dialog, DialogContent, DialogTitle, DialogActions } from '@mui/material';
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from "@mui/icons-material/Edit";
import CategoryIcon from "@mui/icons-material/Category";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import { adminApi, commonApi } from "../../api/index";

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

    // Загрузка офисов
    const fetchOffices = useCallback(async () => {
        setLoading(true);
        try {
            const response = await commonApi.officesGet();
            setOffices(response.data || []);
        } catch {
            console.error('Ошибка при загрузке офисов');
        } finally {
            setLoading(false);
        }
    }, [])
    
    useEffect(() => { fetchOffices(); }, [fetchOffices]);

    // Добавление офиса
    const handleAddOffice = async () => {
        try {
            await adminApi.adminOfficesPost({ address: newOfficeAddress});
            setOpen(false);
            setNewOfficeAddress('');
            await fetchOffices();
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
            await fetchOffices();
        } catch {
            alert("Ошибка при обновлении адреса");
        }
    }

    // Удаление офиса
    const handleDeleteOffice = async (id) => {
        if (window.confirm("Вы уверены, что хотите удалить офис? Все связанные категории и места будут удалены!")) {
            try {
                await adminApi.adminOfficesIdDelete(id);
                await fetchOffices();
            } catch {
                console.error('Ошибка при удалении офиса');
            }
        }
    }

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

            {offices.length === 0 && !loading && (
                <Typography variant="body1" color="text.secondary" textAlign="center" mt={10}>
                    Список офисов пуст. Добавьте первый офис!
                </Typography>
            )}

            <Grid container spacing={3}>
                {offices.map((office) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={office.id}>
                        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', height: '100%', display: 'flex', flexDirection: 'column' }}>
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
                                        color="warning" 
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

                                <IconButton color="error" onClick={() => handleDeleteOffice(office.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Модальное окно добавления */}
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
                <DialogTitle>Новый офис</DialogTitle>
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
                    <Button onClick={handleAddOffice} variant="contained" disabled={!newOfficeAddress}>
                        Создать
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Модальное окно редактирования */}
            <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="xs">
                <DialogTitle>Редактировать адрес</DialogTitle>
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
                        color="warning"
                        disabled={!editAddress || editAddress.trim() === ''}
                    >
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}

export default AdminOffices