import React from 'react';
import logo from '../assets/logo-remove.png'; // 547x547 logo

interface LoadingModalProps {
  show: boolean;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ show }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-[#000033]/80 backdrop-blur-2xl flex items-center justify-center z-50 transition-opacity duration-500">
      <div className="relative w-40 h-40">
        <div className="absolute inset-0 border-4 border-white border-t-transparent rounded-full animate-spin" />
        <img
          src={logo}
          alt="MintxWorx Logo"
          className="absolute inset-0 w-60 h-60 m-auto object-contain"
        />
      </div>
    </div>
  );
};

export default LoadingModal;
