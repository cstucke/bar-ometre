import authService from '../services/authService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide all fields' });
  }

  const token = await authService.registerUser(username, email, password);
  res.status(201).json({ success: true, token });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }

  const token = await authService.loginUser(email, password);
  res.status(200).json({ success: true, token });
});
