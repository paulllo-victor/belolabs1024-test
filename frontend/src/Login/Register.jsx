import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Register.module.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (error) setError('');
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5001/api/users/register', {
        username: formData.username,
        password: formData.password
      });

      if (response.data.success) {
        navigate('/login');
      }
    } catch (error) {
      if (error.response?.status === 400) {
        setError('Username already exists. Please choose another one.');
      } else {
        setError(error.response?.data.message || 'Error registering. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>Create Account</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className={styles.input}
              required
              disabled={isLoading}
              autoComplete="username"
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={styles.input}
              required
              disabled={isLoading}
              autoComplete="new-password"
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className={styles.input}
              required
              disabled={isLoading}
              autoComplete="new-password"
            />
          </div>
          <div className={styles.buttonContainer}>
            <button
              type="button"
              onClick={handleLoginRedirect}
              className={`${styles.button} ${styles.loginButton}`}
              disabled={isLoading}
            >
              Sign In
            </button>
            <button
              type="submit"
              className={`${styles.button} ${styles.registerButton}`}
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;