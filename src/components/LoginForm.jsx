import React, { useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../constants';

function LoginForm({ setUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      axios.defaults.baseURL = `http://${BACKEND_URL}`;
      const response = await axios.post(`/accounts/api-token-auth/`, { username, password });
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
      console.log(response.data)
      setUser(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginForm;
