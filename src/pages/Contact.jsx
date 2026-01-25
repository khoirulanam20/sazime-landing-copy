import React from 'react';
import { Phone, Mail, MapPin, Instagram, Facebook, Clock, Send, ChevronRight } from 'lucide-react';
import { PROFILE } from '../data';

const Contact = () => {
    return (
        <div className="pt-24 min-h-screen bg-slate-50">
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom duration-700">
                    <span className="bg-red-100 text-red-600 px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.2em] mb-8 inline-block shadow-sm">
                        Contact Us
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-slate-900 mb-8 leading-tight">
                        Hubungi Tim <span className="text-red-600">Sazime</span>
                    </h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
                        Kami siap membantu kebutuhan digital printing dan hobi Anda. Silakan hubungi kami melalui saluran berikut.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-12 mb-20">
                    {/* Contact Cards */}
                    <div className="lg:col-span-1 space-y-6">
                        {[
                            {
                                icon: Phone,
                                title: 'WhatsApp & Telepon',
                                val1: PROFILE.phone,
                                val2: 'Tersedia: 08:00 - 17:00',
                                color: 'bg-emerald-50 text-emerald-600'
                            },
                            {
                                icon: Mail,
                                title: 'Email Business',
                                val1: PROFILE.email,
                                val2: 'Respon dalam 1x24 jam',
                                color: 'bg-blue-50 text-blue-600'
                            },
                            {
                                icon: Clock,
                                title: 'Jam Operasional',
                                val1: 'Senin - Sabtu',
                                val2: '08:00 - 17:00 WIB',
                                color: 'bg-red-50 text-red-600'
                            }
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 flex gap-6 items-start group hover:border-red-600 transition-all duration-500">
                                <div className={`w-16 h-16 shrink-0 rounded-[1.5rem] flex items-center justify-center ${item.color} transform group-hover:rotate-12 transition-all`}>
                                    <item.icon size={28} />
                                </div>
                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{item.title}</h3>
                                    <p className="text-xl font-black text-slate-900 tracking-tight mb-1">{item.val1}</p>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{item.val2}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-12 md:p-16 rounded-[4rem] shadow-sm border border-slate-100 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>

                            <h2 className="text-3xl font-black italic tracking-tighter text-slate-900 mb-10">Kirim Pesan Langsung</h2>
                            <form className="space-y-6 relative z-10" onSubmit={e => e.preventDefault()}>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Nama Lengkap</label>
                                        <input type="text" placeholder="Contoh: Budi Santoso" className="w-full px-8 py-5 rounded-3xl bg-slate-50 border-2 border-slate-50 outline-none focus:border-red-600 focus:bg-white transition font-bold" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Alamat Email</label>
                                        <input type="email" placeholder="budi@email.com" className="w-full px-8 py-5 rounded-3xl bg-slate-50 border-2 border-slate-50 outline-none focus:border-red-600 focus:bg-white transition font-bold" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Subjek Pesan</label>
                                    <select className="w-full px-8 py-5 rounded-3xl bg-slate-50 border-2 border-slate-50 outline-none focus:border-red-600 focus:bg-white transition font-bold appearance-none">
                                        <option>Digital Printing (Banner, Stiker, dll)</option>
                                        <option>Sangkar Burung & Aksesoris</option>
                                        <option>Pengiriman & Marketplace</option>
                                        <option>Kerjasama & Lainnya</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Pesan Anda</label>
                                    <textarea placeholder="Tuliskan detail kebutuhan Anda di sini..." rows="5" className="w-full px-8 py-5 rounded-3xl bg-slate-50 border-2 border-slate-50 outline-none focus:border-red-600 focus:bg-white transition font-bold"></textarea>
                                </div>
                                <button className="w-full bg-red-600 text-white py-6 rounded-3xl font-black uppercase text-xs tracking-widest shadow-2xl shadow-red-100 hover:bg-black transition-all transform hover:-translate-y-2 flex items-center justify-center gap-3">
                                    Kirim Pesan Sekarang <Send size={18} />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Map & Address */}
                <div className="grid lg:grid-cols-5 gap-12 items-center">
                    <div className="lg:col-span-2">
                        <h2 className="text-4xl font-black italic tracking-tighter text-slate-900 mb-8 italic">Datang ke <span className="text-red-600">Workshop</span></h2>
                        <div className="flex gap-6 items-start mb-8">
                            <div className="w-16 h-16 shrink-0 bg-slate-900 text-white rounded-[2rem] flex items-center justify-center shadow-xl">
                                <MapPin size={28} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 mb-2">Alamat Lengkap</h3>
                                <p className="text-slate-500 font-medium leading-relaxed uppercase text-xs tracking-widest">{PROFILE.address}</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <a href="#" className="flex items-center gap-3 bg-white px-8 py-4 rounded-2xl border border-slate-100 shadow-sm font-black text-xs uppercase tracking-widest hover:border-red-600 transition group">
                                Buka Google Maps <ChevronRight size={16} className="text-red-600 group-hover:translate-x-1 transition" />
                            </a>
                        </div>
                    </div>
                    <div className="lg:col-span-3 h-[400px] bg-slate-200 rounded-[4rem] overflow-hidden shadow-inner relative group">
                        {/* Placeholder for map */}
                        <div className="absolute inset-0 bg-slate-300 animate-pulse group-hover:hidden"></div>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.226074121406!2d110.4223!3d-6.9839!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e708b49520ac3e1%3A0xda1098555e09f53e!2sSemarang%2C%20Jawa%20Tengah!5e0!3m2!1sid!2sid!4v1642921000000!5m2!1sid!2sid"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            title="Sazime Location"
                            className="relative z-10"
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
