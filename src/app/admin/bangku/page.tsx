"use client";

import { useState, useEffect } from "react";
import { students } from "@/data/students";

export default function AdminBangkuPage() {
  const [isLogged, setIsLogged] = useState(false);
  const [isSuperRole, setIsSuperRole] = useState(false);
  const [password, setPassword] = useState("");
  const [priorities, setPriorities] = useState<number[]>([]);
  const [customPlacements, setCustomPlacements] = useState<{ deskIndex: number, studentId: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cek auth aja dari fetch GET
    fetch("/api/bangku")
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          // kalau ngga eror brti sebenernya API bangku GET bs diakses siapa aja
          // auth cuma buat nentuin menu setting kebuka atau engga.
          // tp gpp kita bikin simple aja. 
        }
        if (data.priorityIds) setPriorities(data.priorityIds);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogin = async () => {
    const res = await fetch("/api/auth", {
      method: "POST",
      body: JSON.stringify({ password })
    });
    const data = await res.json();
    if (res.ok) {
      setIsLogged(true);
      if (data.isSuper) setIsSuperRole(true);
    } else {
      alert("Password lu salah maseh");
    }
  };

  const handleGenerate = async () => {
    if(!confirm("Yakin mau ngacak ulang bangku?")) return;
    const res = await fetch("/api/bangku", {
      method: "POST",
      body: JSON.stringify({ 
        priorityIds: priorities,
        customPlacements: isSuperRole ? customPlacements : []
      })
    });
    if (res.ok) {
      alert("Ud kelar diacak! Liat hasilnya di /bangku");
    } else {
      alert("Gagal. Lu beneran admin kah?");
    }
  };

  const togglePriority = (id: number) => {
    if (priorities.includes(id)) {
      setPriorities(priorities.filter(p => p !== id));
    } else {
      setPriorities([...priorities, id]);
    }
  };

  if(!isLogged) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Admin Bangku</h1>
        <input 
          type="password" 
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          className="p-2 bg-gray-800 text-white rounded mb-2 border border-gray-600"
        />
        <button onClick={handleLogin} className="bg-blue-600 px-4 py-2 rounded">Login</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8">🛠️ Dashboard Rolling Bangku</h1>
      
      <div className="mb-6 bg-gray-900 p-4 rounded-lg border border-gray-700">
        <h2 className="text-xl mb-4 font-semibold">Pilih Siswa Prioritas (Wajib Duduk Depan)</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {students.map(s => (
            <label key={s.id} className="flex flex-row items-center cursor-pointer gap-2 bg-gray-800 p-2 rounded">
              <input 
                type="checkbox"
                checked={priorities.includes(s.id)}
                onChange={() => togglePriority(s.id)}
                className="w-4 h-4"
              />
              <span className="text-sm truncate">{s.nama} ({s.gender})</span>
            </label>
          ))}
        </div>
      </div>

      {isSuperRole && (
        <div className="mb-6 bg-[#2a1111] p-5 rounded-lg border border-red-900 border-dashed animate-pulse-slow">
          <h2 className="text-xl mb-1 font-black text-red-500">💀 MENU MANIPULASI (SUPER ADMIN)</h2>
          <p className="text-xs text-red-300 mb-4 font-mono">Index = nomor meja (0,2.. kiri) (1,3.. kanan). Data ini bakal niban (override) setingan bawaan.</p>
          
          <div className="flex flex-col gap-3 mb-4">
            {customPlacements.map((cp, idx) => (
              <div key={idx} className="flex gap-2 items-center bg-black/50 p-2 rounded">
                <select 
                  className="p-2 bg-gray-800 text-white font-bold rounded text-sm w-full border border-gray-600 outline-none"
                  value={cp.studentId}
                  onChange={(e) => {
                    const fresh = [...customPlacements];
                    fresh[idx].studentId = parseInt(e.target.value);
                    setCustomPlacements(fresh);
                  }}
                >
                  {students.map(s => <option key={s.id} value={s.id}>{s.nama.toUpperCase()} - {s.gender}</option>)}
                </select>
                <span className="text-gray-400 text-[10px] uppercase font-bold tracking-widest text-center whitespace-nowrap">Meja Idx:</span>
                <input 
                  type="number" min="0" max="31" 
                  className="w-16 p-2 bg-gray-800 text-blue-400 font-bold rounded text-sm text-center border border-gray-600 outline-none"
                  value={cp.deskIndex}
                  onChange={(e) => {
                    const fresh = [...customPlacements];
                    fresh[idx].deskIndex = parseInt(e.target.value);
                    setCustomPlacements(fresh);
                  }}
                />
                <button 
                  onClick={() => setCustomPlacements(customPlacements.filter((_, i) => i !== idx))} 
                  className="bg-red-600 w-10 h-10 flex items-center justify-center rounded font-bold hover:bg-red-500 text-white text-xl"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          
          <button 
            onClick={() => setCustomPlacements([...customPlacements, { deskIndex: 0, studentId: students[0].id }])} 
            className="text-xs bg-red-900/50 border border-red-500/50 px-4 py-2 rounded shadow hover:bg-red-800 font-bold text-white transition-all w-full text-center"
          >
            + ADD KURSI SILUMAN
          </button>
        </div>
      )}

      <button 
        onClick={handleGenerate}
        className="w-full bg-green-600 hover:bg-green-500 font-bold py-4 rounded-lg text-xl transition-all"
      >
        🎲 GENERATE BANGKU BARU
      </button>
    </div>
  );
}
