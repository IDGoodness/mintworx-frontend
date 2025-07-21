import React from 'react';

interface LoadingModalProps {
  show: boolean;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ show }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-[#000033]/70 flex items-center justify-center z-50 backdrop-blur-lg">
      <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingModal;
