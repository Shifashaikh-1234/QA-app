import React, { useEffect, useState } from 'react';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import HomePage from './components/HomePage';
import API, { setAuthToken } from './api';

function App() {
  const [page, setPage] = useState('login'); // 👈 default is login
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      // temporarily set token
      setAuthToken(token);

      // ✅ check with backend if token is valid
      API.get('/auth/verify')
        .then(() => {
          setPage('home'); // valid → go to home
        })
        .catch(() => {
          localStorage.removeItem('token'); // invalid token → clear it
          setPage('login');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setPage('login'); // no token → stay on login
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>; // 👈 simple loading UI
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {page === 'signup' && <SignupForm onSwitch={setPage} />}
      {page === 'login' && <LoginForm onLogin={() => setPage('home')} onSwitch={setPage} />}
      {page === 'home' && <HomePage onLogout={() => setPage('login')} />}
    </div>
  );
}

export default App;
