// Importaciones necesarias de React y react-router-dom
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// Importación de styled-components para estilos
import styled from 'styled-components';
// Importación de CircularProgress de Material-UI para el indicador de carga
import { CircularProgress } from '@mui/material';
// Importación del servicio de autenticación de Firebase
import { authenticateUser } from '../../services/firebase';

// Componentes estilizados
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

const StyledErrorMessage = styled.div`
  color: #f44336;
  font-size: 14px;
  margin-top: -15px;
  margin-bottom: 15px;
  text-align: center;
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

// Componente principal LoginForm
const LoginForm = () => {
  // Estados para manejar el email, password, carga y errores
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Hook para la navegación
  const navigate = useNavigate();

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Intento de autenticación del usuario
      const user = await authenticateUser(email, password);
      if (user) {
        // Autenticación exitosa, redirigimos al usuario a la ruta "/"
        navigate('/');
      } else {
        setError('No se encontraron las credenciales. Por favor, verifica tu usuario y contraseña.');
      }
    } catch (err) {
      setError('Usuario o contraseña incorrecta. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Renderizado del componente
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