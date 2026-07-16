import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProjects } from '../api/projectApi';
// 👇 Import the endpoint you use to get deployments on your project details page
import { getProjectDeployments } from '../api/deploymentApi';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const pageSize = 6;

  useEffect(() => {
    setLoading(true);
    getUserProjects(pageNo, pageSize)
      .then(async (res) => {
        const rawProjects = res.data;

        // 🔄 Loop through each project and fetch its deployments individually
        const projectsWithDeployments = await Promise.all(
          rawProjects.map(async (project) => {
            try {
              // Fetch deployment history using the project's ID
              const deploymentRes = await getProjectDeployments(project.id);

              return {
                ...project,
                // Attach the array so our thumbnail UI loop can see it
                deployments: deploymentRes.data || []
              };
            } catch (err) {
              console.error(`Failed to fetch deployments for project ${project.id}`, err);
              return { ...project, deployments: [] };
            }
          })
        );

        setProjects(projectsWithDeployments);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [pageNo]);

  return (
    <div className="w-full max-w-[1300px] mx-auto px-6 py-12 text-white font-sans min-h-screen select-none antialiased">

      {/* Top Bar Navigation Block */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <span className="inline-block bg-[#141414] border border-[#252525] text-[11px] font-bold tracking-wider uppercase text-[#FEC343] px-2.5 py-1 rounded-full mb-3">
            Overview
          </span>
          <h1 className="text-xl font-black tracking-tight md:text-2xl">Active Deployments</h1>
          <p className="text-xs text-neutral-400 mt-1">Manage your web domains, server routing, and edge hooks.</p>
        </div>
        <button
          onClick={() => navigate('/new')}
          className="bg-[#FEC343] hover:bg-[#e0ab3b] text-black px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 flex-shrink-0 transition-all shadow-[0_4px_20px_rgba(254,195,67,0.15)] hover:shadow-[0_4px_25px_rgba(254,195,67,0.3)] active:scale-[0.99]"
        >
          + New Project
        </button>
      </div>

      {/* Information Banner */}
      <div className="bg-[#141414] border border-[#252525] rounded-2xl px-5 py-3.5 flex items-center justify-between mb-8">
        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <svg className="w-5 h-5 text-[#FEC343]" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
          </svg>
          <span>Connected: <span className="text-white font-semibold">{projects.length}</span> repository links on page</span>
        </div>
      </div>

      <h4 className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-3 ms-1">Active Deployments</h4>

      {/* Projects Render Matrix */}
      {loading ? (
        <p className="text-[#FEC343] text-xs font-mono tracking-wide animate-pulse">Fetching index clusters...</p>
      ) : projects.length === 0 ? (
        <div className="bg-[#141414] border border-[#252525] rounded-2xl p-12 text-center">
          <p className="text-neutral-400 text-xs mb-4">
            {pageNo === 0 ? 'No deployments matched this view. Create your first live domain!' : 'End of active production listings.'}
          </p>
          {pageNo === 0 && (
            <button
              onClick={() => navigate('/new')}
              className="bg-[#FEC343] hover:bg-[#e0ab3b] text-black px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-[0_4px_15px_rgba(254,195,67,0.15)] active:scale-[0.99]"
            >
              Launch Stack
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {projects.map((p, idx) => {

            // 👇 Extracts the liveUrl from the frontend-populated array entries
            let targetLiveUrl = '';
            if (p.deployments && p.deployments.length > 0) {
              const latest = p.deployments[0];
              if (latest && latest.liveUrl) {
                targetLiveUrl = latest.liveUrl;
              }
            }

            return (
              <div
                key={p.id || idx}
                onClick={() => navigate(`/projects/${p.id}`)}
                className="bg-[#141414] border border-[#252525] hover:border-neutral-700 rounded-xl p-3 cursor-pointer transition-all duration-200 flex flex-col group"
              >
                {/* Image preview box */}
                <div className="aspect-[1.75/1] w-full bg-[#0a0a0a] border border-neutral-900/60 rounded-lg overflow-hidden relative flex items-center justify-center">
                  {targetLiveUrl ? (
                    <img
                      src={`https://api.microlink.io/?url=${encodeURIComponent(targetLiveUrl)}&screenshot=true&embed=screenshot.url`}
                      alt={`${p.projectName || 'App'} site preview thumbnail`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                  ) : (
                    /* Sleek Technical Placeholder Explicitly Indicating Missing Deployments */
                    <div className="w-full h-full bg-[#0a0a0a] flex flex-col justify-between p-4 font-mono select-none border border-neutral-900/40 rounded-lg">
                      {/* Terminal header controls */}
                      <div className="flex items-center justify-between w-full opacity-60">
                        <div className="flex gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-neutral-800"></span>
                          <span className="w-2 h-2 rounded-full bg-neutral-800"></span>
                          <span className="w-2 h-2 rounded-full bg-neutral-800"></span>
                        </div>
                        {/* Explicit warning tag */}
                        <div className="flex items-center gap-1.5 bg-red-950/30 border border-red-900/50 px-2 py-0.5 rounded-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                          <span className="text-[9px] uppercase tracking-wider text-red-400 font-bold">No Deployments</span>
                        </div>
                      </div>

                      {/* Center Message */}
                      <div className="flex flex-col items-center justify-center my-auto gap-2 opacity-40 group-hover:opacity-60 transition-opacity">
                        <svg className="w-8 h-8 text-neutral-500 group-hover:text-red-400 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div className="text-center">
                          <span className="text-[10px] font-bold text-neutral-400 tracking-wider uppercase block">
                            No Live Deployments Found
                          </span>
                          <span className="text-[9px] text-neutral-600 font-sans mt-0.5 block">
                            Open this project and trigger a build pipeline
                          </span>
                        </div>
                      </div>

                      {/* Bottom string code log path */}
                      <div className="text-[9px] text-neutral-700 truncate w-full border-t border-neutral-900/60 pt-2 opacity-50和">
                        vdeploy_router://empty_deployment_history_array
                      </div>
                    </div>
                  )}
                </div>

                {/* Metadata */}
                <div className="pt-3 pb-0.5 px-1">
                  <span className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500">DEPLOYMENT</span>
                  <h3 className="text-base font-bold text-white mt-0.5 group-hover:text-[#FEC343] transition-colors truncate">
                    {p.projectName || "generated-slug-string"}
                  </h3>
                  <p className="text-xs text-neutral-500 font-mono mt-0.5 truncate opacity-70">
                    {p.githubUrl ? p.githubUrl.replace('https://github.com/', '') : "repo/root-branch"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Container */}
      <div className="flex items-center justify-center gap-3 mt-10">
        <button
          disabled={pageNo === 0}
          onClick={() => setPageNo((p) => Math.max(0, p - 1))}
          className="border border-[#252525] bg-[#0d0d0d] hover:bg-[#141414] px-3.5 py-1.5 rounded-lg text-xs font-semibold text-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          &larr; Prev
        </button>
        <span className="text-xs font-mono text-neutral-400 bg-[#141414] border border-[#252525] px-2.5 py-1 rounded-md">
          Page {pageNo + 1}
        </span>
        <button
          disabled={projects.length < pageSize}
          onClick={() => setPageNo((p) => p + 1)}
          className="border border-[#252525] bg-[#0d0d0d] hover:bg-[#141414] px-3.5 py-1.5 rounded-lg text-xs font-semibold text-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          Next &rarr;
        </button>
      </div>

    </div>
  );
}