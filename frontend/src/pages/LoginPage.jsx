import React, { useState } from 'react';
import { loginUser } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
    setLoading(true);
    try {
      const res = await loginUser(email, password);
      login(res.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center p-6 bg-[#0a0a0a] antialiased select-none">
      <div className="w-full max-w-md bg-[#141414] border border-[#252525] rounded-2xl p-8 md:p-10 shadow-2xl font-sans">
        
        {/* Header Node */}
        <div className="text-center mb-8">
          <h3 className="text-2xl md:text-3xl font-black text-white mb-2 tracking-tight">Welcome back</h3>
          <p className="text-xs md:text-sm text-neutral-400">Log in to manage your active cloud deployments.</p>
        </div>

        {/* Error Feedback Banner */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl px-4 py-3 mb-5">
            {error}
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[13px] font-bold ms-1 pt-2 text-neutral-200 uppercase mb-1 tracking-wide">
              Email Address
            </label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="name@domain.com"
              className="w-full bg-[#0d0d0d] border border-[#252525] rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-700 focus:outline-none focus:border-[#FEC343]/60 font-mono transition-colors" 
            />
          </div>

          <div>
            <label className="block text-[13px] ms-1 font-bold text-neutral-200 uppercase mb-1 tracking-wide">
              Password
            </label>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••"
              className="w-full bg-[#0d0d0d] border border-[#252525] rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-700 focus:outline-none focus:border-[#FEC343]/60 font-mono transition-colors" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#FEC343] hover:bg-[#e0ab3b] disabled:opacity-50 text-black text-xs md:text-sm font-bold py-3.5 rounded-xl transition-all mt-3 tracking-wide shadow-[0_4px_20px_rgba(254,195,67,0.15)] hover:shadow-[0_4px_25px_rgba(254,195,67,0.3)] active:scale-[0.99]"
          >
            {loading ? 'Processing...' : 'Login'}
          </button>
        </form>

        {/* Footer Redirect Route */}
        <div className="text-center mt-8 text-xs md:text-sm text-neutral-400 font-normal">
          Don't have an account? 
          <button 
            type="button" 
            onClick={() => navigate('/signup')} 
            className="text-[#FEC343] hover:underline font-bold ml-1.5 transition-colors"
          >
            Sign Up
          </button>
        </div>

      </div>
    </div>
  );
}