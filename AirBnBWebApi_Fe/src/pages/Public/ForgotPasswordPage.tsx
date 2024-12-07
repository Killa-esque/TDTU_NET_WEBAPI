import React, { useState } from 'react';
import { ForgotPasswordPayload, ResetPasswordPayload } from '@/types';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useResetPassword } from '@/hooks';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import ROUTES from '@/constants/routes';

// Validation schemas
const forgotPasswordValidation = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
});

const resetPasswordValidation = Yup.object({
  token: Yup.string().required('Token is required'),
  newPassword: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Confirm password is required'),
});

const ForgotPasswordPage: React.FC = () => {
  const [step, setStep] = useState<'forgot' | 'reset'>('forgot'); // Toggle between forms
  const navigate = useNavigate();

  const { forgotPassword, resetPassword } = useResetPassword();

  const { mutate: forgotPasswordMutation } = forgotPassword();
  const { mutate: resetPasswordMutation } = resetPassword();

  const handleForgotPasswordSubmit = (values: ForgotPasswordPayload) => {
    forgotPasswordMutation(values, {
      onSuccess: (response) => {
        if (response.status) {
          message.success(response.message || 'Check your email for the reset link.');
          setStep('reset');
        } else {
          message.error(response.message || 'Failed to send reset request. Please try again.');
        }
      },
      onError: () => {
        message.error('An error occurred. Please try again.');
      },
    });
  };

  const handleResetPasswordSubmit = (values: ResetPasswordPayload) => {
    resetPasswordMutation(values, {
      onSuccess: (response) => {
        if (response.status) {
          message.success(response.message || 'Password reset successfully!');
          navigate(ROUTES.HOME);
        } else {
          message.error(response.message || 'Failed to reset password. Please try again.');
        }
      },
      onError: () => {
        message.error('An error occurred. Please try again.');
      },
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {step === 'forgot' ? 'Forgot Password' : 'Reset Password'}
        </h2>

        {/* Forgot Password Form */}
        {step === 'forgot' && (
          <Formik
            initialValues={{ email: '' }}
            validationSchema={forgotPasswordValidation}
            onSubmit={handleForgotPasswordSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <Field
                    name="email"
                    type="email"
                    className="w-full border border-gray-300 rounded-lg p-2"
                    placeholder="Enter your email"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-pinkCustom text-white px-4 py-2 rounded-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Reset Email'}
                </button>
              </Form>
            )}
          </Formik>
        )}

        {/* Reset Password Form */}
        {step === 'reset' && (
          <Formik
            initialValues={{ token: '', newPassword: '', confirmPassword: '' }}
            validationSchema={resetPasswordValidation}
            onSubmit={handleResetPasswordSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <label htmlFor="token" className="block text-sm font-medium text-gray-700">
                    Reset Token
                  </label>
                  <Field
                    name="token"
                    type="text"
                    className="w-full border border-gray-300 rounded-lg p-2"
                    placeholder="Enter the token sent to your email"
                  />
                  <ErrorMessage
                    name="token"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <Field
                    name="newPassword"
                    type="password"
                    className="w-full border border-gray-300 rounded-lg p-2"
                    placeholder="Enter your new password"
                  />
                  <ErrorMessage
                    name="newPassword"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </label>
                  <Field
                    name="confirmPassword"
                    type="password"
                    className="w-full border border-gray-300 rounded-lg p-2"
                    placeholder="Confirm your new password"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-pinkCustom text-white px-4 py-2 rounded-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Resetting...' : 'Reset Password'}
                </button>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
