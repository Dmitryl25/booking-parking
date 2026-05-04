import { useState } from "react";
import { TextField, Button, Container, Typography, Box, Paper, Alert, InputAdornment, IconButton, CircularProgress } from '@mui/material';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/index';
import { jwtDecode } from "jwt-decode";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Фунция логина из контекста
    const { login } = useAuth();
    const navigate = useNavigate();

    const isEmailValid = (email) => /\S+@\S+\.\S+/.test(email);

    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
        if (error) setError('');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isEmailValid(email)) {
            setError('Введите корректный Email');
            return
        }

        setLoading(true);
        setError('');

        try {
            // Запрос
            const response = await authApi.authLoginPost({ email: email, password: password });

            // Ответ
            const { accessToken, refreshToken } = response.data;
            
            // Обновление глобального состояния
            login(accessToken, refreshToken);

            // Навигация пользователя
            const decoded = jwtDecode(accessToken);
            const role = decoded.role;
            if (role.includes('ADMIN')) {
                navigate('/admin/offices');
            } else {
                navigate('/user/bookings');
            }
        } catch (err) {
            if (err.response) {
                switch (err.response.status) {
                    case 401:
                        setError('Неверный email и/или пароль');
                        break
                    case 500:
                        setError('Ошибка на стороне сервера. Мы уже работаем над этим.');
                        break
                    default:
                        setError(`Произошла ошибка: ${err.response.status}. Попробуйте позже.`);
                }
            } else if (err.request) {
                setError('Не удалось связаться с сервером. Проверьте интернет-соединение.')
            } else {
                setError('Произошла непредвиденная ошибка.');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <Container maxWidth='xs'>
            <Box sx={{ marginTop: 12, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Paper elevation={3} sx={{ padding: 4, width: '100%', borderRadius: 4, border: '1px solid #eee' }}>
                    <Typography component='h1' variant="h5" align="center" gutterBottom fontWeight="800">
                        Авторизация
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

                    <form onSubmit={handleSubmit}>
                        <TextField
                            margin="normal"
                            fullWidth
                            required 
                            label='Email'
                            value={email}
                            onChange={handleInputChange(setEmail)}
                            disabled={loading}
                            error={email !== '' && !isEmailValid(email)}
                            helperText={email !== '' && !isEmailValid(email) ? "Неверный формат почты" : ""}
                        />

                        <TextField
                            margin="normal"
                            fullWidth
                            required
                            label='Пароль'
                            disabled={loading}
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={handleInputChange(setPassword)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton 
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                        }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                            sx={{ mt:3, mb: 2 }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : "Войти"}
                        </Button>
                    </form>
                </Paper>
            </Box>
        </Container>
    )
}

export default Login;