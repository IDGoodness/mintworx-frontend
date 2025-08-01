import React from 'react';

interface ErrorModalProps {
  message?: string;
  onClose: () => void;
  
}

const ErrorModal: React.FC<ErrorModalProps> = ({ message, onClose}) => {
  const handleOutsideClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a1a2f]/80 backdrop-blur-lg "
      onClick={handleOutsideClick}
    >
      <div className="w-60 h-60 bg-white/20 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center p-3 relative text-white">

              <div className="flex items-center justify-center mb-4">
                <div className="bg-red-100 rounded-full p-3">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
        <p className="text-xs text-white-300 uppercase tracking-widest mb-3">{message || 'Something went wrong.'}</p>
      </div>
    </div>
  );
};

export default ErrorModal;
