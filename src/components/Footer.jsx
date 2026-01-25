import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { PROFILE } from '../data';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-white pt-24 pb-12 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
                    {/* Brand */}
                    <div className="col-span-1 lg:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-8">
                            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white font-black text-xl">
                                S
                            </div>
                            <span className="text-2xl font-black tracking-tighter text-white">
                                SAZIME<span className="text-red-600">.</span>
                            </span>
                        </Link>
                        <p className="text-slate-400 leading-relaxed mb-8">
                            Solusi terpadu untuk kebutuhan digital printing profesional dan kerajinan sangkar burung berkualitas premium.
                        </p>
                        <div className="flex gap-4">
                            {[
                                { icon: Instagram, link: `https://instagram.com/${PROFILE.instagram.replace('@', '')}` },
                                { icon: Facebook, link: '#' },
                                { icon: Mail, link: `mailto:${PROFILE.email}` }
                            ].map((social, idx) => (
                                <a
                                    key={idx}
                                    href={social.link}
                                    className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:bg-red-600 hover:text-white transition-all transform hover:-translate-y-1"
                                >
                                    <social.icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="lg:ml-auto">
                        <h4 className="text-white font-black uppercase text-xs tracking-widest mb-8 border-b border-white/10 pb-4 inline-block">Menu Navigasi</h4>
                        <ul className="space-y-4">
                            {['Beranda', 'Tentang', 'Produk', 'Kontak'].map((item) => (
                                <li key={item}>
                                    <Link
                                        to={item === 'Beranda' ? '/' : `/${item.toLowerCase()}`}
                                        className="text-slate-400 hover:text-red-500 font-bold transition-colors flex items-center gap-2 group"
                                    >
                                        <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-white font-black uppercase text-xs tracking-widest mb-8 border-b border-white/10 pb-4 inline-block">Layanan Kami</h4>
                        <ul className="space-y-4">
                            {['Digital Printing', 'Sangkar Burung', 'Aksesoris Burung', 'Solusi Bisnis'].map((item) => (
                                <li key={item} className="text-slate-400 font-bold hover:text-white transition-colors cursor-default">
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="bg-slate-800/50 p-8 rounded-[2rem] border border-white/5">
                        <h4 className="text-white font-black uppercase text-xs tracking-widest mb-8">Hubungi Kami</h4>
                        <ul className="space-y-6">
                            <li className="flex gap-4">
                                <div className="text-red-500 mt-1"><MapPin size={18} /></div>
                                <div className="text-sm font-medium text-slate-300 leading-relaxed">
                                    {PROFILE.address}
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className="text-red-500 mt-1"><Phone size={18} /></div>
                                <div className="text-sm font-bold text-slate-100 italic">
                                    {PROFILE.phone}
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className="text-red-500 mt-1"><Mail size={18} /></div>
                                <div className="text-sm font-bold text-slate-100">
                                    {PROFILE.email}
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                        © 2024 SAZIME DIGITAL. ALL RIGHTS RESERVED.
                    </p>
                    <div className="flex gap-8">
                        {['Privacy Policy', 'Terms of Service'].map(text => (
                            <a key={text} href="#" className="text-[10px] font-black uppercase tracking-tighter text-slate-600 hover:text-white transition">
                                {text}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
