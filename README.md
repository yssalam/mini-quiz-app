Mini Quiz App — React
Deskripsi

Mini Quiz App adalah aplikasi web berbasis React untuk mengerjakan quiz secara online.
Aplikasi mendukung mode Mock API untuk development dan Real API untuk production, sehingga tetap berjalan meskipun API mengalami kendala (misalnya CORS).

Cara Menjalankan Project
1. Clone Repository
git clone https://github.com/username/nama-repo.git
cd nama-repo

2. Install Dependency
npm install

3. Konfigurasi Environment

Buat file .env di root project:

VITE_API_BASE_URL=https://apiquiz.ambisiusacademy.com/api/v1
VITE_USE_MOCK=true 

Variable		Keterangan
VITE_API_BASE_URL	Base URL backend API
VITE_USE_MOCK		true = Mock API, false = Real API

Perubahan .env memerlukan restart dev server.

4. Jalankan Aplikasi
npm run dev

Aplikasi berjalan di:

http://localhost:5173

Struktur Folder
src/
├── assets/              # Asset statis (gambar, icon, ilustrasi)
├── components/
│   ├── common/          # Reusable components 
│   ├── layout/          # Layout utama (Navbar, Footer)
│   └── quiz/            # Komponen khusus quiz (QuizList, QuestionCard)
├── hooks/               # Custom React hooks (auth, quiz, dll)
├── library/             # Helper library / third-party wrapper
├── pages/
│   ├── auth/            # Halaman autentikasi (Login, Register)
│   ├── profile/         # Halaman profile & change password
│   └── quiz/            # Halaman quiz (start, active, result)
├── services/            # API services (auth, quiz, mock & real API)
├── store/               # Global state management (jika diperlukan)
├── utils/               # Constants, helper functions



Keputusan Teknis

. Framework: React + Vite

. Routing: react-router-dom

. State Management: React Hooks (useState, useEffect)

. Authentication:

	. Token disimpan di localStorage

	. Axios interceptor untuk inject token & handle 401

. Mock API:

	. Digunakan saat development

	. Data quiz & session disimpan di localStorage

. UI: Tailwind CSS (mobile-first)


Demo Flow (User Journey)

. User melakukan Register / Login

. Masuk ke Dashboard

. Memilih quiz

. Mengerjakan quiz dengan timer

. Submit quiz dan melihat hasil

. Logout