import React, { useState, useEffect } from 'react';
import { registerUser, loginUser } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AuthModal({ isOpen, onClose, initialMode }) {
  const [isSignUp, setIsSignUp] = useState(initialMode === 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setIsSignUp(initialMode === 'signup');
      setError(''); setEmail(''); setPassword(''); setName('');
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      if (isSignUp) {
        await registerUser(name, email, password);
        const res = await loginUser(email, password);
        login(res.data);
      } else {
        const res = await loginUser(email, password);
        login(res.data);
      }
      onClose();
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'An authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#141414] border border-[#252525] rounded-2xl p-8 shadow-2xl z-10 font-sans text-white">
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors cursor-pointer">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <h3 className="text-xl font-black text-white tracking-wide uppercase">{isSignUp ? 'Get Started' : 'Welcome Back'}</h3>
          <p className="text-xs text-neutral-400 mt-1.5 font-medium">{isSignUp ? 'Deploy applications instantly across the platform cluster.' : 'Manage and optimize your active runtime deployments.'}</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl px-4 py-2.5 mb-4 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Full Name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Carter"
                className="w-full bg-[#0d0d0d] border border-[#252525] rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-700 focus:outline-none focus:border-[#FEC343]" />
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Email Address</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@domain.com"
              className="w-full bg-[#0d0d0d] border border-[#252525] rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-700 focus:outline-none focus:border-[#FEC343]" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
              className="w-full bg-[#0d0d0d] border border-[#252525] rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-700 focus:outline-none focus:border-[#FEC343]" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-[#FEC343] hover:bg-[#e5b03b] text-neutral-950 text-xs font-bold py-3.5 rounded-xl transition-all mt-2 disabled:opacity-50 active:scale-[0.99] cursor-pointer">
            {loading ? 'Processing Transaction context...' : isSignUp ? 'Create Workspace Profile' : 'Authenticate Credentials'}
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-neutral-400 font-medium">
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="text-[#FEC343] hover:underline font-bold ml-0.5 cursor-pointer">
            {isSignUp ? 'Sign In' : 'Sign Up Free'}
          </button>
        </div>
      </div>
    </div>
  );
}