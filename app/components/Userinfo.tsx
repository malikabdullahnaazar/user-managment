// components/UserInfo.tsx
"use client"
import React from 'react';
import Cookies from 'js-cookie';

const UserInfo: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const userName = Cookies.get('userName');
    return (
        <div className="flex items-center space-x-4">
            {userName && (
                <>
                    <span className="text-gray-700 dark:text-gray-300">{userName}</span>
                    <button
                        onClick={onLogout}
                        className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
                    >
                        Logout
                    </button>
                </>
            )}
        </div>
    );
};

export default UserInfo;