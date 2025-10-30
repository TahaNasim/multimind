"use client";

import * as React from "react";

export function Sheet({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export function SheetTrigger({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="text-white hover:text-blue-400 transition">
      {children}
    </button>
  );
}

export function SheetContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-slate-800 p-6 rounded-2xl shadow-lg w-[400px] text-white">
        {children}
      </div>
    </div>
  );
}

export function SheetHeader({ children }: { children: React.ReactNode }) {
  return <div className="mb-4">{children}</div>;
}

export function SheetTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-lg font-semibold">{children}</h2>;
}

export function SheetDescription({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-gray-400 mb-2">{children}</p>;
}
