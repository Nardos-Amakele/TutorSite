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
  Chip
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

const Profile: React.FC = () => {
  const { name, email, id } = useContext(UserContext) as UserContextType;
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    name: name || '',
    email: email || '',
    password: '',
    subjects: ['Math', 'Science', 'English'], // Hardcoded subjects
    availability: [
      { day: 'monday', start: '09:00', end: '12:00' },
      { day: 'wednesday', start: '14:00', end: '17:00' }
    ] // Hardcoded availability
  });
  const [newSubject, setNewSubject] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [startTime, setStartTime] = useState<Dayjs | null>(dayjs('09:00', 'HH:mm'));
  const [endTime, setEndTime] = useState<Dayjs | null>(dayjs('17:00', 'HH:mm'));

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // Save implementation for editedData including subjects and availability
    setIsEditing(false);
  };

  const handleAddSubject = () => {
    if (newSubject.trim() && editedData.subjects.length < 3) {
      setEditedData(prev => ({
        ...prev,
        subjects: [...prev.subjects, newSubject.trim()]
      }));
      setNewSubject('');
    }
  };

  const handleRemoveSubject = (index: number) => {
    const updatedSubjects = [...editedData.subjects];
    updatedSubjects.splice(index, 1);
    setEditedData(prev => ({
      ...prev,
      subjects: updatedSubjects
    }));
  };

  const handleAddAvailability = () => {
    if (selectedDay && startTime && endTime) {
      const newSlot = {
        day: selectedDay,
        start: startTime.format('HH:mm'),
        end: endTime.format('HH:mm')
      };
      setEditedData(prev => ({
        ...prev,
        availability: [...prev.availability, newSlot]
      }));
      setSelectedDay('');
      setStartTime(dayjs('09:00', 'HH:mm'));
      setEndTime(dayjs('17:00', 'HH:mm'));
    }
  };

  const handleRemoveAvailability = (index: number) => {
    const updatedAvailability = [...editedData.availability];
    updatedAvailability.splice(index, 1);
    setEditedData(prev => ({
      ...prev,
      availability: updatedAvailability
    }));
  };

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
          <Avatar sx={{ width: 80, height: 80, backgroundColor: '#4CAF50' }}>{name ? name.charAt(0).toUpperCase(): '?'}</Avatar>
          <Typography variant="h6">User ID: {id}</Typography>
          <Divider sx={{ my: 2 }} />
          <TextField label="Full Name" name="name" value={editedData.name} fullWidth disabled={!isEditing} onChange={(e) => setEditedData({ ...editedData, name: e.target.value })} />
          <TextField label="Email" name="email" type="email" value={editedData.email} fullWidth disabled={!isEditing} onChange={(e) => setEditedData({ ...editedData, email: e.target.value })} />

          {isEditing && (
            <TextField label="New Password" name="password" type="password" value={editedData.password} fullWidth placeholder="Leave blank to keep current password" onChange={(e) => setEditedData({ ...editedData, password: e.target.value })} />
          )}

          <Box>
            <Typography variant="subtitle1">Subjects (max 3)</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField fullWidth value={newSubject} onChange={(e) => setNewSubject(e.target.value)} disabled={!isEditing || editedData.subjects.length >= 3} />
              {isEditing && (
                <IconButton onClick={handleAddSubject} disabled={!newSubject.trim() || editedData.subjects.length >= 3} color="primary"><AddIcon /></IconButton>
              )}
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {editedData.subjects.map((subject, index) => (
                <Chip key={index} label={subject} onDelete={isEditing ? () => handleRemoveSubject(index) : undefined} deleteIcon={isEditing ? <DeleteIcon /> : undefined} />
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
              <Button onClick={handleAddAvailability} disabled={!selectedDay} startIcon={<AddIcon />} sx={{ mt: 1 }}>
                Add Availability
              </Button>
            )}
            <Box sx={{ mt: 2 }}>
              {editedData.availability.map((slot, index) => (
                <Chip key={index} label={`${slot.day.charAt(0).toUpperCase() + slot.day.slice(1)}: ${slot.start} - ${slot.end}`} onDelete={isEditing ? () => handleRemoveAvailability(index) : undefined} deleteIcon={isEditing ? <DeleteIcon /> : undefined} sx={{ m: 0.5 }} />
              ))}
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;