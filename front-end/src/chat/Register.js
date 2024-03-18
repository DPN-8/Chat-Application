import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import axios from "axios";
import NodeRSA from "node-rsa";

const Register = () => {
  
  const [nameLocal, setNameLocal] = useState("");
  const [mobile, setMobile] = useState("");
  const navigate = useNavigate();
  const [keys, setKeys] = useState({ publicKey: '', privateKey: '' });

  const generateKeys = () => {
    const key = new NodeRSA({ b: 2048 }); // Generate 2048-bit RSA key pair
    const publicKey = key.exportKey('public'); // Get the public key
    const privateKey = key.exportKey('private'); // Get the private key

    setKeys({ publicKey, privateKey });
  };


  const handleNameChange = (event) => {
    setNameLocal(event.target.value);
  };

  const handleMobileChange = (event) => {
    setMobile(event.target.value);
  };

  const handleSubmit = (event) => {
    generateKeys()
    event.preventDefault();
    if (nameLocal && mobile) {
      const user = {
        username: nameLocal,
        mobile_number: mobile,
        public_key: publicKey,
        private_key: privateKey
      };
      try {
        const response = axios.post("http://192.168.1.20:8000/user/", user);

        console.log(response);
        window.localStorage.setItem(`${username}_private_key`, privateKey)
        // navigate('/chat', { state: { name: nameLocal } });
      } catch (err) {
        console.log(err);
      }
    } else {
      alert("Please fill in both name and mobile number.");
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={nameLocal}
            onChange={handleNameChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="mobile">Mobile Number:</label>
          <input
            type="number"
            id="mobile"
            value={mobile}
            onChange={handleMobileChange}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
