import * as React from 'react';
import { useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32', // Deep green
      contrastText: '#ffffff'
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff'
    }
  },
});

const PendingTutors = () => {
  const [tutors, setTutors] = useState([
    {
      id: 1,
      name: "John Doe",
      qualification: "PhD in Mathematics",
      email: "john.doe@example.com",
      status: "Pending",
      subjects: ["Math", "Physics", "Chemistry"],
      lastActive: "2 days ago",
      documents: ["Degree Certificate", "ID Proof", "Teaching License"]
    },
    {
      id: 2,
      name: "Jane Smith",
      qualification: "MSc in Physics",
      email: "jane.smith@example.com",
      status: "Pending",
      subjects: ["Physics", "Biology"],
      lastActive: "1 day ago",
      documents: ["Degree Certificate", "ID Proof"]
    },
  ]);

  const handleVerify = (tutorId) => {
    setTutors(tutors.map(tutor =>
      tutor.id === tutorId ? { ...tutor, status: "Verified" } : tutor
    ));
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
          background: 'linear-gradient(to bottom, #f5f5f5 0%, #e8f5e9 100%)',
          minHeight: '100vh'
        }}
      >
        {tutors.map((tutor) => (
          <Card
            key={tutor.id}
            sx={{
              width: '100%',
              maxWidth: 1000, // Increased width
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 6px 16px rgba(46, 125, 50, 0.15)',
              }
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                <Avatar sx={{ 
                  bgcolor: 'primary.main', 
                  width: 80, 
                  height: 80, 
                  mr: 3,
                  fontSize: '2rem'
                }}>
                  {tutor.name.charAt(0)}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h5" component="div" fontWeight="bold">
                      {tutor.name}
                    </Typography>
                    <Chip 
                      label={tutor.status}
                      color={tutor.status === "Verified" ? "success" : "warning"}
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>
                  <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 0.5 }}>
                    {tutor.qualification}
                  </Typography>
                  
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
                    gap: 3,
                    mt: 3
                  }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        <strong>Email:</strong>
                      </Typography>
                      <Typography variant="body1">{tutor.email}</Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        <strong>Last Active:</strong>
                      </Typography>
                      <Typography variant="body1">{tutor.lastActive}</Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        <strong>Documents Submitted:</strong>
                      </Typography>
                      <Typography variant="body1">{tutor.documents.length} files</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Subjects:
                </Typography>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                  {tutor.subjects.map((subject, index) => (
                    <Chip
                      key={index}
                      label={subject}
                      color="primary"
                      variant="outlined"
                      sx={{ 
                        fontSize: '0.9rem',
                        px: 1.5,
                        py: 0.5
                      }}
                    />
                  ))}
                </Stack>
              </Box>

              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 4
              }}>
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 'bold',
                    px: 4
                  }}
                >
                  View Documents
                </Button>
                <Button
                  onClick={() => handleVerify(tutor.id)}
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 'bold',
                    px: 4,
                    '&:hover': {
                      backgroundColor: 'primary.dark'
                    }
                  }}
                >
                  Verify Tutor
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </ThemeProvider>
  );
};

export default PendingTutors;