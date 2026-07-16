import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import myImage from '../assets/dp.jpg';

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const profileRef = useRef(null);
  const { isLoggedIn, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => { setDropdownOpen(false); setProfileOpen(false); }, [location.pathname]);
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => { logout(); setProfileOpen(false); navigate('/'); };

  return (
    <header className="sticky top-0 w-full bg-[#0d0d0d]/80 backdrop-blur-md border-b py-1 border-[#252525] z-50 transition-all">
      <div className="h-16 flex items-center justify-between px-8 max-w-[1300px] mx-auto w-full">
        <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => navigate('/')}>
          <span className="text-[21px] font-black tracking-tight text-white uppercase">
            vDeploy<span className="text-[#FEC343]">.</span>
          </span>
        </div>

        <div className="flex items-center gap-6">
          {!isLoggedIn ? (
            <>
              <button onClick={() => navigate('/login')} className="text-neutral-300 hover:text-white text-sm font-medium transition-colors">
                Log in
              </button>
              <button onClick={() => navigate('/signup')} className="bg-[#FEC343] hover:bg-[#e0ab3b] text-black px-4 py-2 rounded-xl text-sm font-bold tracking-wide transition-all shadow-[0_4px_20px_rgba(254,195,67,0.15)] hover:shadow-[0_4px_25px_rgba(254,195,67,0.3)] transition-all active:scale-[0.98]">
                Sign up <span>→</span>
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/dashboard')} className="border border-[#252525] bg-[#FEC343] hover:bg-[#e0ab3b] text-black px-4 py-2 rounded-xl text-xs font-semibold transition-all">
                Dashboard
              </button>

              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-1.5 text-neutral-300 hover:text-white text-xs font-medium transition-colors">
                  New Project <span className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}>▾</span>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-44 bg-[#141414] border border-[#252525] rounded-xl shadow-2xl py-1.5 z-50">
                    <button onClick={() => { navigate('/new'); setDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-xs text-neutral-300 hover:bg-white/5 hover:text-white transition-colors">New Project</button>
                    <button onClick={() => { navigate('/dashboard'); setDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-xs text-neutral-300 hover:bg-white/5 hover:text-white transition-colors">All Projects</button>
                  </div>
                )}
              </div>

              <div className="relative" ref={profileRef}>
                <div onClick={() => setProfileOpen(!profileOpen)} className="w-9 h-9 rounded-full overflow-hidden bg-neutral-500 cursor-pointer border border-[#252525]">
                  <img src={myImage} alt="" className="w-full h-full object-cover grayscale" />
                </div>
                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-52 bg-[#141414] border border-[#252525] rounded-xl shadow-2xl py-1.5 z-50">
                    <div className="px-4 py-2 border-b border-[#252525] mb-1">
                      <p className="text-sm font-semibold text-white truncate">{user?.name || 'User'}</p>
                      <p className="text-[12px] text-neutral-500 truncate">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        navigate('/my-profile');
                        setDropdownOpen(false); // Make sure to close your menu state here
                      }}
                      className="w-full text-left text-xs font-bold text-neutral-300 hover:text-white hover:bg-[#0d0d0d] px-3 py-2 rounded-lg transition-all cursor-pointer uppercase tracking-wider"
                    >
                      My Profile
                    </button>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-[#FEC343] hover:bg-white/5 transition-colors">Log out</button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}