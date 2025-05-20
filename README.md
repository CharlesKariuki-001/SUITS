KenyaBespoke

KenyaBespoke is an elegant e-commerce platform for custom-tailored suits, offering a seamless shopping experience for men’s and women’s bespoke clothing. Built with a React + TypeScript frontend and a Laravel backend, it features a drag-and-drop cart, order tracking, admin dashboard, and newsletter subscriptions.

Table of Contents

Features
Screenshots
Tech Stack
Installation
Usage
API Endpoints
Contributing
License
Contact

Features

🛒 Interactive Cart: Add, remove, and reorder items with drag-and-drop.
✂️ Custom Tailoring: Design bespoke suits with personalized measurements.
📦 Order Tracking: Track orders using order ID and email/phone.
👩‍💼 Admin Dashboard: Manage orders and update statuses (admin login required).
📧 Newsletter: Subscribe for exclusive offers and updates.
🌐 Responsive Design: Optimized for desktop and mobile.

Screenshots



Homepage
Cart
Admin Dashboard








Tech Stack

Frontend: React, TypeScript, Vite, Tailwind CSS, Framer Motion, React Router, Axios
Backend: Laravel, PHP, MySQL
Tools: Git, GitHub, Vercel (frontend deployment), Heroku (backend deployment)

Installation
Prerequisites

Node.js (v18+)
PHP (v8.1+)
Composer
MySQL
Git

Frontend Setup

Navigate to the client directory:cd client


Install dependencies:npm install


Create a .env file in client/:VITE_API_URL=http://127.0.0.1:8000/api


Start the development server:npm run dev



Backend Setup

Navigate to the server directory:cd server


Install dependencies:composer install


Create a .env file in server/ (copy .env.example):DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=kenyabespoke
DB_USERNAME=root
DB_PASSWORD=root123


Generate an app key:php artisan key:generate


Run migrations:php artisan migrate


Start the Laravel server:php artisan serve



Database Setup

Ensure MySQL is running:net start mysql


Create the database:CREATE DATABASE kenyabespoke;



Usage

Open the frontend: http://localhost:5173.
Browse suits (/mens, /womens), design custom suits (/custom-tailoring), or manage cart (/cart).
Admin access: Log in at http://localhost:5173/admin (email: admin@kenyabespoke.com, password: admin123).
Subscribe to the newsletter on the homepage.

API Endpoints

POST /api/orders: Create an order.
GET /api/orders: List all orders (admin).
PATCH /api/orders/{id}: Update order status (admin).
GET /api/orders/track: Track an order.
POST /api/subscribe: Subscribe to the newsletter.

Contributing
Contributions are welcome! See CONTRIBUTING.md for guidelines.
License
This project is licensed under the MIT License. See LICENSE for details.
Contact

Author: Charles Kariuki
Email: mburucharly@gmail.com
GitHub: YourGitHubUsername

