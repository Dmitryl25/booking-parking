import { useState } from "react";
import { TextField, Button, Container, Typography, Box, Paper, Alert, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/index';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    // Фунция логина из контекста
    const { login } = useAuth();
    const navigate = useNavigate();

    const isEmailValid = (email) => /\S+@\S+\.\S+/.test(email);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isEmailValid(email)) {
            setError('Введите корректный Email');
            return
        }

        try {
            // Запрос
            const response = await authApi.authLoginPost({ email: email, password: password });

            // Ответ
            const { accessToken, refreshToken } = response.data;
            
            // Обновление глобального состояния
            login(accessToken, refreshToken);
            navigate('/');
        } catch (err) {
            console.error("Ошибка при входе: ", err)
            setError('Неверный email и/или пароль');
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
                        label='Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={email !== '' && !isEmailValid(email)}
                        helperText={email !== '' && !isEmailValid(email) ? "Неверный формат почты" : ""}
                        />

                        <TextField
                        margin="normal"
                        fullWidth
                        required
                        label='Пароль'
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <VisibilityOff /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
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