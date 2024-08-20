//Componente para mostrar el perfil o datos del usuario

import React from 'react';
import { useAuth } from '../../contexts/authContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardActions, Button, Typography, Avatar } from '@mui/material';

const ProfileView = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        return <Typography variant="h6">Loading user data...</Typography>;
    }

    const handleUpdateProfile = () => {
        navigate('/update-profile');
    };

    return (
        <Card sx={{ maxWidth: 345, margin: 'auto', marginTop: 4 }}>
            <CardContent>
                <Avatar
                    src={user.imageUid ? `https://firebasestorage.googleapis.com/v0/b/gs://reactproject-9049c.appspot.com/o/${encodeURIComponent(user.imageUid)}?alt=media` : undefined}
                    alt={`${user.firstName} ${user.lastName}`}
                    sx={{ width: 100, height: 100, margin: 'auto', marginBottom: 2 }}
                />
                <Typography variant="h5" component="div" gutterBottom>
                    {user.firstName} {user.lastName}
                </Typography>   
                <Typography variant="body2" color="text.secondary">
                    Email: {user.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Birth Date: {user.birthDate ? new Date(user.birthDate).toLocaleDateString() : 'Not provided'}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" color="primary" onClick={handleUpdateProfile}>
                    Update Profile
                </Button>
            </CardActions>
        </Card>
    );
};

export default ProfileView;