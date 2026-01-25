import React, { useState } from 'react';
import { Edit3, X, Save, Upload, Link as LinkIcon, Plus, Trash2 } from 'lucide-react';

// Modal Component for Editing
const EditModal = ({ isOpen, onClose, title, children, onSave }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200 pointer-events-none">
            {/* Modal Container */}
            <div className="relative bg-white w-full max-w-3xl max-h-[90vh] rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.1)] overflow-hidden animate-in zoom-in-95 duration-200 pointer-events-auto border border-slate-200">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-red-700 to-red-800 text-white p-6 flex items-center justify-between z-10">
                    <div>
                        <h3 className="text-2xl font-black uppercase tracking-tight">{title}</h3>
                        <p className="text-xs text-red-100 mt-1 font-medium">Edit konten dan klik simpan perubahan</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-xl transition"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto max-h-[calc(90vh-180px)] custom-scrollbar">
                    {children}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 p-6 flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-4 bg-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-300 transition text-sm uppercase tracking-wide"
                    >
                        Batal
                    </button>
                    <button
                        onClick={onSave}
                        className="flex-1 px-6 py-4 bg-red-700 text-white rounded-2xl font-bold hover:bg-red-800 transition flex items-center justify-center gap-2 text-sm uppercase tracking-wide shadow-lg shadow-red-200"
                    >
                        <Save className="w-5 h-5" />
                        Simpan Perubahan
                    </button>
                </div>
            </div>
        </div>
    );
};

