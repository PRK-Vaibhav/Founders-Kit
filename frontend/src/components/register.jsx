import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState(''); // State to hold error messages

  const { name, email, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setError(''); // Clear previous errors
    try {
      const res = await axios.post('http://localhost:5000/api/users/register', formData);
      console.log('User registered:', res.data);
      // Handle successful registration: save token, redirect user, etc.
      alert('Registration successful! Please log in.'); // Placeholder for success feedback
    } catch (err) {
      // Set a user-friendly error message
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
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

              <h3 className="mb-4">Create an Account</h3>

              <form onSubmit={onSubmit}>
                <div className="form-floating mb-4">
                  <input
                    type="text"
                    id="typeNameX"
                    name="name"
                    className="form-control form-control-lg"
                    placeholder="Your Name"
                    value={name}
                    onChange={onChange}
                    required
                  />
                  <label htmlFor="typeNameX">Name</label>
                </div>

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
                  Sign Up
                </button>

                <hr className="my-4" />

                <p className="small mb-0">Already have an account? <a href="/login">Login</a></p>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
