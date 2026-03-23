import { createContext, useState, useContext } from "react";

// Создание контекста
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // Инициализируем состояние данными из localStorage, чтобы при перезагрузке страницы логин не слетал
    const [ user, setUser ] = useState(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        return token ? { token, role } : null
    })

    // Функция входа: сохраняет данные в состояние и в браузер
    const login = (token, role) => {
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        setUser({ token, role });
    }

    // Функция выхода: все очищает
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
};

// Кастомный хук для доступа к контексту
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);