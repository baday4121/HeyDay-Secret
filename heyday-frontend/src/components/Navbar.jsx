import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/logout', {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.removeItem('adminToken');
      navigate('/');
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2.5 group">
          <img 
            src="/logo.png" 
            alt="Logo" 
            className="w-8 h-8 object-contain rounded-lg shadow-sm border border-gray-100 group-hover:scale-105 transition duration-200" 
          />
          <span className="font-bold text-lg text-gray-800 tracking-tight">
            Hey<span className="text-blue-600">Day</span> Secret
          </span>
        </Link>
        
        {token && (
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="text-xs font-semibold text-gray-500 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full hidden sm:inline-block hover:bg-gray-100 hover:text-blue-600 transition shadow-sm">
              Admin Mode
            </Link>
            <form onSubmit={handleLogout}>
              <button type="submit" className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition shadow-sm">
                Logout
              </button>
            </form>
          </div>
        )}
      </div>
    </nav>
  );
}