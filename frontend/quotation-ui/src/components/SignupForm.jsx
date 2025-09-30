import React, { useState } from 'react';
import API, {setAuthToken} from '../api';


const SignupForm = ({ onSwitch }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const signup = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }
    try {
      const res = await API.post('/signup', { email, password });
      const token = res.data.access_token;
            localStorage.setItem('token', token);
            setAuthToken(token);

      alert('Signup successful! Please log in.');
      onSwitch('login');
    } catch (err) {
      const message = (err.response?.data?.detail || 'Signup failed');
      alert(message);
      console.error('Signup error:', err);
    }
  };

  return (
    <div>

   
    <form onSubmit={signup}>
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-[360px] bg-white rounded-xl shadow-md p-8 border border-gray-200">
          <div className="text-center mb-6">
            <div className="avatar">
              <div className="w-16 rounded-full">
              <img src="https://previews.123rf.com/images/vitechek/vitechek1907/vitechek190700199/126786791-user-login-or-authenticate-icon-human-person-symbol-vector.jpg" alt="avatar" />
            </div>
          </div>
          <h2 className="text-[#003D73] text-xl font-semibold mt-3" disabled={!email || !password}>Sign in</h2>
        </div>

        <input type="text" placeholder="E-mail" value={email} required onChange={(e) => setEmail(e.target.value)} className="input text-black input-bordered border-[#0077C2] w-full mb-4 bg-white hover:border-[#000000]" />
        <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} required onChange={(e) => setPassword(e.target.value)} className="input text-black input-bordered border-[#0077C2] w-full mb-4 bg-white hover:border-[#000000]" />
        <div className='flex items-center mb-4 ml-2'>
          <input type='checkbox'
          id="showPassword"
          checked={showPassword}
          onChange={() => setShowPassword(!showPassword)}
        
          />
          <label htmlFor='showPassword' className='ml-2 text-sm text-[#003d73]'>Show Password</label>
        </div>

        <button className="btn w-full bg-[#0077C2] text-white hover:bg-[#005f99] mb-4" onClick={signup} >
          Sign Up
        </button>
        <p className="text-center text-[#003D73]">Already have an account? <button onClick={() => onSwitch && onSwitch('login')} className="text-blue-500 hover:underline">Log in</button></p>

</div>
</div>
    </form>
     </div>

  );

};

export default SignupForm;
