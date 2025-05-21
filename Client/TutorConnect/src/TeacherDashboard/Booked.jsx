import * as React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
  Divider,
  Avatar
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VideocamIcon from '@mui/icons-material/Videocam';
import ScheduleIcon from '@mui/icons-material/Schedule';

const Booked = () => {
  const [openCancelModal, setOpenCancelModal] = React.useState(false);
  const [openCompleteModal, setOpenCompleteModal] = React.useState(false);

  // Hardcoded teacher data
  const teacher = {
    name: "John Doe",
    email: "john.doe@example.com",
    subject: "Mathematics",
    avatar: "JD"
  };

  // Hardcoded booking data
  const booking = {
    startTime: new Date(),
    endTime: new Date(new Date().getTime() + 60 * 60 * 1000), // 1 hour later
    status: "Upcoming"
  };

  const handleCancelConfirm = () => {
    setOpenCancelModal(false);
    // Handle cancel logic here
    alert("Booking has been cancelled.");
  };

  const handleCompleteConfirm = () => {
    setOpenCompleteModal(false);
    // Handle complete logic here
    alert("Booking marked as completed.");
  };

  // Format time display
  const formatTime = (date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <Card
        sx={{
          maxWidth: 700,
          width: '90%',
          mx: 'auto',
          mt: 4,
          p: 3,
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          backgroundColor: '#ffffff',
          borderLeft: '4px solid #4CAF50'
        }}
      >
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Avatar sx={{ 
              bgcolor: '#4CAF50', 
              width: 56, 
              height: 56,
              fontSize: '1.5rem'
            }}>
              {teacher.avatar}
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {teacher.name}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {teacher.subject} Tutor
              </Typography>
            </Box>
            <Chip
              label={booking.status}
              sx={{
                ml: 'auto',
                backgroundColor: '#E8F5E9',
                color: '#2E7D32',
                fontWeight: 600
              }}
              icon={<ScheduleIcon />}
            />
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Stack spacing={2} sx={{ mb: 3 }}>
            <Typography variant="body1">
              <Box component="span" sx={{ fontWeight: 600, mr: 1 }}>Email:</Box>
              {teacher.email}
            </Typography>
            <Typography variant="body1">
              <Box component="span" sx={{ fontWeight: 600, mr: 1 }}>Starts:</Box>
              {formatTime(booking.startTime)}
            </Typography>
            <Typography variant="body1">
              <Box component="span" sx={{ fontWeight: 600, mr: 1 }}>Ends:</Box>
              {formatTime(booking.endTime)}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="contained"
              startIcon={<VideocamIcon />}
              sx={{
                px: 4,
                backgroundColor: '#4CAF50',
                '&:hover': { backgroundColor: '#388E3C' }
              }}
            >
              Join Class
            </Button>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={() => setOpenCancelModal(true)}
              sx={{
                px: 4,
                color: '#D32F2F',
                borderColor: '#D32F2F',
                '&:hover': { borderColor: '#B71C1C' }
              }}
            >
              Cancel
            </Button>
            <Button
              variant="outlined"
              startIcon={<CheckCircleIcon />}
              onClick={() => setOpenCompleteModal(true)}
              sx={{
                px: 4,
                color: '#2E7D32',
                borderColor: '#2E7D32',
                '&:hover': { borderColor: '#1B5E20' }
              }}
            >
              Completed
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Cancel Confirmation Modal */}
      <Dialog
        open={openCancelModal}
        onClose={() => setOpenCancelModal(false)}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            minWidth: '400px'
          }
        }}
      >
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <CancelIcon 
            color="error" 
            sx={{ 
              fontSize: '60px', 
              mb: 2,
              backgroundColor: '#FFEBEE',
              borderRadius: '50%',
              padding: '12px'
            }} 
          />
          <DialogTitle sx={{ 
            fontSize: '1.5rem',
            fontWeight: 700,
            px: 0,
            color: '#D32F2F'
          }}>
            Cancel This Booking?
          </DialogTitle>
          <DialogContent sx={{ px: 0 }}>
            <DialogContentText sx={{ color: '#616161', fontSize: '1rem' }}>
              This action cannot be undone. The tutor will be notified of the cancellation.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ 
            justifyContent: 'center',
            gap: 2,
            pt: 3,
            px: 0
          }}>
            <Button
              onClick={() => setOpenCancelModal(false)}
              variant="outlined"
              sx={{
                borderRadius: '8px',
                px: 4,
                py: 1,
                borderColor: '#BDBDBD',
                color: '#424242'
              }}
            >
              Go Back
            </Button>
            <Button
              onClick={handleCancelConfirm}
              variant="contained"
              color="error"
              sx={{
                borderRadius: '8px',
                px: 4,
                py: 1,
                backgroundColor: '#D32F2F',
                '&:hover': { backgroundColor: '#B71C1C' }
              }}
              startIcon={<CancelIcon />}
            >
              Confirm Cancellation
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Complete Confirmation Modal */}
      <Dialog
        open={openCompleteModal}
        onClose={() => setOpenCompleteModal(false)}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            minWidth: '400px'
          }
        }}
      >
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <CheckCircleIcon 
            color="success" 
            sx={{ 
              fontSize: '60px', 
              mb: 2,
              backgroundColor: '#E8F5E9',
              borderRadius: '50%',
              padding: '12px'
            }} 
          />
          <DialogTitle sx={{ 
            fontSize: '1.5rem',
            fontWeight: 700,
            px: 0,
            color: '#2E7D32'
          }}>
            Mark Session as Completed?
          </DialogTitle>
          <DialogContent sx={{ px: 0 }}>
            <DialogContentText sx={{ color: '#616161', fontSize: '1rem' }}>
              Please confirm the session has finished. This will help us improve our matching system.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ 
            justifyContent: 'center',
            gap: 2,
            pt: 3,
            px: 0
          }}>
            <Button
              onClick={() => setOpenCompleteModal(false)}
              variant="outlined"
              sx={{
                borderRadius: '8px',
                px: 4,
                py: 1,
                borderColor: '#BDBDBD',
                color: '#424242'
              }}
            >
              Not Yet
            </Button>
            <Button
              onClick={handleCompleteConfirm}
              variant="contained"
              color="success"
              sx={{
                borderRadius: '8px',
                px: 4,
                py: 1,
                backgroundColor: '#2E7D32',
                '&:hover': { backgroundColor: '#1B5E20' }
              }}
              startIcon={<CheckCircleIcon />}
            >
              Confirm Completion
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
};

export default Booked;