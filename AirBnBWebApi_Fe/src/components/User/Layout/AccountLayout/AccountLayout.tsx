// src/components/Account/AccountLayout.tsx
import breadcrumbMap from '@/constants/breadcrumps';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface AccountLayoutProps {
  title: string;
  content: React.ReactNode;
  sidebar: React.ReactNode;
}

const AccountLayout: React.FC<AccountLayoutProps> = ({ title, content, sidebar }) => {
  const location = useLocation();

  // Xử lý breadcrumb paths
  const breadcrumbPaths = location.pathname.split('/').filter((path) => path);

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
      {/* Breadcrumb */}
      <nav className="flex mb-4">
        <ol className="list-reset flex text-sm font-medium text-gray-700">
          {breadcrumbPaths.map((path, index) => {
            const fullPath = `/${breadcrumbPaths.slice(0, index + 1).join('/')}`;
            const isLast = index === breadcrumbPaths.length - 1;

            // Sử dụng breadcrumbMap để ánh xạ path thành tiêu đề thân thiện
            const breadcrumbTitle = breadcrumbMap[path] || path;

            return (
              <React.Fragment key={index}>
                {index > 0 && <li className="mx-2 text-gray-500">/</li>}
                <li className={isLast ? "text-gray-800 font-semibold" : "text-gray-500"}>
                  {isLast ? (
                    <span>{breadcrumbTitle}</span>
                  ) : (
                    <Link to={fullPath} className="hover:text-gray-800">
                      {breadcrumbTitle}
                    </Link>
                  )}
                </li>
              </React.Fragment>
            );
          })}
        </ol>
      </nav>

      {/* Title */}
      <h1 className="text-3xl font-semibold text-gray-900 mb-6">{title}</h1>

      {/* Layout chia cột: content bên trái, sidebar bên phải */}
      <div className="flex flex-col lg:flex-row lg:space-x-10 h-vh-50">
        {/* Bên trái: Content */}
        <div className="w-full lg:w-2/3 bg-white  rounded-lg  mb-6 lg:mb-0">
          {content}
        </div>

        {/* Bên phải: Sidebar */}
        <div className="w-full lg:w-1/3 bg-white  rounded-lg px-5">
          {sidebar}
        </div>
      </div>
    </div>
  );
};

export default AccountLayout;
