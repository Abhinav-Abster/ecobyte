import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-zinc-950 text-zinc-50 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-950/30 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-950/30 blur-[120px] pointer-events-none" />

      <div className="z-10 w-full max-w-md px-4 py-8">
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center justify-center h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-3 shadow-inner shadow-emerald-500/10">
            <span className="text-2xl">🌿</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent">
            EcoByte
          </h1>
          <p className="text-zinc-400 text-sm mt-1">Understand & reduce your digital carbon footprint</p>
        </div>
        {children}
      </div>
    </div>
  );
}
