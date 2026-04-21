import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Container, Typography, Button, Grid, Card, CardContent, Box, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Divider, MenuItem, Stack, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import { adminApi, commonApi } from "../../api/index";

const AdminSpots = () => {
    const { officeId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [officeAddress, setOfficeAddress] = useState(location.state?.officeAddress || '');
    const [groupedSpots, setGroupedSpots] = useState({}); 
    const [loading, setLoading] = useState(false);

    // Состояния для добавления парковочного места
    const [addOpen, setAddOpen] = useState(false);
    const [allCategories, setAllCategories] = useState([]); // Список категорий для Select
    const [newData, setNewData] = useState({ number: '', categoryId: '' });

    // Состояния для модального окна блокировки
    const [blockOpen, setBlockOpen] = useState(false);
    const [selectedSpot, setSelectedSpot] = useState(null);
    const [blockData, setBlockData] = useState({
        date: new Date().toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '18:00'
    });
    const minDateStr = new Date().toISOString().split('T')[0];

    // Получение парковочных мест
    const fetchSpots = useCallback(async () => {
        setLoading(true);
        try {
            // Получаем адрес офиса, если его нет в state
            if (!officeAddress) {
                const offRes = await commonApi.officesGet();
                const current = offRes.data.find(o => o.id === parseInt(officeId));
                if (current) setOfficeAddress(current.address);
            }

            // Получение всех категорий офиса
            const catRes = await commonApi.officesOfficeIdCategoriesGet(parseInt(officeId));
            setAllCategories(catRes.data || []);

            // Получение всех мест офиса
            const response = await adminApi.adminOfficesOfficeIdParkingSpotsGet(parseInt(officeId));
            const allSpots = response.data || [];

            // Группировка мест по категориям
            const groups = allSpots.reduce((acc, spot) => {
                const catName = spot.category;
                if (!acc[catName]) acc[catName] = [];
                acc[catName].push(spot);
                return acc;
            }, {});

            setGroupedSpots(groups);
        } catch (err) {
            console.error("Ошибка при загрузке мест:", err);
        } finally {
            setLoading(false);
        }
    }, [officeId, officeAddress]);

    useEffect(() => { fetchSpots(); }, [fetchSpots]);

    // Добавление парковочного места
    const handleAddSpot = async () => {
        if (!newData.number || !newData.categoryId) {
            alert("Заполните все поля");
            return;
        }
        try {
            await adminApi.adminParkingSpotsPost({
                number: newData.number,
                categoryId: parseInt(newData.categoryId),
                officeId: parseInt(officeId)
            });
            setAddOpen(false);
            setNewData({ number: '', categoryId: '' });
            fetchSpots();
        } catch {
            alert("Ошибка при создании места. Возможно, такой номер уже есть.");
        }
    };

    // Удаление парковочного места
    const handleDeleteSpot = async (spot) => {
        const category = allCategories.find(c => c.name === spot.category);
        const categoryId = category ? category.id : null;

        if (!categoryId) {
            alert("Не удалось определить ID категории");
            return;
        }

        if (window.confirm(`Вы действительно хотите удалить место ${spot.number}?`)) {
            try {
                await adminApi.adminParkingSpotsDeletePost({
                    number: spot.number,
                    categoryId: parseInt(categoryId),
                    officeId: parseInt(officeId)
                });
                fetchSpots();
            } catch {
                alert("Ошибка при удалении места");
            }
        }
    };

    // Блокирование парковочного места
    const handleForceBlock = async () => {
        const start = new Date(`${blockData.date}T${blockData.startTime}:00`);
        const end = new Date(`${blockData.date}T${blockData.endTime}:00`);

        const startISO = start.toISOString();
        const endISO = end.toISOString();

        if (start >= end) {
            alert("Время конца не может быть раньше или равно времени начала");
            return;
        }

        const category = allCategories.find(c => c.name === selectedSpot.category);
        const categoryId = category ? category.id : null;

        if (!categoryId) {
            alert("Не удалось определить ID категории");
            return;
        }

        try {
            const payload = {
                officeId: parseInt(officeId),
                categoryId: parseInt(categoryId),
                number: selectedSpot.number,
                startTime: startISO,
                endTime: endISO
            };

            await adminApi.adminBookingsForcePost(payload);
            setBlockOpen(false);
            alert(`Место ${selectedSpot.number} успешно заблокировано`);
            fetchSpots();
        } catch {
            alert("Ошибка при блокировке. Возможно, данные некорректны.");
        }
    };

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
                <Typography variant="h5" fontWeight="700">
                    Парковочные места {officeAddress}
                </Typography>
                <Button 
                    variant="contained" 
                    startIcon={<AddIcon />}
                    onClick={() => setAddOpen(true)}
                >
                    Добавить место
                </Button>
            </Box>

            {loading ? (
                <Box display="flex" justifyContent="center" my={5}><CircularProgress /></Box>
            ) : (
                Object.keys(groupedSpots).map((categoryName) => (
                    <Box key={categoryName} sx={{ mb: 5 }}>
                        <Typography variant="h6" fontWeight="700" color="primary" gutterBottom>
                            {categoryName}
                        </Typography>
                        <Divider sx={{ mb: 3 }} />
                        
                        <Grid container spacing={2}>
                            {groupedSpots[categoryName].map((spot) => (
                                <Grid item xs={6} sm={4} md={2.4} key={spot.number} sx={{ display: 'flex' }}>
                                    <Card sx={{ 
                                        width: '100%',
                                        borderRadius: 3, 
                                        border: '1px solid #eee',
                                        boxShadow: 'none',
                                        backgroundColor: spot.available === false ? '#fff4f4' : '#fff',
                                        transition: '0.3s',
                                        '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }
                                    }}>
                                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                            <Typography variant="h5" fontWeight="800">
                                                {spot.number}
                                            </Typography>
                                        </CardContent>
                                        
                                        <Divider />
                                        
                                        <Box display="flex" justifyContent="space-around" p={1}>
                                            <IconButton 
                                                size="small" 
                                                color="primary"
                                                onClick={() => {
                                                setSelectedSpot(spot);
                                                setBlockOpen(true);
                                                }}
                                                title="Заблокировать"
                                            >
                                                <BlockIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton 
                                                size="small" 
                                                color="error"
                                                onClick={() => handleDeleteSpot(spot)}
                                                title="Удалить"
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                ))
            )}

            {/* Модалка добавления места */}
            <Dialog open={addOpen} onClose={() => setAddOpen(false)} fullWidth maxWidth="xs">
                <DialogTitle sx={{ fontWeight: 800 }}>Новое парковочное место</DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <TextField
                            select
                            label="Категория"
                            fullWidth
                            value={newData.categoryId}
                            onChange={(e) => setNewData({ ...newData, categoryId: e.target.value })}
                        >
                            {allCategories.map((cat) => (
                                <MenuItem key={cat.id} value={cat.id}>
                                    {cat.name}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            label="Номер места"
                            fullWidth
                            placeholder="Например, A1"
                            value={newData.number}
                            onChange={(e) => setNewData({ ...newData, number: e.target.value })}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setAddOpen(false)}>Отмена</Button>
                    <Button variant="contained" onClick={handleAddSpot}>
                        Создать
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Модальное окно блокировки */}
            <Dialog open={blockOpen} onClose={() => setBlockOpen(false)} fullWidth maxWidth="xs">
                <DialogTitle sx={{ fontWeight: 800 }}>Блокировка места {selectedSpot?.number}</DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <TextField
                            label="Дата блокировки"
                            type="date"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ min: minDateStr }}
                            value={blockData.date}
                            onChange={(e) => setBlockData({ ...blockData, date: e.target.value })}
                        />
                        
                        <Box display="flex" gap={2}>
                            <TextField
                                label="Время начала"
                                type="time"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                value={blockData.startTime}
                                onChange={(e) => setBlockData({ ...blockData, startTime: e.target.value })}
                            />

                            <TextField
                                label="Время окончания"
                                type="time"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                value={blockData.endTime}
                                onChange={(e) => setBlockData({ ...blockData, endTime: e.target.value })}
                            />
                        </Box>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setBlockOpen(false)}>Отмена</Button>
                    <Button variant="contained" color="error" onClick={handleForceBlock}>
                        Заблокировать
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default AdminSpots