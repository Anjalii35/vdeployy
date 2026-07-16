import api from './axiosInstance';

/**
 * Registers a new account entry in the database.
 */
export const registerUser = (name, email, password) =>
  api.post('/auth/register', { name, email, password });

/**
 * Validates login credentials and yields a plain JWT string.
 */
export const loginUser = (email, password) =>
  api.post('/auth/login', { email, password });

/**
 * Retrieves the profile context information for the authenticated user session.
 */
export const getMe = () => 
  api.get('/users/me');

/**
 * Dispatches current and new password structures to update the security vault.
 * Expects { currentPassword, newPassword } inside the payload.
 */
export const changeUserPassword = (currentPassword, newPassword) =>
  api.put('/auth/change-password', { currentPassword, newPassword });