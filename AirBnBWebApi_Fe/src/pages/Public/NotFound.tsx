// src/pages/NotFoundPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import notFoundImage from '@/assets/images/notfound.webp'; // Đảm bảo bạn có file này trong đúng thư mục
import ROUTES from '@/constants/routes';
import useAuth from '@/hooks/useAuth';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Sử dụng hook để lấy thông tin user

  const handleGoBack = () => {
    if (!user) {
      navigate(ROUTES.HOME);
    } else if (user.role === 'USER') {
      navigate(ROUTES.HOME);
    } else if (user.role === 'HOST') {
      navigate(ROUTES.HOST_HOME);
    } else if (user.role === 'ADMIN') {
      navigate(ROUTES.ADMIN_DASHBOARD);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-pink-100 to-pink-50 text-gray-800 px-4">
      <div className="max-w-md text-center">
        <img
          src={notFoundImage}
          alt="Page not found"
          className="w-full max-h-72 object-contain mb-6 animate-bounce-slow"
        />
        <h1 className="text-4xl md:text-5xl font-bold text-pink-600 mb-4 animate-fade-in">
          Oops! Page not found.
        </h1>
        <p className="text-gray-600 mb-6">
          Sorry, we can't find the page you're looking for. It might have been removed, or the link you followed is incorrect.
        </p>
        <button
          onClick={handleGoBack}
          className="px-6 py-3 bg-pink-500 text-white rounded-lg shadow-md hover:bg-pink-600 transition duration-300 ease-in-out transform hover:scale-105"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFound;
