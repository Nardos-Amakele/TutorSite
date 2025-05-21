import * as React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Stack, 
  Divider 
} from '@mui/material';
import { 
  People as PeopleIcon, 
  School as TeacherIcon, 
  Person as StudentIcon,
  Block as BannedIcon,
  Verified as VerifiedIcon,
  TrendingUp as GrowthIcon
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Create green theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32', // Deep green
      light: '#4caf50', // Medium green
      dark: '#1b5e20', // Dark green
      contrastText: '#ffffff'
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff'
    }
  },
});

// Hardcoded analytics data
const dashboardData = {
  totalUsers: 1243,
  totalTeachers: 187,
  verifiedTeachers: 153,
  bannedUsers: 28,
  totalStudents: 1056,
  growthRate: 12.5,
  recentActivity: [
    "5 new teacher applications",
    "3 teachers verified",
    "2 users banned",
    "15 new student signups"
  ]
};

const StatCard = ({ 
  title, 
  value, 
  icon, 
  color = 'primary' 
}: { 
  title: string; 
  value: number; 
  icon: React.ReactNode;
  color?: 'primary' | 'error' | 'success' | 'warning';
}) => {
  const colorMap = {
    primary: '#2e7d32',
    error: '#d32f2f',
    success: '#388e3c',
    warning: '#f57c00'
  };

  return (
    <Paper 
      sx={{ 
        p: 3, 
        borderRadius: 3,
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 6px 16px rgba(0,0,0,0.12)'
        }
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box sx={{
          backgroundColor: `${colorMap[color]}20`,
          color: colorMap[color],
          p: 2,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {icon}
        </Box>
        <Box>
          <Typography variant="h6" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h4" fontWeight="bold" sx={{ color: colorMap[color] }}>
            {value}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};

const Dashboard = () => {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        p: 4, 
        background: 'linear-gradient(to bottom, #f5f5f5 0%, #e8f5e9 100%)',
        minHeight: '100vh'
      }}>
        <Typography variant="h4" sx={{ 
          mb: 4, 
          fontWeight: 'bold',
          color: 'primary.dark',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          Admin Dashboard
        </Typography>

        {/* Main Stats Grid */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Total Users" 
              value={dashboardData.totalUsers} 
              icon={<PeopleIcon fontSize="large" />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Total Teachers" 
              value={dashboardData.totalTeachers} 
              icon={<TeacherIcon fontSize="large" />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Verified Teachers" 
              value={dashboardData.verifiedTeachers} 
              icon={<VerifiedIcon fontSize="large" />}
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Banned Users" 
              value={dashboardData.bannedUsers} 
              icon={<BannedIcon fontSize="large" />}
              color="error"
            />
          </Grid>
        </Grid>

        {/* Secondary Stats */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ 
              p: 3, 
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              height: '100%'
            }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Student Statistics
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Stack direction="row" spacing={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" fontWeight="bold" color="primary.main">
                    {dashboardData.totalStudents}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Total Students
                  </Typography>
                </Box>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: 1
                }}>
                  <GrowthIcon color="success" fontSize="large" />
                  <Box>
                    <Typography variant="h5" fontWeight="bold" color="success.main">
                      +{dashboardData.growthRate}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Growth Rate
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ 
              p: 3, 
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              height: '100%'
            }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Recent Activity
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Stack spacing={2}>
                {dashboardData.recentActivity.map((activity, index) => (
                  <Box key={index} sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: 2
                  }}>
                    <Box sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: 'primary.main'
                    }} />
                    <Typography>{activity}</Typography>
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;