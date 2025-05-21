import * as React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  TextField,
  IconButton,
  Stack,
  Skeleton,
  InputAdornment,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CardActions
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
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
          borderLeft: '4px solid #2e7d32'
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '6px'
        }
      }
    }
  }
});

// Extended hardcoded data
const resourcesData = [
  {
    id: 1,
    title: 'React Documentation',
    url: 'https://reactjs.org/docs/getting-started.html',
    description: 'Official React documentation with guides and API references',
    subject: 'Frontend',
    uploadedBy: 'Alice'
  },
  {
    id: 2,
    title: 'TypeScript Handbook',
    url: 'https://www.typescriptlang.org/docs/handbook/intro.html',
    description: 'Complete guide to TypeScript features',
    subject: 'Programming',
    uploadedBy: 'Bob'
  },
  {
    id: 3,
    title: 'Material-UI Components',
    url: 'https://mui.com/material-ui/getting-started/',
    description: 'Collection of ready-to-use React components',
    subject: 'UI Library',
    uploadedBy: 'Alice'
  },
  {
    id: 4,
    title: 'CSS Tricks',
    url: 'https://css-tricks.com/',
    description: 'Daily articles about CSS, HTML, JavaScript, and all things web development',
    subject: 'Web Design',
    uploadedBy: 'Charlie'
  },
  {
    id: 5,
    title: 'MDN Web Docs',
    url: 'https://developer.mozilla.org/en-US/',
    description: 'Resources for developers, by developers',
    subject: 'Web Development',
    uploadedBy: 'Bob'
  }
];

