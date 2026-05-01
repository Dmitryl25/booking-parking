import { useState, useEffect } from "react";
import { Container, Typography, Button, Card, CardActionArea, Grid, Box, MenuItem, TextField, Alert, Stack, Divider, CircularProgress } from '@mui/material';
import { useNavigate } from "react-router-dom";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { userApi } from "../../api/index";
import { commonApi } from "../../api/index";
import ConfirmModal from "../../components/ConfirmModal";

// Получение времени + 1 час
const getTimeWithOffset = (offsetHours) => {
    const d = new Date();
    d.setHours(d.getHours() + offsetHours, 0, 0, 0); 
    const h = String(d.getHours()).padStart(2, '0');
    return `${h}:00`;
};

// Функция для отправки данных с локальным часовым поясом
const toLocalISOString = (date, timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    const d = new Date(date);
    d.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const tzo = -d.getTimezoneOffset();
    const dif = tzo >= 0 ? '+' : '-';
    const pad = (num) => String(Math.floor(Math.abs(num))).padStart(2, '0');
    
    // Формат: YYYY-MM-DDTHH:mm:ss+HH:mm
    return d.getFullYear() +
        '-' + pad(d.getMonth() + 1) +
        '-' + pad(d.getDate()) +
        'T' + pad(d.getHours()) +
        ':' + pad(d.getMinutes()) +
        ':' + pad(d.getSeconds()) +
        dif + pad(tzo / 60) +
        ':' + pad(tzo % 60);
};


