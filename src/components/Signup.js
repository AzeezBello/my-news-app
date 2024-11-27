// components/Signup.js
"use client"; // Ensure this is a client component
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import from next/navigation

export default function Signup() {
  const [username, setUsername] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter(); // Correct hook usage

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    if (password1 !== password2) {
      setError('Passwords do not match');
      return;
    }

    const response = await fetch('http://127.0.0.1:8000/api/auth/registration/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password1, password2 }),
    });

    if (response.ok) {
      router.push('/login');  // Redirect to login page after signup
    } else {
      const errorData = await response.json();
      setError(errorData.non_field_errors[0] || 'Signup failed');
    }
  };

  return (
    <div className="bg-gray-100 p-6 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      <form onSubmit={handleSignup}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password1" className="block text-gray-700">Password</label>
          <input
            type="password"
            id="password1"
            value={password1}
            onChange={(e) => setPassword1(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password2" className="block text-gray-700">Confirm Password</label>
          <input
            type="password"
            id="password2"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Sign Up</button>
      </form>
    </div>
  );
}
