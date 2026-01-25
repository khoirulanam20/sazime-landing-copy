import React, { useState, useMemo } from 'react';
import { Search, Filter, ChevronDown, List, Grid, Eye, X, ChevronRight, ShoppingCart } from 'lucide-react';
import { PRODUCTS } from '../data';

const Products = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Semua');
    const [selectedSubCategory, setSelectedSubCategory] = useState('Semua');
    const [sortOrder, setSortOrder] = useState('Newest');
    const [pageSize, setPageSize] = useState(10);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Extract unique categories and subcategories
    const categories = useMemo(() => ['Semua', ...new Set(PRODUCTS.map(p => p.category))], []);
    const subCategories = useMemo(() => {
        if (selectedCategory === 'Semua') return ['Semua'];
        return ['Semua', ...new Set(PRODUCTS.filter(p => p.category === selectedCategory).map(p => p.subCategory))];
    }, [selectedCategory]);

    const filteredProducts = useMemo(() => {
        let result = PRODUCTS.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.sku.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'Semua' || p.category === selectedCategory;
            const matchesSubCategory = selectedSubCategory === 'Semua' || p.subCategory === selectedSubCategory;
            return matchesSearch && matchesCategory && matchesSubCategory;
        });

        // Sorting
        if (sortOrder === 'Highest Price') result.sort((a, b) => b.price - a.price);
        if (sortOrder === 'Lowest Price') result.sort((a, b) => a.price - b.price);
        if (sortOrder === 'A-Z') result.sort((a, b) => a.name.localeCompare(b.name));

        return result.slice(0, pageSize);
    }, [searchTerm, selectedCategory, selectedSubCategory, sortOrder, pageSize]);

    return (
        <div className="pt-24 min-h-screen bg-slate-50">
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-slate-900 mb-4">Katalog <span className="text-red-600">Produk</span></h1>
                    <p className="text-slate-500 font-medium max-w-2xl leading-relaxed uppercase tracking-widest text-xs">
                        Temukan berbagai layanan digital printing dan kerajinan sangkar burung terbaik kami.
                    </p>
                </div>

                {/* Filters Bar */}
                <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 mb-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                        {/* Search */}
                        <div className="relative group lg:col-span-2">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-600 transition" size={20} />
                            <input
                                type="text"
                                placeholder="Cari produk atau SKU..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl outline-none focus:border-red-600 focus:bg-white transition font-bold"
                            />
                        </div>

                        {/* Category */}
                        <div className="relative">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest absolute -top-2 left-6 bg-white px-2">Kategori</label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => {
                                    setSelectedCategory(e.target.value);
                                    setSelectedSubCategory('Semua');
                                }}
                                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl outline-none focus:border-red-600 focus:bg-white transition font-bold appearance-none"
                            >
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                        </div>

                        {/* Sub Category */}
                        <div className="relative">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest absolute -top-2 left-6 bg-white px-2">Sub-Kategori</label>
                            <select
                                value={selectedSubCategory}
                                onChange={(e) => setSelectedSubCategory(e.target.value)}
                                disabled={selectedCategory === 'Semua'}
                                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl outline-none focus:border-red-600 focus:bg-white transition font-bold appearance-none disabled:opacity-50"
                            >
                                {subCategories.map(sc => <option key={sc} value={sc}>{sc}</option>)}
                            </select>
                            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                        </div>

                        {/* Sort */}
                        <div className="relative">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest absolute -top-2 left-6 bg-white px-2">Urutkan</label>
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl outline-none focus:border-red-600 focus:bg-white transition font-bold appearance-none"
                            >
                                <option value="Newest">Terbaru</option>
                                <option value="Highest Price">Harga Tertinggi</option>
                                <option value="Lowest Price">Harga Terendah</option>
                                <option value="A-Z">Nama A-Z</option>
                            </select>
                            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Tampilkan:</span>
                            {[10, 20, 50].map(size => (
                                <button
                                    key={size}
                                    onClick={() => setPageSize(size)}
                                    className={`px-4 py-2 rounded-xl text-xs font-black transition ${pageSize === size ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                            Menampilkan <span className="text-slate-900">{filteredProducts.length}</span> dari {PRODUCTS.length} Produk
                        </p>
                    </div>
                </div>

                {/* Product Table List */}
                <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-900 text-white">
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em]">Produk</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em]">Kategori</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-right">Harga (Mulai dari)</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-slate-50 transition group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-6">
                                                <div className="w-20 h-20 bg-slate-100 rounded-2xl overflow-hidden shadow-sm shrink-0 group-hover:scale-105 transition duration-500">
                                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-red-600 mb-1 uppercase tracking-widest">{product.sku}</p>
                                                    <h3 className="font-black text-slate-900 text-lg tracking-tight leading-tight">{product.name}</h3>
                                                    <p className="text-sm text-slate-400 line-clamp-1 max-w-md font-medium">{product.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="px-4 py-2 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <span className="text-xl font-black text-slate-900 tracking-tighter italic">
                                                Rp {product.price.toLocaleString('id-ID')}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex justify-center">
                                                <button
                                                    onClick={() => setSelectedProduct(product)}
                                                    className="bg-red-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-red-200 hover:bg-red-700 transition transform hover:-translate-y-1 flex items-center gap-2"
                                                >
                                                    Detail <ChevronRight size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredProducts.length === 0 && (
                        <div className="py-32 text-center">
                            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Search size={40} className="text-slate-200" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Produk Tidak Ditemukan</h3>
                            <p className="text-slate-400 font-medium uppercase text-xs tracking-widest mt-2">Coba kata kunci atau filter lain</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Detail Modal */}
            {selectedProduct && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-[4rem] shadow-3xl overflow-hidden flex flex-col md:flex-row relative animate-in zoom-in-95 duration-300">
                        <button
                            onClick={() => setSelectedProduct(null)}
                            className="absolute top-8 right-8 z-10 w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-red-600 transition"
                        >
                            <X size={24} />
                        </button>

                        {/* Modal Image */}
                        <div className="w-full md:w-1/2 bg-slate-100">
                            <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                        </div>

                        {/* Modal Content */}
                        <div className="w-full md:w-1/2 p-12 overflow-y-auto">
                            <div className="mb-8">
                                <span className="bg-red-100 text-red-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block">
                                    {selectedProduct.category} / {selectedProduct.subCategory}
                                </span>
                                <h2 className="text-4xl font-black text-slate-900 italic tracking-tighter leading-[1.1] mb-4">{selectedProduct.name}</h2>
                                <p className="text-xl font-black text-red-600 tracking-tighter mb-6 italic">Mulai dari Rp {selectedProduct.price.toLocaleString('id-ID')}</p>
                                <p className="text-slate-500 text-lg leading-relaxed font-medium">{selectedProduct.description}</p>
                            </div>

                            {/* Variants */}
                            <div className="mb-10">
                                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 border-b border-slate-100 pb-2">Varian Tersedia</h4>
                                <div className="space-y-4">
                                    {selectedProduct.variants.map((variant) => (
                                        <div key={variant.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center group hover:border-red-600 transition">
                                            <div>
                                                <p className="text-slate-900 font-black tracking-tight">{variant.name}</p>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{variant.sku}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-black text-slate-900 tracking-tighter">Rp {variant.price.toLocaleString('id-ID')}</p>
                                                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">Stok: {variant.stock}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <a
                                    href={selectedProduct.marketplaceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 bg-red-600 text-white py-5 rounded-3xl font-black uppercase text-xs tracking-widest text-center shadow-2xl shadow-red-100 hover:bg-red-700 transition transform hover:-translate-y-1 flex items-center justify-center gap-3"
                                >
                                    Beli di Shopee <ShoppingCart size={18} />
                                </a>
                                <a
                                    href={`https://wa.me/6281234567890?text=Halo%20Sazime,%20saya%20ingin%20tanya%20detail%20produk%20${selectedProduct.name}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-16 h-16 bg-slate-900 text-white rounded-3xl flex items-center justify-center hover:bg-black transition transform hover:-translate-y-1 uppercase text-xs font-black shadow-2xl shadow-slate-200"
                                >
                                    WA
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;
