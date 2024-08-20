import React, { useState } from 'react';
import { 
  TextField, 
  Checkbox, 
  FormControlLabel, 
  Button, 
  Grid, 
  Typography, 
  Container, 
  Paper 
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { createFlat, uploadFlatImage } from '../../services/firebaseFlats';
import { useAuth } from '../../contexts/authContext'; // Import the useAuth hook

const FlatCreationForm = () => {
  const { user } = useAuth(); // Use the useAuth hook to get the current user
  const [formData, setFormData] = useState({
    city: '',
    country: '',
    streetName: '',
    streetNumber: '',
    areaSize: '',
    hasAC: false,
    yearBuilt: '',
    rentPrice: '',
    dateAvailable: null,
    description: '',
  });
  const [image, setImage] = useState(null);

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDateChange = (date) => {
    setFormData(prevState => ({
      ...prevState,
      dateAvailable: date
    }));
  };

  const handleImageChange = (event) => {
    if (event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user) {
      alert('You must be logged in to create a flat.');
      return;
    }
    try {
      // Create the flat in Firestore, passing the user ID
      const flatRef = await createFlat(formData, user.id);
      
      // If there's an image, upload it and update the flat with the URL
      if (image) {
        const imageUrl = await uploadFlatImage(flatRef.id, image);
        // Here you could update the flat with the image URL if desired
      }
      
      // Clear the form after creating the flat
      setFormData({
        city: '',
        country: '',
        streetName: '',
        streetNumber: '',
        areaSize: '',
        hasAC: false,
        yearBuilt: '',
        rentPrice: '',
        dateAvailable: null,
        description: '',
      });
      setImage(null);
      
      alert('Flat created successfully!');
    } catch (error) {
      console.error('Error creating flat:', error);
      alert('Failed to create flat. Please try again.');
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography component="h1" variant="h5" align="center">
          Create New Flat
        </Typography>
        {user ? (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="city"
                  label="City"
                  fullWidth
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="country"
                  label="Country"
                  fullWidth
                  value={formData.country}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="streetName"
                  label="Street Name"
                  fullWidth
                  value={formData.streetName}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="streetNumber"
                  label="Street Number"
                  fullWidth
                  value={formData.streetNumber}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="areaSize"
                  label="Area Size (m²)"
                  fullWidth
                  type="number"
                  value={formData.areaSize}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="yearBuilt"
                  label="Year Built"
                  fullWidth
                  type="number"
                  value={formData.yearBuilt}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="rentPrice"
                  label="Rent Price"
                  fullWidth
                  type="number"
                  value={formData.rentPrice}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Date Available"
                    value={formData.dateAvailable}
                    onChange={handleDateChange}
                    renderInput={(params) => <TextField {...params} fullWidth required />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.hasAC}
                      onChange={handleChange}
                      name="hasAC"
                      color="primary"
                    />
                  }
                  label="Has AC"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="Description"
                  multiline
                  rows={4}
                  fullWidth
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="raised-button-file"
                  type="file"
                  onChange={handleImageChange}
                />
                <label htmlFor="raised-button-file">
                  <Button variant="contained" component="span">
                    Upload Image
                  </Button>
                </label>
                {image && <Typography variant="body2">{image.name}</Typography>}
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" fullWidth variant="contained" color="primary">
                  Create Flat
                </Button>
              </Grid>
            </Grid>
          </form>
        ) : (
          <Typography variant="body1" align="center" style={{ marginTop: '20px' }}>
            Please log in to create a flat.
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default FlatCreationForm;