import { User } from '../types/auth';

// Check if user is logged in
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('authToken');
  return !!token;
};

// Get current user information
export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem('currentUser');
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson) as User;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

// Register a new user
export const signUp = (email: string, password: string, name: string = ''): boolean => {
  try {
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.some((user: User) => user.email === email)) {
      return false; // User already exists
    }
    
    // Add new user
    const newUser: User = { email, password, name };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto login after signup
    return logIn(email, password);
  } catch (error) {
    console.error('Error during signup:', error);
    return false;
  }
};

// Log in a user
export const logIn = (email: string, password: string): boolean => {
  try {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: User) => u.email === email && u.password === password);
    
    if (user) {
      // Create a session token (in a real app, this would be a JWT or similar)
      const token = Date.now().toString();
      localStorage.setItem('authToken', token);
      
      // Store user info (excluding password for security)
      const { password: _, ...userWithoutPassword } = user;
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error during login:', error);
    return false;
  }
};

// Log out the current user
export const logOut = (): void => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('currentUser');
};