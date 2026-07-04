// Simple front-end-only "user store" backed by localStorage.
// Shared by the public Registration page and the Admin "create users" page
// so both views stay in sync (per assignment 2.3 — static, no backend endpoint).

const STORAGE_KEY = 'dms_admin_users';

export function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export function usernameExists(username) {
  return loadUsers().some((u) => u.username.toLowerCase() === username.trim().toLowerCase());
}

export function addUser(username, password) {
  const users = loadUsers();
  const next = [...users, { username: username.trim(), password, createdAt: new Date().toISOString() }];
  saveUsers(next);
  return next;
}

export function removeUser(username) {
  const next = loadUsers().filter((u) => u.username !== username);
  saveUsers(next);
  return next;
}
