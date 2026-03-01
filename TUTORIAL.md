# 🚀 Tutorial Lengkap: Deploy Link Directory ke Vercel + Supabase

Panduan step-by-step dari nol sampai website live di internet.

---

## 📋 Yang Akan Kamu Pelajari

1. ✅ Persiapan Akun (GitHub, Vercel, Supabase)
2. ✅ Setup Database Supabase
3. ✅ Persiapan Project
4. ✅ Push ke GitHub
5. ✅ Deploy ke Vercel
6. ✅ Konfigurasi Environment Variables
7. ✅ Migrasi Database
8. ✅ Testing & Verifikasi
9. ✅ Custom Domain (Opsional)

---

## 📦 Prerequisites (Yang Perlu Disiapkan)

### 1. Akun GitHub
- Daftar di: https://github.com/signup
- Gratis, tidak perlu kartu kredit

### 2. Akun Vercel
- Daftar di: https://vercel.com/signup
- Pilih "Continue with GitHub" untuk mudah
- Gratis, tidak perlu kartu kredit

### 3. Akun Supabase
- Daftar di: https://supabase.com/sign-up
- Bisa pakai GitHub atau Google
- Gratis, tidak perlu kartu kredit

### 4. Software yang Diperlukan
- **Git**: https://git-scm.com/downloads
- **Node.js** (v18+): https://nodejs.org/
- **Bun** (opsional, lebih cepat): https://bun.sh/
- **Code Editor**: VS Code direkomendasikan

---

## 1️⃣ SETUP SUPABASE DATABASE

### Step 1.1: Buat Project Baru

1. Buka https://supabase.com
2. Klik tombol **"Start your project"** atau **"New Project"**
3. Jika diminta, buat organization baru (nama bebas, contoh: "My Projects")
4. Isi form pembuatan project:

```
┌─────────────────────────────────────────────────────────────┐
│  CREATE A NEW PROJECT                                        │
├─────────────────────────────────────────────────────────────┤
│  Name: link-directory                                        │
│  Database Password: [BUAT PASSWORD KUAT]                     │
│  ⚠️ SIMPAN PASSWORD INI! Nanti tidak bisa dilihat lagi       │
│                                                              │
│  Region: Southeast Asia (Singapore)                         │
│  Plan: Free                                                  │
└─────────────────────────────────────────────────────────────┘
```

5. Klik **"Create new project"**
6. Tunggu ± 2-3 menit sampai project ready

### Step 1.2: Dapatkan Connection String

1. Di dashboard Supabase, klik icon **gear** (Settings) di sidebar kiri
2. Klik **"Database"** di menu
3. Scroll ke bagian **"Connection string"**
4. Klik tab **"URI"**
5. Kamu akan melihat string seperti ini:

```
postgresql://postgres.xxxxxxxx:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

6. **Copy string tersebut** dan simpan di notepad

### Step 1.3: Dapatkan Direct Connection String

1. Masih di halaman yang sama
2. Di bagian "Connection string", ubah mode dari **"Transaction"** ke **"Session"**
3. Atau lihat di bagian bawah ada **"Connection info"**
4. Copy string dengan port **5432**:

```
postgresql://postgres.xxxxxxxx:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres
```

5. **Simpan kedua string** di notepad:
   - DATABASE_URL (port 6543) - untuk koneksi pooling
   - DIRECT_DATABASE_URL (port 5432) - untuk migrasi

### Step 1.4: Ganti [YOUR-PASSWORD]

Di kedua string tadi, ganti `[YOUR-PASSWORD]` dengan password database yang kamu buat di Step 1.1.

**Contoh:**
```
DATABASE_URL="postgresql://postgres.abc123def:MySecureP@ss123@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
DIRECT_DATABASE_URL="postgresql://postgres.abc123def:MySecureP@ss123@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
```

⚠️ **CATATAN:**
- `abc123def` adalah project reference (unik untuk setiap project)
- Password tidak boleh ada spasi
- Jika password ada karakter khusus, perlu di-encode

---

## 2️⃣ PERSIAPAN PROJECT

### Step 2.1: Download Project

Jika kamu mendapat project ini dalam bentuk ZIP atau folder:

```bash
# Buka terminal/command prompt
# Navigate ke folder project
cd link-directory

