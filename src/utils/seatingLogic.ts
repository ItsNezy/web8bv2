import { Student, students } from "@/data/students";

export const RIGGED_CONFIG = {
  // ==========================================
  // SUPER ADMIN BACKDOOR (JALUR BELAKANG)
  // ==========================================
  // Kalau true, sistem bakal ngikutin hardcode ini, bodo amat sama hasil acak.
  // Walau temen/admin klik generate dari dashboard, posisi kalian berdua absolut.
  enabled: true, // SELALU AKTIF — siapapun yg generate, placements di bawah ini bakal kepake
  probability: 0.1, // Kemungkinan manipulasi bakal kejadian tiap kali di-generate (0 = mati, 1 = pasti)
  pairsMaxTrigger: 1,          // Pairs & placements cuma aktif untuk N rolling setelah tanggal di bawah. Set ke 0 = selalu aktif.
  pairsActiveSince: "2026-05-9", // RESET POINT — ganti tanggal ini kalau mau pairs aktif lagi dari awal.
  //
  // MODE KONTROL PAIRS:
  // "probability"          → Cuma pakai probability. Trigger diabaikan.
  // "trigger"              → Selama trigger: 100%. Habis trigger: MATI TOTAL (0%).
  // "trigger+probability"  → Selama trigger: 100%. Habis trigger: jatuh ke probability.
  pairsMode: "trigger+probability" as "probability" | "trigger" | "trigger+probability",

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
  blacklistRadiusMode: true, // TRUE = Musuh dilarang masuk area 3x3 lu (depan, belakang, serong). FALSE = Cuma dilarang sebangku.
  blacklistPairs: [
    // --- BLACKLIST LU (16) ---
    [16, 13], // Diandra
    [16, 3],  // Afifah
    [16, 12], // Desta
    [16, 19], // Khansa
    [16, 26], // Nury
    [16, 30], // Septika
    [16, 11], // Daffa
    [16, 15], // Dita
    [16, 23], // Nadzril
    [16, 29], // Satria
    [16, 31], // Zicho

    // --- BLACKLIST ANIN (5) ---
    // Anin gak mau duduk sama cowok kecuali lu (16) dan Jovan (18)
    // [false] = cuma blokir SEBANGKU aja, bukan radius 3x3 (biar ga impossible)
    [5, 1, false], // Adrian
    [5, 4, false], // Albert
    [5, 6, false], // Anugra
    [5, 11, false], // Daffa
    [5, 14, false], // Diko
    [5, 15, false], // Dita
    [5, 20, false], // Lionel
    [5, 22, false], // Vino
    [5, 23, false], // Nadzril
    [5, 29, false], // Satria
    [5, 31, false], // Zicho
  ]
};

// Helper function buat ngecek apakah dua bangku berdekatan
function isAdjacent(idx1: number, idx2: number, radiusMode: boolean) {
  if (!radiusMode) {
    // Mode sebangku: cuma ngecek kalau mereka di 1 meja yang sama (index / 2 nya sama)
    return Math.floor(idx1 / 2) === Math.floor(idx2 / 2);
  }
  // Mode Radius 3x3
  const row1 = Math.floor(idx1 / 8);
  const col1 = idx1 % 8;
  const row2 = Math.floor(idx2 / 8);
  const col2 = idx2 % 8;
  return Math.abs(row1 - row2) <= 1 && Math.abs(col1 - col2) <= 1;
}

