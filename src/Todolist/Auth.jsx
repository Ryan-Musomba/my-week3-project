import React, { useState } from "react";
import { FaUserAlt, FaLock, FaEnvelope } from "react-icons/fa";
import "./Styling.css";

function Auth({ onLogin, onRegister, activeAuth, toggleAuthMode }) {
  const [authFormData, setAuthFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [authError, setAuthError] = useState('');

  const handleAuthChange = (e) => {
    const { name, value } = e.target;
    setAuthFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setAuthError('');
    onLogin(authFormData.username, authFormData.password)
      .catch(error => setAuthError(error.message || 'Invalid username or password'));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setAuthError('');
    onRegister(authFormData.username, authFormData.email, authFormData.password)
      .catch(error => setAuthError(error.message || 'Registration failed'));
  };

  return (
    <div className={`wrapper ${activeAuth ? "active" : ""}`}>
      {/* Login Form */}
      <div className="form-box login">
        <form onSubmit={handleLogin}>
          <h1>Login</h1>
          {authError && <div className="error-message">{authError}</div>}
          <div className="input-box">
            <input 
              type="text" 
              name="username"
              placeholder="Username" 
              required 
              value={authFormData.username}
              onChange={handleAuthChange}
            />
            <FaUserAlt className="icon" />
          </div>
          <div className="input-box">
            <input 
              type="password" 
              name="password"
              placeholder="Password" 
              required 
              value={authFormData.password}
              onChange={handleAuthChange}
            />
            <FaLock className="icon" />
          </div>
          <div className="remember-forgot">
            <label>
              <input type="checkbox" />
              Remember me
            </label>
            <a href="#">Forgot password?</a>
          </div>
          <button type="submit">Login</button>
          <div className="register-link">
            <p>Don't have an account? <a href="#" onClick={toggleAuthMode}>Register</a></p>
          </div>
        </form>
      </div>

      {/* Registration Form */}
      <div className="form-box register">
        <form onSubmit={handleRegister}>
          <h1>Registration</h1>
          {authError && <div className="error-message">{authError}</div>}
          <div className="input-box">
            <input 
              type="text" 
              name="username"
              placeholder="Username" 
              required 
              value={authFormData.username}
              onChange={handleAuthChange}
            />
            <FaUserAlt className="icon" />
          </div>
          <div className="input-box">
            <input 
              type="email" 
              name="email"
              placeholder="Email" 
              required 
              value={authFormData.email}
              onChange={handleAuthChange}
            />
            <FaEnvelope className="icon" />
          </div>
          <div className="input-box">
            <input 
              type="password" 
              name="password"
              placeholder="Password" 
              required 
              value={authFormData.password}
              onChange={handleAuthChange}
            />
            <FaLock className="icon" />
          </div>
          <div className="remember-forgot">
            <label>
              <input type="checkbox" />I agree to terms & conditions
            </label>
          </div>
          <button type="submit">Register</button>
          <div className="register-link">
            <p>Already have an account? <a href="#" onClick={toggleAuthMode}>Login</a></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Auth;