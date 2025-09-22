# 🌟 SAMVAD Frontend

Beautiful and modern frontend for SAMVAD - A comprehensive campus community platform built with React, Vite, and Tailwind CSS.

## 📋 What is SAMVAD Frontend?

SAMVAD Frontend is a modern, responsive web application that provides an intuitive interface for campus community management. It connects students, clubs, and administrators in one seamless platform.

### 🎯 Key Features
- 🏠 **Beautiful Landing Page** - Modern design with smooth animations
- 🔐 **Secure Authentication** - Login/signup with Google OAuth support
- 📊 **Role-Based Dashboards** - Different interfaces for Students, Club Admins, and Super Admins
- 🏛️ **Club Management** - Browse, join, and manage campus clubs
- 📅 **Event Discovery** - Find and register for campus events
- 🤖 **AI Attendance** - Face recognition for automatic attendance
- 📸 **Photo Gallery** - Share and view event photos
- 💬 **Discussion Forums** - Community discussions and announcements
- 📱 **Mobile Responsive** - Works perfectly on all devices

## 🛠️ Technology Stack

- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React & Heroicons
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Authentication**: Google OAuth + JWT
- **Deployment**: Vercel

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- Git

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd samvad-frontend
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Set Up Environment Variables
Create a `.env.local` file in the root directory:
```bash
# Copy the example file
copy env.example .env.local

# Edit .env.local with your actual values
```

Required environment variables:
```bash
# Backend API URL
VITE_API_BASE_URL=http://localhost:8000

# Google OAuth Client ID
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

### 4. Start Development Server
```bash
npm run dev
# or
yarn dev

# Or use the batch file (Windows)
start-app.bat
```

The application will be available at: `http://localhost:5173`

## 📁 Project Structure

```
samvad-frontend/
├── public/
│   ├── team-photos/         # Team member photos
│   └── index.html          # HTML template
├── src/
│   ├── components/         # Reusable components
│   │   ├── common/         # Common UI components
│   │   ├── dashboards/     # Role-specific dashboards
│   │   ├── forms/          # Form components
│   │   └── Layout.jsx      # Main layout component
│   ├── context/           # React contexts
│   │   ├── AuthContext.jsx # Authentication context
│   │   └── NotificationContext.jsx # Notifications
│   ├── pages/             # Page components
│   │   ├── admin/         # Admin pages
│   │   ├── AuthPage.jsx   # Login/signup page
│   │   ├── DashboardPage.jsx # Main dashboard
│   │   └── LandingPage.jsx # Landing page
│   ├── services/          # API services
│   │   └── api.js         # API client and endpoints
│   ├── App.jsx            # Main app component
│   └── main.jsx           # Entry point
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind configuration
├── vite.config.js         # Vite configuration
└── vercel.json           # Vercel deployment config
```

## 🎨 User Interface

### Landing Page
- **Hero Section**: Eye-catching introduction with call-to-action buttons
- **Features**: Highlight key platform capabilities
- **Statistics**: Show platform engagement metrics
- **Team Section**: Meet the development team
- **Modern Design**: Glassmorphism effects and smooth animations

### Authentication
- **Dual Mode**: Login and signup in one interface
- **Google OAuth**: One-click login with Google
- **Form Validation**: Real-time validation with helpful messages
- **Security Notice**: Clear information about role assignment
- **Responsive**: Works perfectly on mobile devices

### Dashboards (Role-Based)

#### Student Dashboard
- **Welcome Section**: Personalized greeting and stats
- **Quick Actions**: Join clubs, register for events
- **My Clubs**: Overview of joined clubs
- **Recent Activity**: Latest platform updates
- **Event Recommendations**: AI-powered suggestions

#### Club Admin Dashboard
- **Club Management**: Create and manage clubs
- **Event Creation**: Organize events for clubs
- **AI Attendance**: Start face recognition sessions
- **Photo Upload**: Share event photos
- **Member Management**: View and manage club members

#### Super Admin Dashboard
- **System Overview**: Platform-wide statistics
- **User Management**: Manage all users and roles
- **Club Oversight**: System-wide club management
- **Analytics**: Detailed platform insights
- **Role Requests**: Approve/reject admin requests

## 🔐 Authentication & Security

### Authentication Flow
1. **Registration**: New users sign up as Students
2. **Google OAuth**: Alternative login method
3. **JWT Tokens**: Secure session management
4. **Role Assignment**: Automatic based on email whitelist
5. **Protected Routes**: Role-based access control

