# Kidzo Authentication System - Frontend

A complete, production-ready React + TypeScript frontend application for the Kidzo Authentication API. Built with modern technologies and best practices.

## 🚀 Features

- ✅ **User Registration** with comprehensive validation
- ✅ **Login** with email or phone number
- ✅ **JWT Authentication** with automatic token management
- ✅ **Protected Routes** with route guards
- ✅ **Profile Management** with edit capabilities
- ✅ **Form Validation** with Formik + Yup
- ✅ **Toast Notifications** for user feedback
- ✅ **Responsive Design** with TailwindCSS
- ✅ **TypeScript** for type safety
- ✅ **Testing Setup** with Jest & React Testing Library

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI Framework |
| **TypeScript** | Type Safety |
| **Vite** | Build Tool & Dev Server |
| **TailwindCSS** | Styling |
| **React Router v6** | Routing |
| **Axios** | HTTP Client |
| **Formik** | Form Management |
| **Yup** | Schema Validation |
| **JWT Decode** | Token Handling |
| **React Toastify** | Notifications |
| **Jest** | Testing Framework |
| **React Testing Library** | Component Testing |
| **MSW** | API Mocking |

## 📁 Project Structure

```
kidzo-spa/
├── config/
│   └── swagger.js              # API documentation
├── src/
│   ├── components/
│   │   └── common/             # Reusable UI components
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Input.tsx
│   │       ├── Loading.tsx
│   │       └── index.ts
│   ├── context/
│   │   └── AuthContext.tsx     # Authentication context
│   ├── hooks/
│   │   └── useAuth.ts          # Auth custom hook
│   ├── pages/
│   │   ├── Home.tsx            # Landing page
│   │   ├── Login.tsx           # Login page
│   │   ├── Register.tsx        # Registration page
│   │   ├── Profile.tsx         # User profile view
│   │   ├── ProfileEdit.tsx     # Profile edit form
│   │   └── index.ts
│   ├── routes/
│   │   ├── PrivateRoute.tsx    # Protected route wrapper
│   │   ├── PublicRoute.tsx     # Public route wrapper
│   │   └── index.ts
│   ├── services/
│   │   ├── api.ts              # Axios instance
│   │   ├── authService.ts      # Auth API calls
│   │   ├── profileService.ts   # Profile API calls
│   │   └── index.ts
│   ├── tests/
│   │   ├── components/         # Component tests
│   │   └── setup.ts            # Test configuration
│   ├── types/
│   │   └── index.ts            # TypeScript types
│   ├── validation/
│   │   └── schemas.ts          # Yup validation schemas
│   ├── App.tsx                 # Main app component
│   ├── main.tsx                # App entry point
│   ├── index.css               # Global styles
│   └── vite-env.d.ts           # Vite types
├── .env.development            # Dev environment variables
├── .env.production             # Prod environment variables
├── index.html                  # HTML template
├── jest.config.js              # Jest configuration
├── package.json                # Dependencies
├── postcss.config.js           # PostCSS configuration
├── tailwind.config.js          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
├── tsconfig.node.json          # Node TypeScript config
└── vite.config.ts              # Vite configuration
```

## 🚦 Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** or **yarn** or **pnpm**
- Backend API running on `http://localhost:3001` (or update `.env.development`)

### Installation

1. **Install dependencies:**

```bash
npm install
```

2. **Set up environment variables:**

The project includes `.env.development` and `.env.production` files. Update them as needed:

```env
# .env.development
VITE_API_BASE_URL=http://localhost:3001
VITE_APP_NAME=Kidzo

# .env.production
VITE_API_BASE_URL=https://api.kidzo.com
VITE_APP_NAME=Kidzo
```

### Development

Start the development server:

```bash
npm run dev
```

The app will open at [http://localhost:5173](http://localhost:5173)

### Build for Production

```bash
npm run build
```

Build output will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🔑 API Integration

### Base Configuration

The app automatically handles:
- JWT token storage in `localStorage`
- Token injection in request headers
- Token expiration detection
- Automatic redirect on 401 errors

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:3001` |
| `VITE_APP_NAME` | Application name | `Kidzo` |

### API Endpoints

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/api/auth/register` | POST | No | Register new user |
| `/api/auth/login` | POST | No | Login user |
| `/api/auth/profile` | GET | Yes | Get user profile |
| `/api/auth/profile` | PUT | Yes | Update profile |

## 🎨 Component Library

### Input Component

```tsx
<Input
  type="text"
  label="Full Name"
  placeholder="Enter your name"
  error={errors.name}
  touched={touched.name}
  required
/>
```

### Button Component

```tsx
<Button
  variant="primary" // primary | secondary | danger | outline
  size="lg"         // sm | md | lg
  loading={isSubmitting}
  fullWidth
>
  Submit
</Button>
```

### Card Component

```tsx
<Card title="Profile" subtitle="Manage your account">
  {/* Card content */}
</Card>
```

### Loading Component

```tsx
<Loading
  size="lg"
  fullScreen
  text="Loading..."
/>
```

## 🔒 Authentication Flow

### Registration

1. User fills registration form
2. Form validates with Yup schema
3. API call to `/api/auth/register`
4. JWT token stored in localStorage
5. User redirected to profile page

### Login

1. User enters email/phone and password
2. Form validates credentials
3. API call to `/api/auth/login`
4. JWT token stored
5. Redirect to profile

### Protected Routes

Routes wrapped with `<PrivateRoute>` require authentication:
- `/profile` - View user profile
- `/profile/edit` - Edit profile

Public routes (redirect if authenticated):
- `/login`
- `/register`

## 📝 Form Validation Rules

### Registration
- **Name**: 2-50 characters, letters and spaces only
- **Email**: Valid email format
- **Phone**: 10-digit Indian mobile (starts with 6-9)
- **Password**: Min 6 chars, must include uppercase, lowercase, and number

### Login
- **Identifier**: Valid email OR 10-digit phone number
- **Password**: Required

### Profile Update
- All fields optional
- Same validation rules as registration

## 🧪 Testing

The project includes a complete testing setup:

```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

### Test Structure

```
src/tests/
├── components/
│   └── Button.test.tsx
└── setup.ts
```

### Coverage Thresholds

- Branches: 70%
- Functions: 70%
- Lines: 70%
- Statements: 70%

## 🎯 Code Quality

### TypeScript

Strict mode enabled with:
- No implicit any
- Unused locals/parameters detection
- Path aliases for clean imports

### Path Aliases

```typescript
import { Button } from '@/components/common';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services';
import type { User } from '@/types';
```

## 🐛 Troubleshooting

### Common Issues

**1. TypeScript errors after installing dependencies:**

```bash
npm install --legacy-peer-deps
```

**2. Port already in use:**

Update `vite.config.ts`:

```typescript
server: {
  port: 3001, // Change port
}
```

**3. API connection failed:**

Check:
- Backend server is running
- `.env.development` has correct API URL
- CORS is enabled on backend

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev)
- [TailwindCSS Documentation](https://tailwindcss.com)
- [React Router Documentation](https://reactrouter.com)
- [Formik Documentation](https://formik.org)
- [Yup Documentation](https://github.com/jquense/yup)

## 📄 License

MIT

## 👥 Author

Built with ❤️ by the Kidzo Team

---

**Happy Coding! 🚀**
