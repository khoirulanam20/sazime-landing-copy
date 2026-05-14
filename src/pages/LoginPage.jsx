import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { normalizeGmail } from '../lib/nfcOwnershipRegistry';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const nextRaw = searchParams.get('next')?.trim();
    const next = nextRaw && nextRaw.startsWith('/') ? nextRaw : '/profil';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const submit = (e) => {
        e.preventDefault();
        setError('');
        try {
            login(normalizeGmail(email), password);
            navigate(next, { replace: true });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Masuk gagal.');
        }
    };

    return (
        <div className="pt-28 min-h-screen bg-slate-50 pb-24 px-6">
            <div className="max-w-md mx-auto">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-red-100 rounded-[1.25rem] flex items-center justify-center text-red-600 mx-auto mb-6">
                        <LogIn size={32} />
                    </div>
                    <h1 className="text-3xl font-black italic text-slate-900 mb-2">Masuk</h1>
                    <p className="text-slate-600 text-sm font-medium">Akun Gmail yang sama dipakai untuk registrasi kepemilian produk.</p>
                </div>

                <form onSubmit={submit} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 space-y-5">
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-2">Gmail</label>
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
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 outline-none focus:border-red-600"
                            required
                        />
                    </div>
                    {error && <p className="text-sm font-bold text-red-600">{error}</p>}
                    <button
                        type="submit"
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition"
                    >
                        Masuk
                    </button>
                </form>

                <p className="text-center mt-8 text-sm text-slate-600">
                    Belum punya akun?{' '}
                    <Link to={`/daftar?next=${encodeURIComponent(next)}`} className="font-black text-red-600">
                        Daftar
                    </Link>
                </p>
            </div>
        </div>
    );
}
