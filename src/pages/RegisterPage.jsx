import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/authService';
import '../styles/Form.css';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Normal User');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (name.length < 20 || name.length > 60) {
      newErrors.name = 'Name must be between 20 and 60 characters.';
    }
    if (address.length > 400) {
      newErrors.address = 'Address can be a maximum of 400 characters.';
    }
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      newErrors.email = 'Invalid email format.';
    }
    if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16})/.test(password)) {
      newErrors.password = 'Password must be 8-16 characters long, with at least one uppercase letter and one special character.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await register({ name, email, address, password, role });
        navigate('/login');
      } catch (error) {
        console.error('Registration failed', error);
        setErrors({ api: 'Registration failed. Please try again.' });
      }
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>
        {errors.api && <p className="error">{errors.api}</p>}
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        {errors.name && <p className="error">{errors.name}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {errors.email && <p className="error">{errors.email}</p>}
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        {errors.address && <p className="error">{errors.address}</p>}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {errors.password && <p className="error">{errors.password}</p>}
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="Normal User">Normal User</option>
          <option value="Store Owner">Store Owner</option>
          <option value="System Administrator">System Administrator</option>
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegisterPage;