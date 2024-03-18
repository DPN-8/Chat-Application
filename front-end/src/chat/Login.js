import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const nav = useNavigate();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (username) {
      try {
        const body = {
          'username': username
        };
          const response = await axios.post('http://192.168.1.20:8000/auth/login/', body)
          console.log(response)
          if (response.status === 200)
            nav(`/chat/${username}`);
      } catch (error) {
        if (error.code === 'ERR_NETWORK') {
          setErrorMessage('Error occurred while connecting to the server');
        } else if (error.response && error.response.status === 404 && error.response.data && error.response.data.status === 'user_not_found') {
          console.log(error);
          setErrorMessage(error.response.data.message);
        } else {
          console.error('Unhandled error:', error);
          setErrorMessage('An unexpected error occurred. Please try again.');
        }
      }
    } else {
      alert('Please fill in your username.');
    }
  };

  return (
    <div className="login-container">
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
