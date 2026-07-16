import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProject, updateProject, deleteProject } from '../api/projectApi';
import { getProjectDeployments, deleteDeployment } from '../api/deploymentApi';
import Modal from '../components/Modal';

const statusColor = (status) => {
  switch (status) {
    case 'LIVE': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'FAILED': return 'bg-red-500/10 text-red-400 border-red-500/20';
    case 'QUEUED': return 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20';
    default: return 'bg-[#FEC343]/10 text-[#FEC343] border-[#FEC343]/20';
  }
};

export default function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [deployments, setDeployments] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const pageSize = 6;

  const [confirmModal, setConfirmModal] = useState(null);
  const [errorModal, setErrorModal] = useState('');
  const [busy, setBusy] = useState(false);

  const loadAll = useCallback(() => {
    setLoading(true);
    Promise.all([
      getProject(projectId),
      getProjectDeployments(projectId, pageNo, pageSize),
    ])
      .then(([projRes, depRes]) => {
        setProject(projRes.data);
        setEditName(projRes.data.projectName);
        setEditUrl(projRes.data.githubUrl);
        setDeployments(depRes.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [projectId, pageNo]);

  useEffect(() => { loadAll(); }, [loadAll]);

  const handleSaveEdit = async () => {
    setSaving(true);
    try {
      await updateProject(projectId, editName, editUrl);
      setIsEditing(false);
      loadAll();
    } catch (err) {
      setErrorModal(err.response?.data?.message || err.response?.data || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const confirmDeleteProject = async () => {
    setBusy(true);
    try {
      await deleteProject(projectId);
      setConfirmModal(null);
      navigate('/dashboard');
    } catch (err) {
      setConfirmModal(null);
      setErrorModal(err.response?.data?.message || err.response?.data || 'Delete failed');
    } finally {
      setBusy(false);
    }
  };

  const confirmDeleteDeployment = async () => {
    setBusy(true);
    try {
      await deleteDeployment(confirmModal.id);
      setConfirmModal(null);
      loadAll();
    } catch (err) {
      setConfirmModal(null);
      setErrorModal(err.response?.data?.message || err.response?.data || 'Delete failed');
    } finally {
      setBusy(false);
    }
  };

  if (loading && !project) {
    return <p className="text-neutral-400 text-center mt-20 text-sm font-medium">Loading project details...</p>;
  }

  const hasDeployments = deployments.length > 0;
  const currentDeployment = deployments[0] || null;
  const hasLiveDeployment = deployments.some((d) => d.status === 'LIVE' && d.liveUrl);
  const liveUrl = deployments.find((d) => d.status === 'LIVE' && d.liveUrl)?.liveUrl;

  return (
    <div className="w-full max-w-[1250px] mx-auto px-6 py-16 text-white font-sans antialiased select-none">

      {/* Header Management Module */}
      <div className="mb-8">
        {isEditing ? (
          <div className="flex flex-col gap-3 max-w-md">
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="bg-[#0d0d0d] border border-[#252525] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FEC343]/60"
              placeholder="Project name"
            />
            <input
              value={editUrl}
              onChange={(e) => setEditUrl(e.target.value)}
              className="bg-[#0d0d0d] border border-[#252525] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FEC343]/60 font-mono"
              placeholder="GitHub URL"
            />
            <div className="flex gap-2 mt-1">
              <button onClick={handleSaveEdit} disabled={saving}
                className="bg-[#FEC343] hover:bg-[#e0ab3b] text-black px-4 py-2 rounded-lg text-xs font-bold transition-colors disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
              <button onClick={() => setIsEditing(false)}
                className="border border-[#252525] bg-[#0d0d0d] hover:bg-[#141414] px-4 py-2 rounded-lg text-xs font-bold text-neutral-300 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <span className="inline-block bg-[#0d0d0d] border border-[#252525] text-xs font-bold tracking-wider uppercase text-[#FEC343] px-3 py-1 rounded-full mb-3">
                Project Dashboard
              </span>
              <h1 className="text-4xl font-black tracking-tight truncate">{project?.projectName}</h1>
              <a href={project?.githubUrl} target="_blank" rel="noreferrer" className="text-sm text-neutral-400 hover:text-[#FEC343] mt-2 inline-block truncate max-w-full font-mono transition-colors">
                {project?.githubUrl}
              </a>
            </div>
            <button onClick={() => setIsEditing(true)}
              className="border border-[#252525] bg-[#0d0d0d] hover:bg-[#141414] px-4 py-2.5 rounded-xl text-sm font-bold text-neutral-300 transition-all flex-shrink-0">
              Edit Project
            </button>
          </div>
        )}
      </div>

      {/* Main Structural Breakdown Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[410px_1fr] gap-6 items-start">

        {/* LEFT: Meta Details Block */}
        <div className="bg-[#141414] border border-[#252525] rounded-2xl p-6 flex flex-col gap-5">
          <div className="flex flex-col gap-3.5 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-neutral-500 font-medium">Repository</span>
              <a href={project?.githubUrl} target="_blank" rel="noreferrer" className="text-neutral-300 font-mono hover:text-[#FEC343] truncate text-right hover:underline">
                {project?.githubUrl?.replace('https://github.com/', '')}
              </a>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-500 font-medium">Current Status</span>
              <span className={`px-2.5 py-0.5 rounded border text-xs font-bold tracking-wide ${statusColor(currentDeployment?.status)}`}>
                {currentDeployment?.status || 'NOT DEPLOYED'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-500 font-medium">Active Deployment</span>
              <span className="text-neutral-300 font-mono text-xs">{currentDeployment ? `#${currentDeployment.id}` : '--'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-500 font-medium">Created</span>
              <span className="text-neutral-300 font-medium mb-2">
                {project?.createdAt ? new Date(project.createdAt).toLocaleDateString() : '--'}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-5 border-t border-[#252525]">
            {hasLiveDeployment && (
              <a href={liveUrl} target="_blank" rel="noreferrer"
                className="bg-[#FEC343] hover:bg-[#e0ab3b] text-black shadow-[0_4px_15px_rgba(254,195,67,0.15)] text-center px-4 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-[0.99]">
                Visit Live Site
              </a>
            )}
            <button onClick={() => navigate(`/deployments/${projectId}/status`)}
              className="border border-[#252525] bg-[#0d0d0d] hover:bg-[#141414] px-4 py-2.5 rounded-xl text-sm font-bold text-neutral-300 transition-all">
              🔄 Trigger New Deployment
            </button>
            <button onClick={() => setConfirmModal({ type: 'project' })}
              className="border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 px-4 py-2.5 rounded-xl text-sm font-bold text-red-400 transition-all mt-1">
              Delete Project
            </button>
          </div>
        </div>

        {/* RIGHT: Deployment History / State Modules */}
        <div>
          {!hasDeployments && pageNo === 0 ? (
            <div className="bg-[#141414] border border-[#252525] rounded-2xl flex flex-col items-center justify-center text-center py-20 gap-4 h-full">
              <h2 className="text-lg font-bold text-neutral-300">No deployments generated</h2>
              <p className="text-xs text-neutral-400 max-w-sm leading-relaxed px-4">
                This environment context hasn't been initialized yet. Execute your setup runner below to build now.
              </p>
              <button
                onClick={() => navigate(`/deployments/${projectId}/status`)}
                className="bg-[#FEC343] hover:bg-[#e0ab3b] text-black px-5 py-2 rounded-xl text-sm font-bold shadow-[0_4px_15px_rgba(254,195,67,0.15)] flex items-center gap-2 mt-2 active:scale-[0.99]"
              >
                🚀 Deploy System Now
              </button>
            </div>
          ) : (
            <>
              <h3 className="text-xs font-bold text-neutral-400 tracking-wider uppercase mb-4">Build History</h3>
              <div className="flex flex-col gap-3">
                {deployments.map((dep) => (
                  <div key={dep.id} onClick={() => navigate(`/deployments/${dep.id}`)}
                    className="bg-[#141414] border border-[#252525] rounded-2xl p-5 hover:border-[#3a3a3a] transition-all cursor-pointer flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-neutral-200 font-mono">#{dep.id}</p>
                      <p className="text-xs text-neutral-400 mt-1">
                        {dep.startedAt ? new Date(dep.startedAt).toLocaleString() : '--'}
                        {dep.completedAt ? ` — ${new Date(dep.completedAt).toLocaleTimeString()}` : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <span className={`px-2.5 py-1 rounded-lg border text-xs font-bold tracking-wide ${statusColor(dep.status)}`}>
                        {dep.status}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); setConfirmModal({ type: 'deployment', id: dep.id }); }}
                        className="text-neutral-500 hover:text-red-400 transition-colors text-sm px-1.5 py-1"
                        title="Delete record"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Data Pagination */}
              <div className="flex items-center justify-center gap-4 mt-6">
                <button disabled={pageNo === 0} onClick={() => setPageNo((p) => Math.max(0, p - 1))}
                  className="border border-[#252525] bg-[#0d0d0d] hover:bg-[#141414] px-3 py-1.5 rounded-lg text-xs font-bold text-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  ← Previous
                </button>
                <span className="text-xs font-bold text-neutral-400 font-mono">Page {pageNo + 1}</span>
                <button disabled={deployments.length < pageSize} onClick={() => setPageNo((p) => p + 1)}
                  className="border border-[#252525] bg-[#0d0d0d] hover:bg-[#141414] px-3 py-1.5 rounded-lg text-xs font-bold text-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  Next →
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Confirmation Handling Context */}
      <Modal
        isOpen={!!confirmModal}
        onClose={() => setConfirmModal(null)}
        title={confirmModal?.type === 'project' ? 'Delete This Project?' : 'Remove Deployment Record?'}
        actions={
          <>
            <button onClick={() => setConfirmModal(null)}
              className="border border-[#252525] bg-[#0d0d0d] px-4 py-2 rounded-lg text-xs font-bold text-neutral-300">
              Cancel Action
            </button>
            <button
              onClick={confirmModal?.type === 'project' ? confirmDeleteProject : confirmDeleteDeployment}
              disabled={busy}
              className="bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 px-4 py-2.5 rounded-lg text-xs font-bold disabled:opacity-50"
            >
              {busy ? 'Processing...' : 'Confirm Destruction'}
            </button>
          </>
        }
      >
        {confirmModal?.type === 'project'
          ? 'This will permanently destroy this project shell alongside all mapped running deployment points. This step is completely irreversible.'
          : 'This will permanently delete this deployment record from the architecture tracker. This cannot be undone.'}
      </Modal>

      {/* Global Error Fallback Context */}
      <Modal
        isOpen={!!errorModal}
        onClose={() => setErrorModal('')}
        title="Exception Encountered"
        actions={
          <button onClick={() => setErrorModal('')}
            className="bg-[#FEC343] text-black px-4 py-2 rounded-lg text-xs font-bold">
            Dismiss Request
          </button>
        }
      >
        <p className="text-sm font-medium text-neutral-300 leading-relaxed">{errorModal}</p>
      </Modal>
    </div>
  );
}