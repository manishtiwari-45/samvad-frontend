# 🌟 StellarHub Frontend

A modern, responsive web application for campus community management built with React, Vite, and Tailwind CSS.

## ✨ Features

### Landing Page
- Beautiful hero section with call-to-action buttons
- Feature highlights and statistics
- Modern glassmorphism design
- Responsive layout for all devices

### Authentication System
- Modern login/signup forms with smooth animations
- Google OAuth integration
- Form validation with real-time feedback
- Password strength indicators
- Remember me functionality

### Dashboard
- Role-based dashboards (Student, Club Admin, Super Admin)
- Interactive widgets and statistics
- Quick action cards
- Real-time notifications

### Club Management
- Browse and discover clubs
- Detailed club pages with member information
- Join/leave club functionality
- Club admin features for management

### Event System
- Event discovery and browsing
- Detailed event pages with registration
- Event categories and filtering
- Calendar integration

### Gallery
- Photo gallery with upload functionality
- Event photo collections
- Image optimization and lazy loading

### AI Features
- Intelligent chatbot for assistance
- Face enrollment for attendance
- AI-powered event recommendations

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd stellarhub-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   copy env.example .env.local
   
   # Edit .env.local with your configuration
   VITE_API_BASE_URL=http://localhost:8000
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   
   Or use the convenient startup script:
   ```bash
   start-app.bat
   ```

5. **Open your browser**
   Navigate to [http://localhost:5173](http://localhost:5173)

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build optimized production bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality |
| `npm run backend` | Start the backend server |
| `npm run start:all` | Start both frontend and backend concurrently |

## Tech Stack

### Core Technologies
- **React 19** - Modern UI library with latest features
- **Vite** - Fast build tool and development server
- **React Router 7** - Client-side routing
- **Tailwind CSS 3** - Utility-first CSS framework

### UI & Design
- **Lucide React** - Beautiful SVG icons
- **Framer Motion** - Smooth animations
- **Heroicons** - Additional icon set
- **Custom CSS** - Enhanced styling system

### Authentication & API
- **Google OAuth** - Social authentication
- **Axios** - HTTP client with interceptors
- **JWT** - Token-based authentication

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes
- **Concurrently** - Run multiple commands

## Design System

### Color Palette
- **Primary**: Modern blue accent (#388BFD)
- **Background**: Dark theme with gradients
- **Cards**: Elevated surfaces with subtle shadows
- **Text**: High contrast for accessibility

### Components
- **Modern Cards** - Hover effects and smooth transitions
- **Buttons** - Gradient backgrounds with lift animations
- **Forms** - Clean inputs with validation states
- **Navigation** - Responsive sidebar and header

### Animations
- **Fade In Up** - Smooth content entrance
- **Scale In** - Modal and popup animations
- **Hover Effects** - Interactive element feedback
- **Loading States** - Skeleton screens and spinners

## Responsive Design

- **Mobile First** - Optimized for mobile devices
- **Tablet Support** - Enhanced layouts for tablets
- **Desktop** - Full-featured desktop experience
- **Accessibility** - WCAG compliant design

## Configuration

### Environment Variables
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000

# Google OAuth (Optional)
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here

# Development
VITE_NODE_ENV=development
```

### Tailwind Configuration
Custom design tokens and utilities are defined in `tailwind.config.js`:
- Extended color palette
- Custom animations
- Typography scale
- Spacing system

## Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy to Netlify/Vercel
The built files in the `dist` folder can be deployed to any static hosting service.

## Testing

### Manual Testing Checklist
- [ ] Landing page loads correctly
- [ ] Authentication flow works
- [ ] Navigation between pages
- [ ] Club and event cards clickable
- [ ] Responsive design on mobile
- [ ] Form validation working
- [ ] API calls successful

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Check the documentation
- Open an issue on GitHub
- Contact the development team

---

**Made with ❤️ by the StellarHub Team**
