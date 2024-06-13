# Recollections

Recollections is a simple single-page post-sharing website similar to Facebook. Users can sign in, upload posts with a picture, title, description, and tags. Users can also like, share, and delete posts. This project is built using the MERN stack, Tailwind CSS, Babel for server-side rendering (SSR), and JWT authentication.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Authentication**: Sign in using JWT authentication.
- **Post Creation**: Upload a post with a picture, title, description, and tags.
- **Post Management**: Like, share, and delete posts.
- **Responsive Design**: Built with Tailwind CSS for a mobile-first responsive design.

## Tech Stack

- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Server-Side Rendering**: Babel

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14.0.0 or later)
- npm or yarn
- MongoDB

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/recollections.git
   cd recollections
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up the backend server:
   ```bash
   cd backend
   npm install
   ```

## Environment Variables

Create a `.env` file in the `backend` directory and add the following environment variables:

```env
MONGO_URI="your-mongodb-uri"
JWT_SECRET="your-jwt-secret"
PORT=5000
```

## Contributing

Contributions are welcome! Please follow these steps:

    Fork the repository.
    Create a new branch (git checkout -b feature-branch).
    Make your changes.
    Commit your changes (git commit -m 'Add some feature').
    Push to the branch (git push origin feature-branch).
    Create a Pull Request.
