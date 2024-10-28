"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
const ResetPassword: React.FC = () => {
    const [newPassword, setNewPassword] = useState<string>(''); 
    const [confirmpassword, setConfirmpassword] = useState<string>(''); 
    const [error, setError] = useState<string>('');
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement|HTMLButtonElement>) => {
        event.preventDefault();
        console.log("clicjjed");
        setError('');
    
        if (newPassword !== confirmpassword) {
            setError('Passwords do not match. Please try again.');
            return;
        }
    
        try {
            const retrievedToken = Cookies.get('token') as string;
            console.log('Token retrieved:', retrievedToken); // Log the token
    
            const response = await fetch('http://localhost:4000/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: retrievedToken, newPassword }), // Use retrieved token
            });
    
            console.log('Response status:', response.status); // Log response status
            if (!response.ok) {
                const errorMessage = await response.text(); // Get error message from response
                console.error('Error response:', errorMessage); // Log error response
                throw new Error('Failed to reset password');
            }
    
            // Clear the token from cookies
            Cookies.remove('token');
            // Redirect to the login page
            router.push('/login');
        } catch (error) {
            console.error('Error during password reset:', error);
            setError('Failed to reset password. Please try again.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                
                    <input
                        type="text"
                        id="token"
                        hidden
                        placeholder="Enter your reset token"
                        className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
           
                <div className="mb-4">
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input
                        type="password"
                        id="newPassword"
                        placeholder="Enter your new password"
                        className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="confirmpassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm  Password</label>
                    <input
                        type="password"
                        id="confirmpassword"
                        placeholder="Enter your new confirm password"
                        className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={confirmpassword}
                        onChange={(e) => setConfirmpassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" onClick={handleSubmit}className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-200">Reset Password</button>
            </form>
        </div>
    );
};

export default ResetPassword;