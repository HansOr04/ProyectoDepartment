import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { createUser, updateUser, uploadUserImage } from '../../services/firebase';
import {
  PageContainer,
  FormContainer,
  Logo,
  Title,
  StyledField,
  StyledErrorMessage,
  SubmitButton,
  FileInputContainer,
  FileInputLabel,
  HiddenFileInput,
  FileName,
  ImagePreviewContainer,
  ImagePreview
} from './UserForms';

const UserForm = ({ userId = null }) => {
  const [initialValues, setInitialValues] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    birthDate: null,
    avatar: null
  });
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (userId) {
      // Load user data for editing (implementation needed)
    }
  }, [userId]);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    birthDate: Yup.date().nullable().required('Birth date is required'),
    avatar: Yup.mixed().test('fileSize', 'File too large', (value) => {
      if (!value) return true;
      return value && value.size <= 2000000;
    })
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      let userDataToSave = { ...values };
      delete userDataToSave.avatar;

      if (userId) {
        await updateUser(userId, userDataToSave);
      } else {
        const newUserRef = await createUser(userDataToSave);
        userId = newUserRef.id;
      }

      if (values.avatar) {
        await uploadUserImage(userId, values.avatar);
      }

      alert(userId ? 'User updated successfully' : 'User created successfully');
    } catch (error) {
      console.error('Error saving user:', error);
      alert('An error occurred while saving the user');
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
        <Title>{userId ? 'Update Profile' : 'Sign Up'}</Title>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ setFieldValue, values, isSubmitting }) => (
            <Form>
              <StyledField type="email" name="email" placeholder="Email" />
              <StyledErrorMessage name="email" component="div" />

              <StyledField type="password" name="password" placeholder="Password" />
              <StyledErrorMessage name="password" component="div" />

              <StyledField type="text" name="firstName" placeholder="First Name" />
              <StyledErrorMessage name="firstName" component="div" />

              <StyledField type="text" name="lastName" placeholder="Last Name" />
              <StyledErrorMessage name="lastName" component="div" />

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Birth Date"
                  value={values.birthDate}
                  onChange={(date) => setFieldValue('birthDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
              <StyledErrorMessage name="birthDate" component="div" />

              <FileInputContainer>
                <FileInputLabel htmlFor="avatar">
                  Choose Avatar
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
                <FileName>{values.avatar ? values.avatar.name : 'No file chosen'}</FileName>
              </FileInputContainer>
              <StyledErrorMessage name="avatar" component="div" />

              {previewImage && (
                <ImagePreviewContainer>
                  <ImagePreview src={previewImage} alt="Avatar preview" />
                </ImagePreviewContainer>
              )}

              <SubmitButton type="submit" disabled={isSubmitting}>
                {userId ? 'Update Profile' : 'Sign Up'}
              </SubmitButton>
            </Form>
          )}
        </Formik>
      </FormContainer>
    </PageContainer>
  );
};

export default UserForm;