const BookingPage = () => {
    const navigate = useNavigate();

    // Массивы данных
    const [offices, setOffices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [spots, setSpots] = useState([]);

    // Ограничения для даты
    const now = new Date();
    const minDateStr = now.toISOString().split('T')[0];
    const maxDate = new Date();
    maxDate.setDate(now.getDate() + 14);
    const maxDateStr = maxDate.toISOString().split('T')[0];

    // Данные формы
    const [filters, setFilters] = useState({
        officeId: '',
        categoryId: '',
        date: minDateStr,
        startTime: getTimeWithOffset(1),
        endTime: getTimeWithOffset(2)
    });

    // Вспомогательные состояния
    const [selectedSpot, setSelectedSpot] = useState(null);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchDone, setSearchDone] = useState(false);

    // Состояние для модального окна успеха
    const [modal, setModal] = useState({
        open: false,
        title: '',
        message: '',
        type: 'success'
    });

    // Загрузка офисов
    useEffect(() => {
        const fetchOffices = async () => {
            try {
                const response = await commonApi.officesGet();
                setOffices(response.data);
            } catch {
                setError("Не удалось загрузить список офисов");
            } finally {
                setInitialLoading(false);
            }
        }

        fetchOffices();
    }, []);

    // Загрузка категорий
    useEffect(() => {
        if (!filters.officeId) {
            setCategories([]);
            return;
        }

        const fetchCategories = async () => {
            setCategories([]);
            setError(null);
            try {
                const response = await commonApi.officesOfficeIdCategoriesGet(filters.officeId);
                const data = response.data || [];
                setCategories(data);

                if (data.length === 0) {
                    setFilters(prev => ({ ...prev, categoryId: 'none' }));
                } else {
                    setFilters(prev => ({ ...prev, categoryId: '' }));
                }
            } catch {
                setError("Не удалось загрузить список категорий");
            }
        }

        fetchCategories();
    }, [filters.officeId]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFilters(prev => {
            const newFilters = { ...prev, [name]: value };

            if (name === 'startTime') {
                const [hours, minutes] = value.split(':');
                const date = new Date();
                date.setHours(parseInt(hours) + 1, parseInt(minutes));
                
                const newEndHours = String(date.getHours()).padStart(2, '0');
                const newEndMins = String(date.getMinutes()).padStart(2, '0');
                newFilters.endTime = `${newEndHours}:${newEndMins}`;
            }

            return newFilters;
        });

        setSearchDone(false); // Сброс результата при изменении фильтров
        setSelectedSpot(null);
        setError(null);
    }

    // Поиск парковочных мест
    const handleSearch = async () => {
        setError(null);

        const start = new Date(`${filters.date}T${filters.startTime}:00`);
        const end = new Date(`${filters.date}T${filters.endTime}:00`);
        const currentTime = new Date();

        // Валидация - начало не в прошлом
        if (start < currentTime) {
            setError("Нельзя забронировать на время в прошлом");
            return;
        }

        // Валидация - конец позже начала
        if (start >= end) {
            setError("Время конца бронирования должно быть позже времени начала");
            return;
        }

        setLoading(true);
        try {
            const response = await userApi.bookingsSearchPost({
                officeId: filters.officeId,
                categoryId: filters.categoryId,
                startTime: toLocalISOString(filters.date, filters.startTime),
                endTime: toLocalISOString(filters.date, filters.endTime)
            });
            setSpots(response.data);
            setSearchDone(true);
        } catch {
            setError("Ошибка при поиске мест. Попробуйте снова.");
        } finally {
            setLoading(false);
        }
    }

    // Бронирование
    const handleBooking = async () => {
        try {
            await userApi.bookingsPost({
                officeId: filters.officeId,
                categoryId: filters.categoryId,
                number: selectedSpot,
                startTime: toLocalISOString(filters.date, filters.startTime),
                endTime: toLocalISOString(filters.date, filters.endTime)
            })
            
            setModal({
                open: true,
                title: 'Успешно!',
                message: `Место ${selectedSpot} забронировано на ${new Date(filters.date).toLocaleDateString()}.`,
                type: 'success'
            });
        } catch {
            setError("Не удалось забронировать место. Возможно, оно уже занято.")
        }
    }

    // Заполненость формы
    const isFormValid = filters.officeId && filters.categoryId && filters.categoryId !== 'none';

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Button 
                startIcon={<ArrowBackIcon />} 
                onClick={() => navigate(-1)} // Возврат на предыдущую страницу в истории
                sx={{ mb: 2, textTransform: 'none', color: 'text.secondary' }}
            >
                Назад
            </Button>
            <Typography variant="h5" fontWeight="700" mb={4}>Забронировать место</Typography>

            {initialLoading ? <CircularProgress /> : (
                <Card variant="outlined" sx={{ p: 3, borderRadius: 3, mb: 4 }}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                select fullWidth label="Офис" id="officeId" name="officeId"
                                value={filters.officeId} onChange={handleChange}
                            >
                                {offices.map(o => <MenuItem key={o.id} value={o.id}>{o.address}</MenuItem>)}
                            </TextField>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                select fullWidth label="Категория" id="categoryId" name="categoryId"
                                value={filters.categoryId} onChange={handleChange}
                                disabled={!filters.officeId || filters.categoryId === 'none'}
                            >
                                {categories.length > 0 && categories.map((c) => (
                                    <MenuItem key={c.id} value={c.id}>
                                        {c.name}
                                    </MenuItem>
                                ))}

                                {filters.categoryId === 'none' && (
                                    <MenuItem value="none">
                                        Нет доступных категорий
                                    </MenuItem>
                                )}
                            </TextField>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                fullWidth type="date" label="Дата" id="date" name="date"
                                value={filters.date} onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                inputProps={{ min: minDateStr, max: maxDateStr }}
                            />
                        </Grid>

                        <Grid size={{ xs: 6, md: 4 }}>
                            <TextField
                                fullWidth type="time" label="Начало" id="startTime" name="startTime"
                                value={filters.startTime} onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        <Grid size={{ xs: 6, md: 4 }}>
                            <TextField
                                fullWidth type="time" label="Конец" id="endTime" name="endTime"
                                value={filters.endTime} onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Button
                                fullWidth variant="contained" size="large"
                                onClick={handleSearch} disabled={loading || !isFormValid}
                            >
                                {loading ? <CircularProgress size={24} /> : "Найти свободные места"}
                            </Button>
                        </Grid>
                    </Grid>
                </Card>
            )}

            {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

            {searchDone && (
                <Box>
                    <Divider sx={{ mb: 4 }}><Typography color="text.secondary">СВОБОДНЫЕ МЕСТА</Typography></Divider>

                    {spots.length > 0 ? (
                        <>
                            <Grid container spacing={2}>
                                {spots.map((spot) => (
                                    <Grid size={{ xs: 4, sm: 3, md: 2 }} key={spot.number}>
                                        <Card
                                            variant="outlined"
                                            sx={{
                                                borderRadius: 2,
                                                border: selectedSpot === spot.number ? '2px solid #1976d2' : '1px solid #e0e0e0',
                                                bgcolor: selectedSpot === spot.number ? '#e3f2fd' : 'inherit'
                                            }}
                                        >
                                            <CardActionArea onClick={() => setSelectedSpot(spot.number)} sx={{ p: 2, textAlign: 'center' }}>
                                                <DirectionsCarIcon color={selectedSpot === spot.number ? "primary" : "action"} />
                                                <Typography fontWeight="700">{spot.number}</Typography>
                                            </CardActionArea>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>

                            {selectedSpot && (
                                <Box 
                                    sx={{ 
                                        position: 'fixed', 
                                        bottom: 0, 
                                        left: 0, 
                                        right: 0, 
                                        bgcolor: 'rgba(255, 255, 255, 0.8)',
                                        backdropFilter: 'blur(8px)',
                                        borderTop: '1px solid',
                                        borderColor: 'divider',
                                        p: 2, 
                                        zIndex: 1000,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        boxShadow: '0 -4px 20px rgba(0,0,0,0.05)'
                                    }}
                                >
                                    <Stack 
                                        direction={{ xs: 'column', sm: 'row' }} 
                                        spacing={2} 
                                        alignItems="center" 
                                        sx={{ width: '100%', maxWidth: 'md' }}
                                    >
                                        <Typography variant="body1" sx={{ fontWeight: 600, flexGrow: 1 }}>
                                            Выбрано: место {spots.find(s => s.number === selectedSpot)?.number}
                                            <Typography component="span" variant="caption" display="block" color="text.secondary">
                                                {new Date(filters.date).toLocaleDateString()} | {filters.startTime} - {filters.endTime}
                                            </Typography>
                                        </Typography>

                                        <Button 
                                            variant="contained" 
                                            size="large" 
                                            fullWidth={{ xs: true, sm: false }}
                                            onClick={handleBooking}
                                            sx={{ 
                                                px: 6, 
                                                py: 1.5, 
                                                borderRadius: 2, 
                                                textTransform: 'none',
                                                fontSize: '1.1rem',
                                                fontWeight: 700,
                                                boxShadow: '0 4px 14px 0 rgba(25, 118, 210, 0.39)'
                                            }}
                                        >
                                            Забронировать
                                        </Button>
                                    </Stack>
                                </Box>
                            )}
                        </>
                    ) : (
                        <Alert severity="info">К сожалению, на выбранное время нет свободных мест.</Alert>
                    )}
                </Box>
            )}

            <ConfirmModal 
                open={modal.open}
                onClose={() => modal.type === 'success' ? navigate('/user/bookings') : setModal({ ...modal, open: false })}
                onConfirm={() => navigate('/user/bookings')}
                title={modal.title}
                message={modal.message}
                type={modal.type}
            />
            
            <Box sx={{ height: '100px' }} />
        </Container>
    )
}

export default BookingPage