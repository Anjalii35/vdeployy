import React from 'react';

const steps = [
  {
    step: "01",
    title: "Paste GitHub link",
    desc: "Connect your public repo with a single URL — no OAuth required.",
    icon: (
      <svg className="w-5 h-5 text-[#FEC343]" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
      </svg>
    )
  },
  {
    step: "02",
    title: "Configure build settings",
    desc: "Set install and build commands, pick your framework, optional subfolder.",
    icon: (
      <svg className="w-5 h-5 text-[#FEC343]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
      </svg>
    )
  },
  {
    step: "03",
    title: "Spin up Docker",
    desc: "Your code builds inside an isolated Node 20 container.",
    icon: (
      <svg className="w-5 h-5 text-[#FEC343]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    )
  },
  {
    step: "04",
    title: "Upload to S3",
    desc: "Production artifacts are stored securely on AWS S3 object storage.",
    icon: (
      <svg className="w-5 h-5 text-[#FEC343]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
      </svg>
    )
  },
  {
    step: "05",
    title: "Deploy to the world",
    desc: "Your app goes live on a unique subdomain via the edge proxy.",
    icon: (
      <svg className="w-5 h-5 text-[#FEC343]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.63 8.41a6 6 0 0 0-3.47 7.38m13.52-11.4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
      </svg>
    )
  },
  {
    step: "06",
    title: "Redeploy with ease",
    desc: "Trigger a fresh build anytime — we clone, build, and publish again.",
    icon: (
      <svg className="w-5 h-5 text-[#FEC343]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    )
  }
];

export default function HowItWorks() {
  return (
    <section className="w-full max-w-[1300px] mx-auto px-6 pt-12 pb-24 z-10 relative flex flex-col items-center select-none antialiased">
      
      {/* Small Section Tag */}
      <div className="mb-5">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#141414] border border-[#252525] text-[12px] font-bold tracking-wide text-neutral-400">
          <svg className="w-3 h-3 text-[#FEC343]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499c.173-.348.692-.348.865 0l2.365 4.793 5.285.767c.383.055.536.523.258.793l-3.825 3.73 1.053 5.26c.076.381-.324.672-.662.493l-4.707-2.476-4.707 2.476c-.338.179-.738-.112-.662-.493l1.053-5.26-3.825-3.73c-.278-.27-.125-.738.258-.793l5.285-.767 2.365-4.793z" />
          </svg>
          Deployment Architecture
        </span>
      </div>

      {/* Primary Section Headers */}
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-4 font-sans leading-tight">
          Deploy in{' '}
          <span className="relative inline-block px-3 py-0.5 text-[#FEC343] bg-[#FEC343]/5 border border-[#FEC343]/30 rounded-xl drop-shadow-[0_0_15px_rgba(254,195,67,0.2)] font-bold">
            six simple steps
          </span>
        </h2>
        <p className="text-sm md:text-base text-neutral-400 max-w-2xl mx-auto font-normal leading-relaxed">
          Get your frontend project live in minutes with our streamlined infrastructure architecture.
        </p>
      </div>

      {/* Responsive Grid Setup */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 w-full max-w-5xl relative">
        {steps.map((item, index) => (
          <div key={index} className="flex flex-col items-center text-center group relative">
            
            {/* Dark Tech Circle Icon Block */}
            <div className="w-14 h-14 rounded-full bg-[#141414] border border-[#252525] flex items-center justify-center shadow-lg relative mb-4 transition-all duration-300 group-hover:scale-105 group-hover:border-[#FEC343]/40 group-hover:shadow-[0_0_20px_rgba(254,195,67,0.1)]">
              {item.icon}

              {/* Number Badge Pill underneath Circle */}
              <div className="absolute -bottom-2 px-2 py-0.5 rounded-md bg-[#0d0d0d] border border-[#252525] text-[10px] font-bold text-neutral-400 tracking-tight transition-colors group-hover:border-[#FEC343]/30 group-hover:text-white">
                {item.step}
              </div>
            </div>

            {/* Description Meta Labels */}
            <h3 className="text-base font-bold text-white mt-4 mb-2.5 tracking-wide group-hover:text-[#FEC343] transition-colors font-sans">
              {item.title}
            </h3>
            <p className="text-xs md:text-sm text-neutral-400 leading-relaxed font-normal max-w-[280px]">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}