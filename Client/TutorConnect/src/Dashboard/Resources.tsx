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
  Chip // Added Chip for a more visually appealing subject/uploader display
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BookmarkIcon from '@mui/icons-material/Bookmark'; // Not used in the current component, but kept as it was imported
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

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
  const [resources] = React.useState(resourcesData);
  const [selectedSubject, setSelectedSubject] = React.useState('');
  const [selectedUploader, setSelectedUploader] = React.useState('');
  const [loading, setLoading] = React.useState(false); // Keeping loading state for potential future use

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
          size="medium" // Made it medium for better visual consistency
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
          size="medium" // Made it medium for better visual consistency
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
              key={resource.id}
              sx={{
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)', // Enhanced shadow for depth
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-3px)', // Slightly more pronounced lift
                  boxShadow: '0 6px 16px rgba(0,0,0,0.12)' // More prominent shadow on hover
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
    </Box>
  );
};

export default Resources;