import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, CircularProgress, Alert } from '@mui/material';
import { styled } from '@mui/system';
import background from "../assets/images/mode1.gif";
import { API_URL } from '../config/api';

const StyledPageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  width: '100vw',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundImage: `url(${background})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  padding: '2rem',
  fontFamily: '"Press Start 2P", cursive',
  [theme.breakpoints.down('sm')]: {
    padding: '1rem',
  },
}));

const StyledFormContainer = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(44, 44, 84, 0.95)',
  borderRadius: '15px',
  border: '2px solid #00d9ff',
  padding: '3rem',
  maxWidth: '500px',
  width: '100%',
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)',
  textAlign: 'center',
  [theme.breakpoints.down('sm')]: {
    padding: '2rem',
  },
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
  fontFamily: '"Press Start 2P", cursive',
  color: '#00d9ff',
  marginBottom: '2.5rem',
  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
  fontSize: 'clamp(1.8rem, 5vw, 2.2rem)',
  [theme.breakpoints.down('sm')]: {
    marginBottom: '2rem',
    fontSize: 'clamp(1.5rem, 5vw, 1.8rem)',
  },
}));

const StyledTextField = styled(TextField)({
  marginBottom: '1.5rem',
  '& label': {
    color: '#00d9ff',
    fontFamily: '"Press Start 2P", cursive',
    fontSize: '0.9rem',
  },
  '& label.Mui-focused': {
    color: '#00bfff',
  },
  '& .MuiInputBase-input': {
    color: '#fff',
    fontFamily: '"Press Start 2P", cursive',
    fontSize: '0.9rem',
    padding: '14px 10px',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#00d9ff',
      borderWidth: '2px',
      borderRadius: '4px',
    },
    '&:hover fieldset': {
      borderColor: '#00bfff',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#00bfff',
      boxShadow: '0 0 10px #00d9ff',
    },
  },
});

const StyledButton = styled(Button)({
  padding: '10px 20px',
  fontSize: '1rem',
  fontFamily: '"Press Start 2P", cursive',
  color: '#fff',
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  border: '2px solid #00d9ff',
  borderRadius: '4px',
  boxShadow: '0 0 10px #00d9ff',
  transition: 'all 0.3s ease',
  textTransform: 'none',
  '&:hover': {
    background: 'linear-gradient(45deg, #21CBF3 30%, #2196F3 90%)',
    boxShadow: '0 0 15px #00d9ff',
    transform: 'scale(1.05)',
  },
  '&:active': {
    transform: 'scale(0.95)',
    boxShadow: '0 0 5px #00d9ff',
  },
  '&.Mui-disabled': {
    background: 'rgba(33, 150, 243, 0.5)',
    boxShadow: 'none',
    color: 'rgba(255, 255, 255, 0.5)',
    borderColor: 'rgba(0, 217, 255, 0.5)',
  },
});

const StyledError = styled(Alert)({
  marginTop: '1.5rem',
  backgroundColor: 'rgba(255, 87, 87, 0.1)',
  border: '1px solid rgba(255, 87, 87, 0.3)',
  color: '#ff5757',
  fontFamily: '"Press Start 2P", cursive',
  fontSize: '0.8rem',
  borderRadius: '8px',
  '.MuiAlert-icon': {
    color: '#ff5757',
  },
});

const Register = ({ onLogin }) => {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const registerResponse = await fetch(`${API_URL}/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        }),
      });

      const registerData = await registerResponse.json();

      if (!registerResponse.ok) {
         if (registerResponse.status === 400) {
           setError('Username already exists. Please choose another one.');
         } else {
           throw new Error(registerData.message || `HTTP error! status: ${registerResponse.status}`);
         }
         setIsLoading(false); 
         return; 
      }

      try {
        const loginResponse = await fetch(`${API_URL}/api/users/login`, {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
           },
           body: JSON.stringify({
             username: formData.username,
             password: formData.password
           }),
        });
        
        const loginData = await loginResponse.json();

        if (!loginResponse.ok) {
           throw new Error(loginData.message || `Auto-login HTTP error! status: ${loginResponse.status}`);
        }

        localStorage.setItem('token', loginData.token);
        localStorage.setItem('userID', loginData.userID);
        onLogin();

      } catch (loginErr) {
        console.error("Auto-login after registration failed:", loginErr);
        setError('Registration successful, but auto-login failed. Please log in manually.');
      }

    } catch (regErr) {
      setError(regErr.message || 'Error registering. Please check connection and try again.');
      console.error("Registration error:", regErr);
    } finally {
      setIsLoading(false);
    } 
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <StyledPageContainer>
      <StyledFormContainer component="form" onSubmit={handleSubmit}>
        <StyledTitle variant="h4">
          Create Account
        </StyledTitle>
        <StyledTextField
          label="Username"
          variant="outlined"
          fullWidth
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          required
          disabled={isLoading}
          autoComplete="username"
        />
        <StyledTextField
          label="Password"
          variant="outlined"
          type="password"
          fullWidth
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          required
          disabled={isLoading}
          autoComplete="new-password"
        />
        <StyledTextField
          label="Confirm Password"
          variant="outlined"
          type="password"
          fullWidth
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          required
          disabled={isLoading}
          autoComplete="new-password"
        />
        <Box sx={{ display: 'flex', gap: 2, marginTop: 2 }}>
          <StyledButton
            variant="outlined"
            onClick={handleLoginRedirect}
            disabled={isLoading}
             sx={{ 
              flex: 1, 
              background: 'transparent', 
              borderColor: '#00d9ff', 
              color: '#00d9ff',
              '&:hover': {
                background: 'rgba(0, 217, 255, 0.1)',
                borderColor: '#00bfff',
              }
            }}
          >
            Sign In
          </StyledButton>
          <StyledButton
            type="submit"
            variant="contained"
            disabled={isLoading}
            sx={{ flex: 1 }}
          >
            {isLoading ? <CircularProgress size={24} sx={{ color: '#fff'}} /> : 'Create Account'}
          </StyledButton>
        </Box>
        {error && (
          <StyledError severity="error">
            {error}
          </StyledError>
        )}
      </StyledFormContainer>
    </StyledPageContainer>
  );
};

Register.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default Register;