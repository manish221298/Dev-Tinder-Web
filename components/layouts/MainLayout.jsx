'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { getBaseUrl, getToken } from '@/lib/utils/constants';
import { addUser } from '@/lib/store/slices/userSlice';
import Navbar from '@/components/menubar/Navbar';
import Sidebar from '@/components/menubar/Sidebar';
import Footer from '@/components/menubar/Footer';

const MainLayout = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const userData = useSelector((state) => state.user);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const isLoginPage = pathname === '/login';
  
  // Get token only after component is mounted to avoid hydration issues
  const token = mounted ? getToken() : null;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Don't redirect if already on login page
    if (!token && !isLoginPage) {
      router.push('/login');
      return;
    }
    // Only fetch data if we have a token and not on login page
    if (token && !isLoginPage) {
      fetchData();
    }
  }, [mounted, token, isLoginPage, router]);

  const fetchData = async () => {
    // Don't make API call if no token
    if (!token) return;
    
    try {
      const apiUrl = getBaseUrl(); // Use function to get URL dynamically
      const res = await axios.get(`${apiUrl}/profile/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(addUser(res?.data?.userData));
    } catch (err) {
      // Silently fail like the original code
      // Don't log errors to avoid console noise
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div
          className={`flex-1 flex flex-col ${
            mounted && token && !isLoginPage ? 'lg:ml-0' : ''
          }`}
        >
          <main className="flex-grow pb-20 px-4 lg:px-8">{children}</main>
          {mounted && token && !isLoginPage && <Footer />}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;

