import React, { useState, useContext } from "react";
import { UserContext } from "../UserContext";
import SignupImg from "./images/signup-image.jpg";
import Logo from '../Landing/media/logo.png';
import { styled } from "@mui/material";
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import GoogleButton from 'react-google-button';
import { Link as LinkR } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit">TutorHub</Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50', // Changed to green
    },
    secondary: {
      main: '#f50057',
    },
  },
});

const daysOfWeek = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
];

const Signup = () => {
  const [userType, setUserType] = useState('student');
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState('');
  const [availability, setAvailability] = useState([]);
  const [selectedDay, setSelectedDay] = useState('');
  const [startTime, setStartTime] = useState(dayjs('09:00', 'HH:mm'));
  const [endTime, setEndTime] = useState(dayjs('17:00', 'HH:mm'));
  const [qualifications, setQualifications] = useState([]);

  const { setName, setId, setEmail, setIsVarified } = useContext(UserContext);
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  const handleUserTypeChange = (event, newUserType) => {
    if (newUserType !== null) {
      setUserType(newUserType);
    }
  };

  const handleAddSubject = () => {
    if (newSubject.trim() && subjects.length < 3) {
      setSubjects([...subjects, newSubject.trim()]);
      setNewSubject('');
    }
  };

  const handleRemoveSubject = (index) => {
    const updatedSubjects = [...subjects];
    updatedSubjects.splice(index, 1);
    setSubjects(updatedSubjects);
  };

  const handleAddAvailability = () => {
    if (selectedDay && startTime && endTime) {
      const newSlot = {
        day: selectedDay,
        start: startTime.format('HH:mm'),
        end: endTime.format('HH:mm')
      };
      setAvailability([...availability, newSlot]);
      setSelectedDay('');
      setStartTime(dayjs('09:00', 'HH:mm'));
      setEndTime(dayjs('17:00', 'HH:mm'));
    }
  };

  const handleRemoveAvailability = (index) => {
    const updatedAvailability = [...availability];
    updatedAvailability.splice(index, 1);
    setAvailability(updatedAvailability);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setQualifications([...qualifications, ...files]);
  };

  const handleRemoveQualification = (index) => {
    const updatedQualifications = [...qualifications];
    updatedQualifications.splice(index, 1);
    setQualifications(updatedQualifications);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const userDetails = {
      email: data.get('email'),
      password: data.get('password'),
      name: data.get('firstName') + ' ' + data.get('lastName'),
      userType: userType,
    };

    if (userType === 'tutor') {
      userDetails.subjects = subjects;
      userDetails.availability = availability;
    }

    const endpoint = userType === 'student'
      ? 'https://ruby-fragile-angelfish.cyclic.app/student/register'
      : 'https://ruby-fragile-angelfish.cyclic.app/tutor/register';

    await fetch(endpoint, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userDetails)
    })
      .then(res => res.json())
      .then(res => {
        if (res.msg === "Registration successful") {
          setName(res.user.name);
          setId(res.user._id);
          setEmail(res.user.email);
          setIsVarified(res.user.isVerified);

          MySwal.fire({
            title: res.msg,
            position: 'center',
            showConfirmButton: false,
            timer: 1500,
            didOpen: () => {
              MySwal.showLoading();
            },
          }).then(() => {
            return MySwal.fire({
              title: <p>Redirecting to Login Page...</p>
            });
          });

          setTimeout(() => {
            navigate("/login");
          }, 1500);
        } else {
          MySwal.fire({
            title: res.msg,
            position: 'center',
            showConfirmButton: false,
            timer: 1500,
            icon: 'error',
            didOpen: () => {
              MySwal.showLoading();
            },
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const CustomBox = styled(Box)(({ theme }) => ({
    width: '60%',
    margin: '1rem auto',
    display: 'flex',
    padding: '0rem 3rem',
    boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
    borderRadius: '2rem',
    [theme.breakpoints.down('md')]: {
      width: '100vw',
      margin: 0,
    },
    [theme.breakpoints.down('sm')]: {
      width: '100vw',
      margin: 0,
      padding: 0,
    }
  }));

  const CustomBox1 = styled(Box)(({ theme }) => ({
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  }));

  return (
    <CustomBox>
      <Box sx={{ flex: 1 }}>
        <ThemeProvider theme={defaultTheme}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <LinkR to='/'>
                <img src={Logo} alt="Logo" style={{ width: '100px', height: 'auto' }} /> {/* Smaller logo */}
              </LinkR>

              <Typography component="h1" variant="h5" sx={{ fontWeight: 600 }}>
                Sign up
              </Typography>

              <ToggleButtonGroup
                color="primary"
                value={userType}
                exclusive
                onChange={handleUserTypeChange}
                aria-label="User type"
                sx={{ mt: 2, mb: 2 }}
              >
                <ToggleButton value="student">Student</ToggleButton>
                <ToggleButton value="tutor">Tutor</ToggleButton>
              </ToggleButtonGroup>

              <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      autoComplete="given-name"
                      name="firstName"
                      required
                      fullWidth
                      id="firstName"
                      label="First Name"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="lastName"
                      label="Last Name"
                      name="lastName"
                      autoComplete="family-name"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="new-password"
                    />
                  </Grid>

                  {userType === 'tutor' && (
                    <>
                      <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom>
                          Subjects (max 3)
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TextField
                            fullWidth
                            value={newSubject}
                            onChange={(e) => setNewSubject(e.target.value)}
                            label="Add subject"
                            disabled={subjects.length >= 3}
                            autoFocus
                          />
                          <IconButton
                            onClick={handleAddSubject}
                            disabled={!newSubject.trim() || subjects.length >= 3}
                            color="primary"
                          >
                            <AddIcon />
                          </IconButton>
                        </Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                          {subjects.map((subject, index) => (
                            <Chip
                              key={index}
                              label={subject}
                              onDelete={() => handleRemoveSubject(index)}
                              deleteIcon={<DeleteIcon />}
                            />
                          ))}
                        </Box>
                      </Grid>

                      <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom>
                          Availability
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={4}>
                            <TextField
                              select
                              fullWidth
                              label="Day"
                              value={selectedDay}
                              onChange={(e) => setSelectedDay(e.target.value)}
                              SelectProps={{
                                native: true,
                              }}
                            >
                              <option value=""></option>
                              {daysOfWeek.map((day) => (
                                <option key={day.value} value={day.value}>
                                  {day.label}
                                </option>
                              ))}
                            </TextField>
                          </Grid>
                          <Grid item xs={4}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <TimePicker
                                label="Start Time"
                                value={startTime}
                                onChange={(newValue) => setStartTime(newValue)}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                              />
                            </LocalizationProvider>
                          </Grid>
                          <Grid item xs={4}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <TimePicker
                                label="End Time"
                                value={endTime}
                                onChange={(newValue) => setEndTime(newValue)}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                              />
                            </LocalizationProvider>
                          </Grid>
                        </Grid>
                        <Button
                          onClick={handleAddAvailability}
                          disabled={!selectedDay}
                          startIcon={<AddIcon />}
                          sx={{ mt: 1 }}
                        >
                          Add Availability
                        </Button>
                        <Box sx={{ mt: 2 }}>
                          {availability.map((slot, index) => (
                            <Chip
                              key={index}
                              label={`${slot.day.charAt(0).toUpperCase() + slot.day.slice(1)}: ${slot.start} - ${slot.end}`}
                              onDelete={() => handleRemoveAvailability(index)}
                              deleteIcon={<DeleteIcon />}
                              sx={{ m: 0.5 }}
                            />
                          ))}
                        </Box>
                      </Grid>

                      <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom>
                          Qualifications
                        </Typography>
                        <input
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          style={{ display: 'none' }}
                          id="qualification-upload"
                          multiple
                          type="file"
                          onChange={handleFileUpload}
                        />
                        <label htmlFor="qualification-upload">
                          <Button variant="outlined" component="span" startIcon={<AddIcon />}>
                            Upload Files
                          </Button>
                        </label>
                        <Box sx={{ mt: 2 }}>
                          {qualifications.map((file, index) => (
                            <Chip
                              key={index}
                              label={file.name}
                              onDelete={() => handleRemoveQualification(index)}
                              deleteIcon={<DeleteIcon />}
                              sx={{ m: 0.5 }}
                            />
                          ))}
                        </Box>
                      </Grid>
                    </>
                  )}

                  <Grid item xs={12}>
                    <FormControlLabel
                      control={<Checkbox value="allowExtraEmails" color="primary" required />}
                      label="I agree all statements in Terms of service"
                    />
                  </Grid>
                </Grid>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    mb: 2,
                    backgroundColor: 'primary.main',
                    '&:hover': {
                      backgroundColor: '#3e8e41', // Darker green on hover
                    }
                  }}
                >
                  Sign Up
                </Button>

                {/* <GoogleButton
                  label="Sign in"
                  type='dark'
                  style={{
                    display: 'block',
                    margin: '0.1rem auto',
                    width: '35%',
                    color: 'gray',
                    fontSize: '90%',
                    fontWeight: 500,
                    backgroundColor: '#FFFFFF'
                  }}
                /> */}

                <Grid container justifyContent="center" sx={{ marginTop: '1rem' }}>
                  <Grid item>
                    <LinkR to='/login'>
                      <Link variant="body2" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                        Already have an account? Log in
                      </Link>
                    </LinkR>
                  </Grid>
                </Grid>
              </Box>
            </Box>
            <Copyright sx={{ mt: 3, mb: 2 }} />
          </Container>
        </ThemeProvider>
      </Box>

      <CustomBox1>
        <figure>
          <img src={SignupImg} alt="sign up image" />
        </figure>
      </CustomBox1>
    </CustomBox>
  );
};

export default Signup;