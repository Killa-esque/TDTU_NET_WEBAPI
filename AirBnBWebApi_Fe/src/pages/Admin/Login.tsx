import ROLE from '@/constants/role';
import { useLogin } from '@/hooks';
import { LoginPayload } from '@/types';
import { Field, Form, Formik } from 'formik';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';

const loginValidationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const Login = () => {
  const { handleLogin, isLoading, error } = useLogin();

  const handleSubmit = (values: LoginPayload) => {
    handleLogin(values);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-pinkCustom mb-8">Admin Login</h2>

        <Formik
          initialValues={{ email: '', password: '', role: ROLE.ADMIN }}
          validationSchema={loginValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email</label>
                <Field
                  type="email"
                  name="email"
                  id="email"
                  className={`mt-2 p-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-pinkCustom ${errors.email && touched.email ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.email && touched.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-600">Password</label>
                <Field
                  type="password"
                  name="password"
                  id="password"
                  className={`mt-2 p-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-pinkCustom ${errors.password && touched.password ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.password && touched.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-pinkCustom text-white font-semibold rounded-lg hover:bg-pink-700 transition"
              >
                {isLoading ? 'Logging in...' : 'Login'}s
              </button>
            </Form>
          )}
        </Formik>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="register" className="text-pinkCustom font-semibold hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
