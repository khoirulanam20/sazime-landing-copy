import React, { useState } from 'react';
import { Edit3, X, Save, Upload, Link as LinkIcon, Plus, Trash2 } from 'lucide-react';

// Modal Component for Editing (Reusable)
const EditModal = ({ isOpen, onClose, title, children, onSave }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200 pointer-events-none">
            {/* Modal Container */}
            <div className="relative bg-white w-full max-w-3xl max-h-[90vh] rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.1)] overflow-hidden animate-in zoom-in-95 duration-200 pointer-events-auto border border-slate-200">
                <div className="sticky top-0 bg-gradient-to-r from-red-700 to-red-800 text-white p-6 flex items-center justify-between z-10">
                    <div>
                        <h3 className="text-2xl font-black uppercase tracking-tight">{title}</h3>
                        <p className="text-xs text-red-100 mt-1 font-medium">Edit konten dan klik simpan perubahan</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-8 overflow-y-auto max-h-[calc(90vh-180px)] custom-scrollbar">
                    {children}
                </div>
                <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 p-6 flex gap-4">
                    <button onClick={onClose} className="flex-1 px-6 py-4 bg-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-300 transition text-sm uppercase tracking-wide">
                        Batal
                    </button>
                    <button onClick={onSave} className="flex-1 px-6 py-4 bg-red-700 text-white rounded-2xl font-bold hover:bg-red-800 transition flex items-center justify-center gap-2 text-sm uppercase tracking-wide shadow-lg shadow-red-200">
                        <Save className="w-5 h-5" /> Simpan Perubahan
                    </button>
                </div>
            </div>
        </div>
    );
};