// Image Upload Component
const ImageUploadField = ({ label, value, onChange }) => {
    const [mode, setMode] = useState('url');
    const [previewUrl, setPreviewUrl] = useState(value);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert('Ukuran file maksimal 2MB');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
                onChange(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
                {label}
            </label>

            {/* Mode Toggle */}
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => setMode('url')}
                    className={`flex-1 px-4 py-2 rounded-xl text-xs font-bold transition ${mode === 'url'
                        ? 'bg-red-700 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                >
                    <LinkIcon className="w-3 h-3 inline mr-1" />
                    URL Link
                </button>
                <button
                    type="button"
                    onClick={() => setMode('upload')}
                    className={`flex-1 px-4 py-2 rounded-xl text-xs font-bold transition ${mode === 'upload'
                        ? 'bg-red-700 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                >
                    <Upload className="w-3 h-3 inline mr-1" />
                    Upload File
                </button>
            </div>

            {/* Input */}
            {mode === 'url' ? (
                <input
                    type="text"
                    value={value}
                    onChange={(e) => {
                        onChange(e.target.value);
                        setPreviewUrl(e.target.value);
                    }}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-red-500"
                />
            ) : (
                <div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        id={`file-${label}`}
                    />
                    <label
                        htmlFor={`file-${label}`}
                        className="block w-full px-4 py-3 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl text-sm font-bold text-slate-600 hover:border-red-500 hover:text-red-600 transition cursor-pointer text-center"
                    >
                        <Upload className="w-4 h-4 inline mr-2" />
                        Pilih Gambar (Max 2MB)
                    </label>
                </div>
            )}

            {/* Preview */}
            {previewUrl && (
                <div className="relative rounded-xl overflow-hidden border-2 border-slate-200">
                    <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover" />
                </div>
            )}
        </div>
    );
};

// Editable Section Component with Hover Effect
const EditableSection = ({ children, onEdit, label, className = "" }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className={`relative ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {children}

            {/* Edit Overlay */}
            {isHovered && (
                <div className="absolute inset-0 bg-red-700/10 border-2 border-red-700 border-dashed rounded-2xl pointer-events-none animate-in fade-in duration-200 z-10">
                    <div className="absolute top-4 right-4 pointer-events-auto">
                        <button
                            onClick={onEdit}
                            className="px-6 py-3 bg-red-700 text-white rounded-xl font-bold text-sm shadow-2xl hover:bg-red-800 transition flex items-center gap-2 uppercase tracking-wide"
                        >
                            <Edit3 className="w-4 h-4" />
                            Edit {label}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Main Beranda Preview Component
const BerandaPreview = ({ data, onUpdate }) => {
    const [editingSection, setEditingSection] = useState(null);
    const [tempData, setTempData] = useState({});

    const openEditModal = (section, currentData) => {
        setEditingSection(section);
        setTempData({ ...currentData });
    };

    const closeEditModal = () => {
        setEditingSection(null);
        setTempData({});
    };

    const saveChanges = () => {
        onUpdate(editingSection, tempData);
        closeEditModal();
    };

    return (
        <div className="space-y-6">
            {/* Info Header */}
            <div className="bg-gradient-to-r from-red-700 to-red-800 text-white p-6 rounded-[2rem] shadow-lg">
                <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Preview Halaman Beranda</h2>
                <p className="text-sm text-red-100 font-medium">Arahkan kursor ke setiap section untuk mengedit konten. Perubahan akan tersimpan setelah Anda klik tombol Simpan.</p>
            </div>

            {/* Full Preview Container */}
            <div className="bg-slate-50 rounded-[2rem] overflow-hidden border-2 border-slate-200 shadow-sm">

                {/* Hero Section */}
                <EditableSection
                    label="Hero"
                    onEdit={() => openEditModal('hero', data.hero)}
                    className="bg-white"
                >
                    <section className="pt-20 pb-20 px-6 overflow-hidden">
                        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                            <div>
                                <span className="bg-red-100 text-primary px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 inline-block">
                                    {data.hero.badge || 'One Stop Business Solution'}
                                </span>
                                <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-8">
                                    {data.hero.title.split('SAZIME')[0]}
                                    <span className="text-primary italic text-5xl md:text-6xl">SAZIME</span>
                                </h1>
                                <p className="text-lg text-slate-500 mb-10 leading-relaxed">
                                    {data.hero.subtitle}
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <div className="bg-secondary text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:scale-105 transition transform cursor-pointer">
                                        {data.hero.ctaText} <i className="fas fa-shopping-cart"></i>
                                    </div>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-4 pt-12">
                                        <div className="h-64 bg-primary rounded-[2rem] shadow-2xl shadow-red-200 flex items-end p-6">
                                            <span className="text-white font-bold text-xl">Digital Printing</span>
                                        </div>
                                        <div className="h-48 bg-slate-200 rounded-[2rem] overflow-hidden">
                                            <img src={data.hero.image} alt="Hero" className="w-full h-full object-cover grayscale opacity-50" />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="h-48 bg-slate-800 rounded-[2rem] flex items-end p-6">
                                            <span className="text-white font-bold text-xl">Sangkar Burung</span>
                                        </div>
                                        <div className="h-64 bg-primary/10 rounded-[2rem] border-2 border-primary/20 flex items-center justify-center">
                                            <i className="fas fa-dove text-4xl text-primary"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </EditableSection>

                {/* Services Section */}
                <EditableSection
                    label="Services"
                    onEdit={() => openEditModal('services', data.services)}
                    className="bg-white border-t-2 border-slate-100"
                >
                    <section className="py-24 bg-white">
                        <div className="max-w-7xl mx-auto px-6 text-center">
                            <h2 className="text-3xl font-bold mb-16 italic text-slate-900 text-center">
                                {data.services.title.split('Sazime')[0]}
                                <span className="text-primary italic">Sazime</span>
                            </h2>
                            <div className="grid md:grid-cols-2 gap-12">
                                {data.services.items.map((item) => (
                                    <div key={item.id} className="p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 group hover:border-primary transition duration-500 text-left">
                                        <div className={`w-14 h-14 ${item.color === 'primary' ? 'bg-primary' : 'bg-secondary'} text-white rounded-2xl flex items-center justify-center text-xl mb-8`}>
                                            <i className={`fas ${item.icon}`}></i>
                                        </div>
                                        <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                                        <p className="text-slate-500 text-sm leading-relaxed">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </EditableSection>

                {/* Marketplace Section */}
                <EditableSection
                    label="Marketplace"
                    onEdit={() => openEditModal('marketplace', data.marketplace)}
                    className="bg-slate-50 border-t-2 border-slate-100 relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -ml-20 -mt-20 pointer-events-none"></div>
                    <section className="py-24 relative z-10 px-6">
                        <div className="max-w-7xl mx-auto">
                            <div className="text-center mb-16">
                                <span className="text-primary font-bold text-xs uppercase tracking-widest mb-2 block">Official Store</span>
                                <h2 className="text-3xl font-bold italic text-slate-900">
                                    {data.marketplace.title.split('Marketplace')[0]}
                                    <span className="text-primary">Marketplace</span>
                                </h2>
                                <p className="text-slate-500 mt-4 max-w-xl mx-auto">{data.marketplace.subtitle}</p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-8">
                                {data.marketplace.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`group bg-white p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl border border-slate-100 transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden hover-${item.color}`}
                                    >
                                        <div className={`absolute top-0 right-0 w-24 h-24 bg-${item.color}-soft rounded-bl-[2.5rem] -mr-4 -mt-4 transition group-hover:scale-110`}></div>
                                        <div className={`w-16 h-16 bg-${item.color}-soft rounded-2xl flex items-center justify-center text-${item.color} text-2xl mb-6 relative z-10`}>
                                            <i className={`${item.icon.startsWith('fa-') ? 'fas' : 'fab'} ${item.icon}`}></i>
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                                        <p className="text-slate-400 text-sm mb-8">{item.description}</p>
                                        <span className={`inline-flex items-center text-${item.color} font-bold text-sm bg-${item.color}-soft px-4 py-2 rounded-xl group-hover:bg-primary group-hover:text-white transition-colors`}>
                                            Kunjungi Toko <i className="fas fa-arrow-right ml-2"></i>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </EditableSection>

                {/* Testimonials Section */}
                <EditableSection
                    label="Testimonials"
                    onEdit={() => openEditModal('testimonials', data.testimonials)}
                    className="bg-white border-t-2 border-slate-100"
                >
                    <section className="py-24 bg-white">
                        <div className="max-w-7xl mx-auto px-6">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl font-bold italic">{data.testimonials.title}</h2>
                                <p className="text-slate-500 mt-2">{data.testimonials.subtitle}</p>
                            </div>
                            <div className="grid md:grid-cols-3 gap-8">
                                {data.testimonials.items.map((item, idx) => (
                                    <div
                                        key={item.id}
                                        className={`p-8 rounded-[2rem] italic relative ${idx === 1 ? 'bg-secondary text-white' : 'bg-slate-50 text-slate-600'}`}
                                    >
                                        <i className={`fas fa-quote-left text-4xl absolute top-6 left-6 ${idx === 1 ? 'text-white/10' : 'text-primary/20'}`}></i>
                                        <p className="relative z-10 mb-6 font-medium leading-relaxed">"{item.comment}"</p>
                                        <div className="flex items-center gap-3">
                                            <img src={item.avatar} alt={item.name} className="w-10 h-10 rounded-full object-cover" />
                                            <div>
                                                <p className={`text-xs font-bold italic ${idx === 1 ? 'text-white' : 'text-slate-900'}`}>{item.name}</p>
                                                <p className="text-[10px] uppercase text-slate-400">{item.role}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </EditableSection>

                {/* Contact Section */}
                <EditableSection
                    label="Contact"
                    onEdit={() => openEditModal('contact', data.contact)}
                    className="bg-slate-50 border-t-2 border-slate-100"
                >
                    <section className="py-24 bg-slate-50">
                        <div className="max-w-7xl mx-auto px-6">
                            <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row">
                                <div className="md:w-1/2 p-12 bg-secondary text-white">
                                    <h2 className="text-3xl font-bold italic mb-6">{data.contact.title}</h2>
                                    <p className="text-slate-400 mb-10">{data.contact.subtitle}</p>

                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center">
                                                <i className="fas fa-phone"></i>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">Telepon/WA</p>
                                                <p className="font-bold">{data.contact.phone}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center">
                                                <i className="fas fa-envelope"></i>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">Email</p>
                                                <p className="font-bold">{data.contact.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center">
                                                <i className="fas fa-map-marker-alt"></i>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">Alamat Workshop</p>
                                                <p className="font-bold">{data.contact.address}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="md:w-1/2 p-12">
                                    <form className="space-y-4" onSubmit={e => e.preventDefault()}>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input type="text" placeholder="Nama" className="w-full px-6 py-4 rounded-2xl bg-slate-100 border-none outline-none font-semibold text-sm" />
                                            <input type="email" placeholder="Email" className="w-full px-6 py-4 rounded-2xl bg-slate-100 border-none outline-none font-semibold text-sm" />
                                        </div>
                                        <input type="text" placeholder="Subjek Layanan" className="w-full px-6 py-4 rounded-2xl bg-slate-100 border-none outline-none font-semibold text-sm" />
                                        <textarea placeholder="Pesan Anda..." rows="4" className="w-full px-6 py-4 rounded-2xl bg-slate-100 border-none outline-none font-semibold text-sm"></textarea>
                                        <button className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-red-200 hover:bg-red-700 transition">Kirim Pesan Sekarang</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </section>
                </EditableSection>
            </div>

            {/* Edit Modals */}
            {/* Hero Modal */}
            <EditModal
                isOpen={editingSection === 'hero'}
                onClose={closeEditModal}
                title="Edit Hero Section"
                onSave={saveChanges}
            >
                <div className="space-y-6">
                    <div>
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 block">Badge (Small Text)</label>
                        <input
                            type="text"
                            value={tempData.badge || ''}
                            onChange={(e) => setTempData({ ...tempData, badge: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-red-500"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 block">Judul Utama</label>
                        <textarea
                            value={tempData.title || ''}
                            onChange={(e) => setTempData({ ...tempData, title: e.target.value })}
                            rows="2"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-red-500"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 block">Subtitle / Deskripsi</label>
                        <textarea
                            value={tempData.subtitle || ''}
                            onChange={(e) => setTempData({ ...tempData, subtitle: e.target.value })}
                            rows="3"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-red-500"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 block">Teks Tombol CTA</label>
                            <input
                                type="text"
                                value={tempData.ctaText || ''}
                                onChange={(e) => setTempData({ ...tempData, ctaText: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-red-500"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 block">Link Tombol CTA</label>
                            <input
                                type="text"
                                value={tempData.ctaLink || ''}
                                onChange={(e) => setTempData({ ...tempData, ctaLink: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-red-500"
                            />
                        </div>
                    </div>
                    <ImageUploadField
                        label="Gambar Hero (Display)"
                        value={tempData.image || ''}
                        onChange={(value) => setTempData({ ...tempData, image: value })}
                    />
                </div>
            </EditModal>

            {/* Services Modal */}
            <EditModal
                isOpen={editingSection === 'services'}
                onClose={closeEditModal}
                title="Edit Services (Dua Pilar)"
                onSave={saveChanges}
            >
                <div className="space-y-6">
                    <div>
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 block">Judul Section</label>
                        <input
                            type="text"
                            value={tempData.title || ''}
                            onChange={(e) => setTempData({ ...tempData, title: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-red-500"
                        />
                    </div>
                    <div className="space-y-4">
                        {(tempData.items || []).map((item, index) => (
                            <div key={item.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                <p className="text-xs font-bold text-slate-500 mb-3">Pilar #{index + 1}</p>
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        placeholder="FontAwesome Icon (e.g. fa-print)"
                                        value={item.icon}
                                        onChange={(e) => {
                                            const newItems = [...tempData.items];
                                            newItems[index].icon = e.target.value;
                                            setTempData({ ...tempData, items: newItems });
                                        }}
                                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Judul"
                                        value={item.title}
                                        onChange={(e) => {
                                            const newItems = [...tempData.items];
                                            newItems[index].title = e.target.value;
                                            setTempData({ ...tempData, items: newItems });
                                        }}
                                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold"
                                    />
                                    <textarea
                                        placeholder="Deskripsi"
                                        value={item.description}
                                        onChange={(e) => {
                                            const newItems = [...tempData.items];
                                            newItems[index].description = e.target.value;
                                            setTempData({ ...tempData, items: newItems });
                                        }}
                                        rows="2"
                                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </EditModal>

            {/* Marketplace Modal */}
            <EditModal
                isOpen={editingSection === 'marketplace'}
                onClose={closeEditModal}
                title="Edit Marketplace Links"
                onSave={saveChanges}
            >
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 block">Judul Section</label>
                            <input
                                type="text"
                                value={tempData.title || ''}
                                onChange={(e) => setTempData({ ...tempData, title: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-red-500"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 block">Subtitle Section</label>
                            <textarea
                                value={tempData.subtitle || ''}
                                onChange={(e) => setTempData({ ...tempData, subtitle: e.target.value })}
                                rows="2"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-red-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        {(tempData.items || []).map((item, index) => (
                            <div key={item.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                <p className="text-xs font-bold text-slate-500 mb-3">{item.name} Config</p>
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Short Description"
                                        value={item.description}
                                        onChange={(e) => {
                                            const newItems = [...tempData.items];
                                            newItems[index].description = e.target.value;
                                            setTempData({ ...tempData, items: newItems });
                                        }}
                                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Store Link"
                                        value={item.link}
                                        onChange={(e) => {
                                            const newItems = [...tempData.items];
                                            newItems[index].link = e.target.value;
                                            setTempData({ ...tempData, items: newItems });
                                        }}
                                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </EditModal>

            {/* Testimonials Modal */}
            <EditModal
                isOpen={editingSection === 'testimonials'}
                onClose={closeEditModal}
                title="Edit Testimonials"
                onSave={saveChanges}
            >
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 block">Judul Section</label>
                            <input
                                type="text"
                                value={tempData.title || ''}
                                onChange={(e) => setTempData({ ...tempData, title: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-red-500"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 block">Subtitle Section</label>
                            <input
                                type="text"
                                value={tempData.subtitle || ''}
                                onChange={(e) => setTempData({ ...tempData, subtitle: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-red-500"
                            />
                        </div>
                    </div>
                    <div className="space-y-4">
                        {(tempData.items || []).map((item, index) => (
                            <div key={item.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                <div className="flex justify-between items-center mb-3">
                                    <p className="text-xs font-bold text-slate-500">Testimoni #{index + 1}</p>
                                    <button
                                        onClick={() => {
                                            const newItems = tempData.items.filter((_, i) => i !== index);
                                            setTempData({ ...tempData, items: newItems });
                                        }}
                                        className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            placeholder="Nama"
                                            value={item.name}
                                            onChange={(e) => {
                                                const newItems = [...tempData.items];
                                                newItems[index].name = e.target.value;
                                                setTempData({ ...tempData, items: newItems });
                                            }}
                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Role/Profesi"
                                            value={item.role}
                                            onChange={(e) => {
                                                const newItems = [...tempData.items];
                                                newItems[index].role = e.target.value;
                                                setTempData({ ...tempData, items: newItems });
                                            }}
                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
                                        />
                                    </div>
                                    <textarea
                                        placeholder="Komentar"
                                        value={item.comment}
                                        onChange={(e) => {
                                            const newItems = [...tempData.items];
                                            newItems[index].comment = e.target.value;
                                            setTempData({ ...tempData, items: newItems });
                                        }}
                                        rows="2"
                                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
                                    />
                                    <ImageUploadField
                                        label="Avatar"
                                        value={item.avatar}
                                        onChange={(val) => {
                                            const newItems = [...tempData.items];
                                            newItems[index].avatar = val;
                                            setTempData({ ...tempData, items: newItems });
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                        <button
                            onClick={() => {
                                const newItem = { id: Date.now(), name: 'Baru', role: 'Pelanggan', comment: '', avatar: '' };
                                setTempData({ ...tempData, items: [...(tempData.items || []), newItem] });
                            }}
                            className="w-full py-3 bg-white border-2 border-dashed border-slate-300 text-slate-500 rounded-xl font-bold text-xs hover:border-red-500 hover:text-red-700 transition"
                        >
                            <Plus className="w-4 h-4 inline mr-2" /> Tambah Testimoni
                        </button>
                    </div>
                </div>
            </EditModal>

            {/* Contact Modal */}
            <EditModal
                isOpen={editingSection === 'contact'}
                onClose={closeEditModal}
                title="Edit Contact Info"
                onSave={saveChanges}
            >
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 block">Judul Section</label>
                            <input
                                type="text"
                                value={tempData.title || ''}
                                onChange={(e) => setTempData({ ...tempData, title: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-red-500"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 block">Subtitle Section</label>
                            <input
                                type="text"
                                value={tempData.subtitle || ''}
                                onChange={(e) => setTempData({ ...tempData, subtitle: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-red-500"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 block">Telepon / WhatsApp</label>
                            <input
                                type="text"
                                value={tempData.phone || ''}
                                onChange={(e) => setTempData({ ...tempData, phone: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-red-500"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 block">Email</label>
                            <input
                                type="text"
                                value={tempData.email || ''}
                                onChange={(e) => setTempData({ ...tempData, email: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-red-500"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 block">Alamat</label>
                            <textarea
                                value={tempData.address || ''}
                                onChange={(e) => setTempData({ ...tempData, address: e.target.value })}
                                rows="3"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-red-500"
                            />
                        </div>
                    </div>
                </div>
            </EditModal>
        </div>
    );
};

export default BerandaPreview;
