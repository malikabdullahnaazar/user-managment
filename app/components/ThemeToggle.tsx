"use client"
// components/ThemeToggle.tsx
import React, { useEffect } from 'react';

const ThemeToggle: React.FC = () => {
    const toggleTheme = () => {
        const currentTheme = localStorage.getItem('theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.classList.toggle('dark', savedTheme === 'dark');
        }
    }, []);

    const isDarkMode = localStorage.getItem('theme') === 'dark';

    return (
        <button
            onClick={toggleTheme}
            className="flex items-center p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
        >
            {isDarkMode ? (
                <>
                    {/* Sun Icon */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.364-6.364l-1.414 1.414M6.364 17.364l-1.414 1.414M17.364 17.364l1.414 1.414M6.364 6.364L4.95 4.95" />
                    </svg>
                    Light Mode
                </>
            ) : (
                <>
                    {/* Moon Icon */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.364-12.364l-.707.707M4.636 18.364l-.707.707M18.364 18.364l.707.707M4.636 5.636l.707-.707" />
                    </svg>
                    Dark Mode
                </>
            )}
        </button>
    );
};

export default ThemeToggle;