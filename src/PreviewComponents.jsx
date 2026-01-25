// Preview Components for CMS
export const PreviewComponents = {
    Hero: ({ data }) => (
        <div className="relative h-[400px] rounded-2xl overflow-hidden">
            <img src={data.image} alt="Hero" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex items-center">
                <div className="px-12 text-white max-w-2xl">
                    <h1 className="text-4xl font-black mb-4">{data.title}</h1>
                    <p className="text-lg mb-6 opacity-90">{data.subtitle}</p>
                    <button className="bg-red-600 px-8 py-3 rounded-xl font-bold hover:bg-red-700 transition">
                        {data.ctaText}
                    </button>
                </div>
            </div>
        </div>
    ),

    Features: ({ data }) => (
        <div className="py-12 px-8 bg-slate-50 rounded-2xl">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-black text-slate-800 mb-2">{data.title}</h2>
                <p className="text-slate-600">{data.subtitle}</p>
            </div>
            <div className="grid grid-cols-2 gap-6">
                {data.items?.map((item) => (
                    <div key={item.id} className="bg-white p-6 rounded-xl border border-slate-200">
                        <div className="text-3xl mb-3">{item.icon}</div>
                        <h3 className="font-black text-slate-800 mb-2">{item.title}</h3>
                        <p className="text-sm text-slate-600">{item.description}</p>
                    </div>
                ))}
            </div>
        </div>
    ),

    ProductsShowcase: ({ data }) => (
        <div className="py-12 px-8">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-slate-800 mb-2">{data.title}</h2>
                <p className="text-slate-600 mb-6">{data.subtitle}</p>
                <button className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition">
                    {data.ctaText}
                </button>
            </div>
        </div>
    ),

    Testimonials: ({ data }) => (
        <div className="py-12 px-8 bg-slate-50 rounded-2xl">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-black text-slate-800 mb-2">{data.title}</h2>
                <p className="text-slate-600">{data.subtitle}</p>
            </div>
            <div className="grid grid-cols-1 gap-6">
                {data.items?.map((item) => (
                    <div key={item.id} className="bg-white p-6 rounded-xl border border-slate-200">
                        <div className="flex items-start gap-4">
                            <img src={item.avatar} alt={item.name} className="w-12 h-12 rounded-full" />
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <h4 className="font-black text-slate-800">{item.name}</h4>
                                    <span className="text-xs text-slate-500">• {item.role}</span>
                                </div>
                                <p className="text-sm text-slate-600 italic">"{item.comment}"</p>
                                <div className="flex gap-1 mt-2">
                                    {[...Array(item.rating || 5)].map((_, i) => (
                                        <span key={i} className="text-yellow-400">⭐</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    ),

    Stats: ({ data }) => (
        <div className="py-12 px-8">
            <h2 className="text-3xl font-black text-slate-800 text-center mb-10">{data.title}</h2>
            <div className="grid grid-cols-4 gap-6">
                {data.items?.map((item) => (
                    <div key={item.id} className="text-center p-6 bg-red-50 rounded-xl border-2 border-red-200">
                        <div className="text-3xl font-black text-red-600 mb-2">{item.number}</div>
                        <div className="text-sm font-bold text-slate-600">{item.label}</div>
                    </div>
                ))}
            </div>
        </div>
    ),

    Contact: ({ data }) => {
        const Phone = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>;
        const Mail = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
        const MapPin = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
        const Share = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>;
        const Clock = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

        return (
            <div className="py-12 px-8 bg-slate-800 text-white rounded-2xl">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-black mb-2">{data.title}</h2>
                    <p className="text-slate-300">{data.subtitle}</p>
                </div>
                <div className="grid grid-cols-2 gap-6 max-w-3xl mx-auto">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <Phone />
                            <span className="font-bold">{data.phone}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Mail />
                            <span className="font-bold">{data.email}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <MapPin />
                            <span className="font-bold text-sm">{data.address}</span>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <Share />
                            <span className="font-bold">{data.instagram}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Share />
                            <span className="font-bold">{data.facebook}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Clock />
                            <span className="font-bold text-sm">{data.operationalHours}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};
