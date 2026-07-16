import React from 'react';

const features = [
  {
    title: "One-Click Deploy",
    desc: "From repository to live site in seconds. Zero configuration required for popular frameworks.",
    iconBg: "bg-[#FEC343]/10 text-[#FEC343] border border-[#FEC343]/20",
    iconPath: "M13 10V3L4 14h7v7l9-11h-7z",
  },
  {
    title: "Instant Preview Links",
    desc: "Shareable preview URLs for every deployment and pull request. Perfect for client reviews.",
    iconBg: "bg-[#FEC343]/10 text-[#FEC343] border border-[#FEC343]/20",
    iconPath: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9",
  },
  {
    title: "Smart Build Detection",
    desc: "Automatically detects React, Vue, Angular, and other frameworks. Optimizes builds automatically.",
    iconBg: "bg-[#FEC343]/10 text-[#FEC343] border border-[#FEC343]/20",
    iconPath: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
  },
  {
    title: "Live Deployment Logs",
    desc: "Real-time visibility into your deployment process with detailed build logs and error reporting.",
    iconBg: "bg-[#FEC343]/10 text-[#FEC343] border border-[#FEC343]/20",
    iconPath: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  }
];

export default function FeaturesSection({ onCtaClick }) {
  return (
    <section className="w-full max-w-[1300px] mx-auto px-6 pt-12 pb-24 z-10 relative flex flex-col items-center select-none antialiased">
      
      {/* Small Badge */}
      <div className="mb-5">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#141414] border border-[#252525] text-[12px] font-bold tracking-wide text-neutral-400">
          <svg className="w-3 h-3 text-[#FEC343]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499c.173-.348.692-.348.865 0l2.365 4.793 5.285.767c.383.055.536.523.258.793l-3.825 3.73 1.053 5.26c.076.381-.324.672-.662.493l-4.707-2.476-4.707 2.476c-.338.179-.738-.112-.662-.493l1.053-5.26-3.825-3.73c-.278-.27-.125-.738.258-.793l5.285-.767 2.365-4.793z" />
          </svg>
          Features
        </span>
      </div>

      {/* Main Header Descriptor Block */}
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-4 font-sans leading-tight">
          Everything you need to deploy with{' '}
          <span className="relative inline-block px-3 py-0.5 text-[#FEC343] bg-[#FEC343]/5 border border-[#FEC343]/30 rounded-xl drop-shadow-[0_0_15px_rgba(254,195,67,0.2)]">
            confidence
          </span>
        </h2>
        <p className="text-sm md:text-base text-neutral-400 max-w-2xl mx-auto font-normal leading-relaxed">
          Powerful features that make frontend deployment simple, fast, and reliable for developers.
        </p>
      </div>

      {/* Features Cards Architecture Matrix Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-20">
        {features.map((feat, index) => (
          <div 
            key={index} 
            className="bg-[#141414] border border-[#252525] rounded-2xl p-6 transition-all duration-300 relative overflow-hidden flex flex-col group hover:border-[#FEC343]/40 hover:shadow-[0_0_30px_rgba(254,195,67,0.04)]"
          >
            {/* Functional Card Content Nodes */}
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-105 ${feat.iconBg}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d={feat.iconPath} />
              </svg>
            </div>

            <h3 className="text-base font-bold text-white mb-2.5 tracking-wide font-sans">
              {feat.title}
            </h3>
            <p className="text-xs md:text-sm text-neutral-400 leading-relaxed font-normal">
              {feat.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Integrated Inline Bottom Call-To-Action Element Workspace */}
      <div className="text-center pt-2 w-full border-b pb-9 border-[#252525] max-w-[500px] flex flex-col items-center">
        <p className="text-sm text-neutral-400 tracking-wide font-medium mb-5">
          Ready to experience the future of deployment?
        </p>
        <button 
          onClick={onCtaClick}
          className="bg-[#FEC343] text-black hover:bg-[#e0ab3b] px-6 py-3 rounded-xl text-xs md:text-sm font-bold shadow-[0_4px_20px_rgba(254,195,67,0.15)] hover:shadow-[0_4px_25px_rgba(254,195,67,0.3)] transition-all active:scale-[0.98] inline-flex items-center gap-2"
        >
          <span>Get started for free</span>
          <svg className="w-3.5 h-3.5 text-black" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>
      </div>

    </section>
  );
}