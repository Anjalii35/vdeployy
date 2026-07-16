import React, { useState } from 'react';

export default function ContactSection() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Message from ${name || 'Deployr user'}`);
    const body = encodeURIComponent(message);
    window.location.href = `mailto:YOUR_EMAIL@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <section className="w-full max-w-[1300px] mx-auto px-6 py-16 select-none antialiased">
      <div className="bg-[#141414] border border-[#252525] rounded-2xl p-8 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Left Informational Block */}
        <div>
          <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-[#0d0d0d] border border-[#252525] text-[11px] font-bold tracking-wide text-neutral-400 mb-5">
            <svg className="w-3 h-3 text-[#FEC343] mr-1.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            Contact
          </span>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-4 font-sans">
            Get in touch
          </h2>
          <p className="text-sm md:text-base text-neutral-400 max-w-sm leading-relaxed">
            Have questions or need support? Reach out to us anytime.
          </p>
        </div>

        {/* Right Form Node */}
        <form onSubmit={handleSend} className="flex flex-col gap-6">
          <div>
            <label className="block text-xs md:text-sm font-bold text-neutral-300 mb-2 ms-1">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              className="w-full bg-[#0d0d0d] border border-[#252525] rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#FEC343]/60 transition-colors font-mono"
            />
          </div>
          
          <div>
            <label className="block text-xs md:text-sm font-bold text-neutral-300 mb-2 ms-1">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your message"
              rows={5}
              required
              className="w-full bg-[#0d0d0d] border border-[#252525] rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#FEC343]/60 transition-colors resize-y font-mono"
            />
          </div>

          <button
            type="submit"
            className="self-start bg-[#FEC343] text-black hover:bg-[#e0ab3b] px-6 py-3 rounded-xl text-xs md:text-sm font-bold shadow-[0_4px_20px_rgba(254,195,67,0.15)] hover:shadow-[0_4px_25px_rgba(254,195,67,0.3)] transition-all active:scale-[0.98]">
            Send message
          </button>
        </form>

      </div>
    </section>
  );
}