import React, { useState } from 'react';
import { loadUsers, usernameExists, addUser, removeUser as removeUserFromStore } from '../../utils/users';

export default function AdminUserForm() {
  const [users, setUsers] = useState(loadUsers);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    if (!username.trim() || !password.trim()) {
      setMessage('error:Username and password are required.');
      return;
    }
    if (usernameExists(username)) {
      setMessage('error:That username already exists.');
      return;
    }
    setUsers(addUser(username, password));
    setUsername('');
    setPassword('');
    setMessage('success:User created.');
  };

  const removeUser = (uname) => {
    setUsers(removeUserFromStore(uname));
  };

  const [kind, text] = message.includes(':') ? message.split(':') : ['', ''];

  return (
    <div>
      <div className="page-header">
        <div className="eyebrow">Administration</div>
        <h1>Create users</h1>
        <p className="sub">
          A static, front-end-only interface for provisioning application users. This is stored
          locally and is separate from the mobile OTP login used to access DocVault.
        </p>
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        <div className="card">
          {kind === 'error' && <div className="error-banner">{text}</div>}
          {kind === 'success' && <div className="success-banner">{text}</div>}
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. nitin.kumar"
              />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choose a password"
              />
            </div>
            <button type="submit" className="btn btn-gold btn-block">
              Create user
            </button>
          </form>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1.05rem', marginBottom: 14 }}>Existing users ({users.length})</h3>
          {users.length === 0 && (
            <p className="sub" style={{ margin: 0 }}>No users created yet.</p>
          )}
          {users.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {users.map((u) => (
                <div
                  key={u.username}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid var(--line)',
                    paddingBottom: 8,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>{u.username}</div>
                    <div className="hint">Created {new Date(u.createdAt).toLocaleString()}</div>
                  </div>
                  <button className="btn btn-danger btn-sm" onClick={() => removeUser(u.username)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
