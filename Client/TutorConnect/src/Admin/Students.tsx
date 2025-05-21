import * as React from 'react';
import { useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import BlockIcon from '@mui/icons-material/Block';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Chip } from '@mui/material';

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
                    fontWeight: 600
                }
            }
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderLeft: '4px solid #2e7d32',
                    width: '100%',
                    maxWidth: 400
                }
            }
        }
    }
});

const Students = () => {
    const [students, setStudents] = useState([
        {
            id: 1,
            name: "Alice Johnson",
            email: "alice.johnson@example.com",
            banned: false
        },
        {
            id: 2,
            name: "Bob Smith",
            email: "bob.smith@example.com",
            banned: false
        },
        {
            id: 3,
            name: "Charlie Brown",
            email: "charlie.brown@example.com",
            banned: true
        }
    ]);

    const toggleBanStudent = (studentId: number) => {
        setStudents(students.map(student =>
            student.id === studentId ? { ...student, banned: !student.banned } : student
        ));
    };

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{
                p: 3,
                display: 'flex',
                flexWrap: 'wrap',
                gap: 3,
                background: 'linear-gradient(to bottom, #f5f5f5 0%, #e8f5e9 100%)',
                minHeight: '100vh'
            }}>
                {students.map((student) => (
                    <Card key={student.id} sx={{
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
                                <Avatar sx={{
                                    bgcolor: student.banned ? 'error.main' : 'primary.main',
                                    mr: 2
                                }}>
                                    {student.name.charAt(0)}
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" component="div" fontWeight="bold">
                                        {student.name}
                                        {student.banned && (
                                            <Chip
                                                label="Banned"
                                                color="error"
                                                size="small"
                                                sx={{ ml: 1, fontSize: '0.7rem' }}
                                            />
                                        )}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {student.email}
                                    </Typography>
                                </Box>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                                <Button
                                    onClick={() => toggleBanStudent(student.id)}
                                    variant={student.banned ? "contained" : "outlined"}
                                    color={student.banned ? "success" : "error"}
                                    startIcon={student.banned ? <LockOpenIcon /> : <BlockIcon />}
                                    size="medium"
                                    sx={{
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: 'bold',
                                        px: 3
                                    }}
                                >
                                    {student.banned ? 'Unban Student' : 'Ban Student'}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </ThemeProvider>
    );
};

export default Students;