### Security Features
- **JWT Authentication**: Secure token-based auth
- **Protected Routes**: Role-based page access
- **Input Validation**: Client-side form validation
- **HTTPS Only**: Secure communication in production
- **Environment Variables**: Sensitive data protection

## 🎯 User Roles & Access

### Student (Default Role)
- Browse clubs and events
- Join clubs and register for events
- View photo gallery and forums
- Enroll face for AI attendance
- Request Club Admin role

### Club Admin
- All student features
- Create and manage clubs
- Create events for their clubs
- Upload photos and manage gallery
- Start AI attendance sessions

### Super Admin
- All platform features
- Manage all users and roles
- System-wide analytics
- Platform configuration
- Approve role requests

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm run preview  # Preview production build
```

### Deploy to Vercel
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy automatically

See `DEPLOYMENT_GUIDE.md` for detailed instructions.

## 🧪 Testing & Verification

### Built-in Verification
```bash
# Run the app verification script
node verify-app.js

# Test build process
npm run build
```

### Manual Testing Checklist
- [ ] Landing page loads correctly
- [ ] Authentication works (both regular and Google)
- [ ] Dashboard displays based on user role
- [ ] Club creation and management
- [ ] Event registration
- [ ] Photo upload functionality
- [ ] AI attendance system
- [ ] Mobile responsiveness

## 🎨 Customization

### Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Custom Components**: Reusable UI components
- **Animations**: Framer Motion for smooth transitions
- **Responsive Design**: Mobile-first approach

### Theming
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',    // Blue
        secondary: '#10B981',   // Green
        accent: '#F59E0B',      // Amber
      }
    }
  }
}
```

## 🔧 Configuration

### Environment Variables
```bash
# Development
VITE_API_BASE_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your_development_client_id

# Production
VITE_API_BASE_URL=https://your-backend.onrender.com
VITE_GOOGLE_CLIENT_ID=your_production_client_id
```

### API Configuration
The app automatically configures API endpoints based on the environment:
- **Development**: `http://localhost:8000`
- **Production**: Your deployed backend URL

## 🐛 Troubleshooting

### Common Issues

**API Connection Failed**
```bash
# Check backend URL
VITE_API_BASE_URL=https://your-backend.onrender.com
```

**Google Login Not Working**
```bash
# Verify Google Client ID
VITE_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com

# Check Google Cloud Console settings
# Ensure authorized origins include your domain
```

**Build Errors**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Styling Issues**
```bash
# Rebuild Tailwind CSS
npm run build
```

### Debug Mode
```bash
# Run with verbose logging
npm run dev -- --debug
```

## 📱 Mobile Experience

- **Responsive Design**: Optimized for all screen sizes
- **Touch Friendly**: Large buttons and touch targets
- **Fast Loading**: Optimized bundle size
- **Offline Support**: Service worker for basic offline functionality
- **PWA Ready**: Can be installed as a mobile app

## 🔄 Updates & Maintenance

### Regular Updates
- Keep dependencies updated
- Monitor security vulnerabilities
- Test new features thoroughly
- Update documentation

### Performance Monitoring
- Bundle size optimization
- Loading time monitoring
- User experience metrics
- Error tracking

## 📞 Support

- **Documentation**: This README and inline comments
- **Issues**: Create GitHub issue for bugs
- **Features**: Submit feature requests
- **Contact**: Reach out to the development team

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Development Guidelines
- Follow React best practices
- Use TypeScript for new components
- Write meaningful commit messages
- Test on multiple devices
- Update documentation

## 📄 Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Testing
node verify-app.js   # Verify app structure
npm run test         # Run tests (if available)

# Deployment
npm run deploy       # Deploy to production
```

## 🎉 Features in Detail

### AI Attendance System
- **Face Enrollment**: Users upload their photo
- **Live Recognition**: Real-time face detection
- **Automatic Marking**: Seamless attendance tracking
- **Privacy Focused**: Secure face data handling

### Photo Gallery
- **Event Photos**: Upload and share event memories
- **Gallery View**: Beautiful grid layout
- **Image Optimization**: Cloudinary integration
- **Mobile Optimized**: Perfect mobile viewing experience

### Discussion Forums
- **Community Discussions**: Engage with other students
- **Club Announcements**: Important updates and news
- **Real-time Updates**: Live discussion threads
- **Moderation Tools**: Admin controls for content

---

**Made with ❤️ for campus communities**

*SAMVAD - Connecting campus communities through technology*
