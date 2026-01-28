# FinanceLife Backend API

A comprehensive backend API for the FinanceLife mobile application, built with modern technologies.

## Tech Stack

- **Node.js** - Runtime environment
- **TypeScript** - Type-safe JavaScript
- **Express.js** - Web framework
- **Prisma** - ORM for database management
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **nodemailer** - Email sending
- **Zod** - Schema validation

## Features

- User authentication (register, login, logout, refresh tokens)
- Email verification and password reset
- Comprehensive error handling
- Security middleware (CORS, Helmet)
- Rate limiting
- File upload support
- RESTful API design

## Installation

1. Install dependencies:
```bash
cd backend
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Set up database:
```bash
npx prisma migrate dev
npx prisma generate
```

4. Start the server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/refresh-token` - Refresh access token
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password
- `GET /api/v1/auth/verify-email/:token` - Verify email
- `POST /api/v1/auth/resend-verification` - Resend verification email

### Users
- `GET /api/v1/users/me` - Get current user (protected)
- `PUT /api/v1/users/me` - Update user profile (protected)
- `DELETE /api/v1/users/me` - Delete user account (protected)

### Accounts
- `GET /api/v1/accounts` - Get user accounts (protected)
- `POST /api/v1/accounts` - Create account (protected)
- `PUT /api/v1/accounts/:id` - Update account (protected)
- `DELETE /api/v1/accounts/:id` - Delete account (protected)

### Transactions
- `GET /api/v1/transactions` - Get user transactions (protected)
- `POST /api/v1/transactions` - Create transaction (protected)
- `PUT /api/v1/transactions/:id` - Update transaction (protected)
- `DELETE /api/v1/transactions/:id` - Delete transaction (protected)

### Budgets
- `GET /api/v1/budgets` - Get user budgets (protected)
- `POST /api/v1/budgets` - Create budget (protected)
- `PUT /api/v1/budgets/:id` - Update budget (protected)
- `DELETE /api/v1/budgets/:id` - Delete budget (protected)

### Goals
- `GET /api/v1/goals` - Get user goals (protected)
- `POST /api/v1/goals` - Create goal (protected)
- `PUT /api/v1/goals/:id` - Update goal (protected)
- `DELETE /api/v1/goals/:id` - Delete goal (protected)

### Loans
- `GET /api/v1/loans` - Get user loans (protected)
- `POST /api/v1/loans` - Create loan (protected)
- `PUT /api/v1/loans/:id` - Update loan (protected)
- `DELETE /api/v1/loans/:id` - Delete loan (protected)

### Investments
- `GET /api/v1/investments` - Get user investments (protected)
- `POST /api/v1/investments` - Create investment (protected)
- `PUT /api/v1/investments/:id` - Update investment (protected)
- `DELETE /api/v1/investments/:id` - Delete investment (protected)

### Friends
- `GET /api/v1/friends` - Get user friends (protected)
- `POST /api/v1/friends` - Send friend request (protected)
- `PUT /api/v1/friends/:id` - Accept/decline friend request (protected)
- `DELETE /api/v1/friends/:id` - Remove friend (protected)

### Groups
- `GET /api/v1/groups` - Get user groups (protected)
- `POST /api/v1/groups` - Create group (protected)
- `PUT /api/v1/groups/:id` - Update group (protected)
- `DELETE /api/v1/groups/:id` - Delete group (protected)

### Notifications
- `GET /api/v1/notifications` - Get user notifications (protected)
- `PUT /api/v1/notifications/:id` - Mark notification as read (protected)
- `DELETE /api/v1/notifications/:id` - Delete notification (protected)

### Advisors
- `GET /api/v1/advisors` - Get available advisors (protected)
- `GET /api/v1/advisors/:id` - Get advisor details (protected)
- `POST /api/v1/advisors/:id/book` - Book consultation (protected)

### Bookings
- `GET /api/v1/bookings` - Get user bookings (protected)
- `POST /api/v1/bookings` - Create booking (protected)
- `PUT /api/v1/bookings/:id` - Update booking (protected)
- `DELETE /api/v1/bookings/:id` - Cancel booking (protected)

### Settlements
- `GET /api/v1/settlements` - Get user settlements (protected)
- `POST /api/v1/settlements` - Create settlement (protected)
- `PUT /api/v1/settlements/:id` - Update settlement (protected)
- `DELETE /api/v1/settlements/:id` - Delete settlement (protected)

## Database Schema

The database schema is defined in `prisma/schema.prisma` and includes:

- Users with authentication and profile management
- Financial accounts and transactions
- Budgets, goals, loans, and investments
- Social features (friends, groups, settlements)
- Notifications and advisor system
- Bookings and consultations

## Security Features

- JWT-based authentication with refresh tokens
- Password hashing with bcrypt
- CORS configuration
- Helmet security headers
- Input validation with Zod
- Rate limiting
- Email verification

## Development

- **Linting**: ESLint with TypeScript support
- **Formatting**: Prettier
- **Type Checking**: TypeScript compiler
- **Hot Reload**: nodemon for development

## Production

- Environment-based configuration
- Proper error handling
- Security headers and CORS
- Rate limiting
- Logging

## Testing

To be implemented with Jest and Supertest for API testing.

## Documentation

API documentation will be available at `/api/v1/docs` when implemented with Swagger/OpenAPI.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details.