const Resources = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [resources, setResources] = React.useState(resourcesData);
  const [selectedSubject, setSelectedSubject] = React.useState('');
  const [selectedUploader, setSelectedUploader] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [newResource, setNewResource] = React.useState({
    title: '',
    url: '',
    description: '',
    uploadedBy: 'Tutor Name'
  });

  // Derive unique subjects and uploaders for filter dropdowns
  const uniqueSubjects = [...new Set(resources.map(r => r.subject))];
  const uniqueUploaders = [...new Set(resources.map(r => r.uploadedBy))];

  // Filter resources based on search term and selected filters
  const filteredResources = resources.filter(resource => {
    const searchMatch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());

    const subjectMatch = selectedSubject ? resource.subject === selectedSubject : true;
    const uploaderMatch = selectedUploader ? resource.uploadedBy === selectedUploader : true;

    return searchMatch && subjectMatch && uploaderMatch;
  });

  const handleAddResource = () => {
    if (newResource.title && newResource.url) {
      setResources([...resources, {
          id: resources.length + 1, 
          ...newResource,
          subject: 'General'
      }]);
      setNewResource({ title: '', url: '', description: '', uploadedBy: 'Tutor Name' });
      setOpenDialog(false);
    }
  };

  const handleDeleteResource = (id) => {
    setResources(resources.filter(resource => resource.id !== id));
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        p: 3, 
        maxWidth: 1200, 
        mx: 'auto',
        background: 'linear-gradient(to bottom, #f5f5f5 0%, #e8f5e9 100%)',
        minHeight: '100vh'
      }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 700, 
          mb: 3, 
          color: 'primary.dark',
          display: 'flex',
          alignItems: 'center',
          textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
        }}>
          <BookmarkIcon fontSize="large" sx={{ 
            mr: 1,
            color: 'primary.main',
            backgroundColor: 'rgba(46, 125, 50, 0.1)',
            borderRadius: '50%',
            p: 1
          }} />
          Learning Resources
        </Typography>

        {/* Add Resource Button */}
        <Box sx={{ mb: 4 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{
              boxShadow: '0 2px 4px rgba(46, 125, 50, 0.3)',
              '&:hover': {
                boxShadow: '0 4px 8px rgba(46, 125, 50, 0.4)',
                backgroundColor: 'primary.dark'
              }
            }}
          >
            Add Resource
          </Button>
        </Box>

        {/* Resource Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle sx={{ 
            backgroundColor: 'primary.main',
            color: 'white',
            fontWeight: 600
          }}>
            Add New Resource
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Title"
              fullWidth
              value={newResource.title}
              onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="URL"
              fullWidth
              value={newResource.url}
              onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Description (optional)"
              fullWidth
              multiline
              rows={3}
              value={newResource.description}
              onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setOpenDialog(false)}
              sx={{ color: 'primary.dark' }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddResource}
              variant="contained"
              sx={{
                backgroundColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.dark'
                }
              }}
            >
              Add Resource
            </Button>
          </DialogActions>
        </Dialog>

        {/* Search and Filters */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ 
          mb: 4, 
          justifyContent: 'center', 
          alignItems: 'center',
          backgroundColor: 'white',
          p: 3,
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              sx: { 
                borderRadius: 2, 
                backgroundColor: 'background.paper',
                '&:focus-within': {
                  borderColor: 'primary.main'
                }
              }
            }}
            sx={{ flexGrow: 1 }}
          />
          <TextField
            select
            label="Subject"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            sx={{ minWidth: { xs: '100%', sm: 180 } }}
            size="medium"
          >
            <MenuItem value="">All Subjects</MenuItem>
            {uniqueSubjects.map(subject => (
              <MenuItem key={subject} value={subject}>{subject}</MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Uploader"
            value={selectedUploader}
            onChange={(e) => setSelectedUploader(e.target.value)}
            sx={{ minWidth: { xs: '100%', sm: 180 } }}
            size="medium"
          >
            <MenuItem value="">All Uploaders</MenuItem>
            {uniqueUploaders.map(uploader => (
              <MenuItem key={uploader} value={uploader}>{uploader}</MenuItem>
            ))}
          </TextField>
        </Stack>

        {/* Resource Cards */}
        <Stack spacing={3}>
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <Skeleton 
                key={index} 
                variant="rectangular" 
                height={120} 
                sx={{ 
                  borderRadius: 2,
                  backgroundColor: 'rgba(46, 125, 50, 0.1)'
                }} 
              />
            ))
          ) : filteredResources.length > 0 ? (
            filteredResources.map(resource => (
              <Card
                key={resource.id}
                sx={{
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 6px 16px rgba(46, 125, 50, 0.15)'
                  }
                }}
              >
                <Box sx={{ display: 'flex' }}>
                  <CardActionArea
                    component="a"
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ p: 2, flexGrow: 1 }}
                  >
                    <CardContent sx={{ p: 0 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          mb: 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          color: 'primary.dark'
                        }}
                      >
                        {resource.title}
                        <OpenInNewIcon fontSize="small" color="primary" />
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                        {resource.description}
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                        <Chip 
                          label={resource.subject} 
                          size="small" 
                          color="primary" 
                          variant="outlined" 
                          sx={{
                            borderColor: 'primary.light',
                            color: 'primary.dark'
                          }}
                        />
                        <Chip 
                          label={`Uploaded by: ${resource.uploadedBy}`} 
                          size="small" 
                          variant="outlined"
                          sx={{
                            borderColor: 'secondary.main',
                            color: 'text.secondary'
                          }}
                        />
                      </Stack>
                    </CardContent>
                  </CardActionArea>
                  <CardActions sx={{ p: 2, alignItems: 'center' }}>
                    <IconButton 
                      aria-label="delete"
                      onClick={() => handleDeleteResource(resource.id)}
                      sx={{
                        color: 'error.main',
                        '&:hover': {
                          backgroundColor: 'rgba(244, 67, 54, 0.08)'
                        }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Box>
              </Card>
            ))
          ) : (
            <Box sx={{ 
              textAlign: 'center', 
              py: 6, 
              backgroundColor: 'white',
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <Typography variant="body1" sx={{ 
                color: 'text.secondary', 
                fontStyle: 'italic',
                mb: 2
              }}>
                No resources found matching your criteria.
              </Typography>
              <Button 
                variant="outlined" 
                color="primary"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSubject('');
                  setSelectedUploader('');
                }}
              >
                Reset Filters
              </Button>
            </Box>
          )}
        </Stack>
      </Box>
    </ThemeProvider>
  );
};

export default Resources;