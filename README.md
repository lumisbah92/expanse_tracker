## Overview
This project is a full-stack expense tracker application designed to help users manage their expenses efficiently. It includes both a frontend and a backend with robust features such as secure authentication, real-time data visualization, and comprehensive data management. The application is built with modern technologies to ensure scalability, maintainability, and a responsive user experience.

## Features

### Frontend
- **Authentication:**
  - Secure login with token-based authentication.
  - Auth state managed using Context API and LocalStorage.
  - Route protection to ensure unauthorized users cannot access restricted pages.
- **Expense Management:**
  - Data table displaying real-time API data.
  - Pagination, search, and filtering functionalities.
  - A summary of expenses with a comparison to the previous week.
  - Expense Stats with interactive charts using ApexCharts.
- **Form Handling:**
  - Error handling for form data using zod.
- **UI and Styling:**
  - Developed with React.js and TypeScript.
  - Styled using Tailwind CSS.

### Backend
- **API Server:**
  - Built with Node.js and Express.js.
  - Data persistence using PostgreSQL.
  - Database operations managed via Sequelize ORM.
  - Developed in TypeScript for improved reliability and scalability.

## Tech Stack

### Frontend
- React.js
- TypeScript
- Context API & LocalStorage
- Tailwind CSS
- zod (for form data error handling)
- ApexCharts (for data visualization)

### Backend
- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- REST API
- TypeScript

## Project Structure
The project is divided into two main parts:

- **Frontend:** Contains the user interface, authentication logic, expense summary, expense stats using interactive charts, and expense data display.
- **Backend:** Provides the API endpoints for authentication, expense management, and handles database operations.

## Getting Started

### Frontend Setup
1. Navigate to the frontend directory:
```bash
  cd frontend
```
2. Install dependencies:
```bash
  npm install
```
3. Start the development server:
```bash
  npm run dev
```

### Backend Setup
1. Navigate to the backend directory:
```bash
  cd backend
```
2. Install dependencies:
```bash
  npm install
```
3. Start the development server:
```bash
  npm run start
```

## User Credential
For better visualization of the data, you can use the following credential:
```bash
dummy@example.com
dummyPassword
```

## Contact
For any questions or issues, feel free to reach out at [lumisbah92@gmail.com](mailto:lumisbah92@gmail.com).


