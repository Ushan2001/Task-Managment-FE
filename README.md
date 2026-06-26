# Task Management System - Frontend

A modern, responsive React-based frontend for a Task Management System with authentication, real-time task management, and an intuitive user interface built with Next.js and TypeScript.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Development Server](#running-the-development-server)
- [Building for Production](#building-for-production)
- [Project Structure](#project-structure)
- [Available Pages](#available-pages)
- [Components](#components)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

## Features

- **User Authentication**
  - Registration and login
  - JWT token-based authentication
  - Auth context for global state management
  - Protected routes

- **Dashboard**
  - Workspace overview
  - Task statistics (total, open, active, done)
  - Task completion rate visualization
  - Monthly velocity chart
  - Recent tasks preview

- **Task Management**
  - Create, read, update, and delete tasks
  - Set task priority (Low, Medium, High)
  - Manage task status (Open, In Progress, Testing, Done)
  - Assign tasks to team members
  - Set due dates

- **Advanced Features**
  - Search tasks by title and description
  - Filter by priority, status, and assignee
  - Responsive design for mobile and desktop
  - Real-time updates
  - Beautiful UI with custom styling
  - Toast notifications for user feedback

- **UI/UX Enhancements**
  - Collapsible sidebar navigation
  - Breadcrumb navigation
  - Modal dialogs for task creation/editing
  - Loading states and error handling
  - Confirmation dialogs for destructive actions
  - Professional color scheme and typography

## Tech Stack

- **Framework:** Next.js 15+ (React 19)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI primitives
- **Icons:** Lucide React
- **Notifications:** Sonner
- **State Management:** React Context API
- **HTTP Client:** Axios
- **Build Tool:** Vite (via Next.js)

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running (see Backend README)
- Modern web browser

## Installation

1. **Navigate to frontend directory**
   ```bash
   cd fontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Verify installation**
   ```bash
   npm list
   ```

## Configuration

1. **Create a `.env.local` file in the frontend root directory:**
   ```bash
   cp .env.example .env.local
   ```

2. **Configure environment variables in `.env.local`:**
   ```env
   # API Configuration
   NEXT_PUBLIC_API_URL=http://localhost:5000
   NEXT_PUBLIC_API_BASE_PATH=/api

   # Application
   NEXT_PUBLIC_APP_NAME=Task Management System
   NEXT_PUBLIC_APP_ENV=development
   ```

3. **Key points:**
   - `NEXT_PUBLIC_` prefix makes variables accessible in browser
   - Update `NEXT_PUBLIC_API_URL` to match your backend server
   - For production, update to your production API URL

## Running the Development Server

### Standard Development
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### With Custom Port
```bash
npm run dev -- -p 3001
```

### Debug Mode
```bash
npm run dev -- --debug
```

## Building for Production

### Create Production Build
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Export Static Site (if needed)
```bash
npm run export
```

## Project Structure

```
fontend/
├── app/                    # Next.js app directory
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── login/
│   │   └── page.tsx        # Login page
│   ├── register/
│   │   └── page.tsx        # Registration page
│   ├── dashboard/
│   │   └── page.tsx        # Dashboard page
│   └── tasks/
│       └── page.tsx        # Task management page
├── components/             # Reusable components
│   ├── auth-context.tsx    # Authentication context
│   ├── auth-left-panel.tsx # Login/Register sidebar
│   ├── navbar.tsx          # Top navigation bar
│   ├── sidebar.tsx         # Collapsible sidebar
│   ├── banner.tsx          # Page banner component
│   ├── breadcrumb.tsx      # Breadcrumb navigation
│   ├── theme-provider.tsx  # Theme configuration
│   └── ui/                 # UI primitives
│       ├── button.tsx
│       ├── card.tsx
│       ├── checkbox.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── select.tsx
│       ├── sonner.tsx
│       └── tabs.tsx
├── lib/                    # Utilities and helpers
│   ├── api.ts              # API client configuration
│   └── utils.ts            # Helper functions
├── public/                 # Static assets
│   └── assets/
│       └── images/
├── next.config.ts          # Next.js configuration
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── postcss.config.mjs      # PostCSS configuration
├── package.json
├── .env.local             # Environment variables (git-ignored)
└── README.md
```

## Available Pages

### Authentication Pages

#### `/login`
- User login with email and password
- Link to registration page
- Error handling and validation

#### `/register`
- New user registration
- Form validation
- Password confirmation
- Link to login page

### Application Pages

#### `/dashboard`
- Workspace overview
- Key statistics
- Task completion visualization
- Monthly velocity chart
- Recent tasks preview
- User menu and logout

#### `/tasks`
- Complete task management interface
- Task listing table
- Create new tasks
- Edit tasks
- Delete tasks
- Advanced filtering and search
- Status and priority management
- Task assignment

#### `/`
- Home/landing page
- Redirects to dashboard if authenticated

## Components

### Layout Components
- **Navbar** - Top navigation with user info
- **Sidebar** - Collapsible navigation menu
- **Banner** - Page header with background image
- **Breadcrumb** - Navigation path indicator

### Feature Components
- **AuthContext** - Authentication state management
- **AuthLeftPanel** - Login/register form sidebar
- **ThemeProvider** - Application theme configuration

### UI Components (from Radix UI)
- **Dialog** - Modal dialogs for forms
- **Button** - Reusable button component
- **Input** - Text input fields
- **Select** - Dropdown selectors
- **Card** - Container component
- **Checkbox** - Checkbox input
- **Label** - Form labels
- **Tabs** - Tabbed interface

## Environment Variables

### Development
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_API_BASE_PATH=/api
```

### Production
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_API_BASE_PATH=/api
```

**Important:** Variables with `NEXT_PUBLIC_` prefix are exposed to the browser and should not contain secrets.

## Styling

### Tailwind CSS
- Configuration in `tailwind.config.ts`
- Custom color scheme:
  - Primary (brand): `#FF502D`
  - Background: `#F5F7F9`
  - Text: `#1e293b`

### Custom Utilities
- Check `app/globals.css` for custom utilities
- Component-specific styles are inline with Tailwind classes

## Authentication Flow

1. **User Registration**
   - Submit form at `/register`
   - Password validation
   - User created in backend
   - Redirects to login

2. **User Login**
   - Submit credentials at `/login`
   - Receive JWT token
   - Token stored in localStorage
   - Redirects to dashboard

3. **Protected Routes**
   - Auth context checks token on app load
   - Redirects to login if not authenticated
   - Token sent with all API requests

4. **Logout**
   - Token removed from localStorage
   - Auth context updated
   - Redirects to login

## API Integration

### API Client (`lib/api.ts`)
- Axios-based HTTP client
- Automatic token injection
- Base URL configuration
- Error handling

### Making API Calls
```typescript
import { api } from '@/lib/api';

// GET request
const response = await api.get('/tasks');

// POST request
const response = await api.post('/tasks', { title: 'New Task' });

// PUT request
const response = await api.put('/tasks/123', { title: 'Updated' });

// DELETE request
const response = await api.delete('/tasks/123');
```

## Common Issues & Troubleshooting

### Cannot connect to API
- Ensure backend is running on configured port
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Verify CORS settings in backend
- Check browser console for specific errors

### Authentication not working
- Verify backend is sending JWT tokens
- Check that token is stored in localStorage
- Clear localStorage and login again
- Check `auth-context.tsx` for token handling

### Styling not applied
- Rebuild Tailwind CSS: `npm run build`
- Clear Next.js cache: `rm -rf .next`
- Restart dev server: `npm run dev`

### Build errors
- Clear node_modules: `rm -rf node_modules`
- Reinstall dependencies: `npm install`
- Check TypeScript errors: `npm run type-check`

### Page not found or 404
- Verify file is in `app/` directory
- Check file naming follows Next.js conventions
- Restart dev server

### Slow performance
- Check Network tab in DevTools
- Verify API responses are reasonable
- Consider implementing pagination
- Check for memory leaks in browser console

## Development Tips

### Hot Reload
- Next.js automatically reloads on file changes
- Changes reflect immediately in browser

### TypeScript
- Run type checking: `npm run type-check`
- Enable strict mode in `tsconfig.json`

### Debugging
- Use browser DevTools console
- Add `debugger;` statements in code
- Check Next.js debug output

### Code Quality
- Format code: `npm run format` (if configured)
- Lint code: `npm run lint` (if configured)
- Run tests: `npm test` (if configured)

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository at vercel.com
3. Set environment variables
4. Deploy automatically on push

### Netlify
1. Build locally: `npm run build`
2. Deploy `out/` directory
3. Configure environment variables

### Traditional Server
```bash
npm run build
npm start
```

## Performance Optimization

- Next.js Image optimization
- Code splitting by route
- CSS-in-JS optimization
- Bundle analysis available via plugins
- Consider static generation where possible

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Support & Resources

- Next.js Documentation: https://nextjs.org/docs
- React Documentation: https://react.dev
- Tailwind CSS: https://tailwindcss.com
- Radix UI: https://www.radix-ui.com
- TypeScript: https://www.typescriptlang.org

## License

This project is part of a task management system assignment.
