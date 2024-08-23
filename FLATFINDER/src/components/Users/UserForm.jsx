import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../../config/firebase';
import { uploadUserImage } from '../../services/firebase';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

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

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  font-size: 24px;
  color: #f06292;
`;

const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
`;

const StyledField = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const StyledErrorMessage = styled.div`
  color: red;
  font-size: 12px;
  margin-top: -10px;
  margin-bottom: 10px;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #f06292;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:disabled {
    background-color: #ddd;
  }
`;

const FileInputContainer = styled.div`
  margin-bottom: 15px;
`;

const FileInputLabel = styled.label`
  display: inline-block;
  padding: 10px 15px;
  background-color: #f06292;
  color: white;
  border-radius: 4px;
  cursor: pointer;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const FileName = styled.span`
  margin-left: 10px;
`;

const ImagePreviewContainer = styled.div`
  margin-bottom: 15px;
`;

const ImagePreview = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 4px;
`;

// Componente principal UserForm
const UserForm = ({ userId = null }) => {
  const [initialValues, setInitialValues] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    birthDate: null,
    avatar: null
  });
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        try {
          const userDoc = await getDoc(doc(db, 'users', userId));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setInitialValues({
              ...initialValues,
              email: userData.email,
              firstName: userData.firstName,
              lastName: userData.lastName,
              birthDate: userData.birthDate ? new Date(userData.birthDate) : null,
            });
            if (userData.imageUid) {
              try {
                const imageUrl = await getDownloadURL(ref(storage, userData.imageUid));
                setPreviewImage(imageUrl);
              } catch (error) {
                console.error('Error fetching image URL:', error);
              }
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [userId]);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Email inválido').required('El email es requerido'),
    password: userId 
      ? Yup.string()
      : Yup.string()
          .min(6, 'La contraseña debe tener al menos 6 caracteres')
          .matches(
            /^(?=.*[!@#$%^&*])/,
            'La contraseña debe incluir al menos un caracter especial'
          )
          .required('La contraseña es requerida'),
    confirmPassword: userId
      ? Yup.string()
      : Yup.string()
          .oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir')
          .required('Confirmar la contraseña es requerido'),
    firstName: Yup.string()
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .required('El nombre es requerido'),
    lastName: Yup.string()
      .min(2, 'El apellido debe tener al menos 2 caracteres')
      .required('El apellido es requerido'),
    birthDate: Yup.date()
      .nullable()
      .required('La fecha de nacimiento es requerida')
      .test('age', 'Debes tener entre 18 y 120 años', function(birthDate) {
        if (!birthDate) return false;
        const cutoff = new Date();
        const age = cutoff.getFullYear() - birthDate.getFullYear();
        return age >= 18 && age <= 120;
      }),
    avatar: Yup.mixed()
      .required('La imagen de perfil es requerida')
      .test('fileSize', 'Archivo demasiado grande', (value) => {
        if (!value) return false;
        return value && value.size <= 2000000;
      })
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      let userDataToSave = {
        firstName: values.firstName,
        lastName: values.lastName,
        birthDate: values.birthDate,
        email: values.email,
        rol: 'usuario'
      };

      if (!userId) {
        // Para la creación de un nuevo usuario
        const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
        userId = userCredential.user.uid;
        
        await updateProfile(userCredential.user, {
          displayName: `${values.firstName} ${values.lastName}`
        });

        await setDoc(doc(db, 'users', userId), userDataToSave);

        if (values.avatar) {
          const imageUid = await uploadUserImage(userId, values.avatar);
          await updateProfile(auth.currentUser, { photoURL: imageUid });
        }

        alert('Usuario creado exitosamente');
        navigate('/'); // Redirigimos a la ruta principal después de crear el usuario
      } else {
        // Para actualizar un usuario existente
        await updateDoc(doc(db, 'users', userId), userDataToSave);

        if (values.avatar) {
          const imageUid = await uploadUserImage(userId, values.avatar);
          await updateProfile(auth.currentUser, { photoURL: imageUid });
        }

        alert('Usuario actualizado exitosamente');
      }
    } catch (error) {
      console.error('Error al guardar el usuario:', error);
      alert('Ocurrió un error al guardar el usuario: ' + error.message);
    }
    setSubmitting(false);
  };

  return (
    <PageContainer>
      <FormContainer>
        <Logo>
          <svg width="39" height="38" viewBox="0 0 39 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24.375 13.0158V1.18326H2.4375V36.6808H12.1875V29.5813H14.625V36.6808H36.5625V13.0158H24.375ZM8.53125 31.9478H6.09375V29.5813H8.53125V31.9478ZM8.53125 26.0316H6.09375V23.6651H8.53125V26.0316ZM8.53125 20.1153H6.09375V17.7488H8.53125V20.1153ZM8.53125 14.199H6.09375V11.8325H8.53125V14.199ZM8.53125 8.28277H6.09375V5.91627H8.53125V8.28277ZM18.2812 5.91627H20.7188V8.28277H18.2812V5.91627ZM14.625 26.0316H12.1875V23.6651H14.625V26.0316ZM14.625 20.1153H12.1875V17.7488H14.625V20.1153ZM14.625 14.199H12.1875V11.8325H14.625V14.199ZM14.625 8.28277H12.1875V5.91627H14.625V8.28277ZM20.7188 31.9478H18.2812V29.5813H20.7188V31.9478ZM20.7188 26.0316H18.2812V23.6651H20.7188V26.0316ZM20.7188 20.1153H18.2812V17.7488H20.7188V20.1153ZM20.7188 14.199H18.2812V11.8325H20.7188V14.199ZM34.125 34.3143H24.375V31.9478H26.8125V29.5813H24.375V26.0316H26.8125V23.6651H24.375V20.1153H26.8125V17.7488H24.375V15.3823H34.125V34.3143Z" fill="#f06292" />
            <path d="M29.25 29.5813H31.6875V31.9478H29.25V29.5813ZM29.25 23.665H31.6875V26.0315H29.25V23.665ZM29.25 17.7488H31.6875V20.1153H29.25V17.7488Z" fill="#f06292" />
          </svg>
          Flatfinder
        </Logo>
        <Title>{userId ? 'Actualizar Perfil' : 'Registrarse'}</Title>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ setFieldValue, values, isSubmitting, errors, touched }) => (
            <Form>
              <Field name="email" type="email" as={StyledField} placeholder="Email" disabled={!!userId} />
              <ErrorMessage name="email" component={StyledErrorMessage} />

              {!userId && (
                <>
                  <Field name="password" type="password" as={StyledField} placeholder="Contraseña" />
                  <ErrorMessage name="password" component={StyledErrorMessage} />

                  <Field name="confirmPassword" type="password" as={StyledField} placeholder="Confirmar Contraseña" />
                  <ErrorMessage name="confirmPassword" component={StyledErrorMessage} />
                </>
              )}

              <Field name="firstName" type="text" as={StyledField} placeholder="Nombre" />
              <ErrorMessage name="firstName" component={StyledErrorMessage} />

              <Field name="lastName" type="text" as={StyledField} placeholder="Apellido" />
              <ErrorMessage name="lastName" component={StyledErrorMessage} />

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Fecha de Nacimiento"
                  value={values.birthDate}
                  onChange={(date) => setFieldValue('birthDate', date)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: touched.birthDate && Boolean(errors.birthDate),
                      helperText: touched.birthDate && errors.birthDate,
                    },
                  }}
                />
              </LocalizationProvider>

              <FileInputContainer>
                <FileInputLabel htmlFor="avatar">
                  Elegir Avatar
                  <HiddenFileInput
                    id="avatar"
                    name="avatar"
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      setFieldValue("avatar", file);
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setPreviewImage(reader.result);
                        };
                        reader.readAsDataURL(file);
                      } else {
                        setPreviewImage(null);
                      }
                    }}
                  />
                </FileInputLabel>
                <FileName>{values.avatar ? values.avatar.name : 'Ningún archivo seleccionado'}</FileName>
              </FileInputContainer>
              <ErrorMessage name="avatar" component={StyledErrorMessage} />

              {previewImage && (
                <ImagePreviewContainer>
                  <ImagePreview src={previewImage} alt="Vista previa del avatar" />
                </ImagePreviewContainer>
              )}

              <SubmitButton type="submit" disabled={isSubmitting}>
                {userId ? 'Actualizar Perfil' : 'Registrarse'}
              </SubmitButton>
            </Form>
          )}
        </Formik>
      </FormContainer>
    </PageContainer>
  );
};

export default UserForm;