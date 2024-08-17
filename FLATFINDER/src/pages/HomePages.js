import React from 'react';
import styled from 'styled-components';

const ContainerImage = styled.div`
  width: 100%;
  height: 70vh;
  background-image: url('https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1');
  background-size: cover;
  background-position: center;
  position: relative;

  @media (max-width: 768px) {
    height: 50vh; /* Ajusta la altura en pantallas más pequeñas */
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(242, 230, 207, 0.3);
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 2;
  top: 50%;
  left: 10%;
  transform: translateY(-60%);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 50%;

  @media (max-width: 768px) {
    width: 80%; /* Aumenta el ancho en pantallas más pequeñas */
    left: 5%; /* Ajusta la posición */
  }
`;

const Title = styled.h2`
  color: white;
  font-size: 3rem;
  margin-bottom: -1rem;
  text-align: left;

  @media (max-width: 768px) {
    font-size: 2rem; /* Reduce el tamaño de la fuente en pantallas más pequeñas */
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;
  margin-top: 2rem;

  @media (max-width: 768px) {
    justify-content: center; /* Centra los botones en pantallas más pequeñas */
  }
`;

const Button = styled.button`
  background-color: #114C5F;
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 0.5rem;
  margin-left: 33em;

  cursor: pointer;
  font-size: 1.2rem;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    background-color: #1a6985;
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    margin-left: 0; /* Elimina el margen en pantallas más pequeñas */
    margin-right: 1rem; /* Agrega un margen a la derecha para separación */
  }
`;

export { Button, Title, ContentWrapper, ContainerImage, ButtonWrapper, Overlay };
