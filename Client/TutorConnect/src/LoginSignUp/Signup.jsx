// eslint-disable-next-line no-unused-vars
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

const Copyright = (props) => (
  <Typography variant="body2" color="text.secondary" align="center" {...props}>
    {'Copyright © '}
    <Link color="inherit">TutorHub</Link>{' '}
    {new Date().getFullYear()}
    {'.'}
  </Typography>
);

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

const Signup = () => {
  const [userType, setUserType] = useState('student');
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [newAttachment, setNewAttachment] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [password, setPassword] = useState(''); // Manage password state

  const { setName, setId, setEmail, setIsVarified } = useContext(UserContext);
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  const handleUserTypeChange = (event, newUserType) => {
    if (newUserType !== null) {
      setUserType(newUserType);
    }
  };

  const handleAddSubject = (e) => {
    e.preventDefault();
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

  const handleAddAttachment = (e) => {
    e.preventDefault();
    if (newAttachment.trim()) {
      setAttachments([...attachments, newAttachment.trim()]);
      setNewAttachment('');
    }
  };

  const handleRemoveAttachment = (index) => {
    const updatedAttachments = [...attachments];
    updatedAttachments.splice(index, 1);
    setAttachments(updatedAttachments);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    
    const userDetails = {
      name: data.get('firstName') + ' ' + data.get('lastName'),
      email: data.get('email'),
      password: password, // Use controlled password state
    };

    if (userType === 'teacher') {
      userDetails.subjects = subjects;
      userDetails.attachments = attachments;
      userDetails.hourlyRate = Number(hourlyRate);
    }

    const endpoint = userType === 'student'
      ? 'http://localhost:5000/auth/register/student'
      : 'http://localhost:5000/auth/register/teacher';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userDetails)
      });

      const res = await response.json();

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
    } catch (err) {
      console.error(err);
      MySwal.fire({
        title: "An error occurred",
        text: "Please try again later",
        icon: 'error',
        position: 'center',
        showConfirmButton: false,
        timer: 1500,
      });
    }
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
                <img src={Logo} alt="Logo" style={{ width: '100px', height: 'auto' }} />
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
                <ToggleButton value="teacher">Teacher</ToggleButton>
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
                      value={password} // Controlled input
                      onChange={(e) => setPassword(e.target.value)} // Update password state
                    />
                  </Grid>

                  {userType === 'teacher' && (
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
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddSubject(e);
                              }
                            }}
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
                          Attachments
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TextField
                            fullWidth
                            value={newAttachment}
                            onChange={(e) => setNewAttachment(e.target.value)}
                            label="Add attachment (e.g., cv.pdf)"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddAttachment(e);
                              }
                            }}
                          />
                          <IconButton
                            onClick={handleAddAttachment}
                            disabled={!newAttachment.trim()}
                            color="primary"
                          >
                            <AddIcon />
                          </IconButton>
                        </Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                          {attachments.map((attachment, index) => (
                            <Chip
                              key={index}
                              label={attachment}
                              onDelete={() => handleRemoveAttachment(index)}
                              deleteIcon={<DeleteIcon />}
                            />
                          ))}
                        </Box>
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          required
                          fullWidth
                          type="number"
                          label="Hourly Rate ($)"
                          value={hourlyRate}
                          onChange={(e) => setHourlyRate(e.target.value)}
                          inputProps={{ min: 0 }}
                        />
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
                      backgroundColor: '#3e8e41',
                    }
                  }}
                >
                  Sign Up
                </Button>

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