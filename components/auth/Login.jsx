'use client';

import { useState } from 'react';
import axios from 'axios';
import { baseUrl } from '@/lib/utils/constants';
import { useDispatch } from 'react-redux';
import { addUser } from '@/lib/store/slices/userSlice';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

const Login = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const dispatch = useDispatch();


  console.log("baseUrl" , baseUrl);

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${baseUrl}/user/signin`, {
        email,
        password,
      });
      localStorage.setItem('token', res?.data?.token);
      // Dispatch only the user data, not the entire response
      dispatch(addUser(res?.data?.data));
      router.push('/profile');
    } catch (err) {
      if (err.response?.status === 400 || err.response?.status === 401) {
        toast.error(err.response?.data || err.response?.data?.message || 'Login failed');
      } else {
        toast.error('Login failed. Please try again.');
      }
    }
  };

  const handleSignup = async () => {
    try {
      const res = await axios.post(`${baseUrl}/user/signup`, {
        firstName,
        lastName,
        email,
        password,
      });

      toast.success(res?.data || 'User registered successfully!');
      setIsLogin(true);
    } catch (err) {
      if (err.response?.status === 400 || err.response?.status === 401) {
        toast.error(err.response?.data || err.response?.data?.message || 'Signup failed');
      } else {
        toast.error('Signup failed. Please try again.');
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh] px-4">
      <div className="bg-white/90 backdrop-blur-md shadow-2xl w-full max-w-md border border-gray-200 rounded-lg">
        <div className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-600">
              {isLogin ? 'Sign in to continue' : 'Join Dev Tinder today'}
            </p>
          </div>

          <div className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block mb-2">
                    <span className="text-sm font-semibold text-gray-700">
                      First Name *
                    </span>
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter First Name"
                  />
                </div>

                <div>
                  <label className="block mb-2">
                    <span className="text-sm font-semibold text-gray-700">
                      Last Name
                    </span>
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter Last Name"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block mb-2">
                <span className="text-sm font-semibold text-gray-700">
                  Email *
                </span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="xyz@gmail.com"
              />
            </div>

            <div>
              <label className="block mb-2">
                <span className="text-sm font-semibold text-gray-700">
                  Password *
                </span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-6">
            <button
              onClick={isLogin ? handleLogin : handleSignup}
              className="w-full px-4 py-2 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 hover:scale-105 transition-transform"
            >
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="w-full px-4 py-2 bg-transparent text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isLogin ? (
                <>
                  Don't have an account?{' '}
                  <span className="text-blue-600 font-semibold ml-1">
                    Sign Up
                  </span>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <span className="text-blue-600 font-semibold ml-1">
                    Login
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

