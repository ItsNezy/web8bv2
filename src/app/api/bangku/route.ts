import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateKocokan, RIGGED_CONFIG } from "@/utils/seatingLogic";
import { cookies } from "next/headers";

// GET untuk ngambil bangku saat ini dan prioritas
export async function GET() {
  const latest = await prisma.seatingArrangement.findFirst({
    orderBy: { createdAt: 'desc' }
  });
  const priorityStudents = await prisma.priorityStudent.findMany();

  return NextResponse.json({
    seats: latest ? JSON.parse(latest.seatsData) : Array(32).fill(null),
    priorityIds: priorityStudents.map((p: any) => p.studentId),
    createdAt: latest?.createdAt || null
  });
}

// POST untuk update list prioritas dan generate bangku baru
export async function POST(req: NextRequest) {
  // Simple auth cek
  const cookieStore = await cookies();
  const authVal = cookieStore.get("adminAuth")?.value;
  if (!authVal || (authVal !== "admin" && authVal !== "super_admin")) {
    return NextResponse.json({ error: "Gagal login. Lu bukan admin." }, { status: 401 });
  }

  const isSuperAdmin = authVal === "super_admin";

  const data = await req.json();
  const { priorityIds, customPlacements } = data as {
    priorityIds?: number[],
    customPlacements?: { deskIndex: number, studentId: number }[]
  };

  const customMap: Record<number, number> = {};
  if (isSuperAdmin && customPlacements && customPlacements.length > 0) {
    customPlacements.forEach(cp => {
      customMap[cp.deskIndex] = cp.studentId;
    });
  }

  if (Array.isArray(priorityIds)) {
    // Update prioritas
    await prisma.priorityStudent.deleteMany();
    if (priorityIds.length > 0) {
      await prisma.priorityStudent.createMany({
        data: priorityIds.map(id => ({ studentId: id }))
      });
    }
  }

  // Ambil prioritas paling baru
  const priorities = await prisma.priorityStudent.findMany();
  const pIds = priorities.map((p: any) => p.studentId);

  // Hitung berapa kali udah di-generate SEJAK tanggal reset (buat fitur pairsMaxTrigger)
  const sinceDate = RIGGED_CONFIG.pairsActiveSince
    ? new Date(RIGGED_CONFIG.pairsActiveSince)
    : new Date(0);
  const totalArrangements = await prisma.seatingArrangement.count({
    where: { createdAt: { gte: sinceDate } }
  });
  const maxTrigger = RIGGED_CONFIG.pairsMaxTrigger ?? 0;
  const triggerExhausted = maxTrigger > 0 && totalArrangements >= maxTrigger;
  const pairsMode = RIGGED_CONFIG.pairsMode ?? "probability";
  const prob = RIGGED_CONFIG.probability ?? 1;

  // Hitung probabilitas pairs efektif berdasarkan mode
  let effectivePairsProbability: number;
  if (pairsMode === "probability") {
    // Cuma pakai probability, trigger diabaikan
    effectivePairsProbability = prob;
  } else if (pairsMode === "trigger") {
    // Selama trigger: 100%. Habis trigger: MATI TOTAL (0%)
    effectivePairsProbability = triggerExhausted ? 0 : 1;
  } else {
    // "trigger+probability": Selama trigger: 100%. Habis trigger: jatuh ke probability
    effectivePairsProbability = triggerExhausted ? prob : 1;
  }

  // Kocok
  const { seats: newSeats, debugLog } = generateKocokan(pIds, isSuperAdmin, customMap, effectivePairsProbability);

  // Tambahin info trigger ke debug
  debugLog.unshift(
    `[ROUTE] totalArrangements since ${RIGGED_CONFIG.pairsActiveSince}: ${totalArrangements}`,
    `[ROUTE] pairsMode: ${pairsMode}, maxTrigger: ${maxTrigger}, triggerExhausted: ${triggerExhausted}`,
    `[ROUTE] effectivePairsProbability: ${effectivePairsProbability}`,
  );

  // Save
  const saved = await prisma.seatingArrangement.create({
    data: {
      seatsData: JSON.stringify(newSeats),
      isRigged: RIGGED_CONFIG.enabled
    }
  });

  return NextResponse.json({ success: true, arrangement: saved, debugLog });
}
