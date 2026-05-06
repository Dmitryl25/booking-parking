import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack, MenuItem, InputAdornment, Tooltip, Divider, CircularProgress, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { adminApi } from "../../api/index";
import ConfirmModal from '../../components/ConfirmModal';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    // Состояния для модальных окон
    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [modal, setModal] = useState({
        open: false,
        title: '',
        message: '',
        type: 'success',
        onConfirm: null
    });

    // Данные форм
    const [formData, setFormData] = useState({
        email: '', 
        name: '', 
        licensePlate: '', 
        password: '', 
        role: 'ROLE_USER',
    });

    // Регулярные выражения
    const EMAIL_REGEX = /\S+@\S+\.\S+/;
    const PLATE_REGEX = /^[А-Яа-яA-Za-z]\d{3}[А-Яа-яA-Za-z]{2}\d{3}$/;
    const isEmailValid = (email) => EMAIL_REGEX.test(email);
    const isPlateValid = (plate) => PLATE_REGEX.test(plate);

    const showModal = (title, message, type = 'success', onConfirm = null) => {
        setModal({ open: true, title, message, type, onConfirm });
    };

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
                    setError("Пользователь не найден.");
                    fetchUsers()
                    break;
                case 409:
                    setError("Пользователь с таким Email уже существует в системе.");
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

    // Получение списка пользователей
    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await adminApi.adminUsersGet();
            const sorted = (response.data || []).sort((a, b) => a.id - b.id);
            setUsers(sorted);
        } catch (err) {
            handleApiError(err, "Не удалось загрузить список пользователей");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    // Генерация пароля для нового пользователя
    const handleGeneratePassword = async () => {
        try {
            const res = await adminApi.adminGeneratePasswordPost();
            setFormData({ ...formData, password: res.data.password });
        } catch (err) {
            handleApiError(err, "Ошибка генерации пароля");
        }
    };

    // Создание пользователя
    const handleCreateUser = async () => {
        setActionLoading(true);
        setError(null);
        try {
            await adminApi.adminUsersPost(formData);
            setOpenAdd(false);
            setFormData({ email: '', name: '', licensePlate: '', password: '', role: 'ROLE_USER' });
            fetchUsers();
            showModal('Готово!', 'Сотрудник успешно добавлен в систему', 'success');
        } catch (err) {
            handleApiError(err, "Ошибка создания пользователя");
        } finally {
            setActionLoading(false);
        }
    };

    // Обновление (ФИО и номер машины)
    const handleUpdateUser = async () => {
        setActionLoading(true);
        setError(null);
        try {
            await adminApi.adminUsersIdPut(selectedUser.id, {
                name: formData.name,
                licensePlate: formData.licensePlate
            });
            setOpenEdit(false);
            fetchUsers();
            showModal('Обновлено', 'Данные сотрудника успешно изменены', 'success');
        } catch (err) {
            handleApiError(err, "Ошибка обновления данных пользователя");
        } finally {
            setActionLoading(false);
        }
    };

    // Сброс пароля (внутри редактирования)
    const handleResetPassword = async () => {
        try {
            const res = await adminApi.adminUsersIdResetPasswordPost(selectedUser.id);
            // Запись нового пароля в состояние, чтобы он отобразился в поле
            setFormData({ ...formData, tempPassword: res.data.password });
        } catch (err) {
            handleApiError(err, "Ошибка сброса пароля");
        }
    };

    // Подтверждение удаления пользователя
    const handleDeleteClick = (user) => {
        showModal(
            'Удаление', 
            `Вы уверены, что хотите удалить сотрудника ${user.name}? Это действие необратимо.`, 
            'confirm',
            () => confirmDelete(user.id)
        );
    };

    // Удаление пользователя
    const confirmDelete = async (id) => {
        setError(null);
        try {
            await adminApi.adminUsersIdDelete(id);
            fetchUsers();
            showModal('Удалено', 'Сотрудник полностью удален из системы', 'success');
        } catch (err) {
            handleApiError(err, "Не удалось удалить пользователя");
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" fontWeight="700">Сотрудники</Typography>
                <Button 
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => {
                        setFormData({ email: '', name: '', licensePlate: '', password: '', role: 'ROLE_USER' });
                        setOpenAdd(true);
                        setError(null);
                    }}
                >
                    Добавить сотрудника
                </Button>
            </Box>

            {error && !openAdd && !openEdit && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError(null)}>{error}</Alert>
            )}

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
                    <CircularProgress thickness={4} />
                </Box>
            ) : (
                <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <Table>
                        <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>ФИО</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Гос. номер</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Роль</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="right">Действия</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id} hover>
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell fontWeight="600">{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.licensePlate}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell align="right">
                                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                                            <IconButton color="primary" onClick={() => {
                                                setSelectedUser(user);
                                                setFormData({ name: user.name, licensePlate: user.licensePlate, tempPassword: '' });
                                                setOpenEdit(true);
                                            }}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton color="error" onClick={() => handleDeleteClick(user)}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Модальное окно добавления */}
            <Dialog open={openAdd} onClose={() => {if(!actionLoading) setOpenAdd(false); setError(null)}} fullWidth maxWidth="xs">
                <DialogTitle sx={{ fontWeight: 800 }}>Новый сотрудник</DialogTitle>
                <DialogContent>
                    {error && <Alert severity="error" sx={{ mb: 2, mt: 1, borderRadius: 2 }}>{error}</Alert>}
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField 
                            label="ФИО"
                            fullWidth
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                        <TextField 
                            label="Email"
                            type="email"
                            fullWidth
                            required
                            value={formData.email}
                            error={formData.email !== '' && !isEmailValid(formData.email)}
                            helperText={formData.email !== '' && !isEmailValid(formData.email) ? "Неверный формат почты" : ""}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                        <TextField 
                            label="Номер машины"
                            placeholder="А111АА199"
                            fullWidth
                            required
                            value={formData.licensePlate}
                            error={formData.licensePlate !== '' && !isPlateValid(formData.licensePlate)}
                            helperText={formData.licensePlate !== '' && !isPlateValid(formData.licensePlate) ? "Формат: А111АА199 (номер и регион)" : ""}
                            onChange={(e) => setFormData({...formData, licensePlate: e.target.value.toUpperCase()})}
                        />
                        <TextField 
                            label="Пароль"
                            type={showPassword ? 'text' : 'password'}
                            fullWidth
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Tooltip title="Показать/скрыть">
                                            <IconButton onClick={() => setShowPassword(!showPassword)}>
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Сгенерировать">
                                            <IconButton onClick={handleGeneratePassword}>
                                                <RefreshIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            select
                            label="Роль"
                            fullWidth
                            value={formData.role}
                            onChange={(e) => setFormData({...formData, role: e.target.value})}
                        >
                            <MenuItem value="ROLE_USER">USER</MenuItem>
                            <MenuItem value="ROLE_ADMIN">ADMIN</MenuItem>
                        </TextField>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => {setError(null); setOpenAdd(false);}} disabled={actionLoading}>Отмена</Button>
                    <Button variant="contained" onClick={handleCreateUser} disabled={actionLoading || !formData.name || !isEmailValid(formData.email) || !isPlateValid(formData.licensePlate) || !formData.password}>
                        {actionLoading ? <CircularProgress size={24} /> : "Создать"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Модальное окно редактирования */}
            <Dialog open={openEdit} onClose={() => {if (!actionLoading) setOpenEdit(false); setError(null); setFormData({ ...formData, tempPassword: '' });}} fullWidth maxWidth="xs">
                <DialogTitle sx={{ fontWeight: 800 }}>Редактирование профиля</DialogTitle>
                <DialogContent>
                    {error && <Alert severity="error" sx={{ mb: 2, mt: 1, borderRadius: 2 }}>{error}</Alert>}
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField 
                            label="ФИО" 
                            fullWidth 
                            value={formData.name} 
                            onChange={(e) => setFormData({...formData, name: e.target.value})} 
                        />
                        <TextField 
                            label="Номер машины"
                            placeholder="А111АА199"
                            fullWidth
                            value={formData.licensePlate}
                            error={formData.licensePlate !== '' && !isPlateValid(formData.licensePlate)}
                            helperText={formData.licensePlate !== '' && !isPlateValid(formData.licensePlate) ? "Неверный формат номера" : ""}
                            onChange={(e) => setFormData({...formData, licensePlate: e.target.value.toUpperCase()})}
                        />
                        
                        <Divider sx={{ my: 1 }}><Typography fontWeight="500">Пароль</Typography></Divider>
                        
                        {/* Если пароль сброшен, показывается поле с ним */}
                        {formData.tempPassword && (
                            <TextField
                                label="Новый пароль"
                                fullWidth
                                focused
                                color="success"
                                value={formData.tempPassword}
                                helperText="Скопируйте и передайте пользователю"
                                InputProps={{
                                    readOnly: true,
                                    style: { fontWeight: 'bold', fontFamily: 'monospace' }
                                }}
                            />
                        )}

                        <Button 
                            variant="outlined" 
                            color="warning" 
                            startIcon={<VpnKeyIcon />}
                            onClick={handleResetPassword}
                        >
                            {formData.tempPassword ? "Сгенерировать другой пароль" : "Сбросить и показать новый пароль"}
                        </Button>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => {
                            setError(null);
                            setOpenEdit(false);
                            setFormData({ ...formData, tempPassword: '' });
                        }}
                        disabled={actionLoading}
                    >
                        Закрыть
                    </Button>
                    <Button variant="contained" disabled={!formData.name || !isPlateValid(formData.licensePlate) || actionLoading} onClick={handleUpdateUser}>
                        {actionLoading ? <CircularProgress size={24} /> : "Сохранить"}
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
                confirmText={modal.type === 'confirm' ? "Удалить" : "Понятно"}
            />
        </Container>
    );
};

export default AdminUsers;