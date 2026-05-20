// ============================================
// FILE: students.ts
// FUNGSI: Menyimpan data semua siswa kelas 8B
// CARA EDIT: Ganti nama, nomor absen, dan jabatan sesuai data asli
// ============================================

// Interface/tipe data untuk setiap siswa
// Ini mendefinisikan struktur data yang harus diikuti
export interface Student {
  id: number;           // ID unik untuk setiap siswa (untuk React key)
  noAbsen: number;      // Nomor absen siswa (1-31)
  nama: string;         // Nama lengkap siswa
  gender: "L" | "P";    // Jenis Kelamin (L/P)
  jabatan?: string;     // Jabatan di kelas (opsional, pakai ? artinya boleh kosong)
  foto: string;         // Path ke foto siswa (nanti ganti dengan foto asli)
}

// Array berisi data semua 31 siswa
// DUMMY DATA - Ganti dengan data asli nanti!
export const students: Student[] = [
  { id: 1, noAbsen: 1, nama: "ADRIAN KHALFANI ANGGARA", gender: "L", foto: "/images/students/default.png" },
  { id: 2, noAbsen: 2, nama: "AFIDA RIZQY PUTRI ARROFI", gender: "P", jabatan: "Ketua Kelas", foto: "/images/students/default.png" },
  { id: 3, noAbsen: 3, nama: "AFIFAH AULIA PUTRI", gender: "P", foto: "/images/students/default.png" },
  { id: 4, noAbsen: 4, nama: "ALBERT MELVIN MAHARDIKA", gender: "L", foto: "/images/students/default.png" },
  { id: 5, noAbsen: 5, nama: "ANINDYA ARLIN WULANDARI", gender: "P", foto: "/images/students/default.png" },
  { id: 6, noAbsen: 6, nama: "ANUGRA WAHYU SYAHPUTRA", gender: "L", foto: "/images/students/default.png" },
  { id: 7, noAbsen: 7, nama: "ARGISEL SHALUM PUTRI NABINT", gender: "P", foto: "/images/students/default.png" },
  { id: 8, noAbsen: 8, nama: "AURA VALENSYA AZKA", gender: "P", foto: "/images/students/default.png" },
  { id: 9, noAbsen: 9, nama: "BACILA LAURENCE RAMADHANI", gender: "P", jabatan: "Wakil Ketua", foto: "/images/students/default.png" },
  { id: 10, noAbsen: 10, nama: "Bunga Ramadhani", gender: "P", jabatan: "Sekretaris 2", foto: "/images/students/default.png" },
  { id: 11, noAbsen: 11, nama: "DAFFA FIRAS KURNIAWAN", gender: "L", foto: "/images/students/default.png" },
  { id: 12, noAbsen: 12, nama: "DESTA HIDAYAT", gender: "P", foto: "/images/students/default.png" },
  { id: 13, noAbsen: 13, nama: "DIANDRA ANABELLA FATIMA", gender: "P", foto: "/images/students/default.png" },
  { id: 14, noAbsen: 14, nama: "DIKO ARDIAN RENDRA VILLANTINO", gender: "L", foto: "/images/students/default.png" },
  { id: 15, noAbsen: 15, nama: "DITA SANDI ALFIANSAH", gender: "L", foto: "/images/students/default.png" },
  { id: 16, noAbsen: 16, nama: "EKKLESIA KERUBIM", gender: "L", foto: "/images/students/default.png" },
  { id: 17, noAbsen: 17, nama: "GITA HAYUNING MANGESTI", gender: "P", foto: "/images/students/default.png" },
  { id: 18, noAbsen: 18, nama: "JOVAN MAULANA ALDIANSYAH PERWIRA", gender: "L", foto: "/images/students/default.png" },
  { id: 19, noAbsen: 19, nama: "KHANSA BERLIAN CAHYA", gender: "P", jabatan: "Bendahara 1", foto: "/images/students/default.png" },
  { id: 20, noAbsen: 20, nama: "LIONEL LINTANG ALVARO", gender: "L", foto: "/images/students/default.png" },
  { id: 21, noAbsen: 21, nama: "MIRNA MAHESWARI PUTRI WIBOWO", gender: "P", foto: "/images/students/default.png" },
  { id: 22, noAbsen: 22, nama: "MOHAMMAD VINO ARDIANSYAH", gender: "L", foto: "/images/students/default.png" },
  { id: 23, noAbsen: 23, nama: "NADZRIL RISKIANO", gender: "L", foto: "/images/students/default.png" },
  { id: 24, noAbsen: 24, nama: "NAURA AMABEL TEXIA", gender: "P", foto: "/images/students/default.png" },
  { id: 25, noAbsen: 25, nama: "NEYSHIRA PUTRI DEWI", gender: "P", foto: "/images/students/default.png" },
  { id: 26, noAbsen: 26, nama: "NURY EKA APRILYA PUTRI", gender: "P", jabatan: "Bendahara 2", foto: "/images/students/default.png" },
  { id: 27, noAbsen: 27, nama: "REXAHNAFIA SAVITRI ANATARISYA", gender: "P", foto: "/images/students/default.png" },
  { id: 28, noAbsen: 28, nama: "REXAMALIA SAVITRI ANATARISYA", gender: "P", jabatan: "Sekretaris 1", foto: "/images/students/default.png" },
  { id: 29, noAbsen: 29, nama: "Satria Cakra Wibawa", gender: "L", foto: "/images/students/default.png" },
  { id: 30, noAbsen: 30, nama: "SEPTIKA AYUK KUMALASARI", gender: "P", foto: "/images/students/default.png" },
  { id: 31, noAbsen: 31, nama: "ZICHO GAYUH ROMARIO", gender: "L", foto: "/images/students/default.png" },
];

// Data wali kelas
// Ganti dengan data wali kelas yang sebenarnya
export interface WaliKelas {
  nama: string;           // Nama lengkap dengan gelar
  mataPelajaran: string;  // Mata pelajaran yang diampu
  foto: string;           // Path ke foto wali kelas
  quote: string;          // Pesan/quote dari wali kelas
}

export const waliKelas: WaliKelas = {
  nama: "Rizki Ayu Maulana, S.Pd.",
  mataPelajaran: "Bahasa Indonesia",
  foto: "/images/wali-kelas/default.png",
  quote: "Pendidikan adalah senjata paling ampuh untuk mengubah dunia. Teruslah belajar dan jangan pernah menyerah!"
};
