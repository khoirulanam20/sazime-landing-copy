import React from 'react';
import { ExternalLink, Radio } from 'lucide-react';
import { NFC_CHIP_SPEC, resolveChipUrls } from '../lib/nfcVerification';

export default function NfcChipUrlPanel({ chip }) {
    if (!chip) return null;

    const { url_scan, url_preview } = resolveChipUrls(chip);
    const frekuensi = chip.nfc_frekuensi || NFC_CHIP_SPEC.frekuensi;
    const tipe = chip.nfc_tipe || NFC_CHIP_SPEC.tipe;

    return (
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5 md:p-6 space-y-4">
            <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-indigo-600 shrink-0" aria-hidden />
                <p className="text-[10px] font-black text-indigo-900/70 uppercase tracking-[0.2em]">Tag NFC produk</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
                <div className="rounded-xl bg-white border border-indigo-100/80 px-4 py-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Frekuensi</p>
                    <p className="font-black text-slate-900">{frekuensi}</p>
                    <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-wide">{tipe}</p>
                </div>
                <div className="rounded-xl bg-white border border-indigo-100/80 px-4 py-3 sm:col-span-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Isi chip (NDEF URI)</p>
                    <p className="text-[10px] font-medium text-slate-500 leading-relaxed">
                        Bukan LF 125 kHz — tag HF 13,56 MHz berisi URL scan di bawah.
                    </p>
                </div>
            </div>
            <div className="space-y-3">
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">URL scan (ditulis ke chip)</p>
                    <a
                        href={url_scan}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-2 text-sm font-mono font-bold text-indigo-700 hover:text-red-600 break-all leading-relaxed"
                    >
                        {url_scan}
                        <ExternalLink className="w-4 h-4 shrink-0 mt-0.5" aria-hidden />
                    </a>
                </div>
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">URL preview</p>
                    <a
                        href={url_preview}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-2 text-sm font-mono font-bold text-slate-700 hover:text-red-600 break-all leading-relaxed"
                    >
                        {url_preview}
                        <ExternalLink className="w-4 h-4 shrink-0 mt-0.5" aria-hidden />
                    </a>
                </div>
            </div>
        </div>
    );
}
