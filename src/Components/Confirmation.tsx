import React from 'react';
import logo from '../../public/assets/logo-remove.png'

const imageSrc = logo;

interface ConfirmationModalProps {
  message?: string;
  onCancel: () => void;
  onProceed: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  message,
  onCancel,
  onProceed,
}) => {
  const handleOutsideClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a1a2f]/80 backdrop-blur-3xl"
      onClick={handleOutsideClick}
    >
      <div className="w-60 h-auto bg-white/20 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center p-5 text-white relative">
        {imageSrc && (
          <img
            src={imageSrc}
            alt="Prompt"
            className="w-40 h-40 object-contain mb-3"
          />
        )}
        {message && <p className="text-sm mb-4">{message}</p>}

        <div className="flex space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md bg-red-500/80 hover:bg-red-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={onProceed}
            className="px-4 py-2 rounded-md bg-green-500/80 hover:bg-green-600 transition"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
