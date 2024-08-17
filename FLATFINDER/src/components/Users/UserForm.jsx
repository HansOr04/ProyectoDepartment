//Componente para registrar el usuario o para actualizar el perfil
 //avatar, Email String, Password String, First Name String,Last Name String,Birth Date Date,
 import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { createUser, updateUser, uploadUserImage } from '../../services/firebase';

const UserForm = ({ userId = null }) => {
  const [initialValues, setInitialValues] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    birthDate: null,
    avatar: null
  });

  useEffect(() => {
    // Si hay un userId, cargar los datos del usuario para edición
    if (userId) {
      // Aquí deberías cargar los datos del usuario desde Firebase
      // y actualizar initialValues
    }
  }, [userId]);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    birthDate: Yup.date().nullable().required('Birth date is required'),
    avatar: Yup.mixed().test('fileSize', 'File too large', (value) => {
      if (!value) return true; // attachment is optional
      return value && value.size <= 2000000; // 2MB
    })
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      let userDataToSave = { ...values };
      delete userDataToSave.avatar; // Remove avatar from user data

      if (userId) {
        // Update existing user
        await updateUser(userId, userDataToSave);
      } else {
        // Create new user
        const newUserRef = await createUser(userDataToSave);
        userId = newUserRef.id;
      }

      // If there's an avatar, upload it
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
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ setFieldValue, values, isSubmitting }) => (
        <Form>
          <div>
            <label htmlFor="email">Email</label>
            <Field type="email" name="email" />
            <ErrorMessage name="email" component="div" />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <Field type="password" name="password" />
            <ErrorMessage name="password" component="div" />
          </div>

          <div>
            <label htmlFor="firstName">First Name</label>
            <Field type="text" name="firstName" />
            <ErrorMessage name="firstName" component="div" />
          </div>

          <div>
            <label htmlFor="lastName">Last Name</label>
            <Field type="text" name="lastName" />
            <ErrorMessage name="lastName" component="div" />
          </div>

          <div>
            <label htmlFor="birthDate">Birth Date</label>
            <DatePicker
              selected={values.birthDate}
              onChange={date => setFieldValue('birthDate', date)}
              dateFormat="dd/MM/yyyy"
            />
            <ErrorMessage name="birthDate" component="div" />
          </div>

          <div>
            <label htmlFor="avatar">Avatar</label>
            <input
              id="avatar"
              name="avatar"
              type="file"
              onChange={(event) => {
                setFieldValue("avatar", event.currentTarget.files[0]);
              }}
            />
            <ErrorMessage name="avatar" component="div" />
          </div>

          <button type="submit" disabled={isSubmitting}>
            {userId ? 'Update User' : 'Create User'}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default UserForm;