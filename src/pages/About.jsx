import React from 'react';
import { LANDING_DATA } from '../data';

const About = () => {
    const { hero, story, visionMission, values } = LANDING_DATA.tentang;

    return (
        <div className="pt-24 min-h-screen bg-white overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative py-32 px-6 overflow-hidden bg-slate-900 text-white">
                <div className="absolute inset-0 opacity-40">
                    <img src={hero.image} alt="Background" className="w-full h-full object-cover grayscale" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
                <div className="relative z-10 max-w-4xl mx-auto text-center animate-in slide-in-from-bottom duration-1000">
                    <span className="bg-red-600 text-white px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.2em] mb-8 inline-block shadow-lg shadow-red-900/20">
                        {hero.badge}
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black mb-10 italic tracking-tighter leading-tight uppercase">
                        {hero.title.split(' ').map((word, i) => (
                            <span key={i} className={word === '&' || word === 'Kualitas' ? 'text-red-600' : ''}>{word} </span>
                        ))}
                    </h1>
                    <div className="w-24 h-2 bg-red-600 mx-auto mb-10 rounded-full shadow-lg shadow-red-600/50"></div>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
                        {hero.subtitle}
                    </p>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-24 px-6 bg-white overflow-hidden relative">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
                    <div className="relative animate-in slide-in-from-left duration-1000">
                        <div className="absolute -top-10 -left-10 w-48 h-48 bg-red-600/5 rounded-full blur-[80px]"></div>
                        <div className="relative z-10 rounded-[4rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.1)] border-8 border-white">
                            <img src={story.image} alt="Story" className="w-full h-full object-cover transform hover:scale-105 transition duration-1000" />
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-56 h-56 bg-red-600 rounded-[4rem] shadow-2xl shadow-red-200 -z-0 hidden lg:block transform rotate-12"></div>
                    </div>
                    <div className="animate-in slide-in-from-right duration-1000">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-1 bg-red-600 rounded-full"></div>
                            <h3 className="text-red-600 font-black uppercase tracking-[0.3em] text-xs">{story.subtitle}</h3>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black mb-10 italic tracking-tighter text-slate-900">{story.title}</h2>
                        <div className="space-y-6">
                            <p className="text-slate-500 leading-relaxed text-lg font-medium">
                                {story.content}
                            </p>
                        </div>
                        <div className="mt-12 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 inline-block">
                            <div className="flex items-center gap-6">
                                <div className="text-5xl font-black text-red-600 italic tracking-tighter">10+</div>
                                <div className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 leading-tight">Tahun<br />Berkarya</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vision & Mission Section */}
            <section className="py-24 px-6 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-800 rounded-full blur-[100px] -ml-48 -mb-48"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="p-12 bg-white/5 rounded-[4rem] border border-white/10 backdrop-blur-md transform hover:-translate-y-2 transition duration-500">
                            <h2 className="text-3xl font-black mb-10 italic text-red-600 tracking-tighter flex items-center gap-4">
                                <span className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white text-base shadow-lg shadow-red-900/50">
                                    <i className="fas fa-eye"></i>
                                </span>
                                Visi Kami
                            </h2>
                            <p className="text-2xl leading-[1.4] text-slate-300 italic font-medium">
                                "{visionMission.vision}"
                            </p>
                        </div>
                        <div className="p-12 bg-white/5 rounded-[4rem] border border-white/10 backdrop-blur-md transform hover:-translate-y-2 transition duration-500">
                            <h2 className="text-3xl font-black mb-10 italic text-red-600 tracking-tighter flex items-center gap-4">
                                <span className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white text-base shadow-lg shadow-red-900/50">
                                    <i className="fas fa-bullseye"></i>
                                </span>
                                Misi Kami
                            </h2>
                            <ul className="space-y-6">
                                {visionMission.mission.map((item, i) => (
                                    <li key={i} className="flex gap-5 items-start group">
                                        <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center shrink-0 shadow-lg shadow-red-900/50 group-hover:scale-110 transition">
                                            <i className="fas fa-check text-[10px]"></i>
                                        </div>
                                        <p className="text-slate-300 text-lg font-medium leading-tight group-hover:text-white transition">{item}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-24 px-6 bg-slate-50 relative border-t border-slate-100">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20 animate-in fade-in duration-1000">
                        <h2 className="text-4xl md:text-5xl font-black text-center italic tracking-tighter text-slate-900">{values.title}</h2>
                        <div className="w-24 h-2 bg-red-600 mx-auto mt-6 rounded-full shadow-lg shadow-red-200"></div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.items.map((item) => (
                            <div key={item.id} className="p-10 bg-white rounded-[3.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 group text-center border border-slate-100 transform hover:-translate-y-2">
                                <div className="w-20 h-20 bg-red-600/5 text-red-600 rounded-[2rem] flex items-center justify-center text-3xl mx-auto mb-8 group-hover:bg-red-600 group-hover:text-white transition-all duration-700 shadow-sm">
                                    <i className={`fas ${item.icon}`}></i>
                                </div>
                                <h3 className="text-xl font-black mb-4 tracking-tight group-hover:text-red-600 transition">{item.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed font-medium uppercase tracking-widest">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
