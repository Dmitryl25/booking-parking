import { AppBar, Toolbar, Typography, Button, Box, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LogoutIcon from '@mui/icons-material/Logout';
import { IconButton, Tooltip } from '@mui/material';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    }

    return (
        <AppBar position="static" sx={{ mb: 4 }}>
            <Container maxWidth="lg">
                <Toolbar disableGutters>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
                        Booking Parking
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        {user?.role === 'ADMIN' ? (
                            <Button color="inherit" onClick={() => navigate('/admin/offices')}>Офисы</Button>
                        ) : (
                            <Button color="inherit" onClick={() => navigate('/user/bookings')}>Мои бронирования</Button>
                        )}

                        <Tooltip title="Выйти">
                            <IconButton color="inherit" onClick={handleLogout}>
                                <LogoutIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    )
}

export default Header