// Image Upload Field (Reusable)
const ImageUploadField = ({ label, value, onChange }) => {
    const [mode, setMode] = useState('url');
    const [previewUrl, setPreviewUrl] = useState(value);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
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
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block">{label}</label>
            <div className="flex gap-2">
                <button type="button" onClick={() => setMode('url')} className={`flex-1 px-4 py-2 rounded-xl text-xs font-bold transition ${mode === 'url' ? 'bg-red-700 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <LinkIcon className="w-3 h-3 inline mr-1" /> URL Link
                </button>
                <button type="button" onClick={() => setMode('upload')} className={`flex-1 px-4 py-2 rounded-xl text-xs font-bold transition ${mode === 'upload' ? 'bg-red-700 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <Upload className="w-3 h-3 inline mr-1" /> Upload File
                </button>
            </div>
            {mode === 'url' ? (
                <input type="text" value={value} onChange={(e) => { onChange(e.target.value); setPreviewUrl(e.target.value); }} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500" />
            ) : (
                <label className="block w-full px-4 py-3 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl text-sm font-bold text-slate-600 hover:border-red-500 cursor-pointer text-center">
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    Pilih Gambar
                </label>
            )}
            {previewUrl && <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover rounded-xl border-2 border-slate-200" />}
        </div>
    );
};

const EditableSection = ({ children, onEdit, label }) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <div className="relative group" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            {children}
            {isHovered && (
                <div className="absolute inset-0 bg-red-700/10 border-2 border-red-700 border-dashed rounded-2xl pointer-events-none z-10 animate-in fade-in">
                    <div className="absolute top-4 right-4 pointer-events-auto">
                        <button onClick={onEdit} className="px-6 py-3 bg-red-700 text-white rounded-xl font-bold text-sm shadow-2xl hover:bg-red-800 transition flex items-center gap-2 uppercase tracking-wide">
                            <Edit3 className="w-4 h-4" /> Edit {label}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const TentangPreview = ({ data, onUpdate }) => {
    const [editingSection, setEditingSection] = useState(null);
    const [tempData, setTempData] = useState({});

    const openEditModal = (section, currentData) => {
        setEditingSection(section);
        setTempData({ ...currentData });
    };

    const saveChanges = () => {
        onUpdate(editingSection, tempData);
        setEditingSection(null);
    };

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-red-700 to-red-800 text-white p-6 rounded-[2rem] shadow-lg">
                <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Preview Halaman Tentang Kami</h2>
                <p className="text-sm text-red-100 font-medium">Kustomisasi cerita dan visi misi brand SAZIME Anda di sini.</p>
            </div>

            <div className="bg-white rounded-[2rem] overflow-hidden border-2 border-slate-200 shadow-sm">
                {/* Hero Section */}
                <EditableSection label="Hero" onEdit={() => openEditModal('hero', data.hero)}>
                    <section className="relative py-24 px-6 overflow-hidden bg-slate-900 text-white">
                        <div className="absolute inset-0 opacity-30">
                            <img src={data.hero.image} alt="Background" className="w-full h-full object-cover" />
                        </div>
                        <div className="relative z-10 max-w-4xl mx-auto text-center">
                            <span className="bg-primary text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 inline-block">
                                {data.hero.badge}
                            </span>
                            <h1 className="text-4xl md:text-6xl font-extrabold mb-8 italic">
                                {data.hero.title.split(' ').map((word, i) => (
                                    <span key={i} className={word === '&' || word === 'Kualitas' ? 'text-primary' : ''}>{word} </span>
                                ))}
                            </h1>
                            <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
                                {data.hero.subtitle}
                            </p>
                        </div>
                    </section>
                </EditableSection>

                {/* Story Section */}
                <EditableSection label="Perjalanan" onEdit={() => openEditModal('story', data.story)}>
                    <section className="py-24 px-6 bg-white">
                        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                            <div className="relative">
                                <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
                                <img src={data.story.image} alt="Story" className="rounded-[3rem] shadow-2xl relative z-10" />
                                <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-primary rounded-[2.5rem] -z-0 hidden md:block"></div>
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold mb-6 italic">{data.story.title}</h2>
                                <h3 className="text-primary font-bold mb-4 uppercase tracking-widest text-xs">{data.story.subtitle}</h3>
                                <p className="text-slate-500 leading-relaxed text-lg mb-8">
                                    {data.story.content}
                                </p>
                            </div>
                        </div>
                    </section>
                </EditableSection>

                {/* Vision & Mission Section */}
                <EditableSection label="Visi Misi" onEdit={() => openEditModal('visionMission', data.visionMission)}>
                    <section className="py-24 px-6 bg-secondary text-white">
                        <div className="max-w-7xl mx-auto">
                            <div className="grid md:grid-cols-2 gap-12">
                                <div className="p-12 bg-white/5 rounded-[3rem] border border-white/10 backdrop-blur-sm">
                                    <h2 className="text-3xl font-bold mb-8 italic text-primary">Visi Kami</h2>
                                    <p className="text-xl leading-relaxed text-slate-300 italic">
                                        "{data.visionMission.vision}"
                                    </p>
                                </div>
                                <div className="p-12 bg-white/5 rounded-[3rem] border border-white/10 backdrop-blur-sm">
                                    <h2 className="text-3xl font-bold mb-8 italic text-primary">Misi Kami</h2>
                                    <ul className="space-y-6">
                                        {data.visionMission.mission.map((item, i) => (
                                            <li key={i} className="flex gap-4 items-start">
                                                <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shrink-0">
                                                    <i className="fas fa-check text-xs"></i>
                                                </div>
                                                <p className="text-slate-300 font-medium">{item}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>
                </EditableSection>

                {/* Values Section */}
                <EditableSection label="Nilai" onEdit={() => openEditModal('values', data.values)}>
                    <section className="py-24 px-6 bg-slate-50">
                        <div className="max-w-7xl mx-auto">
                            <h2 className="text-3xl font-bold text-center mb-16 italic">{data.values.title}</h2>
                            <div className="grid md:grid-cols-4 gap-8">
                                {data.values.items.map((item) => (
                                    <div key={item.id} className="p-8 bg-white rounded-[2.5rem] shadow-sm hover:shadow-xl transition group text-center border border-slate-100">
                                        <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center text-2xl mx-auto mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                                            <i className={`fas ${item.icon}`}></i>
                                        </div>
                                        <h3 className="font-bold mb-3">{item.title}</h3>
                                        <p className="text-sm text-slate-500">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </EditableSection>
            </div>

            {/* Modals */}
            <EditModal isOpen={editingSection === 'hero'} onClose={() => setEditingSection(null)} title="Edit Hero Section" onSave={saveChanges}>
                <div className="space-y-6">
                    <input type="text" value={tempData.badge || ''} onChange={e => setTempData({ ...tempData, badge: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm" placeholder="Badge" />
                    <textarea value={tempData.title || ''} onChange={e => setTempData({ ...tempData, title: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm" placeholder="Judul" rows="2" />
                    <textarea value={tempData.subtitle || ''} onChange={e => setTempData({ ...tempData, subtitle: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm" placeholder="Subtitle" rows="3" />
                    <ImageUploadField label="Background Image" value={tempData.image || ''} onChange={val => setTempData({ ...tempData, image: val })} />
                </div>
            </EditModal>

            <EditModal isOpen={editingSection === 'story'} onClose={() => setEditingSection(null)} title="Edit Perjalanan Kami" onSave={saveChanges}>
                <div className="space-y-6">
                    <input type="text" value={tempData.title || ''} onChange={e => setTempData({ ...tempData, title: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm" placeholder="Judul" />
                    <input type="text" value={tempData.subtitle || ''} onChange={e => setTempData({ ...tempData, subtitle: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm" placeholder="Small Title" />
                    <textarea value={tempData.content || ''} onChange={e => setTempData({ ...tempData, content: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm" placeholder="Konten" rows="6" />
                    <ImageUploadField label="Story Image" value={tempData.image || ''} onChange={val => setTempData({ ...tempData, image: val })} />
                </div>
            </EditModal>

            <EditModal isOpen={editingSection === 'visionMission'} onClose={() => setEditingSection(null)} title="Edit Visi & Misi" onSave={saveChanges}>
                <div className="space-y-6">
                    <textarea value={tempData.vision || ''} onChange={e => setTempData({ ...tempData, vision: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm" placeholder="Visi" rows="3" />
                    <div className="space-y-3">
                        <label className="text-xs font-bold uppercase">Misi Points</label>
                        {(tempData.mission || []).map((m, i) => (
                            <div key={i} className="flex gap-2">
                                <input type="text" value={m} onChange={e => {
                                    const newMission = [...tempData.mission];
                                    newMission[i] = e.target.value;
                                    setTempData({ ...tempData, mission: newMission });
                                }} className="flex-1 px-4 py-2 bg-slate-50 border rounded-lg text-sm" />
                                <button onClick={() => setTempData({ ...tempData, mission: tempData.mission.filter((_, idx) => idx !== i) })} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        ))}
                        <button onClick={() => setTempData({ ...tempData, mission: [...(tempData.mission || []), ''] })} className="w-full py-2 border-2 border-dashed rounded-lg text-xs font-bold text-slate-500">+ Tambah Misi</button>
                    </div>
                </div>
            </EditModal>

            <EditModal isOpen={editingSection === 'values'} onClose={() => setEditingSection(null)} title="Edit Nilai-Nilai" onSave={saveChanges}>
                <div className="space-y-6">
                    <input type="text" value={tempData.title || ''} onChange={e => setTempData({ ...tempData, title: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm" />
                    <div className="grid grid-cols-2 gap-4">
                        {(tempData.items || []).map((item, i) => (
                            <div key={item.id} className="p-4 border rounded-xl space-y-2">
                                <input type="text" value={item.icon} onChange={e => {
                                    const newItems = [...tempData.items];
                                    newItems[i].icon = e.target.value;
                                    setTempData({ ...tempData, items: newItems });
                                }} className="w-full px-3 py-1 bg-slate-50 border rounded text-xs" placeholder="Icon Class" />
                                <input type="text" value={item.title} onChange={e => {
                                    const newItems = [...tempData.items];
                                    newItems[i].title = e.target.value;
                                    setTempData({ ...tempData, items: newItems });
                                }} className="w-full px-3 py-1 bg-slate-50 border rounded text-xs font-bold" placeholder="Title" />
                                <textarea value={item.description} onChange={e => {
                                    const newItems = [...tempData.items];
                                    newItems[i].description = e.target.value;
                                    setTempData({ ...tempData, items: newItems });
                                }} className="w-full px-3 py-1 bg-slate-50 border rounded text-xs" placeholder="Desc" rows="2" />
                            </div>
                        ))}
                    </div>
                </div>
            </EditModal>
        </div>
    );
};

export default TentangPreview;
