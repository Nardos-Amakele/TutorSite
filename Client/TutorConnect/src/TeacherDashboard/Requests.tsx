import * as React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Button,
  Stack,
  Chip,
  Divider,
  Grid
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import EventIcon from '@mui/icons-material/Event';
import ScheduleIcon from '@mui/icons-material/Schedule';
import EmailIcon from '@mui/icons-material/Email';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

// Create green theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32', // Deep green
      light: '#4caf50', // Medium green
      dark: '#1b5e20', // Dark green
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#81c784', // Light green
      contrastText: '#000000'
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff'
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 16px',
          minWidth: '120px'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderLeft: '6px solid #2e7d32',
          transition: 'all 0.3s ease',
          width: '100%',
          maxWidth: '1000px' // Increased card width
        }
      }
    }
  }
});

const bookingsData = [
  {
    id: 1,
    date: '2025-05-22',
    day: 'Wednesday',
    time: '10:00 AM - 11:00 AM',
    studentEmail: 'student1@example.com',
    subject: 'Mathematics',
    status: 'pending'
  },
  {
    id: 2,
    date: '2025-05-23',
    day: 'Thursday',
    time: '1:00 PM - 2:00 PM',
    studentEmail: 'student2@example.com',
    subject: 'Science',
    status: 'pending'
  },
  {
    id: 3,
    date: '2025-05-24',
    day: 'Friday',
    time: '3:00 PM - 4:00 PM',
    studentEmail: 'student3@example.com',
    subject: 'English',
    status: 'pending'
  },
];

const Requests = () => {
  const [bookings, setBookings] = React.useState(bookingsData);

  const handleConfirm = (id) => {
    setBookings(bookings.map(booking => 
      booking.id === id ? {...booking, status: 'confirmed'} : booking
    ));
    console.log(`Confirmed booking ID: ${id}`);
  };

  const handleDecline = (id) => {
    setBookings(bookings.map(booking => 
      booking.id === id ? {...booking, status: 'declined'} : booking
    ));
    console.log(`Declined booking ID: ${id}`);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        p: 4, // Increased padding
        mx: 'auto',
        background: 'linear-gradient(to bottom, #f5f5f5 0%, #e8f5e9 100%)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center' // Center content horizontally
      }}>
        <Box sx={{ 
          width: '100%',
          maxWidth: '1200px' // Wider container
        }}>
          <Typography variant="h4" sx={{ 
            fontWeight: 700, 
            mb: 4, // Increased margin
            color: 'primary.dark',
            display: 'flex',
            alignItems: 'center',
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
          }}>
            Pending Requests
            <Chip 
              label={`${bookings.filter(b => b.status === 'pending').length} New`}
              color="primary"
              size="medium" // Larger chip
              sx={{ 
                ml: 2,
                fontWeight: 'bold',
                fontSize: '0.9rem',
                height: '32px'
              }}
            />
          </Typography>

          <Grid container spacing={4} sx={{ justifyContent: 'center' }}> {/* Centered grid */}
            {bookings.map((booking) => (
              <Grid item key={booking.id} xs={12} sx={{ 
                display: 'flex',
                justifyContent: 'center',
                width: '100%'
              }}>
                <Card sx={{
                  borderRadius: 3, // More rounded corners
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 24px rgba(46, 125, 50, 0.2)'
                  },
                  width: '100%'
                }}>
                  <CardActionArea>
                    <CardContent sx={{ p: 4 }}> {/* Increased padding */}
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 3 // Increased margin
                      }}>
                        <Typography variant="h5" sx={{ // Larger text
                          fontWeight: 700,
                          color: 'primary.dark'
                        }}>
                          {booking.subject}
                        </Typography>
                        {booking.status !== 'pending' && (
                          <Chip
                            label={booking.status === 'confirmed' ? 'Confirmed' : 'Declined'}
                            color={booking.status === 'confirmed' ? 'primary' : 'error'}
                            size="medium"
                            sx={{ 
                              fontWeight: 700,
                              fontSize: '0.9rem'
                            }}
                          />
                        )}
                      </Box>

                      <Grid container spacing={3} sx={{ mb: 3 }}> {/* Using Grid for layout */}
                        <Grid item xs={12} md={4}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <EventIcon sx={{ 
                              mr: 2, 
                              color: 'primary.main',
                              fontSize: '1.5rem'
                            }} />
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">
                                Date
                              </Typography>
                              <Typography variant="body1">
                                {booking.day}, {booking.date}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <ScheduleIcon sx={{ 
                              mr: 2, 
                              color: 'primary.main',
                              fontSize: '1.5rem'
                            }} />
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">
                                Time Slot
                              </Typography>
                              <Typography variant="body1">
                                {booking.time}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <EmailIcon sx={{ 
                              mr: 2, 
                              color: 'primary.main',
                              fontSize: '1.5rem'
                            }} />
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">
                                Student Email
                              </Typography>
                              <Typography variant="body1">
                                {booking.studentEmail}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>

                      {booking.status === 'pending' && (
                        <>
                          <Divider sx={{ my: 3 }} />
                          <Box sx={{ 
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: 3
                          }}>
                            <Button 
                              variant="contained" 
                              color="primary" 
                              onClick={() => handleConfirm(booking.id)}
                              startIcon={<CheckCircleIcon sx={{ fontSize: '1.2rem' }} />}
                              sx={{
                                boxShadow: '0 3px 6px rgba(46, 125, 50, 0.3)',
                                '&:hover': {
                                  boxShadow: '0 6px 12px rgba(46, 125, 50, 0.4)',
                                  backgroundColor: 'primary.dark'
                                },
                                py: 1.5,
                                px: 3
                              }}
                            >
                              Confirm Request
                            </Button>
                            <Button 
                              variant="outlined" 
                              color="error"
                              onClick={() => handleDecline(booking.id)}
                              startIcon={<CancelIcon sx={{ fontSize: '1.2rem' }} />}
                              sx={{
                                border: '2px solid',
                                borderColor: 'error.main',
                                color: 'error.main',
                                '&:hover': {
                                  backgroundColor: 'rgba(244, 67, 54, 0.04)',
                                  borderColor: 'error.dark',
                                  border: '2px solid'
                                },
                                py: 1.5,
                                px: 3
                              }}
                            >
                              Decline Request
                            </Button>
                          </Box>
                        </>
                      )}
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Requests;