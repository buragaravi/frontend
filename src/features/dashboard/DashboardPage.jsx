import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DashboardPage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:7000/api/auth/me', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          })

        setUser(response.data);
      } catch (err) {
        console.error('Error fetching user data', err);
      }
    };

    fetchUser();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold">Welcome, {user.name}!</h1>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <p>Last Login: {new Date(user.lastLogin).toLocaleString()}</p>
    </div>
  );
};

export default DashboardPage;
