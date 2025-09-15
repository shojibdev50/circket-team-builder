import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-300"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 rounded-xl border border-slate-700 shadow-2xl shadow-emerald-900/50 p-6 w-full max-w-md m-4 transform transition-transform duration-300 scale-100"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-emerald-400">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
