import React from 'react';

export default function Hero({ onGetStarted, onWatchDemo }) {
  return (
    <div className="w-full max-w-[1300px] mx-auto px-6 mt-12 mb-16 font-sans select-none">
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">

        {/* LEFT PANEL: Professional Typography & Call to Actions */}
        <div>
          <span className="inline-block bg-[#141414] border border-[#252525] text-[11px] font-bold tracking-widest uppercase text-neutral-300 px-3 py-1.5 rounded-md mb-5 mt-3">
            Deploy with Confidence
          </span>

          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.18]">
            Deploy your frontend{" "}
            <span className="inline-block text-[#FEC343] border border-[#FEC343]/30 bg-[#FEC343]/5 px-3 py-1 rounded-xl drop-shadow-[0_0_20px_rgba(254,195,67,0.25)]">
              faster
            </span>{" "}
            than ever
          </h1>

          <p className="mt-8 max-w-2xl text-lg text-neutral-400 leading-7">
            Build, preview, and deploy modern frontend apps with lightning speed.
            Connect Git repo and let VDeploy handle the rest.
          </p>

          <div className="flex items-center gap-3 mt-8">
            <button
              onClick={onGetStarted}
              className="bg-[#FEC343] text-black hover:bg-[#e0ab3b] px-6 py-3 rounded-xl text-sm font-bold shadow-[0_4px_20px_rgba(254,195,67,0.15)] hover:shadow-[0_4px_25px_rgba(254,195,67,0.3)] transition-all active:scale-[0.98]">
              Get started free <span>→</span>
            </button>
            <button
              onClick={onWatchDemo}
              className="border border-[#252525] bg-[#0d0d0d] hover:bg-neutral-900 text-neutral-300 hover:text-white px-6 py-3 rounded-lg text-sm font-semibold transition-all"
            >
              How it works
            </button>
          </div>

          {/* Stats Row */}
          <div className="flex items-center gap-12 mt-14 border-t border-[#252525]/50 pt-9">
            <div>
              <p className="text-3xl font-black text-[#FEC343] font-mono">24/7</p>
              <p className="text-[12px] font-medium text-neutral-500 mt-1 uppercase tracking-wider">AVAILABILITY</p>
            </div>
            <div>
              <p className="text-3xl font-black text-[#FEC343] font-mono">&lt;60s</p>
              <p className="text-[12px] font-medium text-neutral-500 mt-1 uppercase tracking-wider">Avg build time</p>
            </div>
            <div>
              <p className="text-3xl font-black text-[#FEC343] font-mono">1-click</p>
              <p className="text-[12px] font-medium text-neutral-500 mt-1 uppercase tracking-wider">Deployments</p>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Live Terminal Window Preview */}
        <div className="bg-[#0c0c0e] border border-[#222225] rounded-xl p-6 font-mono shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

          {/* Window Buttons */}
          <div className="flex items-center gap-1.5 mb-6">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
          </div>

          <p className="text-[11px] text-neutral-600 mb-4 tracking-tight"># Deploy in three steps</p>

          <div className="flex flex-col gap-2 text-[12px] leading-relaxed">
            <p className="flex items-center gap-2">
              <span className="text-cyan-500/70">$</span>
              <span className="text-neutral-300">git clone repo-url</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-cyan-500/70">$</span>
              <span className="text-neutral-300">npm install &amp;&amp; npm run build</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-cyan-500/70">$</span>
              <span className="text-neutral-300 font-semibold text-white">vdeploy deploy --slug my-app</span>
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-[#1a1a1e] flex items-center gap-2 text-[12px] text-emerald-400 font-medium">
            <span className="text-emerald-500">✓</span>
            <span>Published at <span className="underline decoration-emerald-500/40 underline-offset-2 cursor-pointer hover:text-emerald-300">my-app.deployr.live</span></span>
          </div>
        </div>

      </div>
    </div>
  );
}