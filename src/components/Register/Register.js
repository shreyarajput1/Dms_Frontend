import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usernameExists, addUser } from '../../utils/users';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('All fields are required.');
      return;
    }
    if (password.length < 4) {
      setError('Password should be at least 4 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (usernameExists(username)) {
      setError('That username is already taken.');
      return;
    }

    addUser(username, password);
    setSuccess('Account created! Redirecting to login...');
    setUsername('');
    setPassword('');
    setConfirmPassword('');

    setTimeout(() => navigate('/login'), 1200);
  };

  return (
    <div className="auth-wrap">
      <div className="card auth-card">
        <div className="display">Create your account</div>
        <p className="sub">
          Register a username and password. Note: document access itself still uses OTP login
          with your mobile number — this just provisions your app account.
        </p>

        {error && <div className="error-banner">{error}</div>}
        {success && !error && <div className="success-banner">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="reg-username">Username</label>
            <input
              id="reg-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. nitin.kumar"
            />
          </div>
          <div className="field">
            <label htmlFor="reg-password">Password</label>
            <input
              id="reg-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Choose a password"
            />
          </div>
          <div className="field">
            <label htmlFor="reg-confirm-password">Confirm password</label>
            <input
              id="reg-confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
            />
          </div>
          <button className="btn btn-primary btn-block" type="submit">
            Register
          </button>
        </form>

        <p className="sub" style={{ marginTop: 16, textAlign: 'center' }}>
          Already have access? <Link to="/login">Sign in with OTP</Link>
        </p>
      </div>
    </div>
  );
}
