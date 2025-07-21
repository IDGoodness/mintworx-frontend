import React from 'react';
import img from '../assets/error.png'
const imageSrc = img; // image URL or local path
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a1a2f]/50 backdrop-blur-lg"
      onClick={handleOutsideClick}
    >
      <div className="w-80 h-80 bg-white/20 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center p-4 relative text-white">
        <button
          className="absolute top-3 right-3 text-red-500 text-lg font-bold"
          onClick={onClose}
        >
          x
        </button>
        {imageSrc && (
          <img
            src={imageSrc}
            alt="Error"
            className="w-40 h-40 object-contain mb-2"
          />
        )}
        <p className="text-sm">{message || 'Something went wrong.'}</p>
      </div>
    </div>
  );
};

export default ErrorModal;
