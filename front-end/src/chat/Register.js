  import React, { useState } from "react";
  import { useNavigate } from "react-router-dom";
  import "./Register.css";
  import axios from "axios";
  import JSEncrypt from "jsencrypt";

  const Register = () => {
    const [nameLocal, setNameLocal] = useState("");
    const [mobile, setMobile] = useState("");
    const [errorMessage, setErrorMessage] = useState();
    const navigate = useNavigate();

    const handleNameChange = (event) => {
      setNameLocal(event.target.value);
    };

    const handleMobileChange = (event) => {
      setMobile(event.target.value);
    };

    const handleSubmit = (event) => {
      event.preventDefault();
      var crypt = new JSEncrypt({ default_key_size: 2048 });
      var key = {
        public_key: crypt.getPublicKey(),
        private_key: crypt.getPrivateKey(),
      };
      if (nameLocal && mobile) {
        const user = {
          username: nameLocal,
          mobile_number: mobile,
          public_key: key.public_key,
          private_key: key.private_key,
        };
        axios
          .post("http://192.168.1.20:8000/user/", user)
          .then((res) => {
            const data = res?.data?.data;
            window.localStorage.setItem(`${nameLocal}_private_key`, key.private_key);
            navigate(`/chat/${nameLocal}`);
          })
          .catch((err) => {
            if (err.response.status === 409) {
              setErrorMessage(err.response.data.message);
            }
            console.log(err.response);
          });
      } else {
        alert("Please fill in both name and mobile number.");
      }
    };

    return (
      <div className="register-container">
        <form onSubmit={handleSubmit}>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
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
