import React from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { User, Package, ClipboardList, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ProfileLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const nav = [
        { to: '/profil', end: true, label: 'Profil saya', icon: User },
        { to: '/profil/produk', label: 'Produk saya', icon: Package },
        { to: '/profil/registrasi-produk', label: 'Registrasi produk', icon: ClipboardList },
    ];

    return (
        <div className="pt-24 min-h-screen bg-slate-50 pb-24">
            <div className="max-w-6xl mx-auto px-6 py-10">
                <div className="mb-8">
                    <h1 className="text-4xl font-black italic tracking-tighter text-slate-900">
                        Profil <span className="text-red-600">pengguna</span>
                    </h1>
                    <p className="text-slate-500 font-medium mt-2">
                        Halo, <span className="font-bold text-slate-800">{user?.name}</span> — {user?.email}
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
                    <aside className="lg:col-span-4">
                        <nav className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                            {nav.map((item) => {
                                const IconComp = item.icon;
                                return (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    end={item.end}
                                    className={({ isActive }) =>
                                        `flex items-center justify-between px-6 py-5 border-b border-slate-100 last:border-0 font-black text-xs uppercase tracking-widest transition ${
                                            isActive ? 'bg-red-50 text-red-700' : 'text-slate-600 hover:bg-slate-50'
                                        }`
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            <span className="flex items-center gap-3">
                                                <IconComp size={18} className={isActive ? 'text-red-600' : 'text-slate-400'} />
                                                {item.label}
                                            </span>
                                            <ChevronRight size={16} className="opacity-40" />
                                        </>
                                    )}
                                </NavLink>
                                );
                            })}
                            <button
                                type="button"
                                onClick={() => {
                                    logout();
                                    navigate('/');
                                }}
                                className="w-full flex items-center justify-between px-6 py-5 font-black text-xs uppercase tracking-widest text-slate-500 hover:bg-slate-50 hover:text-red-600 transition"
                            >
                                <span className="flex items-center gap-3">
                                    <LogOut size={18} /> Keluar
                                </span>
                            </button>
                        </nav>
                        <Link
                            to="/cek-nfc"
                            className="mt-4 block text-center text-xs font-black text-red-600 uppercase tracking-widest hover:underline"
                        >
                            Verifikasi NFC
                        </Link>
                    </aside>
                    <div className="lg:col-span-8">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}
