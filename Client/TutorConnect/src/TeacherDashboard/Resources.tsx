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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button // Added Button for dialog actions
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AddIcon from '@mui/icons-material/Add'; // Import for the Add button

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
  const [openDialog, setOpenDialog] = React.useState(false); // State for dialog visibility
  const [newResource, setNewResource] = React.useState({
    title: '',
    url: '',
    description: '',
    uploadedBy: 'Tutor Name' // Hardcoded uploader name
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
          id: resources.length + 1, ...newResource,
          subject: ''
      }]);
      setNewResource({ title: '', url: '', description: '', uploadedBy: 'Tutor Name' }); // Reset form
      setOpenDialog(false); // Close dialog
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: 'primary.main' }}>
        <BookmarkIcon fontSize="large" sx={{ mr: 1 }} />
        Learning Resources
      </Typography>

      {/* Add Resource Button */}
      <Box sx={{ mb: 4 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)} // Open dialog
        >
          Add Resource
        </Button>
      </Box>

      {/* Resource Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Resource</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={newResource.title}
            onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="URL"
            fullWidth
            value={newResource.url}
            onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description (optional)"
            fullWidth
            value={newResource.description}
            onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddResource}>Add</Button>
        </DialogActions>
      </Dialog>

      {/* Search and Filters */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4, justifyContent: 'center', alignItems: 'center' }}>
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
          Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
          ))
        ) : filteredResources.length > 0 ? (
          filteredResources.map(resource => (
            <Card
              key={resource.id}
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
          <Typography variant="body1" sx={{ textAlign: 'center', py: 6, color: 'text.secondary', fontStyle: 'italic' }}>
            No resources found matching your criteria. Try adjusting your search or filters.
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default Resources;