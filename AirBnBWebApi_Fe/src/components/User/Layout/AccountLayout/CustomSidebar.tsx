// src/components/User/Sidebar/CustomSidebar.tsx
import React from 'react';

type SidebarItem = {
  icon: JSX.Element;
  title: string;
  description: string;
};

interface CustomSidebarProps {
  items: SidebarItem[];
}

const CustomSidebar: React.FC<CustomSidebarProps> = ({ items }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      {items.map((item, index) => (
        <div
          key={index}
          className={`flex flex-col md:flex-row items-start md:items-center md:space-x-4 space-y-4 md:space-y-0 ${index !== items.length - 1 ? 'border-b border-gray-200' : ''} py-6`}
        >
          {/* Icon */}
          <div className="w-full md:w-auto flex justify-center md:justify-start">
            {item.icon}
          </div>

          {/* Nội dung */}
          <div className="flex-1 mb-4"> {/* Thêm mb-4 để tạo khoảng cách giữa nội dung và đường kẻ */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {item.title}
            </h3>
            <p className="text-sm text-gray-600">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomSidebar;
