import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RegisterRulesDisclosure() {
    const { user } = useAuth();
    return (
        <details className="group rounded-2xl border border-slate-200 bg-slate-50/90 open:bg-white open:shadow-sm transition">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 font-black text-xs uppercase tracking-widest text-slate-600 group-open:text-slate-900">
                <span>Aturan registrasi pemilik</span>
                <ChevronDown className="w-5 h-5 shrink-0 transition group-open:rotate-180 text-slate-400" />
            </summary>
            <ul className="px-5 pb-5 text-xs font-medium text-slate-600 space-y-2 list-disc pl-8 leading-relaxed border-t border-slate-100 pt-4">
                <li>
                    <span className="font-bold text-slate-800">Akun:</span> Registrasi kepemilikan memakai Gmail
                    akun yang sama {!user && '(Anda belum masuk).'}
                </li>
                <li>
                    <span className="font-bold text-slate-800">Pembeli pertama:</span> Konfirmasi email Sazime; produk muncul di{' '}
                    <span className="font-bold">Profil → Produk saya</span>.
                </li>
                <li>
                    <span className="font-bold text-slate-800">Pindah tangan:</span> Konfirmasi lewat Gmail pemilik sebelumnya.
                </li>
            </ul>
        </details>
    );
}
