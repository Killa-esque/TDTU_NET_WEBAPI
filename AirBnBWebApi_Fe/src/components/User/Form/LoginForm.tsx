// src/components/Auth/LoginForm.tsx
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { LoginPayload } from '@/types';
import { useLogin } from '@/hooks';

const loginSchema = Yup.object({
  email: Yup.string().email('Email không hợp lệ').required('Bắt buộc'),
  password: Yup.string().min(6, 'Mật khẩu quá ngắn').required('Bắt buộc'),
});

const LoginForm: React.FC = () => {
  const { handleLogin, isLoading, error } = useLogin();

  const handleSubmit = (values: LoginPayload) => {
    values.role = 'User';
    handleLogin(values);
  };

  return (
    <div className="w-full">
      <Formik
        initialValues={{ email: '', password: '', role: '' }}
        validationSchema={loginSchema}
        onSubmit={handleSubmit}
      >
        <Form className="mt-4 space-y-4">
          <div>
            <Field
              type="email"
              name="email"
              placeholder="Email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-pinkCustom"
            />
            <ErrorMessage name="email" component="div" className="text-red-500" />
          </div>
          <div>
            <Field
              type="password"
              name="password"
              placeholder="Mật khẩu"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-pinkCustom"
            />
            <ErrorMessage name="password" component="div" className="text-red-500" />
          </div>
          <button
            type="submit"
            className="w-full py-2 font-semibold text-white bg-rose-500 rounded-md hover:bg-pink-600"
            disabled={isLoading} // Disable button when loading
          >
            Đăng nhập
          </button>
          {error && <div className="text-red-500">{error.message}</div>} {/* Hiển thị lỗi nếu có */}
        </Form>
      </Formik>
    </div>
  );
};

export default LoginForm;
