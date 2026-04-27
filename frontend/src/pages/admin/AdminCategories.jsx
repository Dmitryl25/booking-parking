import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Container, Typography, Button, Card, CardActions, CardContent, Grid, IconButton, Box, TextField, Dialog, DialogContent, DialogTitle, DialogActions, Divider, Paper, CircularProgress } from '@mui/material';
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { adminApi, commonApi } from "../../api/index";

const AdminCategories = () => {
    const { officeId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const [officeAddress, setOfficeAddress] = useState(location.state?.officeAddress || '');
    const fetchOfficeInfo = useCallback(async () => {
        if (!officeAddress) {
        try {
            const res = await commonApi.officesGet();
            const currentOffice = res.data.find(o => o.id === parseInt(officeId));
            if (currentOffice) {
                setOfficeAddress(currentOffice.address);
            }
        } catch (err) {
            console.error("Не удалось подгрузить адрес офиса", err);
        }
        }
    }, [officeId, officeAddress]);

    // Состояния для модального окна добавления
    const [addOpen, setAddOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', count: '', spots: '' });

    // Состояния для модального окна редактирования
    const [editOpen, setEditOpen] = useState(false);
    const [editData, setEditData] = useState({ id: null, name: '' });

    // Получение категорий
    const fetchCategories = useCallback(async () => {
        setLoading(true);
        try {
            const response = await commonApi.officesOfficeIdCategoriesGet(officeId);
            setCategories(response.data || []);
        } catch (err) {
            console.error("Ошибка при загрузке категорий", err);
        } finally {
            setLoading(false);
        }
    }, [officeId]);

    useEffect(() => {
        fetchOfficeInfo();
        fetchCategories();
    }, [fetchOfficeInfo, fetchCategories])

    // Валидация названий парковочных мест
    const getSpotsArray = (str) => str.trim().split(/\s+/).filter(s => s.length > 0);

    // Добавление категории
    const handleAddCategory = async () => {
        const spotsArray = getSpotsArray(formData.spots);

        if (spotsArray.length !== parseInt(formData.count)) {
            alert(`Ошибка: Вы указали количество ${formData.count}, но ввели ${spotsArray.length} названий мест.`);
            return;
        }

        try {
            await adminApi.adminOfficesOfficeIdCategoriesPost(officeId, {
                name: formData.name,
                spotsName: formData.spots.trim(),
                spot_count: parseInt(formData.count)
            });

            setAddOpen(false);
            setFormData({ name: '', count: '', spots: '' });
            fetchCategories();
        } catch {
            alert("Ошибка при создании категории. Возможно, такая категория уже есть.");
        }
    }

    // Редактирование названия категории
    const handleEditCategory = async () => {
        try {
            await adminApi.adminOfficesOfficeIdCategoriesIdPut(officeId, editData.id, { name: editData.name });
            setEditOpen(false);
            fetchCategories();
        } catch {
            alert("Ошибка при обновлении названия");
        }
    }

    // Удаление категории
    const handleDeleteCategory = async (id) => {
        if (window.confirm("Внимание! Вместе с категорией удалятся ВСЕ закрепленные за ней места. Продолжить?")) {
            try {
                await adminApi.adminOfficesOfficeIdCategoriesIdDelete(officeId, id);
                fetchCategories();
            } catch (err) {
                console.error(err);
            }
        }
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Button 
                startIcon={<ArrowBackIcon />} 
                onClick={() => navigate('/admin/offices')}
                sx={{ mb: 2 }}
            >
                Назад
            </Button>

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h5" fontWeight="700" color="text.primary" noWrap sx={{ flexShrink: 1 }}>
                    Категории офиса {officeAddress || `Загрузка офиса #${officeId}...`}
                </Typography>
                <Button 
                    variant="contained" 
                    startIcon={<AddIcon />} 
                    onClick={() => setAddOpen(true)}
                >
                    Добавить категорию
                </Button>
            </Box>

            {loading ? (
                <Box display="flex" justifyContent="center" my={5}><CircularProgress /></Box>
            ) : categories.length === 0 ? (
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
                        Список категорий пуст
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
                        В этом офисе еще нет категорий парковок. Добавьте категорию и её парковочные места.
                    </Typography>
                </Paper>
            ) : (
                <Grid container spacing={3} sx={{ width: '100%', margin: 0 }}> 
                    {categories.map((cat) => (
                        <Grid 
                            item 
                            xs={12} 
                            sm={6} 
                            md={4} 
                            key={cat.id} 
                            sx={{ 
                                display: 'flex',
                                flexBasis: { xs: '100%', sm: '50%', md: '33.33%' },
                                maxWidth: { xs: '100%', sm: '50%', md: '33.33%' }
                            }}
                        >
                            <Card sx={{ 
                                width: '100%',
                                display: 'flex', 
                                flexDirection: 'column', 
                                borderRadius: 3, 
                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                border: '1px solid #f0f0f0'
                            }}>
                                <CardContent sx={{ 
                                    flexGrow: 1, 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                }}>
                                    <Typography 
                                        variant="h6" 
                                        fontWeight="700" 
                                        textAlign="left"
                                        sx={{
                                            wordBreak: 'break-word',
                                            hyphens: 'auto',
                                            width: '100%'
                                        }}
                                    >
                                        {cat.name}
                                    </Typography>
                                </CardContent>

                                <Divider />
                                
                                <CardActions sx={{ justifyContent: 'center', p: 1.5 }}>
                                    <Button 
                                        size="small" 
                                        variant="text"
                                        color="warning" 
                                        startIcon={<EditIcon />}
                                        onClick={() => {
                                            setEditData({ id: cat.id, name: cat.name });
                                            setEditOpen(true);
                                        }}
                                        sx={{ textTransform: 'none', fontWeight: 600 }}
                                    >
                                        Изменить
                                    </Button>
                                    <Button 
                                        size="small" 
                                        variant="text"
                                        color="error" 
                                        startIcon={<DeleteIcon />}
                                        onClick={() => handleDeleteCategory(cat.id)}
                                        sx={{ textTransform: 'none', fontWeight: 600 }}
                                    >
                                        Удалить
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Модальное окно добавления */}
            <Dialog open={addOpen} onClose={() => setAddOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Новая категория для {officeAddress}</DialogTitle>
                <DialogContent dividers>
                    <TextField
                        label="Название"
                        fullWidth margin="normal"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                    <TextField
                        label="Количество мест"
                        type="number"
                        fullWidth margin="normal"
                        value={formData.count}
                        onChange={(e) => setFormData({...formData, count: e.target.value})}
                    />
                    <TextField
                        label="Список номеров мест (через пробел)"
                        multiline rows={4}
                        fullWidth margin="normal"
                        placeholder="А1 А2 А3..."
                        value={formData.spots}
                        onChange={(e) => setFormData({...formData, spots: e.target.value})}
                        helperText={`Введите ровно ${formData.count || 0} названий через пробел.`}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setAddOpen(false)}>Отмена</Button>
                    <Button variant="contained" onClick={handleAddCategory}>Создать</Button>
                </DialogActions>
            </Dialog>

            {/* Модальное окно редактирования */}
            <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="xs">
                <DialogTitle>Редактировать категорию</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Новое название"
                        fullWidth margin="normal"
                        value={editData.name}
                        onChange={(e) => setEditData({...editData, name: e.target.value})}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setEditOpen(false)}>Отмена</Button>
                    <Button variant="contained" color="warning" onClick={handleEditCategory}>
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}

export default AdminCategories