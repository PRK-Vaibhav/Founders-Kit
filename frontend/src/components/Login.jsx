import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(''); // State to hold error messages

  const { email, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setError(''); // Clear previous errors
    try {
      const res = await axios.post('http://localhost:5000/api/users/login', formData);
      console.log('User logged in:', res.data);
      // Handle successful login: save token, redirect user, update auth state, etc.
      alert('Login successful!'); // Placeholder for success feedback
    } catch (err) {
      // Set a user-friendly error message
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      console.error(err.response?.data || 'An error occurred');
    }
  };

  return (
    <div className="container-fluid bg-light" style={{ minHeight: '100vh' }}>
      <div className="row d-flex justify-content-center align-items-center h-100">
        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
          <div className="card shadow-lg border-0" style={{ borderRadius: '1rem' }}>
            <div className="card-body p-5 text-center">

              <h3 className="mb-4">Sign in</h3>

              <form onSubmit={onSubmit}>
                <div className="form-floating mb-4">
                  <input
                    type="email"
                    id="typeEmailX"
                    name="email"
                    className="form-control form-control-lg"
                    placeholder="name@example.com"
                    value={email}
                    onChange={onChange}
                    required
                  />
                  <label htmlFor="typeEmailX">Email address</label>
                </div>

                <div className="form-floating mb-4">
                  <input
                    type="password"
                    id="typePasswordX"
                    name="password"
                    className="form-control form-control-lg"
                    placeholder="Password"
                    value={password}
                    onChange={onChange}
                    required
                  />
                  <label htmlFor="typePasswordX">Password</label>
                </div>

                {/* Display error message if it exists */}
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <button className="btn btn-primary btn-lg btn-block w-100" type="submit">
                  Login
                </button>

                <hr className="my-4" />

                <p className="small mb-0">Don't have an account? <a href="/register">Sign Up</a></p>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
