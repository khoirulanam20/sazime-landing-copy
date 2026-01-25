import React from 'react';
import { Link } from 'react-router-dom';
import { LANDING_DATA } from '../data';

const Home = () => {
    const { hero, services, marketplace, testimonials, contact } = LANDING_DATA.beranda;

    return (
        <div className="overflow-x-hidden">
            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 overflow-hidden bg-white">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                    <div className="animate-in slide-in-from-left duration-700">
                        <span className="bg-red-100 text-red-600 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 inline-block">
                            {hero.badge || 'One Stop Business Solution'}
                        </span>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-8 tracking-tighter">
                            {hero.title.split('SAZIME')[0]}
                            <span className="text-red-600 italic text-5xl md:text-6xl">SAZIME</span>
                        </h1>
                        <p className="text-lg text-slate-500 mb-10 leading-relaxed font-medium">
                            {hero.subtitle}
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                to={hero.ctaLink}
                                className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:scale-105 transition transform cursor-pointer uppercase text-xs tracking-widest shadow-xl shadow-slate-200"
                            >
                                {hero.ctaText} <i className="fas fa-shopping-cart"></i>
                            </Link>
                        </div>
                    </div>
                    <div className="relative animate-in zoom-in duration-1000">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4 pt-12">
                                <div className="h-64 bg-red-600 rounded-[2rem] shadow-2xl shadow-red-200 flex items-end p-6">
                                    <span className="text-white font-bold text-xl uppercase tracking-tighter">Digital Printing</span>
                                </div>
                                <div className="h-48 bg-slate-200 rounded-[2rem] overflow-hidden">
                                    <img src={hero.image} alt="Hero" className="w-full h-full object-cover grayscale opacity-50" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="h-48 bg-slate-800 rounded-[2rem] flex items-end p-6">
                                    <span className="text-white font-bold text-xl uppercase tracking-tighter">Sangkar Burung</span>
                                </div>
                                <div className="h-64 bg-red-50 rounded-[2rem] border-2 border-red-100 flex items-center justify-center">
                                    <i className="fas fa-dove text-4xl text-red-600"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-24 bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-black mb-16 italic text-slate-900 text-center tracking-tighter">
                        {services.title.split('Sazime')[0]}
                        <span className="text-red-600 italic">Sazime</span>
                    </h2>
                    <div className="grid md:grid-cols-2 gap-12">
                        {services.items.map((item) => (
                            <div key={item.id} className="p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 group hover:border-red-600 transition duration-500 text-left hover:shadow-2xl hover:bg-white">
                                <div className={`w-14 h-14 ${item.color === 'primary' ? 'bg-red-600 shadow-red-200' : 'bg-slate-900 shadow-slate-200'} text-white rounded-2xl flex items-center justify-center text-xl mb-8 shadow-lg`}>
                                    <i className={`fas ${item.icon}`}></i>
                                </div>
                                <h3 className="text-2xl font-black mb-4 tracking-tight">{item.title}</h3>
                                <p className="text-slate-500 text-base leading-relaxed font-medium">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Marketplace Section */}
            <section className="py-24 bg-slate-50 relative overflow-hidden border-t border-slate-100">
                <div className="absolute top-0 left-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl -ml-20 -mt-20 pointer-events-none"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-red-600 font-bold text-xs uppercase tracking-widest mb-2 block">Official Store</span>
                        <h2 className="text-3xl md:text-5xl font-black italic text-slate-900 tracking-tighter">
                            {marketplace.title.split('Marketplace')[0]}
                            <span className="text-red-600">Marketplace</span>
                        </h2>
                        <p className="text-slate-500 mt-4 max-w-xl mx-auto font-medium">{marketplace.subtitle}</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {marketplace.items.map((item) => (
                            <a
                                key={item.id}
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`group bg-white p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl border border-slate-100 transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden`}
                            >
                                <div className={`absolute top-0 right-0 w-24 h-24 bg-${item.color}-soft rounded-bl-[2.5rem] -mr-4 -mt-4 transition group-hover:scale-110 opacity-50`}></div>
                                <div className={`w-16 h-16 bg-${item.color}-soft rounded-2xl flex items-center justify-center text-${item.color} text-2xl mb-6 relative z-10 shadow-sm font-black`}>
                                    <i className={`${item.icon.startsWith('fa-') ? 'fas' : 'fab'} ${item.icon}`}></i>
                                </div>
                                <h3 className="text-xl font-black mb-2 tracking-tight group-hover:text-red-600 transition">{item.name}</h3>
                                <p className="text-slate-400 text-sm mb-8 font-medium leading-relaxed">{item.description}</p>
                                <span className={`inline-flex items-center text-${item.color} font-black text-xs uppercase tracking-widest bg-${item.color}-soft px-5 py-2.5 rounded-xl group-hover:bg-red-600 group-hover:text-white transition-all`}>
                                    Kunjungi Toko <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition"></i>
                                </span>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-24 bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter">{testimonials.title}</h2>
                        <p className="text-slate-500 mt-2 font-medium">{testimonials.subtitle}</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.items.map((item, idx) => (
                            <div
                                key={item.id}
                                className={`p-10 rounded-[3rem] italic relative transition-all duration-500 hover:scale-105 ${idx === 1 ? 'bg-slate-900 text-white shadow-2xl shadow-slate-200' : 'bg-slate-50 text-slate-600 border border-slate-100'}`}
                            >
                                <i className={`fas fa-quote-left text-4xl absolute top-8 left-8 ${idx === 1 ? 'text-white/10' : 'text-red-600/10'}`}></i>
                                <p className="relative z-10 mb-8 text-lg font-medium leading-relaxed italic">"{item.comment}"</p>
                                <div className="flex items-center gap-4">
                                    <img src={item.avatar} alt={item.name} className="w-12 h-12 rounded-2xl object-cover shadow-lg" />
                                    <div>
                                        <p className={`text-sm font-black italic tracking-tight ${idx === 1 ? 'text-white' : 'text-slate-900'}`}>{item.name}</p>
                                        <p className="text-[10px] uppercase font-bold text-red-500 tracking-widest">{item.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-24 bg-slate-50 border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row border border-slate-100">
                        <div className="md:w-1/2 p-12 bg-slate-900 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                            <h2 className="text-3xl md:text-4xl font-black italic mb-6 tracking-tighter relative z-10">{contact.title}</h2>
                            <p className="text-slate-400 mb-10 font-medium leading-relaxed relative z-10">{contact.subtitle}</p>

                            <div className="space-y-8 relative z-10">
                                <div className="flex items-center gap-5 group">
                                    <div className="w-12 h-12 rounded-2xl bg-red-600 shadow-lg shadow-red-900/20 text-white flex items-center justify-center group-hover:scale-110 transition">
                                        <i className="fas fa-phone"></i>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase text-slate-500 font-bold tracking-[0.2em] mb-1">Telepon/WA</p>
                                        <p className="font-black text-lg tracking-tight italic">{contact.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-5 group">
                                    <div className="w-12 h-12 rounded-2xl bg-red-600 shadow-lg shadow-red-900/20 text-white flex items-center justify-center group-hover:scale-110 transition">
                                        <i className="fas fa-envelope"></i>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase text-slate-500 font-bold tracking-[0.2em] mb-1">Email</p>
                                        <p className="font-black text-lg tracking-tight italic">{contact.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-5 group">
                                    <div className="w-12 h-12 rounded-2xl bg-red-600 shadow-lg shadow-red-900/20 text-white flex items-center justify-center group-hover:scale-110 transition">
                                        <i className="fas fa-map-marker-alt"></i>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase text-slate-500 font-bold tracking-[0.2em] mb-1">Alamat Workshop</p>
                                        <p className="font-black text-sm max-w-[250px] leading-tight uppercase tracking-widest">{contact.address}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="md:w-1/2 p-12">
                            <form className="space-y-5" onSubmit={e => e.preventDefault()}>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Nama</label>
                                        <input type="text" placeholder="Nama Anda" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-50 outline-none focus:border-red-600 focus:bg-white transition font-bold text-sm" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Email</label>
                                        <input type="email" placeholder="Email Anda" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-50 outline-none focus:border-red-600 focus:bg-white transition font-bold text-sm" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Subjek</label>
                                    <input type="text" placeholder="Subjek Layanan" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-50 outline-none focus:border-red-600 focus:bg-white transition font-bold text-sm" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Pesan</label>
                                    <textarea placeholder="Pesan Anda..." rows="4" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-50 outline-none focus:border-red-600 focus:bg-white transition font-bold text-sm"></textarea>
                                </div>
                                <button className="w-full bg-red-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-red-200 hover:bg-black transition-all transform hover:-translate-y-1">
                                    Kirim Pesan Sekarang
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
