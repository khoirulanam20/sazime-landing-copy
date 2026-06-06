import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, X } from 'lucide-react';
import { formatVerificationIdDisplay } from '../lib/nfcVerification';
import NfcChipUrlPanel from './NfcChipUrlPanel';

/**
 * @param {object} props
 * @param {boolean} props.open
 * @param {() => void} props.onClose
 * @param {object | null} props.chip — baris dari nfcChips (sama bentuknya dengan `result` di GuestNfcCheck)
 * @param {string} props.verificationId
 * @param {{ nama: string, alamat: string, gmail: string }} [props.owner] — pemilik konsumen terkonfirmasi
 */
export default function NfcProductDetailModal({ open, onClose, chip, verificationId, owner }) {
    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const onKey = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    if (!open) return null;

    const vid = verificationId || chip?.verification_id || '';

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 sm:p-6">
            <button
                type="button"
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                aria-label="Tutup"
                onClick={onClose}
            />
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="nfc-product-detail-title"
                className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300"
            >
                <div className="flex items-start justify-between gap-4 px-6 py-5 sm:px-8 sm:py-6 border-b border-slate-100 shrink-0 bg-gradient-to-br from-emerald-50/90 to-white">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100 shrink-0">
                            <CheckCircle2 size={26} />
                        </div>
                        <div className="min-w-0">
                            <span className="font-black text-emerald-700 text-[10px] uppercase tracking-[0.2em] block mb-0.5">
                                Produk terverifikasi
                            </span>
                            <h2
                                id="nfc-product-detail-title"
                                className="text-lg sm:text-xl font-black italic tracking-tighter text-slate-900 truncate"
                            >
                                {chip?.nama_produk || 'Detail verifikasi'}
                            </h2>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-11 h-11 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition shrink-0"
                        aria-label="Tutup dialog"
                    >
                        <X size={22} />
                    </button>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto px-6 py-6 sm:px-8 sm:py-8 space-y-6 custom-scrollbar">
                    
                {chip && chip.gambar?.length > 0 ? (
                    <div className="px-6 pt-6 sm:px-8 sm:pt-8 pb-0 shrink-0 border-b border-slate-100/80 bg-slate-50/50">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Foto produk</p>
                        <div className="grid grid-cols-2 gap-3 pb-6">
                            {chip.gambar.map((img, i) => (
                                <div
                                    key={i}
                                    className="aspect-[4/3] rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-slate-100"
                                >
                                    <img
                                        src={img}
                                        alt={`${chip.nama_produk} — foto ${i + 1}`}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : null}

                    <div className="rounded-2xl bg-slate-900 text-white p-6">
                        <p className="text-[10px] font-black text-white/45 uppercase tracking-[0.25em] mb-4">Ringkasan verifikasi</p>
                        <div className="grid sm:grid-cols-2 gap-5">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">ID verifikasi</p>
                                <p className="font-mono font-black text-lg tracking-wide break-all">
                                    {formatVerificationIdDisplay(vid)}
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Tgl. ID verifikasi</p>
                                <p className="font-bold text-base">{chip?.tanggal_verifikasi_id || '—'}</p>
                            </div>
                        </div>
                    </div>

                    {!chip ? (
                        <p className="text-sm font-bold text-amber-800 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                            Data katalog untuk ID ini tidak ada di demo lokal. Buka halaman Cek NFC untuk alur lengkap.
                        </p>
                    ) : (
                        <>
                            <NfcChipUrlPanel chip={chip} />
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Informasi produk</p>
                                <div className="grid sm:grid-cols-2 gap-3">
                                    <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Nama produk</p>
                                        <p className="font-black text-slate-900">{chip.nama_produk}</p>
                                    </div>
                                    <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                                            Referensi produsen
                                        </p>
                                        <p className="font-bold text-slate-800">{chip.nama_pemilik}</p>
                                    </div>
                                    <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">No. seri</p>
                                        <p className="font-mono font-bold text-slate-900">{chip.nomor_seri || '—'}</p>
                                    </div>
                                    <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Jenis sangkar</p>
                                        <p className="font-black text-base leading-snug">{chip.jenis_sangkar || chip.nama_produk}</p>
                                    </div>
                                    {chip.deskripsi_produk ? (
                                        <div className="sm:col-span-2 rounded-2xl bg-slate-50 border border-slate-100 p-4">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Deskripsi</p>
                                            <p className="text-sm font-medium text-slate-600 leading-relaxed">{chip.deskripsi_produk}</p>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </>
                    )}

                    {owner ? (
                        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 space-y-3">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Pemilik terdaftar (Anda)</p>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Nama</p>
                                <p className="font-black text-slate-900">{owner.nama}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Alamat</p>
                                <p className="text-sm font-bold text-slate-700 uppercase leading-relaxed">{owner.alamat}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Gmail</p>
                                <p className="font-mono text-sm font-bold text-slate-900 break-all">{owner.gmail}</p>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
