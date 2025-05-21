import { Box, Typography } from "@mui/material";
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll';

// Replace with actual tutor images
import {
  one, two, three, four, five, six
} from '../media/SlideImages/slideImages';

const SlidingImages1 = () => {
  const imgStyle = {
    height: '20rem',
    width: 'auto',
    objectFit: 'cover',
    borderRadius: '1rem',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
  };

  const customSlideStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 'fit-content'
  };

  return (
    <Box
      sx={{
        backgroundColor: '#F5FDF7', // very light greenish background
        mt: 8,
        mb: 8,
        py: 6,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: '3rem',
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 'bold',
          letterSpacing: '3px',
          color: '#4CAF50', // your preferred green
        }}
      >
        MEET OUR DEDICATED TUTORS
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: '#2E7D32', // darker green for text
          maxWidth: '700px',
          mx: 'auto',
        }}
      >
        A glimpse of the passionate educators who are here to help you succeed in your academic journey.
      </Typography>

      <Splide
        options={{
          type: "loop",
          drag: "free",
          gap: '1.5rem',
          arrows: false,
          pagination: false,
          perPage: 4,
          autoScroll: {
            pauseOnHover: false,
            pauseOnFocus: false,
            rewind: false,
            speed: 1.5,
          }
        }}
        extensions={{ AutoScroll }}
      >
        {[one, two, three, four, five, six].map((imgSrc, index) => (
          <SplideSlide key={index} style={customSlideStyle}>
            <img src={imgSrc} alt={`Tutor ${index + 1}`} style={imgStyle} />
          </SplideSlide>
        ))}
      </Splide>
    </Box>
  );
};

export default SlidingImages1;
