

"use client";
import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie';

interface User {
    username: string;
    name: string;
    role:"user"|"admin"
}
interface Params{
    slug:string
}

function EditUser({params}:{params:Params}) {
    const router =useRouter()
    
  const search:string = params.slug
  console.log(search+"search");
  
    const [formData, setFormData] = useState<User>({
        username: "",
        name: "",
        role: "user"
    }); const handleDropdownChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => { // Updated to handle select element
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    useEffect(() => {
        const fetchUser = async () => {
            if (search) {
                try {
                    const response = await fetch(`http://localhost:4000/user/${search}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': Cookies.get('accessToken') || ''
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch user');
                    }

                    const data = await response.json();
                    setFormData(data.data); // Assuming the returned data is the user object
                } catch (error) {
                    console.error('Error fetching user:', error);
                }
            }
        };

        fetchUser();
    }, [search]);

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

            const response = await fetch(`http://localhost:4000/user/${search}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accesstoken
                },
                body: JSON.stringify({
                    username: formData.username,
                    name: formData.name,
                    role: formData.role 
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`User  update failed: ${errorData.message || 'Unknown error'}`);
            }

            console.log('User  updated successfully');
            router.push('/'); // Redirect to the users list after successful update
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error during user update:', error.message);
            } else {
                console.error('Unexpected error:', error);
            }
        }
    };
    return (
        <div className="max-w-md mx-auto p-4">
            <h2 className="text-xl font-bold mb-4">Update User</h2>
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

                <select
                    name="role"
                    value={formData.role}
                    onChange={handleDropdownChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                >
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                </select>
                <button
                    type="submit"
                    className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Update User
                </button>
            </form>


        </div>
    );
}

export default EditUser;
