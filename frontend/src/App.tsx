
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import Database from './components/Database';
import './styles/App.css';

function App() {
    return (
      <div className="app">
        <Header/>
        <Database/>
        <Routes>
          <Route path="/" element={<Dashboard/>} />
          <Route path="/login" element={<Login/>} />
        </Routes>
      </div>
    );
}

export default App;