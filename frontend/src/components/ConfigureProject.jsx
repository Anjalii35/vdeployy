import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../api/projectApi';

export default function ConfigureProject() {
  const [projectName, setProjectName] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCreate = async () => {
    setError('');
    if (!projectName || !githubUrl) {
      setError('Project name and GitHub URL are required.');
      return;
    }
    setIsCreating(true);
    try {
      const res = await createProject(projectName, githubUrl);
      navigate(`/projects/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Could not create project');
      setIsCreating(false);
    }
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto px-6 py-10 z-20 relative grid grid-cols-1 md:grid-cols-3 gap-6 font-sans antialiased text-white mt-16 select-none">

      {/* Sidebar Metadata Cards */}
      <div className="flex flex-col gap-6">
        <div className="bg-[#141414] border border-[#252525] rounded-2xl p-6 flex flex-col gap-4">
          <h4 className="text-xs font-bold text-neutral-400 tracking-wider uppercase">Framework Preset</h4>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#FEC343]/10 text-[#FEC343] border border-[#FEC343]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">Auto Detect</h3>
              <p className="text-xs text-neutral-400 leading-relaxed mt-1">Framework is detected automatically from your repo during build.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-2.5 py-0.5 rounded bg-[#0d0d0d] border border-[#252525] text-xs font-medium text-neutral-400">Server-side detection</span>
          </div>
        </div>

        <div className="bg-[#141414] border border-[#252525] rounded-2xl p-6 flex flex-col gap-4">
          <h4 className="text-xs font-bold text-neutral-400 tracking-wider uppercase">Repository</h4>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-neutral-200">
              <svg className="w-4 h-4 text-neutral-400" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              <span className="text-xs font-bold tracking-wide text-neutral-200">
                {githubUrl ? githubUrl.replace('https://github.com/', '') : 'Paste your repo URL →'}
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed font-normal">
              Paste a public GitHub repository URL on the right. You'll deploy it from the project page after creating it.
            </p>
          </div>
        </div>
      </div>

      {/* Configuration Form Module */}
      <div className="md:col-span-2 bg-[#141414] border border-[#252525] rounded-2xl p-8 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white mb-1.5">Configure Project</h2>
          <p className="text-sm text-neutral-400 leading-relaxed mb-8">
            Enter your project name and GitHub repository URL.
          </p>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-neutral-300 tracking-wide">Project Name</label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="my-awesome-app"
                className="w-full bg-[#0d0d0d] border border-[#252525] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FEC343]/60 font-sans transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-neutral-300 tracking-wide">GitHub URL</label>
              <input
                type="text"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username/repo"
                className="w-full bg-[#0d0d0d] border border-[#252525] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FEC343]/60 font-mono transition-colors"
              />
              <span className="text-xs text-neutral-500 font-sans mt-0.5">Must be a public repository URL starting with https://github.com/</span>
            </div>
          </div>
        </div>

        {/* Action Blocks */}
        <div className="pt-8 mt-8 border-t border-[#252525]">
          {error && <p className="text-red-400 text-sm mb-4 font-medium">{error}</p>}
          <button
            onClick={handleCreate}
            disabled={isCreating}
            className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all ${
              isCreating
                ? 'bg-[#1c1c1c] text-neutral-500 border border-[#252525] cursor-not-allowed opacity-50'
                : 'bg-[#FEC343] hover:bg-[#e0ab3b] text-black shadow-[0_4px_20px_rgba(254,195,67,0.15)] hover:shadow-[0_4px_25px_rgba(254,195,67,0.3)] active:scale-[0.99]'
            }`}
          >
            {isCreating && (
              <svg className="animate-spin h-4 w-4 text-neutral-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            <span>{isCreating ? 'Creating...' : 'Create Project'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}