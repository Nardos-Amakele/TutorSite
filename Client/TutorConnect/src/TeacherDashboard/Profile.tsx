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
  Avatar,
  Button,
  Chip,
  Alert,
  Snackbar
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { UserContext } from '../UserContext';
import dayjs, { Dayjs } from 'dayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

interface UserContextType {
  name: string;
  email: string;
  id: string;
}

interface ProfileUpdateRequest {
  name: string;
  email: string;
  phone: string;
  password?: string;
}

interface Availability {
  day: string;
  date: string;
  startTime: string;
  endTime: string;
}

interface Profile {
  id: string;
  name: string;
  email: string;
  phone: string;
  subjects: string[];
  availability: Availability[];
  attachments: any[];
}

const Profile: React.FC = () => {
  const { name, email, id } = useContext(UserContext) as UserContextType;
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editedData, setEditedData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    subjects: [] as string[],
    availability: [] as Availability[]
  });
  const [newSubject, setNewSubject] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [startTime, setStartTime] = useState<Dayjs | null>(dayjs('09:00', 'HH:mm'));
  const [endTime, setEndTime] = useState<Dayjs | null>(dayjs('17:00', 'HH:mm'));
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  // Fetch profile data
  const fetchProfile = async () => {
    try {
      const cookieString = document.cookie;
      const tokenMatch = cookieString.split('; ').find(row => row.startsWith('JAA_access_token='));
      
      if (!tokenMatch) {
        setSnackbar({
          open: true,
          message: 'Authentication token not found',
          severity: 'error'
        });
        return;
      }

      const token = tokenMatch.split('=')[1];

      const response = await fetch("http://localhost:5000/teacher/profile", {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        credentials: 'include'
      });

      const data = await response.json();
      
      if (response.ok) {
        setProfile(data.teacher);
        setEditedData({
          name: data.teacher.name,
          email: data.teacher.email,
          phone: data.teacher.phone || '',
          password: '',
          subjects: data.teacher.subjects || [],
          availability: data.teacher.availability || []
        });
      } else {
        setSnackbar({
          open: true,
          message: data.msg || 'Failed to fetch profile',
          severity: 'error'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error fetching profile',
        severity: 'error'
      });
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const cookieString = document.cookie;
      const tokenMatch = cookieString.split('; ').find(row => row.startsWith('JAA_access_token='));
      
      if (!tokenMatch) {
        setSnackbar({
          open: true,
          message: 'Authentication token not found',
          severity: 'error'
        });
        return;
      }

      const token = tokenMatch.split('=')[1];

      // Create request body without password if it's empty
      const requestBody: ProfileUpdateRequest = {
        name: editedData.name,
        email: editedData.email,
        phone: editedData.phone
      };

      // Only add password to request body if it's not empty
      if (editedData.password.trim()) {
        requestBody.password = editedData.password;
      }

      const response = await fetch("http://localhost:5000/teacher/profile", {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      
      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'Profile updated successfully',
          severity: 'success'
        });
        setIsEditing(false);
        // Clear password field after successful update
        setEditedData(prev => ({ ...prev, password: '' }));
        fetchProfile();
      } else {
        setSnackbar({
          open: true,
          message: data.msg || 'Failed to update profile',
          severity: 'error'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error updating profile',
        severity: 'error'
      });
    }
  };

  const handleAddSubject = async () => {
    if (!newSubject.trim()) return;

    try {
      const cookieString = document.cookie;
      const tokenMatch = cookieString.split('; ').find(row => row.startsWith('JAA_access_token='));
      
      if (!tokenMatch) {
        setSnackbar({
          open: true,
          message: 'Authentication token not found',
          severity: 'error'
        });
        return;
      }

      const token = tokenMatch.split('=')[1];

      const response = await fetch("http://localhost:5000/teacher/subjects/add", {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({ subjects: [newSubject.trim()] })
      });

      const data = await response.json();
      
      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'Subject added successfully',
          severity: 'success'
        });
        setNewSubject('');
        fetchProfile();
      } else {
        setSnackbar({
          open: true,
          message: data.msg || 'Failed to add subject',
          severity: 'error'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error adding subject',
        severity: 'error'
      });
    }
  };

  const handleRemoveSubject = async (subject: string) => {
    try {
      const cookieString = document.cookie;
      const tokenMatch = cookieString.split('; ').find(row => row.startsWith('JAA_access_token='));
      
      if (!tokenMatch) {
        setSnackbar({
          open: true,
          message: 'Authentication token not found',
          severity: 'error'
        });
        return;
      }

      const token = tokenMatch.split('=')[1];

      const response = await fetch("http://localhost:5000/teacher/subjects/remove", {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({ subject })
      });

      const data = await response.json();
      
      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'Subject removed successfully',
          severity: 'success'
        });
        fetchProfile();
      } else {
        setSnackbar({
          open: true,
          message: data.msg || 'Failed to remove subject',
          severity: 'error'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error removing subject',
        severity: 'error'
      });
    }
  };

  const handleAddAvailability = async () => {
    if (!selectedDay || !startTime || !endTime) return;

    try {
      const cookieString = document.cookie;
      const tokenMatch = cookieString.split('; ').find(row => row.startsWith('JAA_access_token='));
      
      if (!tokenMatch) {
        setSnackbar({
          open: true,
          message: 'Authentication token not found',
          severity: 'error'
        });
        return;
      }

      const token = tokenMatch.split('=')[1];

      const response = await fetch("http://localhost:5000/teacher/availability/add", {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({
          date: new Date().toISOString().split('T')[0], // Today's date
          startTime: startTime.format('HH:mm'),
          endTime: endTime.format('HH:mm')
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'Availability added successfully',
          severity: 'success'
        });
        setSelectedDay('');
        setStartTime(dayjs('09:00', 'HH:mm'));
        setEndTime(dayjs('17:00', 'HH:mm'));
        fetchProfile();
      } else {
        setSnackbar({
          open: true,
          message: data.msg || 'Failed to add availability',
          severity: 'error'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error adding availability',
        severity: 'error'
      });
    }
  };

  const handleRemoveAvailability = async (slot: Availability) => {
    try {
      const cookieString = document.cookie;
      const tokenMatch = cookieString.split('; ').find(row => row.startsWith('JAA_access_token='));
      
      if (!tokenMatch) {
        setSnackbar({
          open: true,
          message: 'Authentication token not found',
          severity: 'error'
        });
        return;
      }

      const token = tokenMatch.split('=')[1];

      const response = await fetch("http://localhost:5000/teacher/availability/remove", {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({
          userId: profile?.id,
          date: slot.date,
          startTime: slot.startTime,
          endTime: slot.endTime
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'Availability removed successfully',
          severity: 'success'
        });
        fetchProfile();
      } else {
        setSnackbar({
          open: true,
          message: data.msg || 'Failed to remove availability',
          severity: 'error'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error removing availability',
        severity: 'error'
      });
    }
  };

  if (!profile) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography>Loading profile...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ padding: 4, borderRadius: '16px', boxShadow: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>My Profile</Typography>
          {!isEditing ? (
            <IconButton onClick={handleEdit} color="primary"><EditIcon /></IconButton>
          ) : (
            <Box>
              <IconButton onClick={handleSave} color="primary"><SaveIcon /></IconButton>
              <IconButton onClick={() => setIsEditing(false)} color="secondary"><CancelIcon /></IconButton>
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Avatar sx={{ width: 80, height: 80, backgroundColor: '#4CAF50' }}>{profile.name ? profile.name.charAt(0).toUpperCase(): '?'}</Avatar>
          <Divider sx={{ my: 2 }} />
          <TextField 
            label="Full Name" 
            name="name" 
            value={editedData.name} 
            fullWidth 
            disabled={!isEditing} 
            onChange={(e) => setEditedData({ ...editedData, name: e.target.value })} 
          />
          <TextField 
            label="Email" 
            name="email" 
            type="email" 
            value={editedData.email} 
            fullWidth 
            disabled={!isEditing} 
            onChange={(e) => setEditedData({ ...editedData, email: e.target.value })} 
          />
          <TextField 
            label="Phone" 
            name="phone" 
            value={editedData.phone} 
            fullWidth 
            disabled={!isEditing} 
            onChange={(e) => setEditedData({ ...editedData, phone: e.target.value })} 
          />

          {isEditing && (
            <TextField 
              label="New Password" 
              name="password" 
              type="password" 
              value={editedData.password} 
              fullWidth 
              placeholder="Leave blank to keep current password" 
              onChange={(e) => setEditedData({ ...editedData, password: e.target.value })} 
            />
          )}

          <Box>
            <Typography variant="subtitle1">Subjects</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField 
                fullWidth 
                value={newSubject} 
                onChange={(e) => setNewSubject(e.target.value)} 
                disabled={!isEditing} 
              />
              {isEditing && (
                <IconButton 
                  onClick={handleAddSubject} 
                  disabled={!newSubject.trim()} 
                  color="primary"
                >
                  <AddIcon />
                </IconButton>
              )}
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {profile.subjects.map((subject, index) => (
                <Chip 
                  key={index} 
                  label={subject} 
                  onDelete={isEditing ? () => handleRemoveSubject(subject) : undefined} 
                  deleteIcon={isEditing ? <DeleteIcon /> : undefined} 
                />
              ))}
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle1">Availability</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                select
                fullWidth
                label="Day"
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                SelectProps={{ native: true }}
                disabled={!isEditing}
              >
                <option value=""></option>
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                  <option key={day} value={day}>{day.charAt(0).toUpperCase() + day.slice(1)}</option>
                ))}
              </TextField>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                  label="Start Time"
                  value={startTime}
                  onChange={(newValue) => {
                    setStartTime(newValue);
                  }}
                  components={{ 
                    TextField: (props) => <TextField {...props} fullWidth /> 
                  }}
                  disabled={!isEditing}
                />
                <TimePicker
                  label="End Time"
                  value={endTime}
                  onChange={(newValue) => {
                    setEndTime(newValue);
                  }}
                  components={{ 
                    TextField: (props) => <TextField {...props} fullWidth /> 
                  }}
                  disabled={!isEditing}
                />
              </LocalizationProvider>
            </Box>
            {isEditing && (
              <Button 
                onClick={handleAddAvailability} 
                disabled={!selectedDay} 
                startIcon={<AddIcon />} 
                sx={{ mt: 1 }}
              >
                Add Availability
              </Button>
            )}
            <Box sx={{ mt: 2 }}>
              {profile.availability.map((slot, index) => (
                <Chip 
                  key={index} 
                  label={`${slot.day.charAt(0).toUpperCase() + slot.day.slice(1)}: ${slot.startTime} - ${slot.endTime}`} 
                  onDelete={isEditing ? () => handleRemoveAvailability(slot) : undefined} 
                  deleteIcon={isEditing ? <DeleteIcon /> : undefined} 
                  sx={{ m: 0.5 }} 
                />
              ))}
            </Box>
          </Box>
        </Box>
      </Paper>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile;