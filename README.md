# 💸 FinTeen - Smart Budgeting Untuk Anak Muda

**FinTeen** adalah aplikasi pencatatan keuangan pintar yang dirancang khusus untuk generasi muda (pelajar, mahasiswa, dan pekerja muda). Aplikasi ini membantu pengguna membangun kebiasaan finansial yang sehat dengan melacak arus kas, merencanakan tabungan, menyimulasikan beban hutang, dan menganalisis pengeluaran melalui antarmuka yang modern, responsif, dan intuitif.

---

## ✨ Fitur Utama (Key Features)

Aplikasi ini tidak hanya sekadar mencatat angka, tetapi dilengkapi dengan sistem keamanan dan alur pengguna (*User Flow*) sekelas aplikasi *Startup* profesional:

* 🔐 **Autentikasi Pintar & Berlapis (Smart Auth):**
  * Pendaftaran akun dengan sistem verifikasi kode **OTP via Email**.
  * Integrasi *Single Sign-On* (SSO) menggunakan **Google OAuth** untuk akses instan.
  * Pemulihan akun (*Forgot Password*) dengan tautan *reset* aman via email.
  * **Smart Protected Routing:** Sistem penjaga rute berlapis yang secara cerdas mendeteksi kelengkapan data pengguna (memaksa pengguna baru mengisi saldo awal sebelum bisa mengakses *Dashboard*).
