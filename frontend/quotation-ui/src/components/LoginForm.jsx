import React, { useState } from 'react';
import API, { setAuthToken } from '../api';

const LoginForm = ({ onSwitch }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }
    try {
      const res = await API.post('/login', { email, password });
      const userData = {
        email: res.data.email,
        id: res.data.id,
        access_token: res.data.access_token

      };

      const token = res.data.access_token;
      localStorage.setItem('token', token);

      setAuthToken(token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('userEmail', email);
      alert('Login successful');
      onSwitch("home");
    } catch (err) {
      alert(err.response?.data?.detail || 'Login failed');
    }
  };

  return (
    <div>
     <form onSubmit={login}>
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-[360px] bg-white rounded-xl shadow-md p-8 border border-gray-200">
          <div className="text-center mb-6">
            <div className="avatar">
              <div className="w-16 rounded-full">
              <img src="https://previews.123rf.com/images/vitechek/vitechek1907/vitechek190700199/126786791-user-login-or-authenticate-icon-human-person-symbol-vector.jpg" alt="avatar" />
            </div>
          </div>

          <h2 className="text-[#003D73] text-xl font-semibold mt-3" disabled={!email || !password}>Login</h2>
        </div>

        <input type="text" placeholder="E-mail" value={email} required onChange={(e) => setEmail(e.target.value)} className="input text-black input-bordered border-[#0077C2] w-full mb-4 bg-white hover:border-[#000000]" />
        <input type={showPassword ? "text" : "password" } placeholder="Password" value={password} required onChange={(e) => setPassword(e.target.value)} className="input text-black input-bordered border-[#0077C2] w-full mb-4 bg-white hover:border-[#000000]" />
        
        <div className='flex items-center mb-4 ml-2'>
          <input type='checkbox'
          id="showPassword"
          checked={showPassword}
          onChange={() => setShowPassword(!showPassword)}
          
          />
          <label htmlFor="showPassword" className="ml-2 text-sm text-[#003d73]">Show Password</label>
        </div>


        <button className="btn w-full bg-[#0077C2] text-white hover:bg-[#005f99] mb-4" onClick={login} >
          Login
        </button>
        <p className="text-center text-[#003D73]">Don't have an account? <button onClick={() => onSwitch && onSwitch('signup')} className="text-blue-500 hover:underline">Sign up</button></p>

</div>
</div>
    </form>
      </div>
  );
  
};

export default LoginForm;
