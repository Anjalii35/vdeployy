import React, { useState } from 'react';
import { registerUser } from '../api/authApi';
import { useNavigate } from 'react-router-dom';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await registerUser(name, email, password);
      navigate('/login');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        (typeof err.response?.data === 'string' ? err.response.data : null) ||
        'Something went wrong'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center p-6 bg-[#0a0a0a] antialiased select-none">
      <div className="w-full max-w-md bg-[#141414] border border-[#252525] rounded-2xl p-8 md:p-10 shadow-2xl font-sans">
        <div className="text-center mb-8">
          <h3 className="text-2xl md:text-3xl font-black text-white mb-2 tracking-tight">Create your account</h3>
          <p className="text-xs md:text-sm text-neutral-400">Start deploying your static files to edge servers instantly.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl px-4 py-3 mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[13px] font-bold text-neutral-200 ms-1 uppercase mb-1 tracking-wide">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Carter"
              className="w-full bg-[#0d0d0d] border border-[#252525] rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-700 focus:outline-none focus:border-[#FEC343]/60 font-sans transition-colors"
            />
          </div>

          <div>
            <label className="block text-[13px] font-bold text-neutral-200 ms-1 uppercase mb-1 tracking-wide">Email Address</label>
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
            <label className="block text-[13px] font-bold text-neutral-200 ms-1 uppercase mb-1 tracking-wide">Password</label>
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
            {loading ? 'Please wait...' : 'Register Now'}
          </button>
        </form>

        <div className="text-center mt-8 text-xs md:text-sm text-neutral-400 font-normal">
          Already have an account?
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-[#FEC343] hover:underline font-bold ml-1.5 transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}