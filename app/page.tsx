"use client"
import ThemeToggle from './components/ThemeToggle';
import CreateUser from './components/CreateUser';
import { useEffect } from 'react';
import UserInfo from './components/Userinfo';
import Cookies from 'js-cookie';

export default function Home() {
  useEffect(() => {
    const token = Cookies.get('accessToken');
    if (!token) {
      // Redirect to login page or show a message
      window.location.href = '/login'; // Adjust the path as necessary
    }
  }, []);
  const handleLogout = () => {
    Cookies.remove('accessToken');
    Cookies.remove('userName');
    // Optionally, redirect to login page or refresh the page
    window.location.reload(); // Reloads the page to reflect the changes
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex justify-between items-center w-full px-4 py-2">
        <ThemeToggle />
        <UserInfo onLogout={handleLogout} />
      </div>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">Welcome to the Dashboard!</h1>
        <p className="text-gray-600 dark:text-gray-300">Manage your account and settings here.</p>
      </div>
      <CreateUser />
    </div>
  );
}