import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TextField, 
  Checkbox, 
  FormControlLabel, 
  Button, 
  Grid, 
  Typography,
  CircularProgress,
  Paper,
  Container,
  Snackbar,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { createFlat, updateFlat, uploadFlatImage, getFlatByID } from '../../services/firebaseFlats';
import { useAuth } from '../../contexts/authContext';

const FlatForm = ({ flatId }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
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
  const [loading, setLoading] = useState(!!flatId);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadFlatData = async () => {
      if (flatId) {
        try {
          const flatData = await getFlatByID(flatId);
          if (flatData) {
            setFormData({
              ...flatData,
              dateAvailable: flatData.dateAvailable ? new Date(flatData.dateAvailable.seconds * 1000) : null,
            });
          }
        } catch (err) {
          console.error("Error loading flat data:", err);
          setError("Failed to load flat data. Please try again.");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    loadFlatData();
  }, [flatId]);

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
      setError('You must be logged in to perform this action.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (flatId) {
        await updateFlat(flatId, formData);
        if (image) {
          const imageUrl = await uploadFlatImage(flatId, image);
          await updateFlat(flatId, { imageURL: imageUrl });
        }
        setSuccess('Flat updated successfully!');
      } else {
        const flatRef = await createFlat(formData, user.id);
        if (image) {
          const imageUrl = await uploadFlatImage(flatRef.id, image);
          await updateFlat(flatRef.id, { imageURL: imageUrl });
        }
        setSuccess('Flat created successfully!');
      }
      setTimeout(() => navigate('/my-flats'), 2000);
    } catch (error) {
      console.error('Error processing flat:', error);
      setError(`Failed to ${flatId ? 'update' : 'create'} flat. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: '2rem', marginTop: '2rem' }}>
        <Typography variant="h4" gutterBottom align="center">
          {flatId ? 'Update Flat' : 'Create New Flat'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
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
                <Button variant="outlined" component="span" fullWidth>
                  {flatId ? 'Upload New Image' : 'Upload Image'}
                </Button>
              </label>
              {image && <Typography variant="body2" style={{ marginTop: '0.5rem' }}>{image.name}</Typography>}
              {formData.imageURL && !image && (
                <Typography variant="body2" style={{ marginTop: '0.5rem' }}>Current image: {formData.imageURL}</Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <Button 
                type="submit" 
                fullWidth 
                variant="contained" 
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : (flatId ? 'Update Flat' : 'Create Flat')}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={!!error || success}
        autoHideDuration={6000}
        onClose={() => { setError(null); setSuccess(false); }}
        message={error || success}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => { setError(null); setSuccess(false); }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Container>
  );
};

export default FlatForm;