import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import NotFound from './NotFound';

export default function Login() {
  const [searchParams] = useSearchParams();
  const secretKey = searchParams.get('key');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  if (secretKey !== 'qwerty') {
    return <NotFound />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await axios.post(`http://localhost:8000/api/login?key=${secretKey}`, {
        email,
        password
      });

      if (res.data.success) {
        localStorage.setItem('adminToken', res.data.token);
        navigate('/dashboard');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMsg(error.response.data.message || 'Login failed. Please check your credentials.');
      } else {
        setErrorMsg('Network error. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mt-20 px-4 sm:px-0">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Admin Login</h2>

        {errorMsg && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-xs font-semibold text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-xs font-bold mb-2">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-gray-300 rounded-lg p-3 border focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm" 
              required 
              placeholder="admin@nexicon.id" 
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-xs font-bold mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-gray-300 rounded-lg p-3 border focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm" 
              required 
              placeholder="••••••••" 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 text-sm shadow-sm ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}