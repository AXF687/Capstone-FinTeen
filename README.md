# FinTeen Backend API

Backend API untuk aplikasi **FinTeen**, yaitu aplikasi manajemen keuangan pribadi yang membantu pengguna mengelola pemasukan, pengeluaran, target tabungan, serta mendapatkan insight keuangan otomatis.

---

# 🚀 Features

* **Authentication**

  * Register user
  * Login user (JWT Authentication)

* **Transaksi**

  * Tambah transaksi (pemasukan / pengeluaran)
  * Edit transaksi
  * Hapus transaksi
  * Lihat riwayat transaksi

* **Kalkulator Cicilan**

  * Simulasi cicilan berdasarkan:

    * total pinjaman
    * bunga tahunan
    * lama cicilan (bulan)

* **Target Tabungan**

  * Membuat target tabungan
  * Analisis apakah target realistis atau tidak
  * Tracking progress tabungan

* **Financial Analysis**

  * Total pemasukan
  * Total pengeluaran
  * Sisa saldo
  * Distribusi pengeluaran per kategori
  * Insight keuangan otomatis (FinTeen Insight)

---

# 🛠️ Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Swagger API Documentation

---

# 📂 Project Structure

```
src
 ├── controllers
 ├── middleware
 ├── models
 ├── routes
 ├── config
 └── app.js
```

---

# ⚙️ Installation

Clone repository

```
git clone -b backend-finteen https://github.com/AXF687/Capstone-FinTeen---Smart-Budgeting-for-Smarter-Future.git
```

Masuk ke folder project

```
cd Capstone-FinTeen---Smart-Budgeting-for-Smarter-Future
```

Install dependencies

```
npm install
```

---

# 🔑 Environment Variables

Buat file `.env`

```
PORT=9000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

---

# ▶️ Run the Server

Jalankan server dengan:

```
node src/app.js
```

atau jika menggunakan nodemon:

```
npm run dev
```

Server akan berjalan di:

```
http://localhost:9000
```

---

# 📘 API Documentation

Swagger documentation tersedia di:

```
http://localhost:9000/api-docs
```

---

# 📡 API Endpoints

## Authentication

```
POST /api/auth/register
POST /api/auth/login
```

## Transactions

```
POST   /api/transaksi
GET    /api/transaksi
PUT    /api/transaksi/:id
DELETE /api/transaksi/:id
```

## Hutang Calculator

```
POST   /api/hutang
GET    /api/hutang
GET    /api/hutang/:id
PUT    /api/hutang/:id
DELETE /api/hutang/:id
```

## Saving Target

```
POST   /api/target-tabungan
GET    /api/target-tabungan
GET    /api/target-tabungan/:id
PUT    /api/target-tabungan/:id
DELETE /api/target-tabungan/:id
```

## Financial Analysis

```
GET /api/analisis
```

Endpoint ini akan memberikan:

* Total pemasukan
* Total pengeluaran
* Saldo
* Distribusi pengeluaran
* Insight keuangan otomatis

---

# 👨‍💻 Author

FinTeen Backend API
