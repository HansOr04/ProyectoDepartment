// StyledComponents.js
import styled from 'styled-components';
import { Field, ErrorMessage } from 'formik';
import DatePicker from 'react-datepicker';

export const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #e0f7fa 0%, #f3e5f5 100%);
`;

export const FormContainer = styled.div`
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 500px;
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  font-size: 24px;
  color: #f06292;  // Cambia el color si es necesario
  margin-bottom: 20px;

  svg {
    margin-right: 10px;  // Espacio entre el SVG y el texto
  }
`;

export const Title = styled.h2`
  font-size: 32px;
  margin-bottom: 30px;
`;

export const StyledField = styled(Field)`
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

export const StyledErrorMessage = styled(ErrorMessage)`
  color: #f44336;
  font-size: 14px;
  margin-top: -15px;
  margin-bottom: 15px;
`;

export const StyledDatePicker = styled(DatePicker)`
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

export const SubmitButton = styled.button`
  background-color: #f06292;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #ec407a;
  }
  &:disabled {
    background-color: #e0e0e0;
    cursor: not-allowed;
  }
`;

export const FileInputContainer = styled.div`
  margin-bottom: 20px;
`;

export const FileInputLabel = styled.label`
  display: inline-block;
  background-color: #f06292;
  color: white;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #ec407a;
  }
`;

export const HiddenFileInput = styled.input`
  display: none;
`;

export const FileName = styled.span`
  margin-left: 10px;
  font-size: 14px;
`;

export const ImagePreviewContainer = styled.div`
  margin-bottom: 20px;
  text-align: center;
`;

export const ImagePreview = styled.img`
  max-width: 200px;
  max-height: 200px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;