import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack, MenuItem, InputAdornment, Tooltip, Divider, CircularProgress } from '@mui/material';
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

    // Проверка на заполненность полей
    const isFormInvalid = !formData.name || !isEmailValid(formData.email) || !isPlateValid(formData.licensePlate) || (!openEdit && !formData.password);

    const showModal = (title, message, type = 'success', onConfirm = null) => {
        setModal({ open: true, title, message, type, onConfirm });
    };

    // Получение списка пользователей
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await adminApi.adminUsersGet();
            const sorted = (response.data || []).sort((a, b) => a.id - b.id);
            setUsers(sorted);
        } catch (err) {
            console.error("Ошибка загрузки пользователей", err);
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
        } catch {
            alert("Ошибка генерации");
        }
    };

    // Создание пользователя
    const handleCreateUser = async () => {
        try {
            await adminApi.adminUsersPost(formData);
            setOpenAdd(false);
            setFormData({ email: '', name: '', licensePlate: '', password: '', role: 'ROLE_USER' });
            fetchUsers();
            showModal('Готово!', 'Сотрудник успешно добавлен в систему', 'success');
        } catch {
            showModal('Ошибка', 'Не удалось создать пользователя. Возможно, такой Email уже занят.', 'error');
        }
    };

    // Обновление (ФИО и номер машины)
    const handleUpdateUser = async () => {
        try {
            await adminApi.adminUsersIdPut(selectedUser.id, {
                name: formData.name,
                licensePlate: formData.licensePlate
            });
            setOpenEdit(false);
            fetchUsers();
            showModal('Обновлено', 'Данные сотрудника успешно изменены', 'success');
        } catch {
            alert("Ошибка обновления");
        }
    };

    // Сброс пароля (внутри редактирования)
    const handleResetPassword = async () => {
        try {
            const res = await adminApi.adminUsersIdResetPasswordPost(selectedUser.id);
            // Запись нового пароля в состояние, чтобы он отобразился в поле
            setFormData({ ...formData, tempPassword: res.data.password });
        } catch {
            alert("Ошибка сброса пароля");
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
        try {
            await adminApi.adminUsersIdDelete(id);
            fetchUsers();
            showModal('Удалено', 'Сотрудник полностью удален из системы', 'success');
        } catch {
            alert("Ошибка удаления");
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
                    }}
                >
                    Добавить сотрудника
                </Button>
            </Box>

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
                    <CircularProgress size={40} thickness={4} />
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
                                                setFormData({ name: user.name, licensePlate: user.licensePlate });
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
            <Dialog open={openAdd} onClose={() => setOpenAdd(false)} fullWidth maxWidth="xs">
                <DialogTitle sx={{ fontWeight: 800 }}>Новый сотрудник</DialogTitle>
                <DialogContent>
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
                            helperText={formData.licensePlate !== '' && !isPlateValid(formData.licensePlate) ? "Формат: А111АА199 (буква, 3 цифры, 2 буквы, 3 цифры)" : ""}
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
                    <Button onClick={() => setOpenAdd(false)}>Отмена</Button>
                    <Button variant="contained" onClick={handleCreateUser} disabled={isFormInvalid}>Создать</Button>
                </DialogActions>
            </Dialog>

            {/* Модальное окно редактирования */}
            <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth maxWidth="xs">
                <DialogTitle sx={{ fontWeight: 800 }}>Редактирование профиля</DialogTitle>
                <DialogContent>
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
                        setOpenEdit(false);
                        setFormData({ ...formData, tempPassword: '' });
                    }}>
                        Закрыть
                    </Button>
                    <Button variant="contained" disabled={!formData.name || !isPlateValid(formData.licensePlate)} onClick={handleUpdateUser}>
                        Сохранить изменения
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