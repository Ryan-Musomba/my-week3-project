import React, { useState } from 'react';
import { FaUserAlt, FaLock, FaEnvelope } from 'react-icons/fa';
import './Styling.css';

function Auth({ setIsLoggedIn, setCurrentUser, loadUserTasks }) {
  const [activeAuth, setActiveAuth] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [authError, setAuthError] = useState('');

  const toggleAuthMode = () => {
    setActiveAuth(!activeAuth);
    setAuthError('');
  };
  
  const handleAuthChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => 
      u.username === formData.username && u.password === formData.password
    );

    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      localStorage.setItem('currentUser', JSON.stringify(user));
      loadUserTasks(user.username);
      setAuthError('');
    } else {
      setAuthError('Invalid username or password');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    const userExists = users.some(u => 
      u.username === formData.username || u.email === formData.email
    );

    if (userExists) {
      setAuthError('Username or email already exists');
      return;
    }

    const newUser = {
      username: formData.username,
      email: formData.email,
      password: formData.password
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    setCurrentUser(newUser);
    setIsLoggedIn(true);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    localStorage.setItem(`tasks_${newUser.username}`, JSON.stringify([]));
    setAuthError('');
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
              value={formData.username}
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
              value={formData.password}
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
              value={formData.username}
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
              value={formData.email}
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
              value={formData.password}
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