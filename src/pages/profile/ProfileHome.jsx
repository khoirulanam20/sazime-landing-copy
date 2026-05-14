import React, { useState } from 'react';
import { User, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { normalizeOwnerNameAddress } from '../../lib/nfcOwnershipRegistry';

function AlamatSection({ user }) {
    const { updateProfile } = useAuth();
    const [alamat, setAlamat] = useState(() => normalizeOwnerNameAddress(user.alamat || ''));
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const saveAlamat = (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        const a = normalizeOwnerNameAddress(alamat).trim();
        if (a.length < 8) {
            setError('Alamat wajib diisi minimal secukupnya (kurang lebih 8 karakter).');
            return;
        }
        try {
            updateProfile({ alamat: a });
            setMessage('Alamat disimpan.');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Gagal menyimpan.');
        }
    };

    return (
        <form
            onSubmit={saveAlamat}
            className="rounded-2xl bg-slate-50 p-5 border border-slate-100 space-y-4"
        >
            <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-600" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Alamat</p>
            </div>
            <p className="text-xs text-slate-500 font-medium">
                Dipakai untuk mengisi otomatis nama &amp; alamat pada formulir pindah tangan NFC (jika sudah diisi di profil).
            </p>
            <textarea
                value={alamat}
                onChange={(e) => {
                    setAlamat(normalizeOwnerNameAddress(e.target.value));
                    setMessage('');
                    setError('');
                }}
                rows={3}
                className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-100 bg-white outline-none focus:border-red-600 text-sm font-bold uppercase resize-none"
                placeholder="ALAMAT LENGKAP"
                autoComplete="street-address"
            />
            {error && <p className="text-sm font-bold text-red-600">{error}</p>}
            {message && <p className="text-sm font-bold text-emerald-700">{message}</p>}
            <button
                type="submit"
                className="w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest bg-slate-900 text-white hover:bg-black transition"
            >
                Simpan alamat
            </button>
        </form>
    );
}

export default function ProfileHome() {
    const { user } = useAuth();

    if (!user) return null;

    return (
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 md:p-10 space-y-6">
            <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-red-600">
                    <User size={28} />
                </div>
                <div>
                    <h2 className="text-xl font-black italic text-slate-900">Profil saya</h2>
                    <p className="text-sm text-slate-500 font-medium mt-1">
                        Gmail akun harus sama dengan Gmail registrasi kepemilian produk.
                    </p>
                </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div className="rounded-2xl bg-slate-50 p-5 border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Nama</p>
                    <p className="font-black text-slate-900 uppercase">{user.name}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-5 border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Gmail</p>
                    <p className="font-mono text-sm font-bold text-slate-800 break-all">{user.email}</p>
                </div>
            </div>

            <AlamatSection key={user.id} user={user} />

            <div className="rounded-2xl bg-slate-50 p-5 border border-slate-100 space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Password Baru</p>
                <input
                    type="password"
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-100 bg-white outline-none focus:border-red-600 text-sm"
                    placeholder="Password Baru"
                />
                <input
                    type="password"
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-100 bg-white outline-none focus:border-red-600 text-sm"
                    placeholder="Konfirmasi Password Baru"
                />
                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                    <button
                        type="button"
                        className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-red-600 text-white hover:bg-red-900 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Simpan
                    </button>
                </div>
            </div>
        </div>
    );
}
