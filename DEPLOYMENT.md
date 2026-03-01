# 🚀 Deployment Guide: Vercel + Supabase

Panduan lengkap untuk deploy Link Directory ke Vercel dengan database Supabase.

---

## 📋 Prerequisites

- Akun GitHub
- Akun Vercel (vercel.com)
- Akun Supabase (supabase.com)

---

## 1️⃣ Setup Supabase Database

### Langkah 1: Buat Project Baru
1. Buka [supabase.com](https://supabase.com)
2. Klik **"New Project"**
3. Isi form:
   - **Name**: `link-directory` (atau nama lain)
   - **Database Password**: Buat password yang kuat (simpan baik-baik!)
   - **Region**: Pilih region terdekat (Singapore untuk Indonesia)
4. Klik **"Create new project"**
5. Tunggu ± 2 menit sampai project selesai dibuat

### Langkah 2: Ambil Database URL
1. Di dashboard Supabase, klik **"Project Settings"** (icon gear)
2. Klik **"Database"** di sidebar
3. Scroll ke bagian **"Connection string"**
4. Pilih **"URI"** tab
5. Copy connection string, contoh:
   ```
   postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```
6. Ganti `[PASSWORD]` dengan password database yang kamu buat

### Langkah 3: Ambil Direct URL
1. Masih di halaman yang sama
2. Klik **"Transaction"** mode (bukan Session)
3. Copy connection string untuk direct connection:
   ```
   postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
   ```

---

## 2️⃣ Setup Vercel Deployment

### Langkah 1: Push ke GitHub
1. Buat repository baru di GitHub
2. Push kode project:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/[USERNAME]/[REPO-NAME].git
   git push -u origin main
   ```

### Langkah 2: Import ke Vercel
1. Buka [vercel.com](https://vercel.com)
2. Klik **"Add New..."** → **"Project"**
3. Klik **"Import Git Repository"**
4. Pilih repository yang baru dibuat
5. Klik **"Import"**

### Langkah 3: Configure Environment Variables
Di halaman konfigurasi Vercel:

1. Expand **"Environment Variables"** section
2. Tambahkan variabel berikut:

| Name | Value |
|------|-------|
| `DATABASE_URL` | Connection string dengan port **6543** (pooler) |
| `DIRECT_DATABASE_URL` | Connection string dengan port **5432** (direct) |
| `ADMIN_PASSWORD` | Password untuk akses admin (contoh: `mysecretpassword123`) |

Contoh:
```
DATABASE_URL=postgresql://postgres.abc123:MyP@ssw0rd@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
DIRECT_DATABASE_URL=postgresql://postgres.abc123:MyP@ssw0rd@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres
ADMIN_PASSWORD=mysecretpassword123
```

### Langkah 4: Deploy
1. Klik **"Deploy"**
2. Tunggu build selesai (± 1-2 menit)
3. Klik **"Continue to Dashboard"**
4. Website sudah live! 🎉

---

## 3️⃣ Setup Database Schema

### Option A: Via Vercel CLI
1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```
2. Login:
   ```bash
   vercel login
   ```
3. Link project:
   ```bash
   vercel link
   ```
4. Pull environment:
   ```bash
   vercel env pull .env.local
   ```
5. Push schema ke Supabase:
   ```bash
   # Ganti schema.prisma dengan PostgreSQL version
   cp prisma/schema.supabase.prisma prisma/schema.prisma
   
   # Generate Prisma Client
   bun run db:generate
   
   # Push schema ke database
   bun run db:push
   ```

### Option B: Via Local Development
1. Buat file `.env` di root project:
   ```env
   DATABASE_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres"
   DIRECT_DATABASE_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
   ADMIN_PASSWORD="your-password-here"
   ```
2. Ganti schema:
   ```bash
   cp prisma/schema.supabase.prisma prisma/schema.prisma
   ```
3. Push schema:
   ```bash
   bun run db:generate
   bun run db:push
   ```
4. Commit dan push ke GitHub:
   ```bash
   git add .
   git commit -m "Switch to Supabase PostgreSQL"
   git push
   ```
5. Vercel akan auto-deploy

---

## 4️⃣ Verifikasi Deployment

1. Buka URL website dari Vercel dashboard
2. Website harusnya sudah bisa diakses
3. Coba:
   - Klik tombol "Tambah"
   - Masukkan password (yang diset di `ADMIN_PASSWORD`)
   - Tambahkan link baru
   - Cek apakah data tersimpan

---

## 5️⃣ Custom Domain (Optional)

### Langkah 1: Tambah Domain di Vercel
1. Buka project di Vercel dashboard
2. Klik **"Settings"** → **"Domains"**
3. Masukkan domain kamu
4. Klik **"Add"**

### Langkah 2: Update DNS
1. Di dashboard domain provider (GoDaddy, Namecheap, dll)
2. Tambahkan DNS record sesuai instruksi Vercel:
   - **A Record** atau **CNAME**
3. Tunggu propagasi DNS (± 5-30 menit)

---

## 📁 File Changes untuk Supabase

### 1. `prisma/schema.prisma`
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_DATABASE_URL")
}

model Recommendation {
  id           String   @id @default(cuid())
  title        String
  url          String
  category     String
  categoryIcon String?
  imageUrl     String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@index([category])
  @@index([createdAt])
}
```

### 2. `package.json` - Tambah script deploy
```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "db:migrate:prod": "prisma migrate deploy"
  }
}
```

### 3. `.env.example` (untuk dokumentasi)
```env
DATABASE_URL="postgresql://..."
DIRECT_DATABASE_URL="postgresql://..."
ADMIN_PASSWORD="your-password"
```

---

## 🔧 Troubleshooting

### Error: "Can't reach database server"
- Cek apakah `DATABASE_URL` dan `DIRECT_DATABASE_URL` sudah benar
- Pastikan password tidak ada karakter khusus yang bikin error
- Cek apakah IP Vercel di-allow di Supabase (biasanya otomatis)

### Error: "Prisma Client could not be generated"
- Pastikan `postinstall` script ada di `package.json`
- Tambahkan `prisma generate` di build command Vercel

### Error: "P1001: Can't reach database server"
- Kemungkinan connection pooling issue
- Pastikan pakai port **6543** untuk `DATABASE_URL`
- Dan port **5432** untuk `DIRECT_DATABASE_URL`

### Website blank setelah deploy
- Cek logs di Vercel dashboard
- Pastikan semua environment variables sudah diset

---

## 💡 Tips

1. **Backup Database**: Supabase punya auto-backup harian di plan free
2. **Monitoring**: Gunakan Vercel Analytics untuk monitoring traffic
3. **Rate Limiting**: Tambahkan rate limiting di API untuk keamanan
4. **Change Password**: Ganti `ADMIN_PASSWORD` secara berkala

---

## 📞 Support

Jika ada masalah:
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)

---

Happy deploying! 🚀
