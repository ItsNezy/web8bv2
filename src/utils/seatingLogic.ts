import { Student, students } from "@/data/students";

export const RIGGED_CONFIG = {
  // ==========================================
  // SUPER ADMIN BACKDOOR (JALUR BELAKANG)
  // ==========================================
  // Kalau true, sistem bakal ngikutin hardcode ini, bodo amat sama hasil acak.
  // Walau temen/admin klik generate dari dashboard, posisi kalian berdua absolut.
  enabled: false,

  // --- PANDUAN INDEX MEJA (0-31) ---
  // | 0, 1 |   | 2, 3 |   | 4, 5 |   | 6, 7 |  -> BARIS 1 (Depan)
  // | 8, 9 |   |10, 11|   |12, 13|   |14, 15|  -> BARIS 2
  // Angka GENAP (0,2,4,8..) = Kursi KIRI
  // Angka GANJIL (1,3,5,9..) = Kursi KANAN

  // Zicho = ID 31, Anin = ID 5
  // Kasus: Zicho mau duduk sama Anin di pojok KIRI atas (Baris 1, Meja 1).
  // Anin Kiri -> Index 0 | Zicho Kanan -> Index 1
  placements: {
    2: 5,  // ANIN (KIRI)
    3: 16, // me (KANAN)
  }
};

export function generateKocokan(priorityIds: number[], forceRigged: boolean = false, customPlacements?: Record<number, number>) {
  // Output array 32 nulls
  const seats: (Student | null)[] = Array(32).fill(null);

  // 1. Terapkan RIGGED
  if (RIGGED_CONFIG.enabled || forceRigged) {
    // Kalau sengaja masukin password ZICHO (forceRigged), pake customPlacements dari UI (kalau kosong ya kosong).
    // Kalau cuma dari kode biasa, pake RIGGED_CONFIG.placements
    const placementsToUse = forceRigged ? (customPlacements || {}) : RIGGED_CONFIG.placements;

    for (const [pos, id] of Object.entries(placementsToUse)) {
      const student = students.find(s => s.id === id);
      if (student) seats[Number(pos)] = student;
    }
  }

  // Cari siapa aja yg udh ditaruh
  const placedIds = new Set(seats.map(s => s?.id).filter(Boolean));

  // 2. Taruh Priority (yang belum ada di seats) ke Barisan Depan (0 -> 7) & Tengah Baris 2 (10 -> 13)
  let frontAvailableIndices = [0, 1, 2, 3, 4, 5, 6, 7].filter(i => seats[i] === null);
  // Shuffle frontAvailable
  frontAvailableIndices.sort(() => Math.random() - 0.5);

  const prioritiesToPlace = priorityIds.filter(pid => !placedIds.has(pid));

  for (const pid of prioritiesToPlace) {
    if (frontAvailableIndices.length === 0) break; // Kalo bangku depan udh penuh
    const student = students.find(s => s.id === pid);
    if (!student) continue;

    const idx = frontAvailableIndices.pop()!;
    seats[idx] = student;
    placedIds.add(student.id);
  }

  // 3. Taruh sisa as campur gender (1 Meja = Kiri Kanan)
  const remainingStudents = students.filter(s => !placedIds.has(s.id));
  const remainingBoys = remainingStudents.filter(s => s.gender === 'L').sort(() => Math.random() - 0.5);
  const remainingGirls = remainingStudents.filter(s => s.gender === 'P').sort(() => Math.random() - 0.5);

  // Semua index meja: [0,1], [2,3], ... [30,31]
  const desks = [];
  for (let i = 0; i < 32; i += 2) desks.push([i, i + 1]);
  // Shuffle urutan nempati meja
  desks.sort(() => Math.random() - 0.5);

  for (const [leftIdx, rightIdx] of desks) {
    // Kalau kiri kosong
    if (seats[leftIdx] === null) {
      if (remainingGirls.length > 0) seats[leftIdx] = remainingGirls.pop()!;
      else if (remainingBoys.length > 0) seats[leftIdx] = remainingBoys.pop()!;
    }
    // Kalau kanan kosong
    if (seats[rightIdx] === null) {
      // Usahakan beda gender
      // Kalau yg kiri tadinya diisi Girl (entah dari sebelum loop ini), kanan Boy.
      const leftGender = seats[leftIdx]?.gender;
      if (leftGender === 'P' && remainingBoys.length > 0) {
        seats[rightIdx] = remainingBoys.pop()!;
      } else if (leftGender === 'L' && remainingGirls.length > 0) {
        seats[rightIdx] = remainingGirls.pop()!;
      } else {
        // Sisanya aja sikat
        if (remainingBoys.length > 0) seats[rightIdx] = remainingBoys.pop()!;
        else if (remainingGirls.length > 0) seats[rightIdx] = remainingGirls.pop()!;
      }
    }
  }

  return seats;
}
