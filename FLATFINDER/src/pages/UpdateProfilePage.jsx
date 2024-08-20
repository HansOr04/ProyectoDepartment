import React from 'react';
import { useAuth } from '../contexts/authContext';
import { useNavigate } from 'react-router-dom';
import UserForm from '../components/Users/UserForm';
import { Container, Typography, Button } from '@mui/material';

export default function UpdateProfilePage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        return <Typography variant="h6">Loading user data...</Typography>;
    }

    const handleCancel = () => {
        navigate('/profile');
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mt: 4 }}>
                Update Your Profile
            </Typography>
            <UserForm userId={user.id} />
            <Button 
                variant="outlined" 
                color="secondary" 
                onClick={handleCancel}
                fullWidth
                sx={{ mt: 2 }}
            >
                Cancel
            </Button>
        </Container>
    );
}