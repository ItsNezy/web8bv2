"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Student } from "@/data/students";
import { Users, Info } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import PageTransition from "@/components/layout/PageTransition";

export default function BangkuPage() {
  const [seats, setSeats] = useState<(Student | null)[]>(Array(32).fill(null));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bangku")
      .then(r => r.json())
      .then(d => setSeats(d.seats || Array(32).fill(null)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const desks = [];
  for(let i=0; i<16; i++) {
    desks.push({ id: i, left: seats[i*2], right: seats[i*2+1] });
  }

  // Baris pertama (0-3), kedua (4-7), ketiga (8-11), keempat (12-15)

  return (
    <PageTransition>
      <Navbar />
      <div className="min-h-screen bg-black text-white pt-24 pb-20 px-4">
        <div className="max-w-6xl mx-auto flex flex-col gap-8 items-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              DENAH BANGKU 8B
            </h1>
            <p className="text-gray-400 flex items-center justify-center gap-2">
              <Users size={18} /> Posisi tempat duduk paling baru
            </p>
          </motion.div>

          <div className="w-full bg-gray-900 mx-auto rounded-3xl p-6 md:p-10 border border-gray-800 shadow-2xl relative overflow-hidden">
            {/* Gurunya di depan */}
            <div className="w-full flex justify-center mb-12 relative z-10">
              <div className="bg-gradient-to-r from-gray-700 to-gray-600 px-12 py-3 rounded-xl border border-gray-500 shadow-md flex items-center gap-3">
                <span className="font-bold tracking-widest">PAPAN TULIS / MEJA GURU</span>
              </div>
            </div>

            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="w-full pb-4">
                <div className="grid grid-cols-4 gap-2 md:gap-8 relative z-10 w-full">
                  {desks.map((desk, i) => (
                    <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    key={desk.id}
                    className="flex flex-col lg:flex-row bg-gray-800 rounded-lg md:rounded-2xl border md:border-2 border-gray-700 overflow-hidden hover:border-blue-500 transition-colors duration-300 h-full"
                  >
                    {/* KIRI (Atas pas di hape, Kiri pas di lapie) */}
                    <div className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4 border-b lg:border-b-0 lg:border-r border-gray-700 bg-gray-800/80">
                      <div className="w-8 h-8 md:w-14 md:h-14 rounded-full bg-gray-700 mb-1 md:mb-2 overflow-hidden border border-gray-600 flex items-center justify-center text-sm md:text-4xl drop-shadow-md select-none shrink-0">
                        {desk.left && (desk.left.gender === "L" ? "👦🏻" : "👧🏻")}
                      </div>
                      <span className="text-[8px] md:text-sm font-semibold text-center leading-tight line-clamp-1 break-all">
                        {desk.left ? desk.left.nama.split(" ")[0] : "-"}
                      </span>
                    </div>

                    {/* KANAN (Bawah pas di hape, Kanan pas di lapie) */}
                    <div className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4 bg-gray-800/80">
                      <div className="w-8 h-8 md:w-14 md:h-14 rounded-full bg-gray-700 mb-1 md:mb-2 overflow-hidden border border-gray-600 flex items-center justify-center text-sm md:text-4xl drop-shadow-md select-none shrink-0">
                        {desk.right && (desk.right.gender === "L" ? "👦🏻" : "👧🏻")}
                      </div>
                      <span className="text-[8px] md:text-sm font-semibold text-center leading-tight line-clamp-1 break-all">
                        {desk.right ? desk.right.nama.split(" ")[0] : "-"}
                      </span>
                    </div>
                  </motion.div>
                ))}
                </div>
              </div>
            )}

            {/* Aksen background */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent pointer-events-none"></div>
          </div>
          
          <div className="mt-4 flex flex-col gap-2 items-center text-xs sm:text-sm text-gray-400 text-center">
            <div className="flex items-center gap-2">
              <Info size={16} /> 1 Meja diisi 2 orang (Cowok-Cewek kalau bisa). Prioritas di depan.
            </div>
            <div className="flex items-center gap-2 text-yellow-600/80">
              <Info size={16} /> Khusus di layar HP, meja <b>Kiri-Kanan</b> ditumpuk jadi <b>Atas-Bawah</b> biar muka gak gepeng. (Atas=Kiri).
            </div>
          </div>

        </div>
      </div>
    </PageTransition>
  );
}
