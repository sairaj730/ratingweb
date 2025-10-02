
import React, { useState } from 'react';
import { updateUserPassword } from '../services/authService';
import '../styles/Form.css';

function ProfilePage() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const validatePassword = () => {
    if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16})/.test(password)) {
      setError('Password must be 8-16 characters long, with at least one uppercase letter and one special character.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validatePassword()) {
      try {
        await updateUserPassword(password);
        setMessage('Password updated successfully!');
      } catch (error) {
        setMessage('Failed to update password.');
        console.error(error);
      }
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Update Password</h2>
        {message && <div className={`message ${error ? 'error' : 'success'}`}>{message}</div>}
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Update Password</button>
      </form>
    </div>
  );
}

export default ProfilePage;