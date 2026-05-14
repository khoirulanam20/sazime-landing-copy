import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const NfcTransferTermsModal = ({ open, onClose }) => {
    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    if (!open) return null;

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
                aria-labelledby="nfc-transfer-terms-title"
                className="relative w-full max-w-2xl max-h-[85vh] bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300"
            >
                <div className="flex items-center justify-between gap-4 px-8 py-6 border-b border-slate-100 shrink-0">
                    <h2 id="nfc-transfer-terms-title" className="text-xl md:text-2xl font-black italic tracking-tighter text-slate-900 pr-4">
                        Syarat & <span className="text-red-600">Ketentuan</span>
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 transition shrink-0"
                        aria-label="Tutup dialog"
                    >
                        <X size={22} />
                    </button>
                </div>
                <div className="overflow-y-auto px-8 py-6 space-y-5 text-sm text-slate-600 font-medium leading-relaxed custom-scrollbar">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                        Permohonan pindah kepemilikan chip NFC — Sazime
                    </p>
                    <section className="space-y-2">
                        <h3 className="font-black text-slate-900 text-xs uppercase tracking-widest">1. Ruang lingkup</h3>
                        <p>
                            Fitur ini memproses permohonan perubahan data pemilik terdaftar pada chip NFC produk Sazime, berdasarkan dokumen
                            yang Anda unggah dan verifikasi internal tim kami. Pengajuan tidak menjamin persetujuan otomatis.
                        </p>
                    </section>
                    <section className="space-y-2">
                        <h3 className="font-black text-slate-900 text-xs uppercase tracking-widest">2. Keaslian data dan dokumen</h3>
                        <p>
                            Anda menyatakan bahwa nama pemilik baru, identitas, dan dokumen permohonan (termasuk tanda tangan) adalah benar
                            dan sah. Pemalsuan atau penyalahgunaan dapat mengakibatkan penolakan permohonan dan tindakan sesuai kebijakan
                            Sazime serta hukum yang berlaku.
                        </p>
                    </section>
                    <section className="space-y-2">
                        <h3 className="font-black text-slate-900 text-xs uppercase tracking-widest">3. Proses verifikasi</h3>
                        <p>
                            Tim Sazime berhak meminta dokumen tambahan, wawancara singkat, atau bukti kepemilikan. Masa tunggu peninjauan
                            bergantung pada antrean internal dan kelengkapan berkas.
                        </p>
                    </section>
                    <section className="space-y-2">
                        <h3 className="font-black text-slate-900 text-xs uppercase tracking-widest">4. Privasi</h3>
                        <p>
                            Data yang dikirim digunakan untuk keperluan verifikasi dan administrasi kepemilikan chip. Kami tidak
                            mempublikasikan dokumen Anda tanpa dasar hukum atau persetujuan, kecuali diwajibkan oleh pihak berwenang.
                        </p>
                    </section>
                    <section className="space-y-2">
                        <h3 className="font-black text-slate-900 text-xs uppercase tracking-widest">5. Perubahan kebijakan</h3>
                        <p>
                            Sazime dapat memperbarui syarat dan ketentuan ini; versi yang berlaku mengikuti informasi saat Anda menyetujui
                            pada saat pengajuan.
                        </p>
                    </section>
                </div>
                <div className="px-8 py-5 border-t border-slate-100 bg-slate-50 shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition"
                    >
                        Saya Mengerti
                    </button>
                </div>
            </div>
            <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
        </div>
    );
};

export default NfcTransferTermsModal;
