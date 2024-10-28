"use client";
import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import Cookies from 'js-cookie';
import Link from "next/link";

interface User {
    username: string;
    password: string;
    name: string;
    confirmpassword: string;
    _id?: string;
    updatedAt?: string,
    createdAt?: string,
    role?: "user" | "admin"
}

function CreateUser() {
    const [formData, setFormData] = useState<User>({
        username: "",
        password: "",
        name: "",
        confirmpassword: ""
    });
    const [error, setError] = useState<string>('');
    const [users, setUsers] = useState<User[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:4000/user', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': Cookies.get('accessToken') || ''
                    }
                });

                if (!response.ok) {

                    throw new Error('Failed to fetch users');
                }

                const data = await response.json();
                setUsers(data.data); // Assuming the returned data is an array of users
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const accesstoken: string | undefined = Cookies.get('accessToken');

            if (!accesstoken) {
                throw new Error('Access token is missing');
            }

            const response = await fetch(formData._id ? `http://localhost:4000/user/${formData._id}` : 'http://localhost:4000/user', {
                method: formData._id ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accesstoken
                },
                body: formData._id ? JSON.stringify({
                    username: formData.username,
                    password: formData.password,
                    name: formData.name
                }) : JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData.errorMessage);
                setError(errorData.errorMessage)
                throw new Error(`User  Creation/Update failed: ${errorData.message || 'Unknown error'}`);
            }

            const data = await response.json();
            console.log('User  created/updated successfully:', data);
            setUsers((prevUsers) => {
                if (formData._id) {
                    return prevUsers.map(user => (user._id === formData._id ? data.data : user));
                }
                return [...prevUsers, data.data];
            });

            setFormData({
                username: "",
                password: "",
                name: "",
                confirmpassword: ""
            });
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error during user creation/updating:', error.message);
            } else {
                console.error('Unexpected error:', error);
            }
        }
    };



    const handlePagination = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const indexOfLastUser = currentPage * itemsPerPage;
    const indexOfFirstUser = indexOfLastUser - itemsPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    const totalPages = Math.ceil(users.length / itemsPerPage);

    return (
        <div className="max-w-md mx-auto p-4">
            <h2 className="text-xl font-bold mb-4">Create User</h2>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
                <input
                    type="password"
                    name="confirmpassword"
                    placeholder="Confirm Password"
                    value={formData.confirmpassword}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
                <button
                    type="submit"
                    className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    {formData._id ? 'Update User' : 'Create User'}
                </button>
            </form>

            <div className="bg-gray-100 p-4 rounded-md shadow-md">
                <span className="text-lg font-semibold">Total Users: </span>
                <span className="text-blue-600">{users.length}</span>
            </div>
            <ul className="space-y-2">
                {currentUsers.map((user, index) => (
                    <Link key={index} href={`/${user._id}`} passHref>
                        <li className="p-4 border border-gray-300 rounded cursor-pointer">
                            <p><strong>Username:</strong> {user.username}</p>
                            <p><strong>Name:</strong> {user.name}</p>
                            <p><strong>Role:</strong> {user.role}</p>
                            <p><strong>Created At:</strong> {user.createdAt}</p>
                            <p><strong>Updated At:</strong> {user.updatedAt}</p>
                        </li>
                    </Link>
                ))}
            </ul>

            <div className="flex justify-center mt-4">
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => handlePagination(i + 1)}
                        className={`mx-1 p-2 border rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default CreateUser;