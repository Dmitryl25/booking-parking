import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Container, Typography, Button, Grid, Card, CardContent, Box, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Divider, MenuItem, Stack, CircularProgress, Paper } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import InfoIcon from '@mui/icons-material/Info';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
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

    // Состояния для модального окна информации о блокировках
    const [infoOpen, setInfoOpen] = useState(false);
    const [blockingInfo, setBlockingInfo] = useState(null);
    const [infoLoading, setInfoLoading] = useState(false);

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

    // Получение информации о блокировке
    const handleFetchInfo = async (spot) => {
        setSelectedSpot(spot);
        setInfoLoading(true);
        setInfoOpen(true);

        const category = allCategories.find(c => c.name === spot.category);
        
        try {
            const response = await adminApi.adminBookingsGetinfoPost({
                officeId: parseInt(officeId),
                categoryId: category?.id,
                number: spot.number
            });
            setBlockingInfo(response.data);
        } catch {
            console.error("Ошибка получения инфо");
            setBlockingInfo(null);
        } finally {
            setInfoLoading(false);
        }
    };

    // Отмена блокировки (разблокировка)
    const handleUnblock = async () => {
        if (!window.confirm("Вы уверены, что хотите разблокировать это место?")) return;

        const category = allCategories.find(c => c.name === selectedSpot.category);

        try {
            await adminApi.adminBookingsUnblockPost({
                officeId: parseInt(officeId),
                categoryId: category?.id,
                number: selectedSpot.number
            });
            setInfoOpen(false);
            fetchSpots();
        } catch {
            alert("Ошибка при разблокировке");
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
            ) : allCategories.length === 0 ? (
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
                        В этом офисе пока нет парковочных мест
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
                        Добавьте категории в настройках офиса, чтобы управлять парковочными местами.
                    </Typography>
                    <Button 
                        variant="outlined" 
                        onClick={() => navigate('/admin/offices')}
                    >
                        К списку офисов
                    </Button>
                </Paper>
            ) : Object.keys(groupedSpots).length === 0 ? (
                <Box sx={{ textAlign: 'center', mt: 8 }}>
                    <Typography variant="h6" color="text.secondary">
                        В офисе пока нет парковочных мест
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Нажмите кнопку «Добавить место», чтобы добавить парковочные места.
                    </Typography>
                </Box>
            ) : (
                Object.keys(groupedSpots).map((categoryName) => {
                    const spots = groupedSpots[categoryName];
                    const isEmptyCategory = spots.length === 1 && spots[0].number === "";
                    return (
                        <Box key={categoryName} sx={{ mb: 5 }}>
                            <Typography variant="h6" fontWeight="700" color="primary" gutterBottom>
                                {categoryName}
                            </Typography>
                            <Divider sx={{ mb: 3 }} />
                            
                            {isEmptyCategory ? (
                                <Typography variant="body1" sx={{ color: 'text.secondary', fontStyle: 'italic', ml: 2 }}>
                                    В данной категории пока нет добавленных мест
                                </Typography>
                            ) : (
                                <Grid container spacing={2}>
                                    {spots.map((spot) => (
                                        <Grid item xs={6} sm={4} md={2.4} key={spot.number} sx={{ display: 'flex' }}>
                                            <Card sx={{ 
                                                width: '100%',
                                                borderRadius: 3, 
                                                boxShadow: 'none',
                                                border: spot.available === false ? '1px solid #ef5350' : '1px solid #eee',
                                                background: spot.available === false 
                                                    ? 'linear-gradient(45deg, #fffcfc 25%, #fff5f5 25%, #fff5f5 50%, #fffcfc 50%, #fffcfc 75%, #fff5f5 75%, #fff5f5 100%)'
                                                    : '#fff',
                                                backgroundSize: '20px 20px',
                                            }}>
                                                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                                                    <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                                                        {spot.available === false && <LockIcon sx={{ fontSize: 20, color: 'error.main' }} />}
                                                        <Typography variant="h5" fontWeight="800" color={spot.available === false ? 'error.main' : 'text.primary'}>
                                                            {spot.number}
                                                        </Typography>
                                                    </Box>
                                                </CardContent>
                                                
                                                <Divider />
                                                
                                                <Box display="flex" justifyContent="space-around" p={0.5} bgcolor="rgba(255,255,255,0.6)">
                                                    {spot.available === false ? (
                                                        <IconButton color="info" onClick={() => handleFetchInfo(spot)} title="Информация о блокировке">
                                                            <InfoIcon fontSize="small" />
                                                        </IconButton>
                                                    ) : (
                                                        <IconButton color="primary" onClick={() => { setSelectedSpot(spot); setBlockOpen(true); }} title="Заблокировать">
                                                            <BlockIcon fontSize="small" />
                                                        </IconButton>
                                                    )}
                                                    
                                                    <IconButton color="error" onClick={() => handleDeleteSpot(spot)} title="Удалить место">
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </Box>
                    )
                })
            )}

            {/* Модальное окно добавления места */}
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

            {/* Модальное окно информации о блокировке */}
            <Dialog open={infoOpen} onClose={() => setInfoOpen(false)} fullWidth maxWidth="xs">
                <DialogTitle sx={{ fontWeight: 800 }}>Блокировка места {selectedSpot?.number}</DialogTitle>
                <DialogContent dividers>
                    {infoLoading ? (
                        <Box display="flex" justifyContent="center" p={3}><CircularProgress size={24} /></Box>
                    ) : blockingInfo ? (
                        <Stack spacing={2} sx={{ mt: 1 }}>
                            <Box sx={{ 
                                p: 2, 
                                bgcolor: '#f8f9fa', 
                                borderRadius: 2, 
                                border: '1px solid #eee',
                                textAlign: 'center'
                            }}>
                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, letterSpacing: 1 }}>
                                    ПЕРИОД ДЕЙСТВИЯ
                                </Typography>
                                
                                <Typography variant="h6" sx={{ mt: 1, fontWeight: 700 }}>
                                    {new Date(blockingInfo.startTime).toLocaleDateString('ru-RU', { 
                                        day: '2-digit', 
                                        month: '2-digit', 
                                        year: 'numeric' 
                                    })}
                                </Typography>
                                
                                <Typography variant="body1" color="text.secondary">
                                    с {new Date(blockingInfo.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                                    до {new Date(blockingInfo.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Typography>
                            </Box>
                        </Stack>
                    ) : (
                        <Typography p={2} textAlign="center">Информация отсутствует</Typography>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
                    <Button 
                        color="error" 
                        variant="contained"
                        startIcon={<LockOpenIcon />} 
                        onClick={handleUnblock}
                        sx={{ borderRadius: 2 }}
                    >
                        Разблокировать
                    </Button>
                    <Button onClick={() => setInfoOpen(false)} variant="outlined" sx={{ borderRadius: 2 }}>
                        Закрыть
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default AdminSpots