# RatingWeb - Store Rating Application

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
</p>

## 🌟 About the Project

RatingWeb is a full-stack web application that allows users to rate and review stores. It provides a platform for customers to share their experiences and for store owners to get feedback and improve their services. The application features a modern, glossy, and responsive design inspired by iOS 18, with a beautiful dark mode and glassmorphism effects.

## ✨ Features

- **User Authentication:** Secure user registration and login with JWT authentication.
- **Role-Based Access Control:** Different roles for Normal Users, Store Owners, and System Administrators.
- **Store Ratings:** Users can rate stores on a scale of 1 to 5.
- **Dashboards:** Separate dashboards for each user role with relevant statistics and information.
- **Admin Dashboard:** System Administrators can manage users and stores, and view overall statistics.
- **Store Owner Dashboard:** Store Owners can view ratings and statistics for their own store.
- **User Dashboard:** Normal Users can view and manage their ratings.
- **Modern UI/UX:** A beautiful and responsive UI with a dark mode and glossy, glassmorphism effects.

## 🚀 Live Demo

A live demo of the application is not available at the moment.

## 🛠️ Tech Stack

- **Frontend:**
  - React
  - Vite
  - React Router
  - Axios
  - TanStack Table
  - JWT Decode

- **Backend:**
  - Node.js
  - Express.js
  - MySQL2
  - bcrypt
  - jsonwebtoken
  - cors
  - dotenv

## 🏁 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v14 or later)
- npm
- MySQL

### Installation

1.  **Clone the repository:**

    ```sh
    git clone <repository-url>
    cd <repository-folder>
    ```

2.  **Install frontend dependencies:**

    ```sh
    cd frontend
    npm install
    ```

3.  **Install backend dependencies:**

    ```sh
    cd ../backend
    npm install
    ```

4.  **Set up environment variables:**

    Create a `.env` file in the `backend` directory and add the following variables:

    ```env
    DB_HOST=your_database_host
    DB_USER=your_database_user
    DB_PASSWORD=your_database_password
    DB_NAME=your_database_name
    ACCESS_TOKEN_SECRET=your_jwt_secret
    ```

5.  **Set up the database:**

    Connect to your MySQL server and run the SQL script located at `backend/database.sql` to create the necessary tables.

## 🏃‍♀️ Usage

1.  **Start the backend server:**

    ```sh
    cd backend
    npm start
    ```

2.  **Start the frontend development server:**

    ```sh
    cd ../frontend
    npm run dev
    ```

    The application will be available at `http://localhost:5173`.

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📧 Contact

For any questions or feedback, please open an issue in the GitHub repository.
