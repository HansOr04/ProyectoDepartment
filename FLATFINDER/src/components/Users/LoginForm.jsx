import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { ErrorMessage } from 'formik';
import { CircularProgress } from '@mui/material';
import { authenticateUser } from '../../services/firebase';

// Styled Components
const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #e0f7fa 0%, #f3e5f5 100%);
`;

const FormContainer = styled.div`
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 500px;
`;

const Title = styled.h2`
  font-size: 32px;
  margin-bottom: 30px;
  text-align: center;
`;

const StyledField = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  &:focus {
    outline: none;
    border-color: #f06292;
  }
`;

const StyledErrorMessage = styled(ErrorMessage)`
  color: #f44336;
  font-size: 14px;
  margin-top: -15px;
  margin-bottom: 15px;
`;

const SubmitButton = styled.button`
  background-color: #f06292;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;
  &:hover {
    background-color: #ec407a;
  }
  &:disabled {
    background-color: #e0e0e0;
    cursor: not-allowed;
  }
`;

const StyledLink = styled(Link)`
  display: block;
  text-align: center;
  margin-top: 20px;
  color: #f06292;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const user = await authenticateUser(email, password);
      if (user) {
        navigate('/');
      } else {
        setError('Failed to authenticate. Please check your credentials.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <FormContainer>
        <Title>Login</Title>
        <form onSubmit={handleSubmit}>
          {error && <StyledErrorMessage>{error}</StyledErrorMessage>}
          <StyledField
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
          <StyledField
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
          <SubmitButton type="submit" disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
          </SubmitButton>
        </form>
        <StyledLink to="/register">
          Don't have an account? Sign up
        </StyledLink>
      </FormContainer>
    </PageContainer>
  );
};

export default LoginForm;