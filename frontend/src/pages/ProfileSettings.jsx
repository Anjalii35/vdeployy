import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance'; 

export default function ProfileSettings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projectCount, setProjectCount] = useState(0);
  const [loadingProjects, setLoadingProjects] = useState(true);

  const joinDate = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'N/A';

  useEffect(() => {
    const fetchRealProjectCount = async () => {
      try {
        const res = await api.get('/projects'); 
        if (Array.isArray(res.data)) {
          setProjectCount(res.data.length);
        } else if (res.data?.content && Array.isArray(res.data.content)) {
          setProjectCount(res.data.content.length);
        }
      } catch (err) {
        console.error("Failed to extract account project count:", err);
      } finally {
        setLoadingProjects(false);
      }
    };
    fetchRealProjectCount();
  }, []);

  return (
    <div className="w-full max-w-[1300px] mx-auto px-6 py-8 relative flex flex-col gap-8 font-sans antialiased text-white mt-12 select-none">
      
      {/* Header Context Tracking Row */}
      <div className="flex flex-col gap-1.5 border-b border-[#252525] pb-5">
        <h2 className="text-xl font-black uppercase tracking-wide">Workspace Profile Settings</h2>
        <p className="text-xs text-neutral-400 font-medium">Verified system authorization profile and cluster parameters.</p>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Read-Only Passport Node (Zero Form Inputs, Zero Broken Buttons) */}
        <div className="md:col-span-2 bg-[#141414] border border-[#252525] rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col gap-6">
          <div className="flex items-center gap-4 border-b border-[#252525]/50 pb-5">
            <div className="w-12 h-12 rounded-xl bg-[#FEC343] text-black font-black text-lg flex items-center justify-center uppercase shadow-lg">
              {user?.name?.substring(0, 2) || 'DV'}
            </div>
            <div>
              <h3 className="text-base font-black uppercase tracking-wide">{user?.name || 'Kuber'}</h3>
              <p className="text-xs text-neutral-500 font-medium mt-0.5">Active Dashboard Session Identity</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#0d0d0d] border border-[#252525] rounded-xl p-4 flex flex-col gap-1">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Email Connection</span>
              <span className="text-sm font-semibold text-neutral-200 truncate">{user?.email || 'abc@gmail.com'}</span>
            </div>
            
            <div className="bg-[#0d0d0d] border border-[#252525] rounded-xl p-4 flex flex-col gap-1">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Assigned Authority Role</span>
              <span className="text-sm font-bold text-[#FEC343] uppercase tracking-wide">{user?.role || 'DEVELOPER'}</span>
            </div>

            <div className="bg-[#0d0d0d] border border-[#252525] rounded-xl p-4 flex flex-col gap-1">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Account Handshake Open Since</span>
              <span className="text-sm font-semibold text-neutral-200 tracking-wide">{joinDate}</span>
            </div>

            <div className="bg-[#0d0d0d] border border-[#252525] rounded-xl p-4 flex flex-col gap-1">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Active Workspace Environments</span>
              <span className="text-sm font-semibold text-neutral-200 tracking-wide">
                {loadingProjects ? '...' : `${projectCount} Active Projects`}
              </span>
            </div>
          </div>

          {/* Clean Dashboard Navigation Escape Link */}
          <div className="flex justify-end pt-2 border-t border-[#252525]/30">
            <button 
              onClick={() => navigate('/dashboard')}
              className="text-xs font-bold text-neutral-400 hover:text-[#FEC343] mt-2 transition-colors cursor-pointer uppercase tracking-wider"
            >
              Return to Project Dashboard →
            </button>
          </div>
        </div>

        {/* Right Column: Deployment Node Status */}
        <div className="bg-[#141414] border border-[#252525] rounded-2xl p-6 shadow-2xl flex flex-col gap-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-200 border-b border-[#252525]/50 pb-3">Runtime Gateway</h3>
          
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center text-xs border-b border-[#252525]/40 pb-2.5">
              <span className="text-neutral-400">Global Edge Network</span>
              <span className="text-emerald-400 font-bold uppercase tracking-wider">Online</span>
            </div>
            <div className="flex justify-between items-center text-xs border-b border-[#252525]/40 pb-2.5">
              <span className="text-neutral-400">Default Region</span>
              <span className="text-neutral-300 font-bold uppercase">us-east-1</span>
            </div>
            <div className="flex justify-between items-center text-xs pb-1">
              <span className="text-neutral-400">SSL Handshake</span>
              <span className="text-neutral-400 font-bold uppercase">Automated</span>
            </div>

            <div className="bg-[#0d0d0d] border border-[#252525] rounded-xl p-4 flex flex-col gap-1.5 mt-2 text-center">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Environment Engine</span>
              <span className="text-xs font-black text-[#FEC343] uppercase tracking-wider animate-pulse">
                vDeploy Core Active
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}