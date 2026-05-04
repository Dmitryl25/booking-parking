import { useState, useEffect} from "react";
import { Container, Typography, Button, Card, Grid, Box, Divider, Stack, CircularProgress, Alert, Paper } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CloseIcon from '@mui/icons-material/Close';
import { userApi } from "../../api/index";
import { Link } from 'react-router-dom';
import ConfirmModal from '../../components/ConfirmModal';

const UserBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState(null);

    // Состояние для модального окна подтверждения
    const [modal, setModal] = useState({
        open: false,
        title: '',
        message: '',
        type: 'success',
        bookingId: null
    });

    const closeModal = () => {
        if (!modal.loading) {
            setModal(prev => ({ ...prev, open: false }));
        }
    }

    // Обработчик ошибок
    const handleApiError = (err, defaultMsg) => {
        if (err.response) {
            const status = err.response.status;
            switch (status) {
                case 401:
                    setError("Ваша сессия истекла. Пожалуйста, войдите в систему заново.");
                    break;
                case 403:
                    setError("У вас недостаточно прав для выполнения этого действия.");
                    break;
                case 404:
                    setError("Бронирование не найдено.");
                    break;
                case 409:
                    setError("Место с таким номером уже существует в этой категории.");
                    break;
                case 500:
                    setError("Ошибка сервера (500). Попробуйте обновить страницу позже.");
                    break;
                default:
                    setError(`${defaultMsg} (Код: ${status})`);
            }
        } else {
            setError("Не удалось связаться с сервером. Проверьте интернет-соединение.");
        }
    };

    // Получение списка бронирований пользователя
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await userApi.bookingsMyGet();
                const sorted = (response.data || []).sort((a, b) =>
                    new Date(a.startTime) - new Date(b.startTime)
                )
                setBookings(sorted);
            } catch (err) {
                handleApiError(err, "Не удалось загрузить ваши бронирования");
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

    // Открытие модального окна подтверждения при отмене брони
    const handleOpenCancelModal = (booking) => {
        setError(null);
        setModal({
            open: true,
            title: 'Отмена бронирования',
            message: `Вы действительно хотите отменить бронирование места ${booking.spotNumber} в офисе ${booking.office}?`,
            type: 'confirm',
            bookingId: booking.id
        });
    }

    // Отмена бронирования после подтверждения
    const confirmCancel = async () => {
        setActionLoading(true);
        setError(null);
        try {
            await userApi.bookingsIdDelete(modal.bookingId);
            setBookings(bookings.filter(b => b.id !== modal.bookingId));

            setModal({
                open: true,
                title: 'Успешно',
                message: 'Бронирование было отменено.',
                type: 'success',
                bookingId: null
            });
        } catch (err) {
            handleApiError(err, "Не удалось отменить бронирование");
            setModal(prev => ({ ...prev, open: false }));
        } finally {
            setActionLoading(false);
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

            {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>
            )}

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
                                        {(booking.category || '').toUpperCase()}
                                    </Typography>
                                </Box>

                                {/* Средняя часть: Время и Место */}
                                <Grid container spacing={2} mb={2}>
                                    <Grid size={{ xs: 7 }}>
                                        <Typography variant="caption" color="text.secondary" display="block">ДАТА И ВРЕМЯ</Typography>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <AccessTimeIcon fontSize="inherit" color="action" />
                                            <Typography variant="body2" fontWeight="500">
                                                {new Date(booking.startTime).toLocaleDateString()} | {formatTimeRange(booking.startTime, booking.endTime)}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid size={{ xs: 5 }}>
                                        <Typography variant="caption" color="text.secondary" display="block">ПАРКОВОЧНОЕ МЕСТО</Typography>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <DirectionsCarIcon fontSize="inherit" color="action" />
                                            <Typography variant="body2" fontWeight="700" color="primary.main">
                                            {booking.spotNumber}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>

                                {/* Нижняя часть: Кнопка */}
                                <Divider sx={{ my: 1.5, borderStyle: 'dashed' }} />
                                <Box display="flex" justifyContent="flex-end">
                                    <Button 
                                        size="small" 
                                        color="error" 
                                        startIcon={actionLoading && modal.bookingId === booking.id ? <CircularProgress size={14} color="inherit" /> : <CloseIcon />}
                                        onClick={() => handleOpenCancelModal(booking)}
                                        disabled={actionLoading}
                                        sx={{ fontWeight: 600, textTransform: 'none' }}
                                    >
                                    Отменить бронь
                                    </Button>
                                </Box>
                            </Box>
                        </Card>
                    ))}
                </Stack>
            ) : (
                !error && (
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
                            Активных бронирований пока нет
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
                            Здесь появится список ваших будущих парковочных мест.
                        </Typography>
                    </Paper>
                )
            )}

            {/* Модальное окно */}
            <ConfirmModal 
                open={modal.open}
                onClose={closeModal}
                onConfirm={modal.type === 'confirm' ? confirmCancel : null}
                title={modal.title}
                message={modal.message}
                type={modal.type}
                confirmText="Да, отменить"
                cancelText="Назад"
                disabled={actionLoading}
            />
        </Container>
    )
}

export default UserBookings