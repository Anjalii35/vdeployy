import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import BackgroundDecor from './components/BackgroundDecor';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import FeaturesSection from './components/FeaturesSection';
import ConfigureProject from './components/ConfigureProject';
import DeploymentStatus from './components/DeploymentStatus';
import DeploymentOverview from './components/DeploymentOverview';
import Dashboard from './pages/Dashboard';
import ProjectDetail from './pages/ProjectDetail';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
// import ContactSection from './components/ContactSection';
import Modal from './components/Modal';
import { useTheme } from './context/ThemeContext';
import { useAuth } from './context/AuthContext';
import ChangePassword from './pages/ProfileSettings';
import ProfileSettings from './pages/ProfileSettings';

// Unified Protected Route Wrapper for dashboard routes
function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function Landing({ onGetStarted, onWatchDemo }) {
  return (
    <>
      <div className="z-20 w-full flex justify-center min-h-[75vh] items-center">
        <Hero onGetStarted={onGetStarted} onWatchDemo={onWatchDemo} />
      </div>
      <FeaturesSection onCtaClick={onGetStarted} />
      <HowItWorks />
      {/* <ContactSection /> */}
    </>
  );
}

function HomeRoute({ onWatchDemo }) {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Landing onGetStarted={() => navigate('/signup')} onWatchDemo={onWatchDemo} />;
}

function App() {
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col items-center font-sans antialiased relative overflow-x-hidden select-none ${isDark ? 'bg-[#0a0a0a] text-white' : 'bg-neutral-100 text-neutral-900'
      }`}>
      {isDark && <BackgroundDecor />}

      {/* Natively sticky Navbar cleanly placed directly in tree structure without wrappers */}
      <Navbar />

      <div className="w-full flex-1">
        <Routes>
          <Route path="/" element={<HomeRoute onWatchDemo={() => setDemoModalOpen(true)} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          {/* Append the new security context endpoint */}
          <Route path="/my-profile" element={<ProfileSettings />} />
          <Route path="/new" element={<ProtectedRoute><ConfigureProject /></ProtectedRoute>} />
          <Route path="/projects/:projectId" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
          <Route path="/deployments/:projectId/status" element={<ProtectedRoute><DeploymentStatus /></ProtectedRoute>} />
          <Route path="/deployments/:deploymentId" element={<ProtectedRoute><DeploymentOverview /></ProtectedRoute>} />
        </Routes>
      </div>

      <Modal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
        title="Demo coming soon"
        actions={
          <button onClick={() => setDemoModalOpen(false)} className="bg-[#FEC343] text-black px-4 py-2 rounded-lg text-xs font-bold">
            Got it
          </button>
        }
      >
        We're recording a walkthrough video. In the meantime, sign up and try deploying a project — it takes less than a minute!
      </Modal>

      {/* Structured Image-Accurate Footer */}
      <footer className="w-full max-w-[1250px] mx-auto px-8 mt-12 pb-10 z-20 flex flex-col gap-6">
        <div className="w-full pt-6 border-t border-[#252525] flex items-center justify-between">

          {/* Logo Left Node */}
          <div className="flex items-center gap-2.5">
            <span className="text-base font-bold tracking-tight text-white text-xl font-sans">VDeploy<span className="text-[#FEC343]">.</span></span>
          </div>

          {/* Social Blocks and Bio Right Node */}
          <div className="flex items-center gap-4">
            <a
              href="https://linkedin.com/in/anjali2201"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-black hover:bg-neutral-200 transition-colors"
              aria-label="LinkedIn"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>

            <a
              href="https://github.com/Anjalii35"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-black hover:bg-neutral-200 transition-colors"
              aria-label="GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
            </a>

            <span className="text-xs text-neutral-400 font-normal font-sans ml-1">
              Made with <span className="text-red-500">❤️</span> for developers
            </span>
          </div>
        </div>

        {/* Center-aligned Subtitle Attribution Node */}
        <div className="w-full text-center text-[11px] text-neutral-400 font-normal font-sans tracking-wide">
          © 2026 VDeploy. A side project by Anjali
        </div>
      </footer>
    </div>
  );
}

export default App;