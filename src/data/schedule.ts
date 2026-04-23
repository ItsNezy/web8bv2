// ============================================
// FILE: schedule.ts
// FUNGSI: Menyimpan data jadwal pelajaran kelas 8B (FINAL VERSION)
// SUMBER: Jadwal Pelajaran Sem Genap 2025/2026 SMPN 1 Cluring
// CATATAN: Guru & Kode dihapus. Ditambah label Jam Pelajaran (JP).
// ============================================

// Interface untuk satu slot jadwal pelajaran
export interface ScheduleSlot {
    jam: string;          // Rentang waktu
    pelajaran: string;    // Nama mata pelajaran
    jp?: string;          // Label Jam Pelajaran (Contoh: "JP 1", "JP 2") - Optional
}

// Interface untuk jadwal satu hari
export interface DaySchedule {
    hari: string;                 // Nama hari
    jadwal: ScheduleSlot[];       // Array jadwal
}

// Styling warna mapel (Tailwind Classes)
export const subjectColors: Record<string, string> = {
    // Mapel Nasional
    "Matematika": "bg-blue-100 text-blue-900 border-blue-200",
    "Bahasa Indonesia": "bg-emerald-100 text-emerald-900 border-emerald-200",
    "Bahasa Inggris": "bg-fuchsia-100 text-fuchsia-900 border-fuchsia-200",
    "IPA": "bg-green-100 text-green-900 border-green-200",
    "IPS": "bg-orange-100 text-orange-900 border-orange-200",
    "PPKn": "bg-red-100 text-red-900 border-red-200",
    "PAIBP": "bg-lime-100 text-lime-900 border-lime-200",
    "PAI": "bg-lime-100 text-lime-900 border-lime-200",

    // Mapel Skill & Seni
    "PJOK": "bg-cyan-100 text-cyan-900 border-cyan-200",
    "Seni Budaya": "bg-purple-100 text-purple-900 border-purple-200",
    "Informatika": "bg-indigo-100 text-indigo-900 border-indigo-200",
    "Prakarya": "bg-teal-100 text-teal-900 border-teal-200",

    // Muatan Lokal & Lainnya
    "Bahasa Jawa": "bg-amber-100 text-amber-900 border-amber-200",
    "BK": "bg-pink-100 text-pink-900 border-pink-200",
    "Jumat Karakter": "bg-sky-100 text-sky-900 border-sky-200",
    "Pengembangan Diri / Ekskul": "bg-violet-100 text-violet-900 border-violet-200",

    // Non-Mapel
    "Upacara Bendera": "bg-rose-100 text-rose-900 border-rose-200 font-bold",
    "Istirahat": "bg-gray-100 text-gray-500 border-gray-200 italic opacity-75",
    "Istirahat Pra Pelajaran": "bg-slate-50 text-slate-400 border-slate-100 text-xs italic",
    "Senam / Istirahat Pra": "bg-slate-50 text-slate-400 border-slate-100 text-xs italic",
    "Pembiasaan": "bg-slate-50 text-slate-400 border-slate-100 text-xs italic",
    "Pembiasaan / Istirahat Pra": "bg-slate-50 text-slate-400 border-slate-100 text-xs italic",
    "Pembiasaan Religi": "bg-slate-50 text-slate-400 border-slate-100 text-xs italic",
};