# Install dependencies
bun install
# atau jika pakai npm
npm install
```

### Step 2.2: Setup Local Environment

1. Buat file `.env` di root folder project
2. Isi dengan:

```env
# Database Supabase
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres"
DIRECT_DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# Admin Password untuk website
ADMIN_PASSWORD="password-kamu-yang-kuat"
```

3. Ganti dengan string yang kamu dapat dari Supabase

### Step 2.3: Ganti Schema untuk PostgreSQL

Project ini default menggunakan SQLite, perlu diubah untuk Supabase:

```bash
# Copy schema PostgreSQL
cp prisma/schema.supabase.prisma prisma/schema.prisma
```

Atau buka file `prisma/schema.prisma` dan ganti isinya dengan:

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

### Step 2.4: Generate Prisma Client

```bash
bun run db:generate
# atau
npm run db:generate
```

### Step 2.5: Push Schema ke Supabase

```bash
bun run db:push
# atau
npx prisma db push
```

Jika berhasil, kamu akan melihat output:
```
🚀 Your database is now in sync with your Prisma schema.
```

### Step 2.6: Test Local

```bash
bun run dev
# atau
npm run dev
```

Buka http://localhost:3000 dan pastikan website berjalan dengan baik.

---

## 3️⃣ PUSH KE GITHUB

### Step 3.1: Buat Repository Baru

1. Buka https://github.com/new
2. Isi form:

```
Repository name: link-directory
Description: Kumpulan link apapun
Visibility: Public (atau Private jika mau)
```

3. **JANGAN** centang "Add a README file"
4. **JANGAN** centang "Add .gitignore"
5. **JANGAN** pilih "Choose a license"
6. Klik **"Create repository"**

### Step 3.2: Initialize Git di Local

```bash
# Pastikan di folder project
cd link-directory

# Initialize git
git init

# Add semua file
git add .

# Commit pertama
git commit -m "Initial commit: Link Directory app"
```

### Step 3.3: Push ke GitHub

Ganti `USERNAME` dengan username GitHub kamu:

```bash
# Add remote
git remote add origin https://github.com/USERNAME/link-directory.git

# Set branch ke main
git branch -M main

# Push ke GitHub
git push -u origin main
```

Jika diminta login:
- Gunakan Personal Access Token (PAT), bukan password
- Buat PAT di: GitHub > Settings > Developer settings > Personal access tokens

---

## 4️⃣ DEPLOY KE VERCEL

### Step 4.1: Import Project

1. Buka https://vercel.com
2. Klik **"Add New..."** > **"Project"**
3. Klik **"Import Git Repository"**
4. Jika belum connect, klik **"Connect GitHub Account"**
5. Pilih repository `link-directory`
6. Klik **"Import"**

### Step 4.2: Configure Project

Di halaman "Configure Project":

**Framework Preset:**
- Pilih **Next.js**

**Root Directory:**
- Biarkan `./`

**Build Command:**
- Biarkan default: `next build`

**Output Directory:**
- Biarkan default: `.next`

**Install Command:**
- Biarkan default: `npm install` atau `bun install`

### Step 4.3: Set Environment Variables

Di bagian **"Environment Variables"**, tambahkan 3 variabel:

**Variable 1:**
```
Name:  DATABASE_URL
Value: postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

**Variable 2:**
```
Name:  DIRECT_DATABASE_URL
Value: postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
```

**Variable 3:**
```
Name:  ADMIN_PASSWORD
Value: password-kamu-yang-kuat
```

⚠️ **PENTING:**
- Pastikan tidak ada spasi di awal/akhir value
- Pastikan password sudah diganti dari `[YOUR-PASSWORD]`
- Jangan ada quote di sekitar value

### Step 4.4: Deploy

1. Klik tombol **"Deploy"**
2. Tunggu build process (± 1-3 menit)
3. Kamu akan melihat:
   - "Building" 
   - "Deploying"
   - "Ready" ✓

4. Klik **"Continue to Dashboard"**

---

## 5️⃣ POST-DEPLOYMENT SETUP

### Step 5.1: Verifikasi Website

1. Di Vercel Dashboard, klik URL project (contoh: `link-directory.vercel.app`)
2. Website harusnya sudah bisa diakses
3. Coba fitur:
   - ✅ Lihat halaman utama
   - ✅ Klik tombol "Tambah"
   - ✅ Masukkan password
   - ✅ Tambah link baru
   - ✅ Hapus link

### Step 5.2: Cek Logs (Jika Error)

Jika ada error:

1. Di Vercel Dashboard, klik tab **"Deployments"**
2. Klik deployment terbaru
3. Klik tab **"Functions"** atau **"Logs"**
4. Lihat error messages

### Step 5.3: Run Database Migration

Jika website error terkait database:

**Option A: Via Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Pull environment variables
vercel env pull .env.local

