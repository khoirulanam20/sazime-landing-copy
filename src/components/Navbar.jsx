import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, ChevronRight } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Beranda', path: '/' },
        { name: 'Tentang', path: '/tentang' },
        { name: 'Produk', path: '/produk' },
        { name: 'Cek NFC', path: '/cek-nfc' },
        { name: 'Kontak', path: '/kontak' },
    ];

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg py-3' : 'bg-transparent py-6'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-red-200">
                        S
                    </div>
                    <span className={`text-2xl font-black tracking-tighter ${isScrolled ? 'text-slate-900' : 'text-slate-900'}`}>
                        SAZIME<span className="text-red-600">.ID</span>
                    </span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            className={({ isActive }) => `
                text-sm font-bold uppercase tracking-widest transition-colors
                ${isActive ? 'text-red-600' : isScrolled ? 'text-slate-600 hover:text-red-600' : 'text-slate-700 hover:text-red-600'}
              `}
                        >
                            {link.name}
                        </NavLink>
                    ))}
                    <Link
                        to="/produk"
                        className="bg-red-600 text-white px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-red-200 hover:bg-red-700 transition transform hover:-translate-y-1"
                    >
                        Mulai Belanja
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-slate-900"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={`
        fixed inset-0 bg-white z-[60] md:hidden transition-transform duration-500 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
                <div className="p-6 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-12">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white font-black text-xl">
                                S
                            </div>
                            <span className="text-2xl font-black tracking-tighter text-slate-900">
                                SAZIME<span className="text-red-600">.</span>
                            </span>
                        </div>
                        <button onClick={() => setIsOpen(false)}>
                            <X size={32} className="text-slate-900" />
                        </button>
                    </div>

                    <div className="flex flex-col gap-6">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) => `
                  text-3xl font-black uppercase tracking-tighter flex justify-between items-center
                  ${isActive ? 'text-red-600' : 'text-slate-900'}
                `}
                            >
                                {({ isActive }) => (
                                    <>
                                        {link.name}
                                        <ChevronRight className={isActive ? 'text-red-600' : 'text-slate-200'} size={24} />
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </div>

                    <div className="mt-auto pt-10 border-t border-slate-100">
                        <p className="text-slate-400 text-sm font-medium mb-6 uppercase tracking-widest">Temukan Kami</p>
                        <Link
                            to="/produk"
                            onClick={() => setIsOpen(false)}
                            className="w-full bg-red-600 text-white py-5 rounded-3xl font-black text-center text-lg uppercase tracking-widest shadow-xl shadow-red-200"
                        >
                            Belanja Sekarang
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
