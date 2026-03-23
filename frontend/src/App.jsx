import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';

// Временные компоненты
const AdminOffices = () => <div>Страница админа</div>;
const UserBookings = () => <div>Страница пользователя</div>;

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to='/login' />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to='/login' />;

  return children
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />} />

          {/* Маршруты администратора */}
          <Route 
          path='/admin/offices'
          element={
            <ProtectedRoute allowedRole='ADMIN'>
              <AdminOffices />
            </ProtectedRoute>
          } 
          />

          {/* Маршруты пользователя */}
          <Route
          path='/user/bookings'
          element={
            <ProtectedRoute allowedRole='USER'>
              <UserBookings />
            </ProtectedRoute>
          }
          />

          {/* Редирект с главной страницы на логин */}
          <Route path='/' element={<Navigate to='/login' />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;