* 👤 **Manajemen Profil Aman:** Pengaturan identitas pengguna, status pekerjaan, dan target menabung bulanan. (Dilengkapi dengan proteksi penguncian email permanen untuk integritas data).
  ![alt text](https://github.com/AXF687/Capstone-FinTeen/blob/developV2/frontend-finteen/public/ss1.png?raw=true)
* 📊 **Dashboard Interaktif:** Ringkasan total saldo, arus kas bulanan, dan progres keuangan sekilas pandang.
  ![alt text](https://github.com/AXF687/Capstone-FinTeen/blob/developV2/frontend-finteen/public/ss2.png?raw=true)
* 💸 **Manajemen Transaksi:** Pencatatan pemasukan dan pengeluaran harian dengan kategorisasi yang jelas.
  ![alt text](https://github.com/AXF687/Capstone-FinTeen/blob/developV2/frontend-finteen/public/ss3.png?raw=true)
* 🏦 **Simulasi Hutang:** Fitur kalkulasi cerdas untuk menyimulasikan skema pinjaman atau cicilan. Membantu pengguna merencanakan pelunasan dan memahami estimasi beban finansial bulanan sebelum mengambil keputusan hutang.
  ![alt text](https://github.com/AXF687/Capstone-FinTeen/blob/developV2/frontend-finteen/public/ss4.png?raw=true)
* 🎯 **Target Tabungan:** Pembuatan *goals* atau impian finansial beserta pelacakan progres pengumpulannya.
  ![alt text](https://github.com/AXF687/Capstone-FinTeen/blob/developV2/frontend-finteen/public/ss5.png?raw=true)
* 📈 **Analisis Finansial:** Laporan dan grafik visual untuk melihat kebiasaan pengeluaran selama periode tertentu.
  ![alt text](https://github.com/AXF687/Capstone-FinTeen/blob/developV2/frontend-finteen/public/ss6.png?raw=true)

---

## 🛠️ Teknologi & Library yang Digunakan

Proyek *Frontend* ini dibangun menggunakan ekosistem React modern untuk memastikan performa maksimal, *bundle size* yang ringan, dan *Developer Experience* (DX) yang sangat baik:

### ⚡ Core Framework & Build Tool
* **[React.js](https://react.dev/) (v18):** *Library* utama untuk membangun antarmuka pengguna interaktif berbasis komponen.
* **[Vite](https://vitejs.dev/):** *Build tool* dan *development server* generasi baru yang memberikan waktu *Hot Module Replacement* (HMR) super cepat.

### 🔀 Routing & State Management
* **[React Router DOM](https://reactrouter.com/):** Digunakan untuk navigasi *Single Page Application* (SPA) dan proteksi rute halaman (*Private/Guest Routes*).
* **[Zustand](https://github.com/pmndrs/zustand):** *Global State Management* yang minimalis dan sangat cepat untuk mengelola status autentikasi (`isAuthenticated`), token, dan data pengguna secara terpusat.

### 🎨 UI, Styling, & Komponen
* **[Tailwind CSS](https://tailwindcss.com/):** *Framework* utilitas CSS untuk *styling* yang responsif dan dukungan **Dark Mode** penuh yang mulus.
* **[Shadcn UI](https://ui.shadcn.com/) & [Radix UI](https://www.radix-ui.com/):** Koleksi komponen UI *headless* yang sangat *customizable* (seperti Card, Button, Input, Label) dengan aksesibilitas standar tinggi.
* **[Lucide React](https://lucide.dev/):** Pustaka ikon SVG yang bersih, konsisten, dan ringan.

### 🔌 Interaksi API & Utilities
* **[Axios](https://axios-http.com/):** *HTTP Client* yang dikonfigurasi secara khusus (*custom instance*) untuk menangani *timeout*, mengirim *credentials* (cookies), dan berkomunikasi dengan *Backend* RESTful API.
* **[Sonner](https://sonner.emilkowal.ski/):** Pustaka notifikasi (*toast*) elegan dengan fitur *anti-spam ID* untuk memberikan *feedback* visual yang rapi kepada pengguna (misal: sukses *login* atau OTP salah).

---

## ⚙️ Petunjuk Setup Environment (.env)

Untuk menjalankan proyek *Backend* ini secara lokal, Anda harus mengonfigurasi *Environment Variables*. 

Buatlah sebuah file baru bernama `.env` di *root directory* (folder paling luar) proyek ini. Kemudian, salin format di bawah ini dan isi nilainya sesuai dengan kredensial lokal atau server Anda.

> **⚠️ PERINGATAN KEAMANAN:** File `.env` memuat informasi rahasia (*secret keys*, *passwords*, *database URI*). Pastikan file `.env` sudah masuk ke dalam `.gitignore` agar tidak ikut ter-*push* ke repositori publik!

### Daftar Variabel Environment

| Nama Variabel | Deskripsi & Kegunaan | Contoh Nilai / Default |
| :--- | :--- | :--- |
| **Konfigurasi Server & Database** | | |
| `PORT` | *Port* tempat *server backend* berjalan secara lokal. | `9000` |
| `MONGO_URI` | *Connection string* untuk terhubung ke *database* MongoDB (Atlas atau Local). | `mongodb://<username>:<password>@cluster.mongodb.net...` |
| `JWT_SECRET` | Kunci rahasia (*secret key*) acak untuk enkripsi dan verifikasi token autentikasi. | `isi_dengan_string_acak_yang_panjang` |
| `FRONTEND_URL` | URL tempat aplikasi *frontend* berjalan (digunakan untuk CORS dan *redirect*). | `http://localhost:5173` |
| **Konfigurasi SMTP (Email Service)** | *Digunakan untuk mengirim OTP & Reset Password* | |
| `SMTP_HOST` | Host server SMTP penyedia layanan email. | `mail.kulijowo.com` |
| `SMTP_PORT` | Port server SMTP (biasanya 465 untuk SSL atau 587 untuk TLS). | `465` |
| `SMTP_EMAIL` | Alamat email yang digunakan untuk autentikasi server SMTP. | `finteen@domainanda.com` |
| `SMTP_PASSWORD` | *Password* dari akun email SMTP tersebut. | `password_email_anda` |
| `FROM_NAME` | Nama pengirim yang akan muncul di kotak masuk pengguna. | `"FinTeen Support"` |
| `FROM_EMAIL` | Alamat email pengirim yang terlihat oleh pengguna. | `"finteen@domainanda.com"` |
| **Konfigurasi Google OAuth (SSO)** | *Digunakan untuk fitur Login/Register with Google* | |
| `GOOGLE_CLIENT_ID` | *Client ID* yang didapatkan dari Google Cloud Console. | `12400...apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | *Client Secret* yang didapatkan dari Google Cloud Console. | `GOCSPX-...` |
| `GOOGLE_CALLBACK_URL` | URL *endpoint backend* yang dituju setelah pengguna berhasil otorisasi Google. | `http://localhost:9000/api/auth/google/callback` |

---

### Contoh File `.env` (Template)
Salin teks di bawah ini ke dalam file `.env` Anda dan ganti nilai di dalam kurung siku `<...>`:

```env
# SERVER & DATABASE
PORT=9000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_very_strong_jwt_secret_key

FRONTEND_URL=http://localhost:5173

# SMTP MAILER (Email OTP)
SMTP_HOST=mail.kulijowo.com
SMTP_PORT=465
SMTP_EMAIL=finteen@kulijowo.com
SMTP_PASSWORD=your_email_password

FROM_NAME="FinTeen Support"
FROM_EMAIL="finteen@kulijowo.com"

# GOOGLE OAUTH 2.0
GOOGLE_CLIENT_ID=124004066129-e3gu2e463s1sdpelsb3jtr95qcoac674.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:9000/api/auth/google/callback

---
```

## 🚀 Cara Menjalankan Project

### 1. Clone Repository
Clone repository dari GitHub:

```bash
git clone https://github.com/AXF687/Capstone-FinTeen.git
```

Atau download file ZIP lalu extract.

---

### 2. Masuk ke Folder Project
```bash
cd Capstone-FinTeen
```

---

### 3. Install Dependencies

Karena project terdiri dari **frontend** dan **backend**, maka install dilakukan **secara terpisah**.

#### 🔹 Backend
```bash
cd backend-finteen
npm install
```

#### 🔹 Frontend
Buka terminal baru atau kembali ke root:
```bash
cd frontend-finteen
npm install
```

---

### 4. Menjalankan Project

#### 🔹 Jalankan Backend
```bash
cd backend-finteen
npm run dev
```
atau
```bash
npm start
```

#### 🔹 Jalankan Frontend
```bash
cd frontend-finteen
npm run dev
```

---

### 5. Akses Aplikasi

- Frontend: biasanya di `http://localhost:5173`
- Backend: biasanya di `http://localhost:9000`

---

## ⚠️ Catatan

- Pastikan Node.js sudah terinstall
- Jalankan frontend & backend di terminal yang berbeda
- Jika ada file `.env`, pastikan sudah dikonfigurasi dengan benar

---

## ❓ FAQ

### Apakah `npm install` otomatis untuk frontend dan backend?

Tidak. Perintah `npm install` hanya berlaku untuk folder tempat perintah tersebut dijalankan.

Jadi, kamu harus menjalankan:
- `npm install` di folder **backend-finteen**
- `npm install` di folder **frontend-finteen**

---



