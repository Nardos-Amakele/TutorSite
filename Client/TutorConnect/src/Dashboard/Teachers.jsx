import { useState, useEffect } from 'react';
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
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import VerifiedIcon from '@mui/icons-material/Verified';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const Teachers = () => {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error'
  });

  // Fetch all teachers on component mount
  useEffect(() => {
    fetchTeachers();
  }, []);

  // Fetch teachers with search query
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        searchTeachers();
      } else {
        fetchTeachers();
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

const fetchTeachers = async () => {
  try {
    const cookieString = document.cookie; // New line for cookie retrieval
    const tokenMatch = cookieString.split('; ').find(row => row.startsWith('JAA_access_token='));

    if (!tokenMatch) {
      setError('Authentication token not found'); // New error handling
      setSnackbar({
        open: true,
        message: 'Please log in to view your teachers',
        severity: 'error'
      });
      return;
    }

    const token = tokenMatch.split('=')[1]; // New line to extract token

    const response = await fetch("http://localhost:5000/student/teachers", {
      headers: {
        "Content-Type": "application/json", // Added content type
        "Authorization": `Bearer ${token}` // Updated to use the token from cookies
      },
      credentials: 'include' // Include cookies if needed
    });

    const data = await response.json();
    
    if (response.ok) {
      setTeachers(data.teachers);
      setError(null);
    } else {
      setError(data.msg || 'Failed to fetch teachers');
      setSnackbar({
        open: true,
        message: data.msg || 'Failed to fetch teachers',
        severity: 'error'
      });
    }
  } catch (err) {
    console.error('Error fetching teachers:', err); // Added logging
    setError('Error fetching teachers');
    setSnackbar({
      open: true,
      message: 'Error fetching teachers',
      severity: 'error'
    });
  }
};

 const searchTeachers = async () => {
  try {
    const cookieString = document.cookie; // New line for cookie retrieval
    const tokenMatch = cookieString.split('; ').find(row => row.startsWith('JAA_access_token='));

    if (!tokenMatch) {
      setError('Authentication token not found'); // New error handling
      setSnackbar({
        open: true,
        message: 'Please log in to search for teachers',
        severity: 'error'
      });
      return;
    }

    const token = tokenMatch.split('=')[1]; // New line to extract token

    const response = await fetch(`http://localhost:5000/student/teachers/search?name=${searchQuery}`, {
      headers: {
        "Content-Type": "application/json", // Added content type
        "Authorization": `Bearer ${token}` // Updated to use the token from cookies
      },
      credentials: 'include' // Include cookies if needed
    });

    const data = await response.json();
    
    if (response.ok) {
      setTeachers(data.teachers);
      setError(null);
    } else {
      setError(data.msg || 'Failed to search teachers');
      setSnackbar({
        open: true,
        message: data.msg || 'Failed to search teachers',
        severity: 'error'
      });
    }
  } catch (err) {
    console.error('Error searching teachers:', err); // Added logging
    setError('Error searching teachers');
    setSnackbar({
      open: true,
      message: 'Error searching teachers',
      severity: 'error'
    });
  }
};

  const handleClickOpen = (teacher) => {
    setSelectedTeacher(teacher);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubjectChange = (subject) => {
    setSelectedSubjects(prev =>
      prev.includes(subject) ? prev.filter(s => s !== subject) : [...prev, subject]
    );
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search teachers by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
  {teachers.map((teacher) => (
    <Grid item xs={12} md={6} key={teacher._id}>
      <Card sx={{
        borderRadius: 3,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
        },
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <CardContent sx={{
          p: 3,
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar 
              sx={{ 
                bgcolor: 'primary.main', 
                mr: 2,
                width: 56, 
                height: 56,
                fontSize: '1.5rem'
              }}
            >
              {teacher.name.charAt(0)}
            </Avatar>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6" component="div" fontWeight="bold">
                  {teacher.name}
                </Typography>
                {teacher.verified && (
                  <VerifiedIcon 
                    sx={{ 
                      color: 'primary.main',
                      fontSize: '1.2rem'
                    }} 
                  />
                )}
              </Box>
              <Typography variant="body2" color="text.secondary">
                {teacher.qualification || 'Qualified Teacher'}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            <strong>Email:</strong> {teacher.email}
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
              Subjects:
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
              {teacher.subjects?.map((subject, index) => (
                <Chip 
                  key={index} 
                  label={subject} 
                  size="small" 
                  color="primary" 
                  variant="outlined" 
                  sx={{ fontWeight: 'medium' }}
                />
              ))}
            </Stack>
          </Box>

          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 'auto',
            pt: 2
          }}>
            <Chip
              label={`$${teacher.hourlyRate || 0}/hr`}
              color="success"
              variant="filled"
              sx={{
                fontWeight: 'bold',
                fontSize: '0.9rem',
                px: 1.5,
                py: 1
              }}
            />
            <Button
              onClick={() => handleClickOpen(teacher)}
              variant="contained"
              size="medium"
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'bold',
                px: 3
              }}
            >
              Book Session
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  ))}
</Grid>

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
          Book a Session with {selectedTeacher?.name}
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
                  {selectedTeacher?.subjects?.map((subject, index) => (
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

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Teachers;