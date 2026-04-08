import { useState, useEffect } from "react";
import { Container, Typography, Button, Card, CardActionArea, Grid, Box, MenuItem, TextField, Alert, Stack, Divider, CircularProgress } from '@mui/material';
import { useNavigate } from "react-router-dom";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { userApi } from "../../api/index";
import { commonApi } from "../../api/index";

const BookingPage = () => {
    const navigate = useNavigate();

    // Массивы данных
    const [offices, setOffices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [spots, setSpots] = useState([]);

    // Данные формы
    const [filters, setFilters] = useState({
        officeId: '',
        categoryId: '',
        date: new Date().toISOString().split('T')[0], // Текущая дата
        startTime: '09:00',
        endTime: '18:00'
    });

    // Вспомогательные состояния
    const [selectedSpot, setSelectedSpot] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchDone, setSearchDone] = useState(false);

    // Загрузка офисов
    useEffect(() => {
        setLoading(true);

        const fetchOffices = async () => {
            try {
                const response = await commonApi.officesGet();
                setOffices(response.data);
            } catch {
                setError("Не удалось загрузить список офисов");
            }
        }

        fetchOffices();
    }, []);

    // Загрузка категорий
    useEffect(() => {
        if (filters.officeId) {
            const fetchCategories = async () => {
                try {
                    const response = await commonApi.officesOfficeIdCategoriesGet(filters.officeId);
                    setCategories(response.data);
                    setFilters(prev => ({ ...prev, categoryId: '' })); // Сброс категории
                } catch {
                    setError("Не удалось загрузить список категорий");
                }
            }

            fetchCategories();
            setLoading(false);
        }
    }, [filters.officeId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setSearchDone(false); // Сброс результата при изменении фильтров
        setSelectedSpot(null);
    }

    // Поиск парковочных мест
    const handleSearch = async () => {
        setError(null);
        setLoading(true);

        const startISO = `${filters.date}T${filters.startTime}:00`;
        const endISO = `${filters.date}T${filters.endTime}:00`;

        if (new Date(startISO) >= new Date(endISO)) {
            setError("Время конца не может быть раньше или равно времени начала");
            setLoading(false);
            return
        }

        try {
            const response = await userApi.bookingsSearchPost({
                officeId: filters.officeId,
                categoryId: filters.categoryId,
                startTime: startISO,
                endTime: endISO
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
        const startISO = `${filters.date}T${filters.startTime}:00`;
        const endISO = `${filters.date}T${filters.endTime}:00`;

        try {
            await userApi.bookingsPost({
                officeId: filters.officeId,
                categoryId: filters.categoryId,
                number: selectedSpot,
                startTime: startISO,
                endTime: endISO
            })
            navigate('/user/bookings');
            alert("Место успешно забронировано!")
        } catch {
            setError("Не удалось забронировать место. Возможно, оно уже занято.")
        }
    }

    // Ограничения для даты
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 1);
    const maxDateStr = maxDate.toISOString().split('T')[0];
    const minDateStr = new Date().toISOString().split('T')[0];

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
            <Typography variant="h4" fontWeight="700" mb={4}>Забронировать место</Typography>
            <Button 
                startIcon={<ArrowBackIcon />} 
                onClick={() => navigate(-1)} // Возврат на предыдущую страницу в истории
                sx={{ mb: 2 }}
            >
                Назад
            </Button>

            <Card variant="outlined" sx={{ p: 3, borderRadius: 3, mb: 4 }}>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            select fullWidth label="Офис" name="officeId"
                            value={filters.officeId} onChange={handleChange}
                        >
                            {offices.map(o => <MenuItem key={o.id} value={o.id}>{o.address}</MenuItem>)}
                        </TextField>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            select fullWidth label="Категория" name="categoryId"
                            value={filters.categoryId} onChange={handleChange}
                        >
                            {categories.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
                        </TextField>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            fullWidth type="date" label="Дата" name="date"
                            value={filters.date} onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ min: minDateStr, max: maxDateStr }}
                        />
                    </Grid>

                    <Grid size={{ xs: 6, md: 4 }}>
                        <TextField
                            fullWidth type="time" label="Начало" name="startTime"
                            value={filters.startTime} onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>

                    <Grid size={{ xs: 6, md: 4 }}>
                        <TextField
                            fullWidth type="time" label="Конец" name="endTime"
                            value={filters.endTime} onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Button
                            fullWidth variant="contained" size="large"
                            onClick={handleSearch} disabled={loading || !filters.categoryId}
                        >
                            {loading ? <CircularProgress size={24} /> : "Найти"}
                        </Button>
                    </Grid>
                </Grid>
            </Card>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            {searchDone && (
                <Box>
                    <Divider sx={{ mb: 4 }}><Typography color="text.secondary">ДОСТУПНЫЕ МЕСТА</Typography></Divider>

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
                                                <Typography fontWeight="700">№{spot.number}</Typography>
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
                                            Выбрано: место №{spots.find(s => s.spotId === selectedSpot)?.number}
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
            <Box sx={{ height: '100px' }} />
        </Container>
    )
}

export default BookingPage