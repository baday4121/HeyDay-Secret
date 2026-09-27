import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDetail from './pages/AdminDetail';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/message/:id" element={<Detail />} />
          <Route path="/login-baday" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} /> 
          <Route path="/admin/message/:id" element={<AdminDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}