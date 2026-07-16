import React from 'react';

export default function Modal({ isOpen, onClose, title, children, actions }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-[#141414] border border-[#252525] rounded-2xl p-6 shadow-2xl z-10 font-sans text-white">
        {title && <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-200 mb-3">{title}</h3>}
        <div className="text-xs text-neutral-400 leading-relaxed mb-6 font-medium">{children}</div>
        <div className="flex justify-end gap-2">{actions}</div>
      </div>
    </div>
  );
}