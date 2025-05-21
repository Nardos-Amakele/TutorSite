import * as React from 'react';
import { useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import BlockIcon from '@mui/icons-material/Block';
import LockOpenIcon from '@mui/icons-material/LockOpen';
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

const Teachers = () => {
    const [teachers, setTeachers] = useState([
        {
            id: 1,
            name: "John Doe",
            qualification: "PhD in Mathematics",
            email: "john.doe@example.com",
            status: "Active",
            subjects: ["Math", "Physics", "Chemistry"],
            banned: false,
            lastActive: "2 hours ago"
        },
        {
            id: 2,
            name: "Jane Smith",
            qualification: "MSc in Physics",
            email: "jane.smith@example.com",
            status: "Active",
            subjects: ["Physics", "Biology"],
            banned: false,
            lastActive: "30 minutes ago"
        },
        {
            id: 3,
            name: "Robert Johnson",
            qualification: "PhD in Chemistry",
            email: "robert.j@example.com",
            status: "Inactive",
            subjects: ["Chemistry", "Biology"],
            banned: true,
            lastActive: "2 weeks ago"
        }
    ]);

    const toggleBanTeacher = (teacherId: number) => {
        setTeachers(teachers.map(teacher =>
            teacher.id === teacherId ? { 
                ...teacher, 
                banned: !teacher.banned,
                status: !teacher.banned ? "Inactive" : "Active"
            } : teacher
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
                {teachers.map((teacher) => (
                    <Card key={teacher.id} sx={{
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
                                    bgcolor: teacher.banned ? 'error.main' : 
                                             teacher.status === "Active" ? 'primary.main' : 'grey.500',
                                    mr: 2,
                                    width: 56,
                                    height: 56
                                }}>
                                    {teacher.name.charAt(0)}
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" component="div" fontWeight="bold">
                                        {teacher.name}
                                        {teacher.banned && (
                                            <Chip
                                                label="Banned"
                                                color="error"
                                                size="small"
                                                sx={{ ml: 1, fontSize: '0.7rem' }}
                                            />
                                        )}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {teacher.qualification}
                                    </Typography>
                                </Box>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        <strong>Email:</strong>
                                    </Typography>
                                    <Typography variant="body2">{teacher.email}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        <strong>Status:</strong>
                                    </Typography>
                                    <Chip 
                                        label={teacher.status} 
                                        size="small"
                                        color={teacher.status === "Active" ? "success" : "default"}
                                        variant="outlined"
                                    />
                                </Box>
                            
                            </Box>

                            <Box sx={{ mb: 2, mt: 2 }}>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    <strong>Subjects:</strong>
                                </Typography>
                                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                                    {teacher.subjects.map((subject, index) => (
                                        <Chip
                                            key={index}
                                            label={subject}
                                            size="small"
                                            color="primary"
                                            variant="outlined"
                                            sx={{
                                                borderColor: 'primary.light',
                                                color: 'primary.dark'
                                            }}
                                        />
                                    ))}
                                </Stack>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                                <Button
                                    onClick={() => toggleBanTeacher(teacher.id)}
                                    variant={teacher.banned ? "contained" : "outlined"}
                                    color={teacher.banned ? "success" : "error"}
                                    startIcon={teacher.banned ? <LockOpenIcon /> : <BlockIcon />}
                                    size="medium"
                                    sx={{
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: 'bold',
                                        px: 3
                                    }}
                                >
                                    {teacher.banned ? 'Unban Teacher' : 'Ban Teacher'}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </ThemeProvider>
    );
};

export default Teachers;