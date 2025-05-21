import React, { useState, useEffect, useContext } from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Divider,
  Container,
  Paper,
  Avatar
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { UserContext } from '../UserContext';

interface UserContextType {
  name: string;
  email: string;
  id: string;
}

const Profile: React.FC = () => {
  const { name, email, id } = useContext(UserContext) as UserContextType;
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    name: name || '',
    email: email || '',
    password: '' // Password will be handled separately for security
  });

  // Fetch user data when component mounts
  useEffect(() => {
    setEditedData({
      name: name || '',
      email: email || '',
      password: ''
    });
  }, [name, email]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const dataToSend: any = {
        name: editedData.name,
        email: editedData.email
      };
      
      if (editedData.password) {
        dataToSend.password = editedData.password;
      }

      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('JAA_access_token='))
        ?.split('=')[1];

      const response = await fetch("https://ruby-fragile-angelfish.cyclic.app/student/update", {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          authorization: token || ''
        },
        body: JSON.stringify(dataToSend)
      });

      const result = await response.json();
      
      if (result.msg === "Update successful") {
        setIsEditing(false);
        // Optionally show a success message
      } else {
        console.error(result.msg);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({
      name: name || '',
      email: email || '',
      password: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const ProfilePaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    marginTop: theme.spacing(4),
    borderRadius: '16px',
    boxShadow: theme.shadows[4],
    maxWidth: '600px',
    margin: '0 auto'
  }));

  const ProfileHeader = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(3)
  }));

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <ProfilePaper>
        <ProfileHeader>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            My Profile
          </Typography>
          {!isEditing ? (
            <IconButton 
              onClick={handleEdit}
              color="primary"
              sx={{ backgroundColor: '#4CAF50', color: 'white', '&:hover': { backgroundColor: '#388E3C' } }}
            >
              <EditIcon />
            </IconButton>
          ) : (
            <Box>
              <IconButton 
                onClick={handleSave}
                color="primary"
                sx={{ backgroundColor: '#4CAF50', color: 'white', mr: 1, '&:hover': { backgroundColor: '#388E3C' } }}
              >
                <SaveIcon />
              </IconButton>
              <IconButton 
                onClick={handleCancel}
                color="secondary"
                sx={{ backgroundColor: '#f44336', color: 'white', '&:hover': { backgroundColor: '#d32f2f' } }}
              >
                <CancelIcon />
              </IconButton>
            </Box>
          )}
        </ProfileHeader>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar 
              sx={{ 
                width: 80, 
                height: 80, 
                backgroundColor: '#4CAF50',
                fontSize: '2rem'
              }}
            >
              {name ? name.charAt(0).toUpperCase() : ''}
            </Avatar>
            <Typography variant="h6" sx={{ color: 'text.secondary' }}>
              User ID: {id}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <TextField
            label="Full Name"
            name="name"
            value={editedData.name}
            onChange={handleChange}
            fullWidth
            disabled={!isEditing}
            sx={{ mb: 2 }}
            InputProps={{
              sx: { borderRadius: '12px' }
            }}
          />

          <TextField
            label="Email"
            name="email"
            type="email"
            value={editedData.email}
            onChange={handleChange}
            fullWidth
            disabled={!isEditing}
            sx={{ mb: 2 }}
            InputProps={{
              sx: { borderRadius: '12px' }
            }}
          />

          {isEditing && (
            <TextField
              label="New Password"
              name="password"
              type="password"
              value={editedData.password}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
              placeholder="Leave blank to keep current password"
              InputProps={{
                sx: { borderRadius: '12px' }
              }}
            />
          )}
        </Box>
      </ProfilePaper>
    </Container>
  );
};

export default Profile;
