// src/pages/UnauthorizedPage.tsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ROUTES from '@/constants/routes';
import unauthorizedGif from '@/assets/images/giphy.webp'; // Đảm bảo rằng bạn có file này trong đúng thư mục

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy đường dẫn trước đó từ state, hoặc mặc định là ROUTES.HOME
  const previousRoute = location.state?.from || ROUTES.HOME;

  const handleGoBack = () => {
    console.log(previousRoute)
    navigate(previousRoute);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-lg w-full text-center bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold text-red-500 mb-4">
          Unauthorized Access
        </h1>
        <p className="text-gray-600 mb-6">
          You do not have permission to access this page.
        </p>
        <img
          src={unauthorizedGif}
          alt="Unauthorized"
          className="w-full h-64 md:h-80 object-contain mb-6"
        />
        <button
          onClick={handleGoBack}
          className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition duration-300 w-full"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
