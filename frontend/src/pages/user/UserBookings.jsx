import { useState, useEffect} from "react";
import { Container, Typography, Button, Card, Grid, Box, Divider, Stack, CircularProgress, Alert } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { userApi } from "../../api/index";
import { Link } from 'react-router-dom';

const UserBookings = () => {
    const [ bookings, setBookings ] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Получение списка бронирований пользователя
    useEffect(() => {
        const fetchBookings = async () =>{
            try {
                setLoading(true);
                const response = await userApi.bookingsMyGet();
                const sorted = response.data.sort((a, b) => {
                    new Date(a.startTime) - new Date(b.startTime)
                })
                setBookings(sorted);
            } catch (err) {
                //console.error("Не удалось загрузить список бронирований", err)
            } finally {
                setLoading(false);
            }
        }
        fetchBookings();
    }, [])

    // Преобразование времени
    const formatTimeRange = (start, end) => {
        const options = { hour: '2-digit', minute: '2-digit' };
        const s = new Date(start).toLocaleTimeString([], options);
        const e = new Date(end).toLocaleTimeString([], options);
        return `${s} — ${e}`;
    };

    // Отмена бронирования
    const canCancel = (startTime) => {
        return new Date(startTime) > new Date();
    }

    const handleCancel = async (id) => {
        if (window.confirm("Вы уверены, что хотите отменить бронирование?")) {
            try {
                await userApi.bookingsIdDelete(id);
                setBookings(bookings.filter(b => b.id !== id));
            } catch {
                setError("Не удалось отменить бронирование");
            }
        }
    }

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth='sm' sx={{ mt: 5, mb: 5 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h5" fontWeight="700" color="text.primary">
                    Мои бронирования
                </Typography>
                <Button variant="contained" disableElevation component={Link} to="/user/booking">
                    Забронировать
                </Button>
            </Stack>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            {bookings.length > 0 ? (
                <Stack spacing={2}>
                    {bookings.map((booking) => (
                        <Card 
                            key={booking.id} 
                            variant="outlined" 
                            sx={{ 
                            borderRadius: 3, 
                            borderColor: 'divider',
                            transition: '0.3s',
                            '&:hover': { boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }
                            }}
                        >
                            <Box p={3}>
                                {/* Верхняя часть: Офис и Категория */}
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <LocationOnIcon fontSize="small" color="primary" />
                                        <Typography variant="subtitle1" fontWeight="600">
                                            {booking.office}
                                        </Typography>
                                    </Box>
                                    <Typography variant="caption" sx={{ bgcolor: '#f0f2f5', px: 1.5, py: 0.5, borderRadius: 1, fontWeight: 600 }}>
                                        {booking.category.toUpperCase()}
                                    </Typography>
                                </Box>

                                {/* Средняя часть: Время и Место */}
                                <Grid container spacing={2} mb={2}>
                                    <Grid item xs={7}>
                                        <Typography variant="caption" color="text.secondary" display="block">ДАТА И ВРЕМЯ</Typography>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <AccessTimeIcon fontSize="inherit" color="action" />
                                            <Typography variant="body2" fontWeight="500">
                                                {new Date(booking.startTime).toLocaleDateString()} | {formatTimeRange(booking.startTime, booking.endTime)}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={5}>
                                        <Typography variant="caption" color="text.secondary" display="block">ПАРКОВОЧНОЕ МЕСТО</Typography>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <DirectionsCarIcon fontSize="inherit" color="action" />
                                            <Typography variant="body2" fontWeight="700">
                                            № {booking.spotNumber}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>

                                {/* Нижняя часть: Кнопка */}
                                {canCancel(booking.startTime) && (
                                    <>
                                        <Divider sx={{ my: 1.5, borderStyle: 'dashed' }} />
                                        <Box display="flex" justifyContent="flex-end">
                                            <Button 
                                                size="small" 
                                                color="error" 
                                                startIcon={<DeleteOutlineIcon />}
                                                onClick={() => handleCancel(booking.id)}
                                                sx={{ fontWeight: 600, textTransform: 'none' }}
                                            >
                                            Отменить запись
                                            </Button>
                                        </Box>
                                    </>
                                )}
                            </Box>
                        </Card>
                    ))}
                </Stack>
            ) : (
                <Box 
                    sx={{ 
                        textAlign: 'center', 
                        py: 10, 
                        px: 2, 
                        bgcolor: '#f8f9fa', 
                        borderRadius: 4, 
                        border: '2px dashed #e0e0e0' 
                    }}
                >
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        Активных бронирований пока нет
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={3}>
                        Здесь появится список ваших будущих парковочных мест.
                    </Typography>
                </Box>
            )}
        </Container>
    )
}

export default UserBookings