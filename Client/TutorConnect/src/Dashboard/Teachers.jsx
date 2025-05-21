import * as React from 'react';
import { useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

const Teachers = () => {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [selectedSubjects, setSelectedSubjects] = useState([]); // Removed type annotation

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Hardcoded teacher data
  const teacherData = {
    name: "John Doe",
    qualification: "PhD in Mathematics",
    hourlyRate: 50,
    email: "john.doe@example.com",
    availability: "Available",
    subjects: ["Math", "Physics", "Chemistry"],
  };

  const handleSubjectChange = (subject) => {
    setSelectedSubjects(prev =>
      prev.includes(subject) ? prev.filter(s => s !== subject) : [...prev, subject]
    );
  };

  return (
    <>
      <Card sx={{
        maxWidth: 345,
        borderRadius: 3,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
        }
      }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
              {teacherData.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h6" component="div" fontWeight="bold">
                {teacherData.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {teacherData.qualification}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            <strong>Email:</strong> {teacherData.email}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            <strong>Availability:</strong> {teacherData.availability}
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Subjects:</strong>
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
              {teacherData.subjects.map((subject, index) => (
                <Chip key={index} label={subject} size="small" color="primary" variant="outlined" />
              ))}
            </Stack>
          </Box>

          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 3,
          }}>
            <Chip
              label={`$${teacherData.hourlyRate}/hr`}
              color="success"
              variant="filled"
              sx={{
                fontWeight: 'bold',
                fontSize: '1rem',
                px: 1,
              }}
            />
            <Button
              onClick={handleClickOpen}
              variant="contained"
              size="small"
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'bold',
              }}
            >
              Book Session
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle sx={{
          bgcolor: 'primary.main',
          color: 'white',
          fontWeight: 'bold',
        }}>
          Book a Session with {teacherData.name}
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column' }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Select Date
                </Typography>
                <DatePicker
                  value={selectedDate}
                  onChange={(newValue) => setSelectedDate(newValue)}
                  sx={{ width: '100%' }}
                />
              </FormControl>

              <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
                <FormControl fullWidth>
                  <Typography variant="subtitle1" gutterBottom>
                    Start Time
                  </Typography>
                  <TimePicker
                    value={startTime}
                    onChange={(newValue) => setStartTime(newValue)}
                    sx={{ width: '100%' }}
                  />
                </FormControl>
                <FormControl fullWidth>
                  <Typography variant="subtitle1" gutterBottom>
                    End Time
                  </Typography>
                  <TimePicker
                    value={endTime}
                    onChange={(newValue) => setEndTime(newValue)}
                    sx={{ width: '100%' }}
                  />
                </FormControl>
              </Box>

              <FormControl fullWidth>
                <Typography variant="subtitle1" gutterBottom>
                  Select Subjects
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  {teacherData.subjects.map((subject, index) => (
                    <FormControlLabel
                      key={index}
                      control={
                        <Checkbox
                          color="primary"
                          checked={selectedSubjects.includes(subject)}
                          onChange={() => handleSubjectChange(subject)}
                        />
                      }
                      label={subject}
                    />
                  ))}
                </Box>
              </FormControl>
            </LocalizationProvider>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleClose} variant="outlined" sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}>
            Cancel
          </Button>
          <Button onClick={handleClose} variant="contained" sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}>
            Confirm Booking
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Teachers;