import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Container, Typography, Button, Card, CardActions, CardContent, Grid, IconButton, Box, TextField, Dialog, DialogContent, DialogTitle, DialogActions, Divider, Paper, CircularProgress } from '@mui/material';
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { adminApi, commonApi } from "../../api/index";
import ConfirmModal from "../../components/ConfirmModal";

const AdminCategories = () => {
    const { officeId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    // Информация по офису, в котором идет работа
    const [officeAddress, setOfficeAddress] = useState(location.state?.officeAddress || '');
    const fetchOfficeInfo = useCallback(async () => {
        if (!officeAddress) {
        try {
            const response = await commonApi.officesGet();
            const currentOffice = response.data.find(o => o.id === parseInt(officeId));
            if (currentOffice) setOfficeAddress(currentOffice.address);
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

    // Состояние для модального окна подтверждения/успеха
    const [modal, setModal] = useState({
        open: false,
        title: '',
        message: '',
        type: 'success',
        onConfirm: null
    });

    const showModal = (title, message, type = 'success', onConfirm = null) => {
        setModal({ open: true, title, message, type, onConfirm });
    };

    // Получение категорий
    const fetchCategories = useCallback(async () => {
        setLoading(true);
        try {
            const response = await commonApi.officesOfficeIdCategoriesGet(officeId);
            const sorted = (response.data || []).sort((a, b) => a.id - b.id);
            setCategories(sorted);
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
            showModal(
                'Ошибка валидации', 
                `Вы указали количество ${formData.count}, но ввели ${spotsArray.length} названий мест.`, 
                'error'
            );
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
            showModal('Успешно', 'Категория и места созданы', 'success');
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
            showModal('Обновлено', 'Название категории успешно изменено', 'success');
        } catch {
            alert("Ошибка при обновлении названия");
        }
    }

    // Удаление категории
    const handleDeleteClick = (cat) => {
        showModal(
            'Удаление категории',
            `Внимание! Удаление категории "${cat.name}" приведет к удалению ВСЕХ связанных с ней мест. Продолжить?`,
            'confirm',
            () => confirmDelete(cat.id)
        );
    }

    const confirmDelete = async (id) => {
        try {
            await adminApi.adminOfficesOfficeIdCategoriesIdDelete(officeId, id);
            fetchCategories();
            showModal('Удалено', 'Категория и места успешно удалены', 'success');
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Button 
                startIcon={<ArrowBackIcon />} 
                onClick={() => navigate('/admin/offices')}
                sx={{ mb: 2, textTransform: 'none', color: 'text.secondary' }}
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
                <Grid container spacing={3}> 
                    {categories.map((cat) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={cat.id}>
                            <Card sx={{
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
                                        onClick={() => handleDeleteClick(cat)}
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
                <DialogTitle sx={{ fontWeight: 800 }}>Новая категория для {officeAddress}</DialogTitle>
                <DialogContent>
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
                    <Button variant="contained" onClick={handleAddCategory} disabled={!formData.name || !formData.count || !formData.spots}>Создать</Button>
                </DialogActions>
            </Dialog>

            {/* Модальное окно редактирования */}
            <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="xs">
                <DialogTitle sx={{ fontWeight: 800 }}>Редактировать категорию</DialogTitle>
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
                    <Button variant="contained" onClick={handleEditCategory} disabled={!editData.name.trim()}>
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Модальное окно подтверждения/успеха */}
            <ConfirmModal 
                open={modal.open}
                onClose={() => setModal({ ...modal, open: false })}
                onConfirm={modal.onConfirm}
                title={modal.title}
                message={modal.message}
                type={modal.type}
                confirmText={modal.type === 'confirm' ? "Да, удалить" : "Понятно"}
            />
        </Container>
    )
}

export default AdminCategories