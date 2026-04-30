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
import ConfirmModal from "../../components/ConfirmModal";

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
            const sortedCats = (catRes.data || []).sort((a, b) => a.id - b.id);
            setAllCategories(sortedCats);

            // Получение всех мест офиса
            const response = await adminApi.adminOfficesOfficeIdParkingSpotsGet(parseInt(officeId));
            const allSpots = response.data || [];

            // Сортировка мест
            const sortedSpots = allSpots.sort((a, b) => 
                a.number.localeCompare(b.number, undefined, { numeric: true, sensitivity: 'base' })
            );

            // Группировка мест по категориям
            const groups = sortedSpots.reduce((acc, spot) => {
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
        try {
            await adminApi.adminParkingSpotsPost({
                number: newData.number,
                categoryId: parseInt(newData.categoryId),
                officeId: parseInt(officeId)
            });
            setAddOpen(false);
            setNewData({ number: '', categoryId: '' });
            fetchSpots();
            showModal('Успешно', `Место ${newData.number} добавлено`, 'success');
        } catch {
            alert("Ошибка при создании места. Возможно, такой номер уже есть.");
        }
    };

    // Удаление парковочного места
    const handleDeleteClick = (spot) => {
        showModal(
            'Удаление места',
            `Вы действительно хотите удалить место ${spot.number}?`,
            'confirm',
            () => confirmDelete(spot)
        );
    };

    const confirmDelete = async (spot) => {
        const category = allCategories.find(c => c.name === spot.category);

        try {
            await adminApi.adminParkingSpotsDeletePost({
                number: spot.number,
                categoryId: parseInt(category.id),
                officeId: parseInt(officeId)
            });
            fetchSpots();
            showModal('Удалено', 'Парковочное место удалено', 'success');
        } catch {
            alert("Ошибка при удалении места");
        }
    };

    // Блокирование парковочного места
    const handleForceBlock = async () => {
        const start = new Date(`${blockData.date}T${blockData.startTime}:00`);
        const end = new Date(`${blockData.date}T${blockData.endTime}:00`);

        if (start >= end) {
            showModal('Ошибка времени', 'Время окончания должно быть позже времени начала', 'error');
            return;
        }

        const category = allCategories.find(c => c.name === selectedSpot.category);

        try {
            await adminApi.adminBookingsForcePost({
                officeId: parseInt(officeId),
                categoryId: category.id,
                number: selectedSpot.number,
                startTime: start.toISOString(),
                endTime: end.toISOString()
            });
            setBlockOpen(false);
            fetchSpots();
            showModal('Заблокировано', `Место ${selectedSpot.number} недоступно для бронирования`, 'success');
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
                number: spot.number,
                categoryId: category?.id,
                officeId: parseInt(officeId)
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
    const handleUnblockClick = () => {
        showModal(
            'Разблокировка',
            `Снять блокировку с места ${selectedSpot.number}?`,
            'confirm',
            handleUnblock
        );
    };

    const handleUnblock = async () => {
        const category = allCategories.find(c => c.name === selectedSpot.category);

        try {
            await adminApi.adminBookingsUnblockPost({
                number: selectedSpot.number,
                categoryId: category?.id,
                officeId: parseInt(officeId)
            });
            setInfoOpen(false);
            fetchSpots();
            showModal('Разблокировано', 'Место снова доступно', 'success');
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
                allCategories.map((cat) => {
                    const spots = groupedSpots[cat.name];
                    const isEmptyCategory = spots.length === 1 && spots[0].number === "";

                    return (
                        <Box key={cat.id} sx={{ mb: 5 }}>
                            <Typography variant="h6" fontWeight="700" color="primary" gutterBottom>
                                {cat.name}
                            </Typography>
                            <Divider sx={{ mb: 3 }} />
                            
                            {isEmptyCategory ? (
                                <Typography variant="body1" sx={{ color: 'text.secondary', fontStyle: 'italic', ml: 2 }}>
                                    В данной категории пока нет добавленных мест
                                </Typography>
                            ) : (
                                <Grid container spacing={1.5}>
                                    {spots.map((spot) => (
                                        <Grid size={{ xs: 4, sm: 2, md: 1.2, lg: 1 }} key={spot.number}>
                                            <Card variant="outlined" sx={{
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
                                                    
                                                    <IconButton color="error" onClick={() => handleDeleteClick(spot)} title="Удалить место">
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
                <DialogContent>
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
                    <Button variant="contained" disabled={!newData.number.trim() || !newData.categoryId} onClick={handleAddSpot}>
                        Создать
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Модальное окно блокировки */}
            <Dialog open={blockOpen} onClose={() => setBlockOpen(false)} fullWidth maxWidth="xs">
                <DialogTitle sx={{ fontWeight: 800 }}>Блокировка места {selectedSpot?.number}</DialogTitle>
                <DialogContent>
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
                    <Button variant="contained" disabled={!blockData.date || !blockData.startTime || !blockData.endTime} color="error" onClick={handleForceBlock}>
                        Заблокировать
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Модальное окно информации о блокировке */}
            <Dialog open={infoOpen} onClose={() => setInfoOpen(false)} fullWidth maxWidth="xs">
                <DialogTitle sx={{ fontWeight: 800 }}>Блокировка места {selectedSpot?.number}</DialogTitle>
                <DialogContent>
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
                                    {new Date(blockingInfo.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}-{new Date(blockingInfo.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                        onClick={handleUnblockClick}
                    >
                        Разблокировать
                    </Button>
                    <Button onClick={() => setInfoOpen(false)} variant="outlined">
                        Закрыть
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
                confirmText={modal.type === 'confirm' ? "Подтвердить" : "Понятно"}
            />
        </Container>
    );
};

export default AdminSpots