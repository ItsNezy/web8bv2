import { Student, students } from "@/data/students";

export const RIGGED_CONFIG = {
  // ==========================================
  // SUPER ADMIN BACKDOOR (JALUR BELAKANG)
  // ==========================================
  // Kalau true, sistem bakal ngikutin hardcode ini, bodo amat sama hasil acak.
  // Walau temen/admin klik generate dari dashboard, posisi kalian berdua absolut.
  enabled: true, // SELALU AKTIF — siapapun yg generate, placements di bawah ini bakal kepake
  probability: 0.3, // 70% kemungkinan manipulasi bakal kejadian. 30% sisanya murni ngacak total.

  // --- PANDUAN INDEX MEJA (0-31) ---
  // | 0, 1 |   | 2, 3 |   | 4, 5 |   | 6, 7 |  -> BARIS 1 (Depan)
  // | 8, 9 |   |10, 11|   |12, 13|   |14, 15|  -> BARIS 2
  // Angka GENAP (0,2,4,8..) = Kursi KIRI
  // Angka GANJIL (1,3,5,9..) = Kursi KANAN

  // Zicho = ID 31, Anin = ID 5
  // Kasus: Zicho mau duduk sama Anin di pojok KIRI atas (Baris 1, Meja 1).
  // Anin Kiri -> Index 0 | Zicho Kanan -> Index 1
  placements: {
    // 2: 5,  // ANIN (KIRI) (Lu bisa uncomment kalau mau dipake lagi)
    // 3: 16, // me (KANAN)
  },

  // Pasangan yang SELALU BARENG, tapi nyari bangku yg kosong secara acak
  // Format: [ID_Siswa_1, ID_Siswa_2]
  pairs: [
    [5, 16], // Anin (5) dan lu (16) bakal selalu sebangku, tapi bisa di meja mana aja.
  ],

  // ==========================
  // ANTI-PASANGAN (BLACKLIST)
  // ==========================
  // Probability terpisah khusus blacklist
  blacklistProbability: 1, // 100% kemungkinan lu GAK bakal duduk sama orang di bawah ini
  blacklistPairs: [
    // --- BLACKLIST LU (16) ---
    [16, 13], // Diandra
    [16, 3],  // Afifah
    [16, 12], // Desta
    [16, 19], // Khansa
    [16, 26], // Nury
    [16, 30], // Septika

    // --- BLACKLIST ANIN (5) ---
    // Anin gak mau duduk sama cowok kecuali lu (16) dan Jovan (18)
    [5, 1],  // Adrian
    [5, 4],  // Albert
    [5, 6],  // Anugra
    [5, 11], // Daffa
    [5, 14], // Diko
    [5, 15], // Dita
    [5, 20], // Lionel
    [5, 22], // Vino
    [5, 23], // Nadzril
    [5, 29], // Satria
    [5, 31], // Zicho
  ]
};

