// Imports
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
  Alert,
  Snackbar
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

// Define the Resource type
interface Resource {
  _id: string;
  title: string;
  url: string;
  description: string;
  subject: string;
  uploadedBy: string;
}

const Resources = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [resources, setResources] = React.useState<Resource[]>([]);
  const [selectedSubject, setSelectedSubject] = React.useState('');
  const [selectedUploader, setSelectedUploader] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'error' as 'error' | 'success'
  });

  // Fetch resources from the backend
  const fetchResources = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch("http://localhost:5000/student/resources", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        setResources(data.Resources);
        setError(null);
      } else {
        setError(data.msg || 'Failed to fetch resources');
        setSnackbar({
          open: true,
          message: data.msg || 'Failed to fetch resources',
          severity: 'error'
        });
      }
    } catch (error) {
      setError('Error fetching resources');
      setSnackbar({
        open: true,
        message: 'Error fetching resources',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch resources on component mount
  React.useEffect(() => {
    fetchResources();
  }, []);

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

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

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      {/* Page Title */}
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: 'primary.main' }}>
        <BookmarkIcon fontSize="large" sx={{ mr: 1 }} />
        Learning Resources
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Search and Filters */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ mb: 4, justifyContent: 'center', alignItems: 'center' }}
      >
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
            sx: { borderRadius: 2, backgroundColor: 'background.paper' }
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
          // Loading Skeletons
          Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
          ))
        ) : filteredResources.length > 0 ? (
          // Display Filtered Resources
          filteredResources.map(resource => (
            <Card
              key={resource._id}
              sx={{
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.12)'
                }
              }}
            >
              <CardActionArea
                component="a"
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ p: 2 }}
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
                      color: 'text.primary'
                    }}
                  >
                    {resource.title}
                    <OpenInNewIcon fontSize="small" color="action" />
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                    {resource.description}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <Chip label={resource.subject} size="small" color="primary" variant="outlined" />
                    <Chip label={`Uploaded by: ${resource.uploadedBy}`} size="small" variant="outlined" />
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>
          ))
        ) : (
          // No Results Message
          <Typography variant="body1" sx={{ textAlign: 'center', py: 6, color: 'text.secondary', fontStyle: 'italic' }}>
            No resources found matching your criteria. Try adjusting your search or filters.
          </Typography>
        )}
      </Stack>

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

export default Resources;