import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { triggerDeploy, getDeployment } from '../api/deploymentApi';

export default function DeploymentStatus() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [deployment, setDeployment] = useState(null);
  const [isDeploying, setIsDeploying] = useState(true);
  const [error, setError] = useState('');
  const hasStarted = useRef(false);
  const pollInterval = useRef(null);

  // Stream simulation configuration states to smooth out text blocks
  const [displayedLogs, setDisplayedLogs] = useState([]);
  const allLogsRef = useRef([]);
  const currentLogIndexRef = useRef(0);
  const streamIntervalRef = useRef(null);
  const terminalEndRef = useRef(null);

  // Auto-scroll the terminal container down when new rows arrive
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [displayedLogs]);

  // Read lines from local cache buffer array step-by-step
  const startLocalLogStream = () => {
    if (streamIntervalRef.current) return;

    streamIntervalRef.current = setInterval(() => {
      if (currentLogIndexRef.current < allLogsRef.current.length) {
        const nextLine = allLogsRef.current[currentLogIndexRef.current];
        setDisplayedLogs((prev) => [...prev, nextLine]);
        currentLogIndexRef.current += 1;
      } else if (!isDeploying) {
        clearInterval(streamIntervalRef.current);
        streamIntervalRef.current = null;
      }
    }, 40); // 40ms printing cadence speed modifier
  };

  const startPolling = (deploymentId) => {
    pollInterval.current = setInterval(async () => {
      try {
        const res = await getDeployment(deploymentId);
        const data = res.data;
        setDeployment(data);

        if (data?.logs) {
          allLogsRef.current = data.logs.split('\n').filter(Boolean);
          startLocalLogStream();
        }

        if (data.status === 'LIVE' || data.status === 'FAILED') {
          clearInterval(pollInterval.current);
          setIsDeploying(false);
        }
      } catch (err) {
        clearInterval(pollInterval.current);
        setError('Failed to fetch deployment status updates');
        setIsDeploying(false);
      }
    }, 2000);
  };

  const startDeploy = () => {
    setError('');
    setIsDeploying(true);
    setDeployment(null);
    setDisplayedLogs([]);
    allLogsRef.current = [];
    currentLogIndexRef.current = 0;

    if (pollInterval.current) clearInterval(pollInterval.current);
    if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);

    triggerDeploy(projectId)
      .then((res) => {
        setDeployment(res.data);
        startPolling(res.data.id);
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.response?.data || 'Deployment failed to initiate');
        setIsDeploying(false);
      });
  };

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;
    startDeploy();
    return () => {
      if (pollInterval.current) clearInterval(pollInterval.current);
      if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
    };
  }, [projectId]);

  // COLOR STYLING ENGINE FOR LOG LINES
  const getLineStyle = (line) => {
    const lowerLine = line.toLowerCase();
    
    // Critical Failures / Errors
    if (lowerLine.includes('error') || lowerLine.includes('failed') || lowerLine.includes('fatal')) {
      return 'text-red-400 font-semibold bg-red-500/5 px-1 rounded';
    }
    // Success Indicators
    if (lowerLine.includes('completed') || lowerLine.includes('success') || lowerLine.includes('✓') || lowerLine.includes('live url')) {
      return 'text-emerald-400 font-bold bg-emerald-500/5 px-1 rounded';
    }
    // Framework / Infrastructure setup steps
    if (lowerLine.includes('cloning into') || lowerLine.includes('framework detected') || lowerLine.includes('using docker image')) {
      return 'text-cyan-400 font-semibold tracking-wide';
    }
    // Build steps & bundle details
    if (lowerLine.includes('building for production') || lowerLine.includes('transforming') || lowerLine.includes('rendering chunks')) {
      return 'text-[#FEC343] font-medium';
    }
    // Compiled assets list (dist folder items)
    if (lowerLine.includes('dist/') || lowerLine.includes('kb | gzip:')) {
      return 'text-indigo-300 font-mono opacity-90';
    }
    // NPM Commands / Scripts execution
    if (line.startsWith('>') || lowerLine.includes('vite build')) {
      return 'text-purple-400 font-mono font-bold';
    }
    // NPM warnings / vulnerabilities notices
    if (lowerLine.includes('warn') || lowerLine.includes('vulnerabilities') || lowerLine.includes('looking for funding')) {
      return 'text-amber-400/90 italic';
    }
    // Default system noise (npm notices, info text)
    if (lowerLine.includes('npm notice')) {
      return 'text-neutral-500 font-mono';
    }

    // Default neutral log line
    return 'text-neutral-300';
  };

  const isFailed = deployment?.status === 'FAILED' || !!error;

  return (
    <div className="w-full max-w-[1300px] mx-auto px-6 py-8 z-20 relative flex flex-col gap-6 font-sans antialiased text-white mt-12 select-none">

      {/* Runner Pulse Banner */}
      <div className={`w-full bg-[#141414] border rounded-2xl p-5 flex items-center gap-4 shadow-lg ${
        isFailed ? 'border-red-500/20' : 'border-[#FEC343]/20'
      } ${isDeploying && !isFailed ? 'animate-pulse' : ''}`}>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center border flex-shrink-0 ${
          isFailed ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-[#FEC343]/10 text-[#FEC343] border-[#FEC343]/20'
        }`}>
          {isDeploying && !isFailed ? (
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : isFailed ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          )}
        </div>
        <div>
          <h3 className="text-sm font-bold tracking-wide">
            {isFailed ? 'Deployment Runtime Interrupted' : isDeploying ? `Status: ${deployment?.status || 'QUEUED'}...` : 'Deployment Complete!'}
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5 font-medium leading-relaxed">
            {isFailed
              ? (error || 'Review build exceptions generated in output below, then retry.')
              : isDeploying
              ? 'Polling for live updates every 2 seconds...'
              : 'Your project is live!'}
          </p>
        </div>
      </div>

      {/* Meta Metrics Status Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#141414] border border-[#252525] rounded-2xl p-5 flex flex-col gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Target Repository</span>
          <span className="text-sm font-bold text-neutral-200 truncate mt-1 font-mono">
            {deployment?.githubUrl?.replace('https://github.com/', '') || (isDeploying ? 'Resolving...' : '--')}
          </span>
        </div>
        <div className="bg-[#141414] border border-[#252525] rounded-2xl p-5 flex flex-col gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Runtime Status</span>
          <span className="text-sm font-bold text-[#FEC343] mt-1 tracking-wide uppercase">
            {deployment?.status || 'QUEUED'}
          </span>
        </div>
        <div className="bg-[#141414] border border-[#252525] rounded-2xl p-5 flex flex-col gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Trigger Time</span>
          <span className="text-sm font-bold text-neutral-200 mt-1 font-mono">
            {deployment?.startedAt ? new Date(deployment.startedAt).toLocaleTimeString() : '--'}
          </span>
        </div>
        <div className="bg-[#141414] border border-[#252525] rounded-2xl p-5 flex flex-col gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">System Context ID</span>
          <span className="text-sm font-bold text-neutral-200 mt-1 truncate font-mono">{projectId}</span>
        </div>
      </div>

      {/* Live Operational Step Progress Matrix Tracking Module */}
      <div className="bg-[#141414] border border-[#252525] rounded-2xl p-5 flex flex-col gap-4 shadow-md">
        <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Live Stage Tracker</span>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { key: 'CLONING', label: '1. Git Clone' },
            { key: 'INSTALLING', label: '2. NPM Install' },
            { key: 'BUILDING', label: '3. Docker Build' },
            { key: 'UPLOADING', label: '4. S3 Upload' },
            { key: 'LIVE', label: '5. Production Live' }
          ].map((stage) => {
            const currentStatus = deployment?.status;
            const isFailedState = currentStatus === 'FAILED';
            
            const stagesOrder = ['CLONING', 'INSTALLING', 'BUILDING', 'UPLOADING', 'LIVE'];
            const currentIdx = stagesOrder.indexOf(currentStatus);
            const stageIdx = stagesOrder.indexOf(stage.key);
            
            let badgeStyle = "border-[#252525] bg-[#0d0d0d] text-neutral-500";
            
            if (currentStatus === stage.key) {
              badgeStyle = isFailedState 
                ? "border-red-500/40 bg-red-500/10 text-red-400 font-bold animate-pulse" 
                : "border-[#FEC343]/50 bg-[#FEC343]/10 text-[#FEC343] font-bold animate-pulse";
            } else if (stageIdx < currentIdx && currentIdx !== -1) {
              badgeStyle = "border-emerald-500/30 bg-emerald-500/5 text-emerald-400/90 font-medium";
            }

            return (
              <div key={stage.key} className={`border p-3 rounded-xl flex items-center justify-between text-xs transition-all duration-300 ${badgeStyle}`}>
                <span>{stage.label}</span>
                {stageIdx < currentIdx && currentIdx !== -1 && <span>✓</span>}
                {currentStatus === stage.key && !isFailedState && <span className="w-1.5 h-1.5 rounded-full bg-[#FEC343] animate-ping" />}
                {currentStatus === stage.key && isFailedState && <span>✕</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Pipeline Logger Module */}
      <div className="bg-[#141414] border border-[#252525] rounded-2xl p-6 flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-sm font-bold tracking-wide uppercase text-neutral-200">Live Build Stream</span>
              {!isDeploying && (
                <span className="text-xs bg-[#0d0d0d] border border-[#252525] text-neutral-400 font-mono px-2 py-0.5 rounded-md font-bold">{displayedLogs.length} lines</span>
              )}
            </div>
            <p className="text-xs text-neutral-400 mt-1 font-medium">
              {isDeploying ? 'Polling every 2s for live log updates...' : 'Persistent build output trace'}
            </p>
          </div>

          {isFailed && (
            <button
              onClick={startDeploy}
              className="border border-[#252525] bg-[#0d0d0d] hover:bg-[#141414] text-neutral-300 hover:text-white px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5"
            >
              🔄 Rerun Deployment
            </button>
          )}

          {deployment?.status === 'LIVE' && deployment?.liveUrl && (
            <a
              href={deployment.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-[#FEC343] hover:bg-[#e0ab3b] text-black px-4 py-2 rounded-xl text-sm font-bold transition-all"
            >
              🚀 Visit Live Site
            </a>
          )}
        </div>

        {/* Code Frame Logger Terminal */}
        <div className="w-full bg-[#0d0d0d] rounded-xl border border-[#252525] p-5 font-mono text-xs leading-relaxed max-h-[480px] overflow-y-auto whitespace-pre-wrap select-text">
          {displayedLogs.length === 0 ? (
            <span className="text-neutral-500 font-medium animate-pulse">Waiting for build output stream matrix...</span>
          ) : (
            displayedLogs.map((line, i) => (
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
    </div>
  );
}