import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { UserProvider } from './context/UserContext';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <GoogleOAuthProvider clientId="513333596106-3tt5thpccc8qn7gum9nhhoinplhvdmor.apps.googleusercontent.com">
    <UserProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </UserProvider>
  </GoogleOAuthProvider>
);