# Run migration
npx prisma db push
```

**Option B: Via Local**

```bash
# Pastikan .env sudah benar
# Run migration
bun run db:push
```

---

## 6️⃣ CUSTOM DOMAIN (OPSIONAL)

### Step 6.1: Beli Domain

Beli domain dari:
- Namecheap: https://namecheap.com
- GoDaddy: https://godaddy.com
- Google Domains: https://domains.google
- Cloudflare: https://cloudflare.com

### Step 6.2: Add Domain ke Vercel

1. Di Vercel Dashboard, klik project
2. Klik **"Settings"** > **"Domains"**
3. Masukkan domain (contoh: `mylinks.com`)
4. Klik **"Add"**

### Step 6.3: Configure DNS

Vercel akan memberikan DNS records yang perlu ditambahkan:

**Jika menggunakan subdomain (contoh: links.mydomain.com):**
```
Type: CNAME
Name: links
Value: cname.vercel-dns.com
```

**Jika menggunakan apex domain (contoh: mydomain.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

### Step 6.4: Update DNS di Domain Provider

1. Login ke dashboard domain provider
2. Masuk ke **DNS Management** atau **DNS Settings**
3. Tambahkan record sesuai instruksi Vercel
4. Simpan

### Step 6.5: Tunggu Propagasi

- DNS propagasi butuh 5 menit - 48 jam
- Biasanya 5-30 menit sudah selesai
- Cek status di Vercel Dashboard > Domains

---

## 7️⃣ TROUBLESHOOTING

### Error: "Can't reach database server"

**Penyebab:**
- Connection string salah
- Password salah
- IP tidak di-allow

**Solusi:**
1. Cek ulang connection string
2. Pastikan password benar
3. Di Supabase, cek: Settings > Database > Connection pooling = enabled

### Error: "Prisma Client could not be generated"

**Solusi:**
```bash
# Di local
bun run db:generate

# Commit dan push
git add .
git commit -m "Regenerate Prisma Client"
git push
```

### Error: "Build failed"

**Solusi:**
1. Cek build logs di Vercel
2. Pastikan semua dependencies terinstall
3. Coba hapus `node_modules` dan reinstall:
```bash
rm -rf node_modules
bun install
```

### Website Blank / White Screen

**Solusi:**
1. Buka browser console (F12)
2. Lihat error messages
3. Cek environment variables di Vercel

### Error: "P1001: Can't reach database"

**Solusi:**
1. Pastikan pakai port yang benar:
   - `DATABASE_URL` = port 6543
   - `DIRECT_DATABASE_URL` = port 5432
2. Pastikan connection pooling aktif di Supabase

---

## 8️⃣ ENVIRONMENT VARIABLES CHECKLIST

Pastikan semua variables sudah diset di Vercel:

```
✅ DATABASE_URL
   Format: postgresql://postgres.[REF]:[PASS]@...pooler.supabase.com:6543/postgres
   
✅ DIRECT_DATABASE_URL  
   Format: postgresql://postgres.[REF]:[PASS]@...pooler.supabase.com:5432/postgres
   
✅ ADMIN_PASSWORD
   Format: terserah (minimal 6 karakter recommended)
```

---

## 9️⃣ TIPS & BEST PRACTICES

### Keamanan
- ✅ Ganti ADMIN_PASSWORD secara berkala
- ✅ Gunakan password yang kuat (campuran huruf, angka, simbol)
- ✅ Jangan commit file `.env` ke GitHub
- ✅ Aktifkan 2FA di GitHub, Vercel, dan Supabase

### Performance
- ✅ Supabase sudah otomatis backup harian (free tier)
- ✅ Connection pooling mengoptimalkan performa
- ✅ Vercel punya CDN global otomatis

### Monitoring
- ✅ Gunakan Vercel Analytics (gratis)
- ✅ Cek Supabase logs untuk query performance
- ✅ Set up alerts di Vercel untuk deployment failures

---

## 🔗 LINKS PENTING

- **Supabase Dashboard**: https://supabase.com/dashboard
- **Vercel Dashboard**: https://vercel.com/dashboard
- **GitHub**: https://github.com
- **Prisma Docs**: https://prisma.io/docs
- **Next.js Docs**: https://nextjs.org/docs

---

## 📞 BUTUH BANTUAN?

Jika mengalami masalah:

1. **Vercel Status**: https://vercel-status.com
2. **Supabase Status**: https://status.supabase.com
3. **GitHub Status**: https://githubstatus.com
4. **Stack Overflow**: Tag `vercel`, `supabase`, `next.js`

---

## ✅ CHECKLIST FINAL

Sebelum menganggap selesai, pastikan:

```
✅ Supabase project sudah dibuat
✅ Database schema sudah di-push
✅ Project sudah di-push ke GitHub
✅ Vercel project sudah dibuat
✅ Environment variables sudah diset
✅ Website bisa diakses
✅ Bisa tambah link baru
✅ Bisa hapus link
✅ Password admin sudah diganti dari default
```

---

Selamat! 🎉 Website Link Directory kamu sudah live di internet!

Share URL website kamu dengan teman-teman. Mereka bisa:
- Melihat semua link yang sudah ditambahkan
- Menambahkan link baru (dengan password)
- Menghapus link (dengan password)

Happy deploying! 🚀
