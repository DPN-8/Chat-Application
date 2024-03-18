import { useState } from 'react';
import React from 'react'
import Register from './Register';
import Login from './Login';
import './LandingPage.css'

const LandingPage = () => {
    const [isRegistering, setIsRegistering] = useState(false);

    const handleToggleForm = () => {
      setIsRegistering((prevIsRegistering) => !prevIsRegistering);
    };
  
    return (
      <div className="register-container">
        <h2>{isRegistering ? 'Registration Form' : 'Login Form'}</h2>
        {isRegistering ? <Register /> : <Login />}
        <button onClick={handleToggleForm}>
          {isRegistering ? 'Switch to Login' : 'Switch to Register'}
        </button>
      </div>
    );
}

export default LandingPage