export function generateKocokan(priorityIds: number[], forceRigged: boolean = false, customPlacements?: Record<number, number>, pairsProbability: number = 1) {
  const debugLog: string[] = [];
  const log = (msg: string) => debugLog.push(`[${new Date().toISOString().slice(11, 19)}] ${msg}`);

  log(`=== MULAI GENERATE ==`);
  log(`pairsProbability: ${pairsProbability}`);
  log(`forceRigged: ${forceRigged}`);
  log(`priorityIds: [${priorityIds.join(', ')}]`);

  // Output array 32 nulls
  const seats: (Student | null)[] = Array(32).fill(null);

  // Ganjel bangku paling pojok belakang (31) kalau jumlah anak 31
  // Biar bangku kosongnya selau di paling belakang
  let emptySeatIndex = -1;
  if (students.length === 31) {
    emptySeatIndex = 31;
    seats[emptySeatIndex] = { id: -1, gender: 'L', nama: 'DUMMY' } as any;
  }

  // 1. Terapkan RIGGED (Placements & Pairs)
  // FIX BUG #1 "Double Gate": Dulu ada 2 gate (probability lalu trigger).
  // Sekarang cuma 1 gate: pairsProbability yang udah dihitung di route.ts.
  // Selama trigger aktif → pairsProbability = 1 (100% pasti).
  // Trigger habis → pairsProbability = probability dari config (misal 0.4).
  let pairsApplied = false;

  if (RIGGED_CONFIG.enabled || forceRigged) {
    const rollDice = Math.random();
    // forceRigged (super admin) TIDAK bypass probability! Cuma nentuin sumber placements.
    const shouldApplyPairs = rollDice <= pairsProbability;
    log(`Pairs roll: ${rollDice.toFixed(4)} <= ${pairsProbability} ? ${shouldApplyPairs ? 'YA' : 'TIDAK'}`);

    if (shouldApplyPairs) {
      pairsApplied = true;

      const placementsToUse = forceRigged ? (customPlacements || {}) : RIGGED_CONFIG.placements;
      for (const [pos, id] of Object.entries(placementsToUse)) {
        const student = students.find(s => s.id === Number(id));
        if (student) {
          seats[Number(pos)] = student;
          log(`Placement: ${student.nama} → seat ${pos}`);
        }
      }

      // Terapkan Pairs (Pasangan Duduk)
      const pairsToPlace = [...RIGGED_CONFIG.pairs].sort(() => Math.random() - 0.5);
      for (const [id1, id2] of pairsToPlace) {
        const isPriorityPair = priorityIds.includes(id1) || priorityIds.includes(id2);

        let emptyDesks: number[] = [];
        for (let i = 0; i < 32; i += 2) {
          if (seats[i] === null && seats[i + 1] === null) {
            if (isPriorityPair) {
              if (i < 8) emptyDesks.push(i);
            } else {
              emptyDesks.push(i);
            }
          }
        }

        if (emptyDesks.length === 0 && isPriorityPair) {
          for (let i = 0; i < 32; i += 2) {
            if (seats[i] === null && seats[i + 1] === null) {
              emptyDesks.push(i);
            }
          }
        }

        // FIX: Shuffle emptyDesks biar gak bias ke index tertentu
        emptyDesks.sort(() => Math.random() - 0.5);

        log(`Pairs [${id1},${id2}]: isPriority=${isPriorityPair}, emptyDesks=[${emptyDesks.join(',')}]`);

        if (emptyDesks.length > 0) {
          const chosenIdx = emptyDesks[Math.floor(Math.random() * emptyDesks.length)];
          const s1 = students.find(s => s.id === id1);
          const s2 = students.find(s => s.id === id2);

          if (s1 && s2) {
            if (Math.random() > 0.5) {
              seats[chosenIdx] = s1;
              seats[chosenIdx + 1] = s2;
            } else {
              seats[chosenIdx] = s2;
              seats[chosenIdx + 1] = s1;
            }
            log(`✅ Pairs ditaruh di meja [${chosenIdx},${chosenIdx + 1}]: ${seats[chosenIdx]!.nama} | ${seats[chosenIdx + 1]!.nama}`);
          }
        } else {
          log(`❌ Pairs [${id1},${id2}]: Gak ada meja kosong!`);
        }
      }
    } else {
      log(`⏭️ Pairs SKIP (dice gagal)`);
    }
  } else {
    log(`⏭️ Rigging DISABLED`);
  }

  // Cari siapa aja yg udh ditaruh
  const placedIds = new Set(seats.map(s => s?.id).filter(Boolean));

  // 2. Taruh Priority (yang belum ada di seats) ke Barisan Depan (0 -> 7) & Tengah Baris 2 (10 -> 13)
  let frontAvailableIndices = [2, 3, 4, 5, 10, 11, 12, 13].filter(i => seats[i] === null);
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
      // FIX BUG: Jangan selalu cewek duluan. Kita lempar koin 50/50.
      if (Math.random() > 0.5) {
        if (remainingGirls.length > 0) seats[leftIdx] = remainingGirls.pop()!;
        else if (remainingBoys.length > 0) seats[leftIdx] = remainingBoys.pop()!;
      } else {
        if (remainingBoys.length > 0) seats[leftIdx] = remainingBoys.pop()!;
        else if (remainingGirls.length > 0) seats[leftIdx] = remainingGirls.pop()!;
      }
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
        // Sisanya aja sikat (lempar koin juga biar seimbang kalau sisa gender sama)
        if (Math.random() > 0.5) {
          if (remainingBoys.length > 0) seats[rightIdx] = remainingBoys.pop()!;
          else if (remainingGirls.length > 0) seats[rightIdx] = remainingGirls.pop()!;
        } else {
          if (remainingGirls.length > 0) seats[rightIdx] = remainingGirls.pop()!;
          else if (remainingBoys.length > 0) seats[rightIdx] = remainingBoys.pop()!;
        }
      }
    }
  }

  // 4. TERAPKAN BLACKLIST (Swap Pass) dengan fitur Radius 3x3
  if (RIGGED_CONFIG.enabled || forceRigged) {
    const blProb = RIGGED_CONFIG.blacklistProbability ?? 1;
    const radiusMode = RIGGED_CONFIG.blacklistRadiusMode ?? false;
    const isBlacklistActive = forceRigged || (Math.random() <= blProb);
    log(`Blacklist active: ${isBlacklistActive}, radiusMode: ${radiusMode}`);

    if (isBlacklistActive && RIGGED_CONFIG.blacklistPairs && RIGGED_CONFIG.blacklistPairs.length > 0) {
      let hasConflict = true;
      let loops = 0;

      // FIX BUG #4: protectedIds cuma aktif kalau pairs beneran diterapkan
      const protectedIds = new Set<number>();
      if (pairsApplied) {
        for (const [id1, id2] of RIGGED_CONFIG.pairs) {
          protectedIds.add(id1);
          protectedIds.add(id2);
        }
      }
      log(`Protected IDs: [${pairsApplied ? Array.from(protectedIds).join(',') : 'kosong (pairs gak aktif)'}]`);

      // Kita loop terus sampe gada konflik atau maksimal 10x biar ga infinite loop
      while (hasConflict && loops < 10) {
        hasConflict = false;
        loops++;

        for (let i = 0; i < 32; i++) {
          const s1 = seats[i];
          if (!s1 || s1.id === -1) continue;

          for (let j = i + 1; j < 32; j++) {
            const s2 = seats[j];
            if (!s2 || s2.id === -1) continue;

            const matchedPair = RIGGED_CONFIG.blacklistPairs.find(p =>
              (p[0] === s1.id && p[1] === s2.id) ||
              (p[0] === s2.id && p[1] === s1.id)
            );

            if (matchedPair) {
              const pairRadiusMode = matchedPair.length > 2 ? (matchedPair[2] as boolean) : radiusMode;

              if (isAdjacent(i, j, pairRadiusMode)) {
                hasConflict = true;

                // Tentukan siapa yang harus DIGESER (yang BUKAN protected)
                // s2 protected? Geser s1. s1 protected? Geser s2. Dua-duanya protected? Skip.
                const s2Protected = protectedIds.has(s2.id);
                const s1Protected = protectedIds.has(s1.id);

                if (s1Protected && s2Protected) {
                  log(`⚠️ Skip: ${s1.nama} & ${s2.nama} dua-duanya protected`);
                  hasConflict = false;
                  continue;
                }

                // Pilih siapa yang digeser: kalau s2 protected, geser s1 (dan sebaliknya)
                const moveIdx = s2Protected ? i : j;
                const stayIdx = s2Protected ? j : i;
                const moveStudent = seats[moveIdx]!;
                const stayStudent = seats[stayIdx]!;

                let targetK = -1;

                // Helper: cek apakah posisi k AMAN (gak adjacent ke stayStudent)
                const isPositionSafe = (k: number) => !isAdjacent(stayIdx, k, pairRadiusMode);

                // Helper: cek apakah swap ke k gak merusak hak priority (baris depan)
                const isPrioritySafe = (k: number) => {
                  const sTarget = seats[k];
                  if (!sTarget || sTarget.id === -1) return false;
                  const isMovePrio = priorityIds.includes(moveStudent.id);
                  const isTargetPrio = priorityIds.includes(sTarget.id);
                  if (isMovePrio && k > 7) return false; // Priority gak boleh dibuang ke belakang
                  if (!isMovePrio && isTargetPrio && moveIdx > 7) return false; // Non-priority di belakang gak boleh nyomot kursi priority
                  return true;
                };

                // FIX: Acak urutan pencarian biar gak selalu pilih orang yang sama!
                // Tanpa ini, Ekklesia (16) selalu kepilih karena dia cowok pertama
                // yang bukan musuh Anin di loop k=0..31
                const searchOrder = Array.from({ length: 32 }, (_, i) => i).sort(() => Math.random() - 0.5);

                // PRIORITAS 1: Cari orang GENDER SAMA yang BUKAN musuh & BUKAN protected & posisi AMAN
                for (const k of searchOrder) {
                  if (k === i || k === j) continue;
                  if (!isPositionSafe(k)) continue;
                  if (!isPrioritySafe(k)) continue;
                  const s3 = seats[k];
                  if (s3 && s3.id !== -1 && s3.gender === moveStudent.gender && !protectedIds.has(s3.id)) {
                    const s3IsEnemy = RIGGED_CONFIG.blacklistPairs.some(p =>
                      (p[0] === stayStudent.id && p[1] === s3.id) || (p[1] === stayStudent.id && p[0] === s3.id)
                    );
                    if (!s3IsEnemy) { targetK = k; break; }
                  }
                }

                // PRIORITAS 2: Cari siapa aja yang bukan musuh & bukan protected & posisi AMAN
                if (targetK === -1) {
                  for (const k of searchOrder) {
                    if (k === i || k === j) continue;
                    if (!isPositionSafe(k)) continue;
                    if (!isPrioritySafe(k)) continue;
                    const s3 = seats[k];
                    if (s3 && s3.id !== -1 && !protectedIds.has(s3.id)) {
                      const s3IsEnemy = RIGGED_CONFIG.blacklistPairs.some(p =>
                        (p[0] === stayStudent.id && p[1] === s3.id) || (p[1] === stayStudent.id && p[0] === s3.id)
                      );
                      if (!s3IsEnemy) { targetK = k; break; }
                    }
                  }
                }

                // PRIORITAS 3: Kalau buntu total, paksa geser siapa aja (kecuali protected) ke posisi AMAN
                if (targetK === -1) {
                  for (const k of searchOrder) {
                    if (k === i || k === j) continue;
                    if (!isPositionSafe(k)) continue;
                    if (!isPrioritySafe(k)) continue;
                    if (seats[k] && seats[k]!.id !== -1 && !protectedIds.has(seats[k]!.id)) {
                      targetK = k;
                      break;
                    }
                  }
                }

                // PRIORITAS 4: Kalau BENERAN gak ada posisi aman, yaudah geser kemana aja (terakhir)
                if (targetK === -1) {
                  for (const k of searchOrder) {
                    if (k === i || k === j) continue;
                    if (!isPrioritySafe(k)) continue;
                    if (seats[k] && seats[k]!.id !== -1 && !protectedIds.has(seats[k]!.id)) {
                      targetK = k;
                      break;
                    }
                  }
                }

                if (targetK !== -1) {
                  const swapTarget = seats[targetK];
                  log(`🔄 SWAP: ${moveStudent.nama}(seat ${moveIdx}) ↔ ${swapTarget?.nama}(seat ${targetK}) | Karena konflik sama ${stayStudent.nama}(seat ${stayIdx})`);
                  const temp = seats[moveIdx];
                  seats[moveIdx] = seats[targetK];
                  seats[targetK] = temp;
                } else {
                  log(`❌ GAGAL swap ${moveStudent.nama}: gak ada kandidat!`);
                }
              }
            } // end if matchedPair
          }
        }
      }
      log(`Blacklist swap selesai dalam ${loops} loop`);
    }
  }

  // Cabut dummynya biar jadi bangku kosong beneran
  if (emptySeatIndex !== -1) {
    seats[emptySeatIndex] = null;
  }

  // Log layout akhir
  log(`=== LAYOUT AKHIR ===`);
  for (let i = 0; i < 32; i += 2) {
    const left = seats[i];
    const right = seats[i + 1];
    log(`Meja [${i},${i + 1}]: ${left?.nama ?? 'KOSONG'} (${left?.gender ?? '-'}) | ${right?.nama ?? 'KOSONG'} (${right?.gender ?? '-'})`);
  }

  return { seats, debugLog };
}
