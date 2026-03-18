import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthService } from './lib/appwrite';

// Expose auth service to window for development console access
if (typeof window !== 'undefined') {
  (window as any).AuthService = AuthService;
  console.log('✓ AuthService available in console as: AuthService');
  console.log('To mark a user as admin, run: AuthService.setupAdminUser("user@example.com")');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
