import React from 'react';

interface CardSettingProps {
  icon: JSX.Element;
  title: string;
  description: string;
  className: string;
  onClick: () => void;
}

const CardSetting: React.FC<CardSettingProps> = ({ icon, title, description, className, onClick }) => {
  return (
    <div
      className={`bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer ${className}`}
      onClick={onClick}
    >
      <div className="bg-rose-500 p-4 flex items-center justify-center">
        <div className="text-4xl text-white">
          {icon}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default CardSetting;
