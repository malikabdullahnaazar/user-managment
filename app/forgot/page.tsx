"use client";
import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const ForgotPassword: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent default form submission
        try {
            const response = await fetch('http://localhost:4000/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username }), // Send the username in the request body
            });

            if (!response.ok) {
                throw new Error('Request failed');
            }

            const data = await response.json();
            console.log('Request successful:', data);

            // Set the reset token in cookies
            Cookies.set('token', data.resetToken, { expires: 1 }); // Set token to expire in 1 day

            // Redirect to the reset password page
            router.push('/resetpassword');
        } catch (error) {
            console.error('Error during request:', error);
            // Handle error (e.g., show error message to user)
        }
        console.log('Username submitted:', username);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
                
                <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                        type="text"
                        id="username"
                        placeholder="Enter your username"
                        className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-200">Submit</button>
            </form>
        </div>
    );
};

export default ForgotPassword;