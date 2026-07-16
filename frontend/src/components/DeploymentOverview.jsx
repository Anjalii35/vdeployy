import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getDeployment } from '../api/deploymentApi';

const statusColor = (status) => {
  switch (status) {
    case 'LIVE': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'FAILED': return 'bg-red-500/10 text-red-400 border-red-500/20';
    case 'QUEUED': return 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20';
    default: return 'bg-[#FEC343]/10 text-[#FEC343] border-[#FEC343]/20';
  }
};

export default function DeploymentOverview() {
  const { deploymentId } = useParams();
  const [deployment, setDeployment] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [copiedField, setCopiedField] = useState(null);

  // Terminal anchor hook for logs auto-scrolling
  const terminalEndRef = useRef(null);

  useEffect(() => {
    getDeployment(deploymentId)
      .then((res) => setDeployment(res.data))
      .catch((err) => console.error(err));
  }, [deploymentId]);

  // Handle snapping terminal logs frame to bottom container view when opening tab
  useEffect(() => {
    if (activeTab === 'logs' && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeTab, deployment?.logs]);

  const handleCopy = (text, fieldId) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // ADVANCED LOG PARSING ENGINE
  const getLineStyle = (line) => {
    const lowerLine = line.toLowerCase();
    
    if (lowerLine.includes('error') || lowerLine.includes('failed') || lowerLine.includes('fatal')) {
      return 'text-red-400 font-semibold bg-red-500/5 px-1 rounded';
    }
    if (lowerLine.includes('completed') || lowerLine.includes('success') || lowerLine.includes('✓') || lowerLine.includes('live url')) {
      return 'text-emerald-400 font-bold bg-emerald-500/5 px-1 rounded';
    }
    if (lowerLine.includes('cloning into') || lowerLine.includes('framework detected') || lowerLine.includes('using docker image')) {
      return 'text-cyan-400 font-semibold tracking-wide';
    }
    if (lowerLine.includes('building for production') || lowerLine.includes('transforming') || lowerLine.includes('rendering chunks')) {
      return 'text-[#FEC343] font-medium';
    }
    if (lowerLine.includes('dist/') || lowerLine.includes('kb | gzip:')) {
      return 'text-indigo-300 font-mono opacity-90';
    }
    if (line.startsWith('>') || lowerLine.includes('vite build')) {
      return 'text-purple-400 font-mono font-bold';
    }
    if (lowerLine.includes('warn') || lowerLine.includes('vulnerabilities') || lowerLine.includes('looking for funding')) {
      return 'text-amber-400/90 italic';
    }
    if (lowerLine.includes('npm notice')) {
      return 'text-neutral-500 font-mono';
    }

    return 'text-neutral-300';
  };

  if (!deployment) {
    return <p className="text-neutral-400 text-center mt-20 text-sm font-medium">Loading environment context...</p>;
  }

  const projectUrl = deployment.liveUrl || '';
  const isFailed = deployment.status === 'FAILED';
  const isLive = deployment.status === 'LIVE';
  const badgeClass = statusColor(deployment.status);
  
  // Format long raw string log sequences into digestible array strings
  const parsedLogLines = deployment.logs ? deployment.logs.split('\n').filter(Boolean) : [];

  return (
    <div className="w-full max-w-[1300px] mx-auto px-6 py-8 z-20 relative flex flex-col gap-6 font-sans antialiased text-white mt-12 select-none">

      {/* Top Meta Indicator Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#141414] border border-[#252525] rounded-2xl p-5 flex flex-col gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Domain</span>
          <div className="flex items-center gap-2 mt-1 min-w-0">
            {projectUrl ? (
              <a href={projectUrl} target="_blank" rel="noreferrer" className="text-sm text-neutral-200 hover:text-[#FEC343] truncate font-medium transition-colors font-mono">
                {projectUrl.replace('https://', '')}
              </a>
            ) : (
              <span className="text-xs text-neutral-500 font-medium">
                {isFailed ? 'Build failed — no url' : `Awaiting Status`}
              </span>
            )}
          </div>
        </div>

        <div className="bg-[#141414] border border-[#252525] rounded-2xl p-5 flex flex-col gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Current Status</span>
          <span className={`text-sm font-bold mt-1 tracking-wide ${isFailed ? 'text-red-400' : isLive ? 'text-emerald-400' : 'text-[#FEC343]'}`}>
            {deployment.status}
          </span>
        </div>

        <div className="bg-[#141414] border border-[#252525] rounded-2xl p-5 flex flex-col gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Started</span>
          <span className="text-sm font-bold text-neutral-200 mt-1 font-mono">
            {deployment.startedAt ? new Date(deployment.startedAt).toLocaleString() : '--'}
          </span>
        </div>

        <div className="bg-[#141414] border border-[#252525] rounded-2xl p-5 flex flex-col gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Completed</span>
          <span className="text-sm font-bold text-neutral-200 mt-1 font-mono">
            {deployment.completedAt ? new Date(deployment.completedAt).toLocaleString() : '--'}
          </span>
        </div>
      </div>

      {/* Navigation Switch Tabs */}
      <div className="w-full flex bg-[#0d0d0d] border border-[#252525] rounded-xl p-1 mt-5">
        {['Overview', 'Logs'].map((tab) => {
          const lowerTab = tab.toLowerCase();
          const isSelected = activeTab === lowerTab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(lowerTab)}
              className={`flex-1 text-center py-2 rounded-lg text-sm font-bold tracking-wide transition-all cursor-pointer ${
                isSelected 
                  ? 'bg-[#141414] text-[#FEC343] border border-[#252525] shadow-md' 
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Primary Tab Viewport Panels */}
      {activeTab === 'overview' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-1">
          <div className="bg-[#141414] border border-[#252525] rounded-2xl p-7 flex flex-col gap-5">
            <h3 className="text-sm font-bold text-neutral-200 uppercase tracking-wider">Repository Specs</h3>
            <div className="flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <span className="text-neutral-400 font-medium">Source Path</span>
                <div className="flex items-center justify-between bg-[#0d0d0d] border border-[#252525] rounded-xl px-4 py-3">
                  <a href={deployment.githubUrl} target="_blank" rel="noreferrer" className="text-neutral-300 font-mono font-medium hover:text-[#FEC343] truncate max-w-[85%]">
                    {deployment.githubUrl}
                  </a>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-neutral-400 font-medium">Deployment ID Reference</span>
                <div className="flex items-center justify-between bg-[#0d0d0d] border border-[#252525] rounded-xl px-4 py-3 font-mono text-xs">
                  <span className="text-neutral-300 select-all font-semibold">{deployment.id}</span>
                  <button onClick={() => handleCopy(String(deployment.id), 'pid')} className="text-neutral-400 hover:text-[#FEC343] font-bold transition-colors">
                    {copiedField === 'pid' ? <span className="text-xs text-emerald-400 font-bold">Copied!</span> : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#141414] border border-[#252525] rounded-2xl p-6 flex flex-col gap-5">
            <h3 className="text-sm font-bold text-neutral-200 uppercase tracking-wider">Deployment Routing</h3>
            <div className="flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <span className="text-neutral-400 font-medium">Production URL Link</span>
                <div className="flex items-center justify-between bg-[#0d0d0d] border border-[#252525] rounded-xl px-4 py-3 font-mono">
                  <span className="text-neutral-300 font-medium truncate max-w-[85%]">{projectUrl || '--'}</span>
                  {projectUrl && (
                    <button onClick={() => handleCopy(projectUrl, 'purl')} className="text-neutral-400 hover:text-[#FEC343] font-bold transition-colors">
                      {copiedField === 'purl' ? <span className="text-xs text-emerald-400 font-bold">Copied!</span> : 'Copy'}
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div className="flex flex-col gap-1.5">
                  <span className="text-neutral-400 font-medium">Environment Badge</span>
                  <div className={`flex items-center gap-1.5 border px-3 py-1 rounded-xl w-fit font-bold text-xs tracking-wide ${badgeClass}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isFailed ? 'bg-red-400' : isLive ? 'bg-emerald-400' : 'bg-[#FEC343]'}`} />
                    <span>{deployment.status}</span>
                  </div>
                </div>
                {projectUrl && (
                  <a href={projectUrl} target="_blank" rel="noreferrer" className="border border-[#252525] bg-[#0d0d0d] hover:bg-[#141414] px-4 py-2.5 rounded-xl font-bold text-neutral-300 hover:text-white transition-all flex items-center gap-1.5 text-xs w-fit active:scale-[0.99]">
                    Visit Environment
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Colored Terminal Panel View */
        <div className="bg-[#141414] border border-[#252525] rounded-2xl p-6">
          <div className="w-full bg-[#0d0d0d] rounded-xl border border-[#252525] p-5 font-mono text-xs leading-relaxed overflow-y-auto max-h-[500px] min-h-[300px] whitespace-pre-wrap select-text">
            {parsedLogLines.length === 0 ? (
              <span className="text-neutral-500 font-medium">No system compile logs outputted for this runner context.</span>
            ) : (
              parsedLogLines.map((line, i) => (
                <div 
                  key={i} 
                  className={`min-h-[18px] transition-colors duration-150 ${getLineStyle(line)}`}
                >
                  {line}
                </div>
              ))
            )}
            <div ref={terminalEndRef} />
          </div>
        </div>
      )}
    </div>
  );
}