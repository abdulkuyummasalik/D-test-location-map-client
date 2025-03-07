import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { useNavigate, Navigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// Skema validasi untuk login
const LoginSchema = Yup.object().shape({
  username: Yup.string()
    .required('Username wajib diisi')
    .min(5, 'Username minimal 5 karakter')
    .matches(
      /^[a-zA-Z0-9_]+$/,
      'Username hanya boleh mengandung huruf, angka, dan underscore (_)'
    ),
  password: Yup.string()
    .required('Password wajib diisi')
    .min(8, 'Password minimal 8 karakter'),
});

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoggedIn } = useAuth();

  // Fungsi untuk menangani submit form
  const handleSubmit = (values) => {
    setIsLoading(true);
    const { username, password } = values;
    login(username, password); // Tidak perlu cek lagi, karena login sudah tangani semuanya
    setIsLoading(false);
  };

  // Redirect jika sudah login
  if (isLoggedIn) {
    return <Navigate to="/" />;
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">PETA</h1>
        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form>
              {/* Field Username */}
              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <Field
                  type="text"
                  name="username"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Field Password */}
              <div className="mb-4 relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Field
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Tombol Submit */}
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                disabled={isLoading}
              >
                {isLoading ? 'Loading..' : 'Masuk'}
              </button>

              {/* Link ke Halaman Register */}
              <div className="mt-4 text-center">
                <span className="text-gray-600">Belum punya akun? </span>
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="text-indigo-600 hover:underline"
                >
                  Daftar di sini
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;