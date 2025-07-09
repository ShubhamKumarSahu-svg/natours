# Natours Application Documentation

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Backend Architecture](#backend-architecture)
3. [API Reference](#api-reference)
    - [Authentication & Authorization](#authentication--authorization)
    - [Tours API](#tours-api)
    - [Users API](#users-api)
    - [Reviews API](#reviews-api)
    - [Bookings API](#bookings-api)
    - [Advanced Query Features](#advanced-query-features)
    - [Error Handling](#error-handling)
    - [Security Features](#security-features)
    - [Performance Optimizations](#performance-optimizations)
    - [Webhooks & Stripe Integration](#webhooks--stripe-integration)
4. [Frontend Architecture](#frontend-architecture)
    - [Pug Templates](#pug-templates)
    - [CSS & Responsiveness](#css--responsiveness)
    - [Client-side JavaScript](#client-side-javascript)
    - [Mapbox Integration](#mapbox-integration)
    - [Stripe Integration](#stripe-integration)
    - [User Experience & Animations](#user-experience--animations)
5. [Project Structure](#project-structure)
6. [Environment Variables](#environment-variables)
7. [Deployment Guide](#deployment-guide)
8. [Testing & Quality](#testing--quality)
9. [Troubleshooting & FAQ](#troubleshooting--faq)
10. [Contribution Guide](#contribution-guide)
11. [References & Further Reading](#references--further-reading)

---

## Project Overview

Natours is a full-stack travel booking platform designed to demonstrate modern Node.js, Express, and MongoDB best practices. It features a robust RESTful API, secure authentication, advanced query capabilities, and a beautiful, responsive frontend built with Pug and custom CSS/JS. The project is ideal for learning scalable web application architecture, security, and deployment.

### Key Features
- RESTful API for tours, users, reviews, and bookings
- JWT authentication, role-based access, secure cookies
- Security: Helmet, rate limiting, sanitization, HPP
- Stripe payments and webhooks
- Email notifications (welcome, password reset)
- File uploads (user photos)
- Advanced filtering, sorting, pagination
- Responsive, modern frontend (Pug, CSS, JS)
- Mapbox integration for tour locations
- Centralized error handling
- Production-ready deployment scripts

---

## Backend Architecture

### Technologies Used
- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: ODM for MongoDB
- **Pug**: Templating engine for server-rendered views
- **Stripe**: Payment processing
- **Multer & Sharp**: File uploads and image processing
- **Nodemailer**: Email sending
- **Helmet, xss-clean, express-mongo-sanitize, hpp**: Security
- **Morgan**: Logging
- **Compression**: Gzip responses
- **CORS**: Cross-origin resource sharing

### Folder Structure
- `controllers/`: Route logic for each resource
- `models/`: Mongoose schemas and models
- `routes/`: API and view route definitions
- `public/`: Static assets (CSS, JS, images)
- `views/`: Pug templates
- `utils/`: Utility functions (error, email, etc.)
- `app.js`: Express app setup
- `server.js`: App startup, DB connection, error handling

---

## API Reference

### Authentication & Authorization

#### Signup
- `POST /api/v1/users/signup`
- Request: `{ "name": "John Doe", "email": "john@example.com", "password": "test1234", "passwordConfirm": "test1234" }`
- Response: JWT token, user data

#### Login
- `POST /api/v1/users/login`
- Request: `{ "email": "john@example.com", "password": "test1234" }`
- Response: JWT token, user data

#### Protecting Routes
- Use `Authorization: Bearer <token>` header
- Some routes require roles: `admin`, `lead-guide`, `guide`, `user`

#### Password Reset
- `POST /api/v1/users/forgotPassword` (send email)
- `PATCH /api/v1/users/resetPassword/:token` (reset password)

#### Update Password (Logged In)
- `PATCH /api/v1/users/updateMyPassword`

---

### Tours API

#### Get All Tours
- `GET /api/v1/tours`
- Query params: filtering, sorting, field limiting, pagination
- Example: `/api/v1/tours?duration=5&difficulty=easy&sort=price`

#### Get Single Tour
- `GET /api/v1/tours/:id`

#### Create Tour
- `POST /api/v1/tours` (admin/lead-guide only)
- Request: `{ "name": "The Forest Hiker", ... }`

#### Update Tour
- `PATCH /api/v1/tours/:id` (admin/lead-guide only)

#### Delete Tour
- `DELETE /api/v1/tours/:id` (admin/lead-guide only)

#### Tour Stats
- `GET /api/v1/tours/tour-stats`

#### Monthly Plan
- `GET /api/v1/tours/monthly-plan/:year` (admin/lead-guide only)

#### Geospatial Queries
- `GET /api/v1/tours-within/:distance/center/:latlng/unit/:unit`
- `GET /api/v1/tours/distances/:latlng/unit/:unit`

#### Example Response
```json
{
  "status": "success",
  "results": 2,
  "data": {
    "tours": [
      { "_id": "...", "name": "The Forest Hiker", ... },
      { "_id": "...", "name": "The Sea Explorer", ... }
    ]
  }
}
```

---

### Users API

#### Get All Users
- `GET /api/v1/users` (admin only)

#### Get User
- `GET /api/v1/users/:id` (admin only)

#### Create User
- `POST /api/v1/users` (admin only)

#### Update User
- `PATCH /api/v1/users/:id` (admin only)

#### Delete User
- `DELETE /api/v1/users/:id` (admin only)

#### Update Own Profile
- `PATCH /api/v1/users/updateMe` (logged in)
- Supports photo upload

#### Delete Own Account
- `DELETE /api/v1/users/deleteMe` (logged in)

---

### Reviews API

#### Get All Reviews
- `GET /api/v1/reviews`
- Supports filtering by tour: `/api/v1/tours/:tourId/reviews`

#### Get Review
- `GET /api/v1/reviews/:id`

#### Create Review
- `POST /api/v1/reviews` (logged in)
- Request: `{ "review": "Great tour!", "rating": 5, "tour": "<tourId>", "user": "<userId>" }`

#### Update Review
- `PATCH /api/v1/reviews/:id` (review owner/admin)

#### Delete Review
- `DELETE /api/v1/reviews/:id` (review owner/admin)

---

### Bookings API

#### Get All Bookings
- `GET /api/v1/bookings` (admin only)

#### Get Booking
- `GET /api/v1/bookings/:id` (admin only)

#### Create Booking
- `POST /api/v1/bookings` (Stripe webhook or admin)

#### Update Booking
- `PATCH /api/v1/bookings/:id` (admin only)

#### Delete Booking
- `DELETE /api/v1/bookings/:id` (admin only)

---

### Advanced Query Features

- **Filtering**: `/api/v1/tours?difficulty=easy&price[lte]=1500`
- **Sorting**: `/api/v1/tours?sort=price,-ratingsAverage`
- **Field Limiting**: `/api/v1/tours?fields=name,price`
- **Pagination**: `/api/v1/tours?page=2&limit=10`

#### Example: Get top 5 cheap tours
`/api/v1/tours?limit=5&sort=price&fields=name,price,ratingsAverage`

---

### Error Handling

- All errors are handled by a global error controller (`controllers/errorController.js`).
- Custom `AppError` class for operational errors.
- Errors are returned in a consistent JSON format:
```json
{
  "status": "fail",
  "message": "Invalid ID"
}
```
- Unhandled promise rejections and uncaught exceptions are logged and the server is shut down gracefully.

---

### Security Features

- **Helmet**: Sets secure HTTP headers
- **Rate Limiting**: Prevents brute-force attacks
- **express-mongo-sanitize**: Prevents NoSQL injection
- **xss-clean**: Prevents XSS attacks
- **hpp**: Prevents HTTP parameter pollution
- **CORS**: Allows cross-origin requests
- **Cookie Security**: Secure, HTTP-only cookies for JWT

---

### Performance Optimizations

- **Compression**: Gzip responses for faster load times
- **Static File Serving**: Efficiently serves CSS, JS, images
- **Production Logging**: Morgan for request logging
- **Database Indexing**: Mongoose schema indexes for fast queries

---

### Webhooks & Stripe Integration

- Stripe is used for payment processing.
- Webhook endpoint: `POST /webhook-checkout` (raw body parser)
- On successful payment, a booking is created in the database.
- Stripe secret keys are stored in environment variables.

---

## Frontend Architecture

### Pug Templates
- All views are rendered using Pug templates in the `views/` directory.
- Layouts, partials, and page-specific templates for modularity.
- Dynamic data is passed from controllers to templates.

### CSS & Responsiveness
- Custom CSS in `public/css/style.css`.
- Uses CSS variables, gradients, box-shadows, and media queries.
- Fully responsive: adapts to mobile, tablet, and desktop.
- Smooth transitions and animations for UI elements.

### Client-side JavaScript
- Located in `public/js/`
- Handles login, signup, alerts, Stripe payments, map rendering, and user settings.
- Uses Axios for API requests.
- Modular structure for maintainability.

### Mapbox Integration
- Interactive maps on tour detail pages.
- Mapbox GL JS used for rendering and markers.
- Tour locations are shown with custom pins and popups.

### Stripe Integration
- Stripe.js used for client-side payment flows.
- Secure checkout and booking confirmation.

### User Experience & Animations
- Smooth page transitions, button effects, and card animations.
- Alerts for success/error feedback.
- Image upload previews for user profile.

---

## Project Structure

```
/ (root)
|-- app.js
|-- server.js
|-- config.env
|-- package.json
|-- controllers/
|-- models/
|-- routes/
|-- public/
|   |-- css/
|   |-- js/
|   |-- img/
|-- views/
|-- utils/
|-- dev-data/
|-- .env.example
|-- .gitignore
|-- .eslintrc.json
|-- .prettierrc
```

---

## Environment Variables

All sensitive configuration is stored in `config.env`:
- `NODE_ENV`: development or production
- `PORT`: server port
- `DATABASE`: MongoDB connection string
- `DATABASE_PASSWORD`: password for DB
- `JWT_SECRET`, `JWT_EXPIRES_IN`, `JWT_COOKIE_EXPIRES_IN`: JWT config
- `EMAIL_*`: SMTP credentials
- `SENDGRID_*`: SendGrid credentials
- `STRIPE_*`: Stripe API keys

---

## Deployment Guide

1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Set up environment variables**: copy `config.env` and fill in your secrets
4. **Build frontend assets**: `npm run build:js`
5. **Start the server**:
    - Development: `npm run dev`
    - Production: `npm run start:prod`
6. **Deploy to cloud**: Use Heroku, Vercel, or your own VPS
7. **Set up environment variables on your host**
8. **Configure domain, SSL, and monitoring**

---

## Testing & Quality

- **Linting**: ESLint with Airbnb and Prettier configs
- **Prettier**: Enforced code style
- **Unit & Integration Tests**: (Add with Jest or Mocha/Chai)
- **Manual Testing**: Use Postman for API, browser for frontend
- **CI/CD**: (Add GitHub Actions or similar for automated testing/deployment)

---

## Troubleshooting & FAQ

### Common Issues
- **DB connection errors**: Check `DATABASE` and `DATABASE_PASSWORD` in `config.env`
- **Stripe errors**: Ensure correct API keys and webhook secret
- **Email not sending**: Verify SMTP credentials
- **CORS issues**: Adjust CORS middleware in `app.js`
- **Static files not loading**: Check `public/` directory and Express static middleware

### FAQ
- **How do I add a new API resource?**
    - Create a new model, controller, and route file. Register the route in `app.js`.
- **How do I customize the frontend?**
    - Edit Pug templates in `views/` and CSS in `public/css/style.css`.
- **How do I deploy to production?**
    - Use `npm run build:js` and `npm run start:prod`. Set all environment variables on your host.

---

## Contribution Guide

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature`
3. Make your changes (follow code style and add tests)
4. Commit and push: `git commit -m 'Add feature' && git push origin feature/your-feature`
5. Open a pull request
6. Wait for review and feedback

---

## References & Further Reading
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Express Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Pug Documentation](https://pugjs.org/api/getting-started.html)
- [Stripe API Docs](https://stripe.com/docs/api)
- [Mapbox GL JS Docs](https://docs.mapbox.com/mapbox-gl-js/)
- [Helmet Security](https://helmetjs.github.io/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)

---

# Appendix: Detailed API Usage & Examples

## 1. Tours API: Full Example

### Create a Tour (Admin/Lead-Guide)
**Request:**
```
POST /api/v1/tours
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "The Mountain Biker",
  "duration": 7,
  "maxGroupSize": 10,
  "difficulty": "medium",
  "price": 1299,
  "summary": "A thrilling mountain biking adventure!",
  "description": "...",
  "startDates": ["2025-08-01", "2025-09-01"]
}
```
**Response:**
```
{
  "status": "success",
  "data": {
    "tour": {
      "_id": "...",
      "name": "The Mountain Biker",
      ...
    }
  }
}
```

### Get All Tours (with Filtering, Sorting, Pagination)
**Request:**
```
GET /api/v1/tours?difficulty=easy&sort=price&limit=5&page=2
```
**Response:**
```
{
  "status": "success",
  "results": 5,
  "data": { "tours": [ ... ] }
}
```

## 2. Users API: Full Example

### Signup
**Request:**
```
POST /api/v1/users/signup
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "test1234",
  "passwordConfirm": "test1234"
}
```
**Response:**
```
{
  "status": "success",
  "token": "...",
  "data": { "user": { ... } }
}
```

### Update Profile (with Photo Upload)
**Request:**
```
PATCH /api/v1/users/updateMe
Content-Type: multipart/form-data
Authorization: Bearer <token>

{ "name": "Jane D.", "photo": <file> }
```
**Response:**
```
{
  "status": "success",
  "data": { "user": { ... } }
}
```

## 3. Reviews API: Full Example

### Create Review
**Request:**
```
POST /api/v1/reviews
Content-Type: application/json
Authorization: Bearer <token>

{
  "review": "Amazing experience!",
  "rating": 5,
  "tour": "<tourId>"
}
```
**Response:**
```
{
  "status": "success",
  "data": { "review": { ... } }
}
```

## 4. Bookings API: Full Example

### Create Booking (via Stripe Webhook)
- Stripe sends a POST request to `/webhook-checkout` after successful payment.
- Booking is created automatically in the database.

---

# Code Style & Best Practices

- Use ES6+ syntax throughout
- Follow Airbnb and Prettier code style
- Use async/await for all async operations
- Centralize error handling
- Use environment variables for all secrets
- Modularize code: separate controllers, models, routes, utils
- Write clear, descriptive comments
- Use meaningful variable and function names

---

# Example: Adding a New Resource (FAQ)

1. Create a new model in `models/`
2. Create a controller in `controllers/`
3. Add a route in `routes/`
4. Register the route in `app.js`
5. Add tests and documentation

---

# Example: Customizing the Frontend

- Edit Pug templates in `views/`
- Update CSS in `public/css/style.css`
- Add or modify JS in `public/js/`
- Use Mapbox and Stripe as needed

---

# Example: Running in Production

1. Build frontend assets: `npm run build:js`
2. Set `NODE_ENV=production` in `config.env`
3. Start server: `npm run start:prod`
4. Use a process manager (PM2, forever) for reliability
5. Set up HTTPS and domain

---

# Example: Environment Variable Template

```
NODE_ENV=development
PORT=3000
DATABASE=mongodb+srv://<user>:<password>@cluster.mongodb.net/natours?retryWrites=true&w=majority
DATABASE_PASSWORD=yourpassword
JWT_SECRET=your-secret
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90
EMAIL_USERNAME=your-email-username
EMAIL_PASSWORD=your-email-password
EMAIL_HOST=your-smtp-host
EMAIL_PORT=2525
EMAIL_FROM=your@email.com
SENDGRID_USERNAME=apikey
SENDGRID_PASSWORD=your-sendgrid-key
STRIPE_SECRET_KEY=your-stripe-secret
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
```

---

# End of Documentation
