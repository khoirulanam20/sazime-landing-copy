import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ScanLine, UserPlus, ArrowRight, ArrowRightLeft, ChevronRight } from 'lucide-react';
import { normalizeVerificationId } from '../../lib/nfcVerification';

const menuItems = [
    {
        key: 'cek',
        title: 'Cek & pindai NFC',
        desc: 'Buka halaman Cek NFC untuk memindai tag HF 13,56 MHz (NDEF URI / URL scan) atau memasukkan ID verifikasi (testing).',
        to: '/cek-nfc',
        icon: ScanLine,
        cta: 'Ke Cek NFC',
        variant: 'red',
    },
    {
        key: 'daftar',
        title: 'Registrasi pemilik (punya ID)',
        desc: 'Sudah mengetahui verification_id 10 digit dari tag atau kemasan? Masukkan di bawah lalu lanjutkan formulir registrasi kepemilian.',
        icon: UserPlus,
        cta: 'Lanjut formulir',
        variant: 'slate',
        hasInput: true,
    },
    {
        key: 'pindah',
        title: 'Pindah kepemilikan',
        desc: 'Produk sudah punya pemilik terdaftar? Ajukan pindah tangan dari hasil Cek NFC (harus masuk sebagai Gmail calon pemilik baru), lalu pemilik lama menerima permintaan konfirmasi.',
        to: '/cek-nfc',
        icon: ArrowRightLeft,
        cta: 'Mulai dari Cek NFC',
        variant: 'outline',
    },
];

export default function ProfileProductRegistration() {
    const navigate = useNavigate();
    const [vid, setVid] = useState('');
    const [err, setErr] = useState('');

    const goRegister = () => {
        setErr('');
        const id = normalizeVerificationId(vid);
        if (id.length !== 10) {
            setErr('Masukkan tepat 10 digit verification_id.');
            return;
        }
        navigate(`/cek-nfc/registrasi?verification_id=${encodeURIComponent(id)}`);
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 md:p-10">
                <h2 className="text-xl font-black italic text-slate-900 mb-2">Registrasi produk mandiri</h2>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    Pilih langkah sesuai situasi Anda. Semua alur registrasi kepemilikan memakai Gmail akun yang sama seperti akun login di landing ini.
                </p>
            </div>

            <ul className="space-y-4">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isRed = item.variant === 'red';
                    const isOutline = item.variant === 'outline';

                    return (
                        <li
                            key={item.key}
                            className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 md:p-8 flex flex-col md:flex-row md:items-start gap-6"
                        >
                            <div
                                className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                                    isRed ? 'bg-red-50 text-red-600' : isOutline ? 'bg-slate-100 text-slate-700' : 'bg-slate-900 text-white'
                                }`}
                            >
                                <Icon size={26} />
                            </div>
                            <div className="flex-1 min-w-0 space-y-3">
                                <h3 className="text-lg font-black text-slate-900">{item.title}</h3>
                                <p className="text-sm text-slate-600 font-medium leading-relaxed">{item.desc}</p>

                                {item.hasInput ? (
                                    <div className="space-y-3 pt-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                                            verification_id (10 digit)
                                        </label>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            autoComplete="off"
                                            value={vid}
                                            maxLength={10}
                                            onChange={(e) => {
                                                setVid(e.target.value.replace(/\D/g, '').slice(0, 10));
                                                setErr('');
                                            }}
                                            placeholder="0000000000"
                                            className="w-full max-w-xs px-5 py-3.5 rounded-2xl border-2 border-slate-100 font-mono font-black text-center tracking-widest focus:border-red-600 outline-none"
                                            onKeyDown={(e) => e.key === 'Enter' && goRegister()}
                                        />
                                        {err && <p className="text-sm font-bold text-red-600">{err}</p>}
                                        <button
                                            type="button"
                                            onClick={goRegister}
                                            disabled={vid.length !== 10}
                                            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-slate-900 text-white hover:bg-black transition disabled:opacity-40 disabled:cursor-not-allowed mb-3"
                                        >
                                            {item.cta}
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
                                ) : (
                                    <Link
                                        to={item.to}
                                        className={`inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition w-fit ${
                                            isRed
                                                ? 'bg-red-600 text-white hover:bg-black shadow-lg shadow-red-100'
                                                : isOutline
                                                  ? 'border-2 border-slate-200 text-slate-800 hover:border-red-600 hover:text-red-600'
                                                  : 'bg-slate-900 text-white hover:bg-black'
                                        }`}
                                    >
                                        {item.cta}
                                        <ArrowRight size={18} />
                                    </Link>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
