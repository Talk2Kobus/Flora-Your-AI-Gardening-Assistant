import React from 'react';

interface ImageRequestCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const ImageRequestCard: React.FC<ImageRequestCardProps> = ({ title, description, icon, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center p-4 text-center bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow w-full h-full"
    >
      <div className="text-blue-500 mb-2">{icon}</div>
      <h3 className="font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
    </button>
  );
};

export default ImageRequestCard;