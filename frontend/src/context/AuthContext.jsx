import { createContext, useState, useContext } from "react";
import { jwtDecode } from "jwt-decode";

// Создание контекста
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // Инициализируем состояние данными из localStorage, чтобы при перезагрузке страницы логин не слетал
    const [ user, setUser ] = useState(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                return { token, role: decoded.role }
            } catch {
                return null
            }
        }
        return null
    })

    // Функция входа: сохраняет данные в состояние и в браузер
    const login = (accessToken, refreshToken) => {
        if (!accessToken || !refreshToken) {
            console.error("Попытка логина с пустыми токенами");
            return
        }
        
        const decoded = jwtDecode(accessToken);
        
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        setUser({ token: accessToken, role: decoded.role });
    }

    // Функция выхода: все очищает
    const logout = () => {
        localStorage.clear();
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