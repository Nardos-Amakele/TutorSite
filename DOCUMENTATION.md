# Tutor-Connect Documentation

## Project Overview
Tutor-Connect is a comprehensive tutoring platform that connects students with qualified tutors. The platform facilitates online learning through a robust backend system and an intuitive frontend interface.

## Architecture
The project follows a client-server architecture with the following components:

### Backend (Server)
- Built with Node.js and Express.js
- MongoDB database for data persistence
- Redis for caching and session management
- RESTful API architecture

### Frontend (Client)
- Modern web application
- Responsive design
- User-friendly interface

## Main Features

### Authentication System
- User registration and login
- Google OAuth integration
- JWT-based authentication
- Session management
- Password encryption using bcrypt

### User Roles
1. **Students**
   - Profile management
   - Search for tutors
   - Book sessions
   - View session history

2. **Teachers**
   - Profile management
   - Set availability
   - Manage sessions
   - Upload teaching materials

3. **Admin**
   - User management
   - Content moderation
   - System monitoring
   - Analytics and reporting

### Core Functionality
- Session scheduling
- File uploads for learning materials
- Email notifications
- Progress tracking

## Technical Stack

### Backend Technologies
- Node.js
- Express.js
- MongoDB
- Redis for caching
- JWT
- Passport.js
- SendGrid (Email)
- Google APIs
- Multer (File uploads)

### Security Features
- CORS protection
- Secure session management
- HTTP-only cookies
- Environment variable configuration
- Input validation
- Error handling middleware

## Project Structure

### Server Directory
```
Server/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── middlewares/    # Custom middlewares
├── models/         # Database models
├── routes/         # API routes
├── Services/       # Business logic
├── uploads/        # File uploads
└── index.js        # Main server file
```

### Client Directory
```
Client/
├── TutorConnect/   # Frontend application
└── screenshots/    # UI images
```

## API Endpoints

### Authentication Routes
- POST /auth/register - User registration
- POST /auth/login - User login
- GET /auth/google - Google OAuth
- POST /auth/logout - User logout

### Student Routes
- GET /student/profile - Get student profile
- PUT /student/profile - Update student profile
- GET /student/sessions - Get student sessions
- POST /student/book - Book a session

### Teacher Routes
- GET /teacher/profile - Get teacher profile
- PUT /teacher/profile - Update teacher profile
- GET /teacher/sessions - Get teacher sessions
- POST /teacher/availability - Set availability

### Admin Routes
- GET /admin/users - Get all users
- PUT /admin/users/:id - Update user status
- GET /admin/analytics - Get system analytics

## Setup and Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Redis
- npm or yarn

### Environment Variables
Create a `.env` file in the Server directory with the following variables:
```
PORT=3000
MONGODB_URI=your_mongodb_uri
REDIS_URL=your_redis_url
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
CLIENT_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SENDGRID_API_KEY=your_sendgrid_api_key
```

### Installation Steps
1. Clone the repository
2. Install server dependencies:
   ```bash
   cd Server
   npm install
   ```
3. Install client dependencies:
   ```bash
   cd Client/TutorConnect
   npm install
   ```
4. Start the server:
   ```bash
   npm run dev
   ```
5. Start the client:
   ```bash
   npm run dev
   ```

## Error Handling
The application implements comprehensive error handling:
- Global error handling middleware
- Unhandled promise rejection handling
- Uncaught exception handling
- Custom error classes for different scenarios

## Security Considerations
- All sensitive data is encrypted
- API endpoints are protected with appropriate middleware
- File uploads are validated and sanitized
- Session management is secure
- CORS is properly configured
- Environment variables are used for sensitive data

## Performance Optimization
- Redis caching for frequently accessed data
- Efficient database queries
- File upload optimization
- Connection pooling
- Error boundary implementation

## Future Enhancements
- Video conferencing integration
- Advanced analytics dashboard
- Mobile application
- AI-powered tutor matching
- Automated scheduling system
- Payment gateway integration
- Multi-language support



## License
This project is licensed under the ISC License. 