// Data Jadwal Mingguan (Dengan Label JP)
// Logika: JP dihitung untuk mapel akademik. Upacara, Istirahat, Pembiasaan tidak dihitung.
export const weeklySchedule: DaySchedule[] = [
    {
        hari: "Senin",
        jadwal: [
            { jam: "06:45 - 07:30", pelajaran: "Upacara Bendera", jp: "JP 0" },
            { jam: "07:30 - 07:55", pelajaran: "Istirahat Pra Pelajaran" },
            { jam: "07:55 - 08:35", pelajaran: "Matematika", jp: "JP 1" },
            { jam: "08:35 - 09:15", pelajaran: "Matematika", jp: "JP 2" },
            { jam: "09:15 - 09:55", pelajaran: "Pendidikan Pancasila", jp: "JP 3" },
            { jam: "09:55 - 10:25", pelajaran: "Istirahat" },
            { jam: "10:25 - 11:05", pelajaran: "Pendidikan Pancasila", jp: "JP 4" },
            { jam: "11:05 - 11:45", pelajaran: "Bahasa Indonesia", jp: "JP 5" },
            { jam: "11:45 - 12:25", pelajaran: "Istirahat" },
            { jam: "12:25 - 13:05", pelajaran: "Bahasa Indonesia", jp: "JP 6" },
            { jam: "13:05 - 13:45", pelajaran: "Bahasa Indonesia", jp: "JP 7" },
        ]
    },
    {
        hari: "Selasa",
        jadwal: [
            { jam: "06:45 - 07:00", pelajaran: "Pembiasaan" },
            { jam: "07:00 - 07:15", pelajaran: "Senam" },
            { jam: "07:15 - 07:25", pelajaran: "Istirahat Pra Pelajaran" },
            { jam: "07:25 - 08:05", pelajaran: "PJOK", jp: "JP 1" },
            { jam: "08:05 - 08:45", pelajaran: "PJOK", jp: "JP 2" },
            { jam: "08:45 - 09:25", pelajaran: "PJOK", jp: "JP 3" },
            { jam: "09:25 - 10:05", pelajaran: "IPS", jp: "JP 4" },
            { jam: "10:05 - 10:35", pelajaran: "Istirahat" },
            { jam: "10:35 - 11:15", pelajaran: "IPS", jp: "JP 5" },
            { jam: "11:15 - 11:55", pelajaran: "Agama Islam", jp: "JP 6" },
            { jam: "11:55 - 12:25", pelajaran: "Istirahat" },
            { jam: "12:25 - 13:05", pelajaran: "Agama Islam", jp: "JP 7" },
            { jam: "13:05 - 13:45", pelajaran: "Agama Islam", jp: "JP 8" },
        ]
    },
    {
        hari: "Rabu",
        jadwal: [
            { jam: "06:45 - 07:00", pelajaran: "Pembiasaan / Istirahat Pra" },
            { jam: "07:00 - 07:15", pelajaran: "Senam" },
            { jam: "07:15 - 07:25", pelajaran: "Istirahat Pra Pelajaran" },
            { jam: "07:25 - 08:05", pelajaran: "Bahasa Inggris", jp: "JP 1" },
            { jam: "08:05 - 08:45", pelajaran: "Bahasa Inggris", jp: "JP 2" },
            { jam: "08:45 - 09:25", pelajaran: "Seni Budaya", jp: "JP 3" },
            { jam: "09:25 - 10:05", pelajaran: "Seni Budaya", jp: "JP 4" },
            { jam: "10:05 - 10:35", pelajaran: "Istirahat" },
            { jam: "10:35 - 11:15", pelajaran: "Seni Budaya", jp: "JP 5" },
            { jam: "11:15 - 11:55", pelajaran: "Matematika", jp: "JP 6" },
            { jam: "11:55 - 12:25", pelajaran: "Istirahat" },
            { jam: "12:25 - 13:05", pelajaran: "Matematika", jp: "JP 7" },
            { jam: "13:05 - 13:45", pelajaran: "Matematika", jp: "JP 8" },
        ]
    },
    {
        hari: "Kamis",
        jadwal: [
            { jam: "06:45 - 07:00", pelajaran: "Pembiasaan / Istirahat Pra" },
            { jam: "07:00 - 07:15", pelajaran: "Senam" },
            { jam: "07:15 - 07:25", pelajaran: "Istirahat Pra Pelajaran" },
            { jam: "07:25 - 08:05", pelajaran: "Bahasa Inggris", jp: "JP 1" },
            { jam: "08:05 - 08:45", pelajaran: "Bahasa Inggris", jp: "JP 2" },
            { jam: "08:45 - 09:25", pelajaran: "IPA", jp: "JP 3" },
            { jam: "09:25 - 10:05", pelajaran: "IPA", jp: "JP 4" },
            { jam: "10:05 - 10:35", pelajaran: "Istirahat" },
            { jam: "10:35 - 11:15", pelajaran: "IPS", jp: "JP 5" },
            { jam: "11:15 - 11:55", pelajaran: "IPS", jp: "JP 6" },
            { jam: "11:55 - 12:25", pelajaran: "Istirahat" },
            { jam: "12:25 - 13:05", pelajaran: "Bahasa Jawa", jp: "JP 7" },
            { jam: "13:05 - 13:45", pelajaran: "Bahasa Jawa", jp: "JP 8" },
        ]
    },
    {
        hari: "Jumat",
        jadwal: [
            { jam: "06:45 - 07:00", pelajaran: "Pembiasaan Religi" },
            { jam: "07:00 - 07:45", pelajaran: "Jumat Karakter", jp: "JP 0" },
            { jam: "07:45 - 08:20", pelajaran: "PPKn", jp: "JP 1" },
            { jam: "08:20 - 08:55", pelajaran: "Bahasa Indonesia", jp: "JP 2" },
            { jam: "08:55 - 09:30", pelajaran: "Bahasa Indonesia", jp: "JP 3" },
            { jam: "09:30 - 10:00", pelajaran: "Istirahat" },
            { jam: "10:00 - 10:35", pelajaran: "Bahasa Indonesia", jp: "JP 4" },
        ]
    },
    {
        hari: "Sabtu",
        jadwal: [
            { jam: "06:45 - 07:25", pelajaran: "Pembiasaan / Istirahat Pra" },
            { jam: "07:25 - 08:05", pelajaran: "IPA", jp: "JP 1" },
            { jam: "08:05 - 08:45", pelajaran: "IPA", jp: "JP 2" },
            { jam: "08:45 - 09:25", pelajaran: "IPA", jp: "JP 3" },
            { jam: "09:25 - 10:05", pelajaran: "BK", jp: "JP 4" },
            { jam: "10:05 - 10:30", pelajaran: "Istirahat" },
            { jam: "10:30 - 11:10", pelajaran: "Informatika", jp: "JP 5" },
            { jam: "11:10 - 11:50", pelajaran: "Informatika", jp: "JP 6" },
            { jam: "11:50 - 12:30", pelajaran: "Informatika", jp: "JP 7" },
        ]
    },
];
