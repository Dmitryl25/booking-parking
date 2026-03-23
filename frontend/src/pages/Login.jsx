import { useState } from "react";
import { TextField, Button, Container, Typography, Box, Paper, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Фунция логина из контекста
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // Запрос
            const response = await api.post('/auth/login', { username, password });

            // Ответ
            const { token, role } = response.data;

            // Обновление глобального состояния
            login(token, role);

            // Навигация в зависимости от роли
            if (role === 'ADMIN') {
                navigate('/admin/offices');
            } else {
                navigate('/user/bookings');
            }
        } catch (err) {
            console.error("Ошибка при входе: ", err)
            setError('Неверный логин и/или пароль');
        }
    }

    return (
        <Container maxWidth='xs'>
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
                    <Typography component='h1' variant="h5" align="center" gutterBottom>
                        Авторизация
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <form onSubmit={handleSubmit}>
                        <TextField
                        margin="normal"
                        fullWidth
                        required 
                        label='Логин'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        />

                        <TextField
                        margin="normal"
                        fullWidth
                        required
                        label='Пароль'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        />

                        <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt:3, mb: 2 }}
                        >
                            Войти
                        </Button>
                    </form>
                </Paper>
            </Box>
        </Container>
    )
}

export default Login;