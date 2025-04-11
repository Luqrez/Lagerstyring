import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders.tsx';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Header from './components/Header';
import StockVarer from './pages/stock/Varer.tsx';
import StockKategorier from './pages/stock/Kategorier.tsx';

import './styles/App.css';

function App() {
  return (
    <div className="app">
      <Header />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/users" element={<Users />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/stock/varer" element={<StockVarer />} />
        <Route path="/stock/kategorier" element={<StockKategorier />} />
      </Routes>
    </div>
  );
}

export default App;
