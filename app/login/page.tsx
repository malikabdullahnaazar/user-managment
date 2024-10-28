"use client";
import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const Login: React.FC = () => {
    const [username, setUsername] = useState<string>(''); // Change email to username
    const [password, setPassword] = useState<string>('');
    const router = useRouter();
    const [error, setError] = useState<string>('');
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent the default form submission

        // Create the payload for the login API
        const payload = {
            username, // Use username instead of email
            password,
        };

        try {
            const response = await fetch('http://localhost:4000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                setError("invalid username or password!!")
                throw new Error('Login failed');

            }

            const data = await response.json();
            console.log('Login successful:', data);

            // Set the JWT token in cookies
            Cookies.set('accessToken', data.token, { expires: 1 }); // Set token to expire in 7 days
            Cookies.set('userName', data.userName, { expires: 1 }); // Set token to expire in 7 days

            // Redirect to the home page
            router.push('/');
        } catch (error) {
            console.error('Error during login:', error);
            // Handle error (e.g., show error message to user)
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} method="post" className="bg-white p-6 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
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
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter your password"
                        className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-200">Submit</button>
                <div className="mt-4 text-center">
                    <a href="/forgot" className="text-blue-500 hover:underline">Forgot Password?</a>
                </div>
            </form>
        </div>
    );
};

export default Login;