export function generateKocokan(priorityIds: number[], forceRigged: boolean = false, customPlacements?: Record<number, number>) {
  // Output array 32 nulls
  const seats: (Student | null)[] = Array(32).fill(null);

  // 1. Terapkan RIGGED
  if (RIGGED_CONFIG.enabled || forceRigged) {
    // Cek probabilitas manipulasi (kalau pake backdoor, pasti 100%)
    const prob = RIGGED_CONFIG.probability ?? 1;
    const isRiggingActive = forceRigged || (Math.random() <= prob);

    if (isRiggingActive) {
      // Kalau sengaja masukin password ZICHO (forceRigged), pake customPlacements dari UI (kalau kosong ya kosong).
      // Kalau cuma dari kode biasa, pake RIGGED_CONFIG.placements
      const placementsToUse = forceRigged ? (customPlacements || {}) : RIGGED_CONFIG.placements;

      for (const [pos, id] of Object.entries(placementsToUse)) {
        const student = students.find(s => s.id === Number(id));
        if (student) seats[Number(pos)] = student;
      }

      // Terapkan Pairs (Pasangan Duduk)
      if (RIGGED_CONFIG.pairs) {
        // Acak urutan masangannya biar fair kalau ada banyak pasangan
        const pairsToPlace = [...RIGGED_CONFIG.pairs].sort(() => Math.random() - 0.5);
        for (const [id1, id2] of pairsToPlace) {
          // Cek apakah ada yang prioritas di pasangan ini
          const isPriorityPair = priorityIds.includes(id1) || priorityIds.includes(id2);

          // Cari meja yang dua-duanya (kiri & kanan) masih kosong
          let emptyDesks = [];
          for (let i = 0; i < 32; i += 2) {
            if (seats[i] === null && seats[i + 1] === null) {
              if (isPriorityPair) {
                // Kalau prioritas, cuma boleh di baris depan (0,2,4,6)
                if (i < 8) emptyDesks.push(i);
              } else {
                emptyDesks.push(i);
              }
            }
          }

          // Kalau prioritas tapi depan udah penuh (apes), yaudah cari bangku mana aja yg kosong
          if (emptyDesks.length === 0 && isPriorityPair) {
            for (let i = 0; i < 32; i += 2) {
              if (seats[i] === null && seats[i + 1] === null) {
                emptyDesks.push(i);
              }
            }
          }

          if (emptyDesks.length > 0) {
            // Pilih satu meja kosong secara acak
            const chosenIdx = emptyDesks[Math.floor(Math.random() * emptyDesks.length)];
            const s1 = students.find(s => s.id === id1);
            const s2 = students.find(s => s.id === id2);

            if (s1 && s2) {
              // Acak siapa yang duduk di kiri dan siapa yang di kanan
              if (Math.random() > 0.5) {
                seats[chosenIdx] = s1;
                seats[chosenIdx + 1] = s2;
              } else {
                seats[chosenIdx] = s2;
                seats[chosenIdx + 1] = s1;
              }
            }
          }
        }
      }
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

  // 4. TERAPKAN BLACKLIST (Swap Pass)
  if (RIGGED_CONFIG.enabled || forceRigged) {
    const blProb = RIGGED_CONFIG.blacklistProbability ?? 1;
    const isBlacklistActive = forceRigged || (Math.random() <= blProb);

    if (isBlacklistActive && RIGGED_CONFIG.blacklistPairs && RIGGED_CONFIG.blacklistPairs.length > 0) {
      for (let i = 0; i < 32; i += 2) {
        const left = seats[i];
        const right = seats[i + 1];

        if (left && right) {
          const isBlacklisted = RIGGED_CONFIG.blacklistPairs.some(p =>
            (p[0] === left.id && p[1] === right.id) ||
            (p[0] === right.id && p[1] === left.id)
          );

          if (isBlacklisted) {
            // Apes! Mereka sebangku. Kita harus tuker "right" sama orang lain di meja lain yg gendernya SAMA
            for (let j = 0; j < 32; j++) {
              if (j === i || j === i + 1) continue; // jangan meja ini

              const candidate = seats[j];
              if (candidate && candidate.gender === right.gender) {
                // Pastikan kalau dituker, nggak bikin musuh baru di meja baru
                const partnerOfJIdx = j % 2 === 0 ? j + 1 : j - 1;
                const partnerOfJ = seats[partnerOfJIdx];

                // Cek apakah "right" musuhan sama "partnerOfJ"
                const rightWillConflict = partnerOfJ && RIGGED_CONFIG.blacklistPairs.some(p =>
                  (p[0] === right.id && p[1] === partnerOfJ.id) ||
                  (p[0] === partnerOfJ.id && p[1] === right.id)
                );

                // Cek apakah "candidate" musuhan sama "left"
                const candidateWillConflict = RIGGED_CONFIG.blacklistPairs.some(p =>
                  (p[0] === candidate.id && p[1] === left.id) ||
                  (p[0] === left.id && p[1] === candidate.id)
                );

                if (!rightWillConflict && !candidateWillConflict) {
                  // AMAN! Tuker posisi
                  seats[i + 1] = candidate;
                  seats[j] = right;
                  break; // Selesai nuker meja ini
                }
              }
            }
          }
        }
      }
    }
  }

  return seats;
}
