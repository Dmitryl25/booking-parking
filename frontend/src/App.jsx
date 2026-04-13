import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Header from './components/Header';
import UserBookings from './pages/user/UserBookings';
import BookingPage from './pages/user/BookingPage';
import AdminOffices from './pages/admin/AdminOffices';

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

          <Route path='*' element={
            <>
              <Header />
              <Routes>
                {/* Маршруты администратора */}
                <Route 
                path='/admin/offices'
                element={
                  <ProtectedRoute allowedRole='ROLE_ADMIN'>
                    <AdminOffices />
                  </ProtectedRoute>
                } 
                />

                {/* Маршруты пользователя */}
                <Route
                path='/user/bookings'
                element={
                  <ProtectedRoute allowedRole='ROLE_USER'>
                    <UserBookings />
                  </ProtectedRoute>
                }
                />
                <Route
                path='/user/booking'
                element={
                  <ProtectedRoute allowedRole='ROLE_USER'>
                    <BookingPage />
                  </ProtectedRoute>
                }
                />

                {/* Редирект с главной страницы на логин */}
                <Route path='/' element={<Navigate to='/login' />} />
              </Routes>
            </>
          }>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;
