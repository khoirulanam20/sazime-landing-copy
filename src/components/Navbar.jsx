import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, ChevronRight, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Tentang', path: '/tentang' },
    { name: 'Produk', path: '/produk' },
    { name: 'Cek NFC', path: '/cek-nfc' },
    { name: 'Kontak', path: '/kontak' },
];

const Navbar = () => {
    const { user, ready } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (!isOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
        };
    }, [isOpen]);

    const closeMenu = () => setIsOpen(false);

    const linkClassDesktop = ({ isActive }) =>
        `text-sm font-bold uppercase tracking-widest transition-colors
        ${isActive ? 'text-red-600' : isScrolled ? 'text-slate-600 hover:text-red-600' : 'text-slate-700 hover:text-red-600'}`;

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 ${
                isScrolled ? 'bg-white shadow-lg py-3' : 'bg-transparent py-6'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center gap-3">
                <Link to="/" className="flex items-center gap-2 shrink-0 min-w-0" onClick={closeMenu}>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-red-600 rounded-xl flex items-center justify-center text-white font-black text-lg sm:text-xl shadow-lg shadow-red-200 shrink-0">
                        S
                    </div>
                    <span className="text-lg sm:text-2xl font-black tracking-tighter text-slate-900 truncate">
                        SAZIME<span className="text-red-600">.ID</span>
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-6 lg:gap-8">
                    <div className="hidden md:flex items-center gap-4 lg:gap-6">
                        {navLinks.map((link) => (
                            <NavLink key={link.name} to={link.path} className={linkClassDesktop}>
                                {link.name}
                            </NavLink>
                        ))}
                        {ready && user ? (
                            <NavLink
                                to="/profil"
                                className={({ isActive }) =>
                                    `flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-colors ${
                                        isActive ? 'text-red-600' : isScrolled ? 'text-slate-600 hover:text-red-600' : 'text-slate-700 hover:text-red-600'
                                    }`
                                }
                            >
                                <User size={18} aria-hidden /> Profil
                            </NavLink>
                        ) : ready ? (
                            <Link
                                to="/masuk"
                                className="bg-slate-900 text-white px-5 py-2.5 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-black transition"
                            >
                                Masuk
                            </Link>
                        ) : null}
                    </div>
                </div>

                <button
                    type="button"
                    className="md:hidden text-slate-900 p-2 -mr-2 rounded-xl hover:bg-white/60 transition"
                    onClick={() => setIsOpen((o) => !o)}
                    aria-expanded={isOpen}
                    aria-label={isOpen ? 'Tutup menu' : 'Buka menu'}
                >
                    {isOpen ? <X size={26} /> : <Menu size={26} />}
                </button>
            </div>

            <div
                role="dialog"
                aria-modal="true"
                aria-label="Menu navigasi"
                className={`fixed inset-0 z-[60] md:hidden flex flex-col bg-white transition-[transform] duration-300 ease-out ${
                    isOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
                }`}
            >
                <div className="shrink-0 p-4 sm:p-6 flex justify-between items-center gap-4 border-b border-slate-100 bg-white">
                    <span className="flex items-center gap-2 min-w-0">
                        <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white font-black text-xl shrink-0">
                            S
                        </div>
                        <span className="text-xl font-black tracking-tighter text-slate-900 truncate">
                            SAZIME<span className="text-red-600">.ID</span>
                        </span>
                    </span>
                    <button
                        type="button"
                        onClick={closeMenu}
                        className="p-2 rounded-xl text-slate-900 hover:bg-slate-100 shrink-0"
                        aria-label="Tutup menu"
                    >
                        <X size={28} />
                    </button>
                </div>

                <nav className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 sm:px-6 py-4 flex flex-col">
                    <ul className="flex flex-col gap-0">
                        {navLinks.map((link) => (
                            <li key={link.path} className="border-b border-slate-100">
                                <NavLink
                                    to={link.path}
                                    onClick={closeMenu}
                                    className={({ isActive }) =>
                                        `py-4 flex justify-between items-center gap-3 text-lg font-black uppercase tracking-tight ${
                                            isActive ? 'text-red-600' : 'text-slate-900'
                                        }`
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            {link.name}
                                            <ChevronRight
                                                className={`shrink-0 ${isActive ? 'text-red-600' : 'text-slate-300'}`}
                                                size={22}
                                                aria-hidden
                                            />
                                        </>
                                    )}
                                </NavLink>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-6 pt-2">
                        {ready && user ? (
                            <NavLink
                                to="/profil"
                                onClick={closeMenu}
                                className={({ isActive }) =>
                                    `flex items-center justify-between gap-3 w-full py-4 text-lg font-black uppercase tracking-tight border-t border-slate-200 ${
                                        isActive ? 'text-red-600' : 'text-slate-900'
                                    }`
                                }
                            >
                                <span className="flex items-center gap-2">
                                    <User size={22} aria-hidden /> Profil
                                </span>
                                <ChevronRight className="text-slate-300 shrink-0" size={22} aria-hidden />
                            </NavLink>
                        ) : ready ? (
                            <Link
                                to="/masuk"
                                onClick={closeMenu}
                                className="block w-full text-center bg-slate-900 text-white px-6 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-black transition"
                            >
                                Masuk
                            </Link>
                        ) : null}
                    </div>
                </nav>
            </div>
        </nav>
    );
};

export default Navbar;
