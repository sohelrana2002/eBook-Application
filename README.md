# 📚 eBook Application

A modern full-stack eBook platform where users can browse, search, and purchase books online, while admins can manage books, genres, tags, and orders.  
Built with **Next.js**, **Express.js**, **MongoDB**, and **Cloudinary**.

![Homepage](https://github.com/user-attachments/assets/df2591e8-22e4-482c-a26d-18ed599e7a2d)

---

## ✨ Features

### 👤 User Features
- Browse books by categories, genres, and tags
- Advanced search and filtering
- Detailed book pages with descriptions, reviews, and ratings
- Add books to cart and purchase securely
- Request new books
- AI-powered book assistant for recommendations
- User authentication (login/register)

### 👑 Admin Features
- Full CRUD for books, genres, tags, and orders
- Dashboard with order statistics and analytics
- Upload book covers and files to Cloudinary
- Manage user orders and update status

---

## 🌐 Live Demo

| **User Website** | **Admin Dashboard** |
|:---:|:---:|
| [Visit User Site](https://knowledgea-ebook.vercel.app) | [Visit Admin Panel](https://knowledgea-ebook-admin.vercel.app) |

---

## 📸 Screenshots

### 🔐 Authentication
![Login](https://github.com/user-attachments/assets/d843b099-9b1a-440b-a9e6-ae84b6d367ba)

### 📘 Core Pages

| **Featured Books Section** | **Book Detail Page** |
|:---:|:---:|
| ![Featured](https://github.com/user-attachments/assets/a2e04181-24f3-4822-bd7c-7ea2ce674547) | ![Book Page](https://github.com/user-attachments/assets/d53e45f0-b5d0-4f8e-b5c9-156b7ef132cc) |

| **Request a Book** | **Book Assistant (AI)** |
|:---:|:---:|
| ![Request](https://github.com/user-attachments/assets/0f3559d5-0a67-4c27-8c58-d374e008fabc) | ![Assistant](https://github.com/user-attachments/assets/6f04086a-c1d6-4ce6-9dfe-476f91e10a2d) |

### 📘 Admin Dashboard

| **Book Page** | **Requested Book** |
|:---:|:---:|
| ![Book Page](https://github.com/user-attachments/assets/02a0e4fd-aedd-4f04-85bb-ac19a6149a31) | ![Book Page](https://github.com/user-attachments/assets/2191a0f4-42ea-4ba3-b984-2e4c5ed7cb64) |

---

## 🛠️ Tech Stack

### **Frontend**
- [Next.js 14](https://nextjs.org/) – React framework with SSR
- [Tailwind CSS](https://tailwindcss.com/) – Utility-first styling
- [React Query](https://tanstack.com/query/latest) – Server-state management
- [Axios](https://axios-http.com/) – HTTP client
- [React Hook Form](https://react-hook-form.com/) – Form handling

### **Backend**
- [Node.js](https://nodejs.org/) – Runtime environment
- [Express.js](https://expressjs.com/) – REST API framework
- [MongoDB](https://www.mongodb.com/) – NoSQL database
- [Mongoose](https://mongoosejs.com/) – ODM for MongoDB
- [Cloudinary](https://cloudinary.com/) – Media storage and optimization
- [JWT](https://jwt.io/) – Authentication
- [Bcrypt](https://github.com/kelektiv/node.bcrypt.js) – Password hashing

---

## 🚀 Installation & Setup

### Prerequisites

Before getting started, make sure you have:

- Node.js (v18 or later)
- MongoDB (Local or Atlas)
- Cloudinary account

### 1. Clone the Repository

```bash
git clone https://github.com/sohelrana2002/eBook-Application.git
cd eBook-Application
```

### 2. Backend Setup

Navigate to the backend folder and install dependencies:

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory and add the required environment variables.

Start the development server:

```bash
npm run dev
```

### 3. Frontend (User) Setup

Navigate to the user frontend folder and install dependencies:

```bash
cd ../client
npm install
```

Create a `.env.local` file and add the required environment variables.

Start the development server:

```bash
npm run dev
```

### 4. Admin Panel Setup

Navigate to the admin panel folder and install dependencies:

```bash
cd ../admin
npm install
```

Create a `.env.local` file and add the required environment variables.

Start the development server:

```bash
npm run dev
```

---

## 🙏 Acknowledgements
- Next.js
- Tailwind CSS
- MongoDB
- Cloudinary
-All open-source libraries used

---

Made with by Sohel Rana
For any queries, feel free to open an issue or contact sohelrana110979@gmail.com.
