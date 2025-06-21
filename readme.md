# 🏍️ Mini E-Commerce Website

A simple full-stack e-commerce site built using **HTML, CSS, JavaScript (frontend)** and **Node.js + Express + MongoDB (backend)**.

Live GitHub Repo: [https://github.com/Devadevan-B-P/awswebpage](https://github.com/Devadevan-B-P/awswebpage)

---

## ✅ Features

* User signup & login with JWT
* Contact form data saved to MongoDB
* Auth-guarded product purchase flow
* Responsive product showcase using TailwindCSS
* Admin panel to upload product details
* Product images uploaded to AWS S3 via multer-s3
* Orders are saved to MongoDB
* Products dynamically loaded from the database

---

## ⚙️ How to Run This Project

### 📦 Prerequisites

Make sure your system has the following installed:

* [Node.js](https://nodejs.org/) (v18+ recommended)
* [MongoDB](https://www.mongodb.com/) (local or [Atlas](https://www.mongodb.com/cloud/atlas) cloud instance)

---

### 🧑‍💻 1. Clone the Repo

```bash
git clone https://github.com/Devadevan-B-P/awswebpage.git
cd awswebpage
```

---

### 📁 2. Install Dependencies

```bash
npm install
```

---

### 🔐 3. Set up Environment Variables

Create a `.env` file in the root folder:

mongodb credentials
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

IAM user credentials
```
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_BUCKET_NAME=your_s3_bucket_name
```

> ❗️ **Never commit your `.env` file to GitHub.**
> ✅ Instead, provide a `.env.example` if sharing the project.
> Both should be in same .env file 
---

### ▶️ 4. Start the Backend Server

```bash
node server.js
```

Or with hot-reload (dev mode):

```bash
npx nodemon server.js
```

---

### 🌐 5. Access the App in Browser

```
http://localhost:5000
```

---

## 📂 Folder Structure

```
awswebpage/
├── public/             # Static HTML, CSS, JS (frontend)
│   ├── protected/      # Auth-protected pages (home.html, admin.html)
├── models/             # Mongoose models (user.js, contact.js, order.js, product.js)
├── routes/             # API routes (auth.js, contact.js, order.js, product.js, upload.js)
├── server.js           # Main Express app entry point
├── .env                # Secret credentials (excluded from repo)
├── package.json        # Project metadata and dependencies
├── .gitignore          # Files/folders excluded from Git
```

---

## 📬 Contact & Product Flow Features

### 📝 Contact Form Integration

When a user fills the contact form, their **name, email, phone, subject**, and **message** are stored in **MongoDB**.

On pressing **"Buy Now"**, the app checks:

* ✅ If contact info exists → Redirect to `pay.html`
* ❌ If not → Redirect to `contact.html`

---

### 🛒 Product & Order Flow

* Products are dynamically fetched from MongoDB.
* Clicking **Buy Now** records the product and user info into the **orders** collection.
* Orders are saved with user session and timestamp for tracking.

---

### 🛠️ Admin Product Upload

* Admin must log in to access `admin.html`.
* Admin can upload:

  * 📦 Product name
  * 💰 Price
  * 🖼️ Image (uploaded to **AWS S3**)
  * 🧾 Description
* Products appear instantly on the homepage after upload.

---

## 🤝 Contributing

Want to collaborate?

1. Fork this repo
2. Clone your fork
3. Create a new branch
4. Make your changes
5. Push & open a pull request

---

## 📃 License

MIT License

---

