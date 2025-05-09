import { Routes, Route } from 'react-router-dom';
import Login from './pages/login/Login.tsx';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders.tsx';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Header from './components/Header';
import StockVarer from './pages/stock/Varer.tsx';
import StockKategorier from './pages/stock/Kategorier.tsx';
import Signup from './pages/login/Signup.tsx';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './components/Toast';
import RoleBasedRoute from './components/RoleBasedRoute';

import './styles/App.css';

function App() {
  console.log('App.tsx: Rendering App component');

  return (
    <AuthProvider>
      <ToastProvider>
        <div className="app">
          <Header />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/users" element={
              <RoleBasedRoute allowedRoles={['admin']} redirectTo="/">
                <Users />
              </RoleBasedRoute>
            } />
            <Route path="/settings" element={
              <RoleBasedRoute allowedRoles={['admin']} redirectTo="/">
                <Settings />
              </RoleBasedRoute>
            } />
            <Route path="/stock/varer" element={<StockVarer />} />
            <Route path="/stock/kategorier" element={<StockKategorier />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
