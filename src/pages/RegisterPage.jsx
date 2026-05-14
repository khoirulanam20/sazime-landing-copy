import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { normalizeAccountName } from '../lib/authStorage';
import { normalizeGmail } from '../lib/nfcOwnershipRegistry';

export default function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const next = searchParams.get('next')?.trim() || '/profil';

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const submit = (e) => {
        e.preventDefault();
        setError('');
        try {
            register({
                name: normalizeAccountName(name),
                email: normalizeGmail(email),
                password,
            });
            navigate(next.startsWith('/') ? next : '/profil', { replace: true });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registrasi gagal.');
        }
    };

    return (
        <div className="pt-28 min-h-screen bg-slate-50 pb-24 px-6">
            <div className="max-w-md mx-auto">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-red-100 rounded-[1.25rem] flex items-center justify-center text-red-600 mx-auto mb-6">
                        <UserPlus size={32} />
                    </div>
                    <h1 className="text-3xl font-black italic text-slate-900 mb-2">Daftar akun</h1>
                    <p className="text-slate-600 text-sm font-medium">
                        Buat akun dulu, lalu masuk untuk registrasi kepemilian produk NFC dan melihat produk di profil.
                    </p>
                </div>

                <form onSubmit={submit} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 space-y-5">
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-2">
                            Nama (huruf besar otomatis)
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(normalizeAccountName(e.target.value))}
                            className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 outline-none focus:border-red-600 font-bold uppercase"
                            placeholder="NAMA LENGKAP"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-2">
                            Gmail (huruf kecil)
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(normalizeGmail(e.target.value))}
                            className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 outline-none focus:border-red-600 font-mono lowercase text-sm"
                            placeholder="Alamat email Gmail"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-2">
                            Password (min. 6 karakter)
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 outline-none focus:border-red-600"
                            required
                            minLength={6}
                        />
                    </div>
                    {error && <p className="text-sm font-bold text-red-600">{error}</p>}
                    <button
                        type="submit"
                        className="w-full py-4 bg-red-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition"
                    >
                        Daftar
                    </button>
                </form>

                <p className="text-center mt-8 text-sm text-slate-600">
                    Sudah punya akun?{' '}
                    <Link to={`/masuk?next=${encodeURIComponent(next)}`} className="font-black text-red-600">
                        Masuk
                    </Link>
                </p>
            </div>
        </div>
    );
}
