// src/components/AuthModal.tsx
import React, { useRef, useLayoutEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { useModal } from '@/contexts/ModalAuthContext';
import LoginForm from '../Form/LoginForm';
import RegisterForm from '../Form/RegisterForm';
import Logo from '../Logo/Logo';
import { useNavigate } from 'react-router-dom';
import ROUTES from '@/constants/routes';

const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, isLogin, openAuthModal } = useModal();
  const formRef = useRef<HTMLDivElement>(null); // Ref để đo chiều cao form
  const navigate = useNavigate();

  // Tự động điều chỉnh chiều cao modal dựa trên nội dung
  useLayoutEffect(() => {
    if (formRef.current) {
      const formElement = formRef.current;
      formElement.style.height = 'auto'; // Reset để tính chiều cao mới
      const height = formElement.scrollHeight; // Đo chiều cao thật của nội dung
      formElement.style.height = `${height}px`; // Gán chiều cao mới vào
    }
  }, [isLogin]); // Chạy lại khi `isLogin` thay đổi

  return (
    <Dialog open={isAuthModalOpen} onClose={closeAuthModal} className="fixed inset-0 z-50 overflow-y-auto">
      {/* Nền mờ khi mở modal */}
      <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity"></div>

      {/* Hiệu ứng mở modal với Tailwind */}
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="relative w-full max-w-md p-6 mx-auto bg-white rounded-lg shadow-lg transform transition-transform duration-500 ease-out scale-95">
          {/* Nút đóng modal */}
          <button
            onClick={closeAuthModal}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            ✕
          </button>

          {/* Hiển thị Logo */}
          <div className="flex justify-center mb-4">
            <Logo />
          </div>

          {/* Container cho form, chiều cao thay đổi động */}
          <div
            ref={formRef} // Ref giúp theo dõi chiều cao động
            className="overflow-hidden transition-height duration-500 ease-in-out"
          >
            {isLogin ? (
              <div key="login" className="opacity-100 transition-opacity duration-500 ease-in-out">
                <LoginForm />
              </div>
            ) : (
              <div key="register" className="opacity-100 transition-opacity duration-500 ease-in-out">
                <RegisterForm />
              </div>
            )}
          </div>

          {/* Nút chuyển đổi giữa login và register */}
          <div className="mt-6 text-center">
            <button
              onClick={() => openAuthModal(!isLogin)} // Chuyển đổi form khi bấm vào
              className="text-blue-500 hover:underline focus:outline-none"
            >
              {isLogin ? 'Chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập'}
            </button>
          </div>

          {/* Nút để dẫn đến trang quên mật khẩu */}
          <div className="mt-4 text-center">
            <button className="text-gray-500 hover:underline focus:outline-none" onClick={() => {
              navigate(ROUTES.FORGOT_PASSWORD);
            }}>Quên mật khẩu?</button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default AuthModal;
