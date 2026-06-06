import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getConfirmedProductsByGmail } from '../../lib/nfcOwnershipRegistry';
import { findChipByVerificationId, formatVerificationIdDisplay } from '../../lib/nfcVerification';
import NfcProductDetailModal from '../../components/NfcProductDetailModal';

export default function ProfileProducts() {
    const { user } = useAuth();
    const [detailModal, setDetailModal] = useState(null);

    const items =
        user?.email != null && user.email !== ''
            ? getConfirmedProductsByGmail(user.email).map(({ verification_id, owner }) => ({
                  verification_id,
                  owner,
                  chip: findChipByVerificationId(verification_id),
              }))
            : [];

    return (
        <div className="space-y-6">
            <NfcProductDetailModal
                open={detailModal != null}
                onClose={() => setDetailModal(null)}
                chip={detailModal?.chip ?? null}
                verificationId={detailModal?.verification_id ?? ''}
                owner={detailModal?.owner}
            />
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 md:p-10">
                <div className="flex items-center gap-3 mb-2">
                    <Package className="text-red-600" size={24} />
                    <h2 className="text-xl font-black italic text-slate-900">Produk saya</h2>
                </div>
                <p className="text-sm text-slate-500 font-medium">
                    Produk dengan kepemilikan terkonfirmasi yang terhubung ke Gmail akun ini.
                </p>
            </div>

            {items.length === 0 ? (
                <div className="bg-white rounded-[2rem] border border-dashed border-slate-200 p-12 text-center">
                    <p className="text-slate-600 font-medium mb-6">Belum ada produk. Verifikasi NFC lalu daftarkan kepemilian.</p>
                    <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3">
                        <Link
                            to="/profil/registrasi-produk"
                            className="inline-block px-8 py-4 bg-slate-900 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-black transition"
                        >
                            Registrasi produk
                        </Link>
                        <Link
                            to="/cek-nfc"
                            className="inline-block px-8 py-4 bg-red-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-black transition"
                        >
                            Ke Cek NFC
                        </Link>
                    </div>
                </div>
            ) : (
                <ul className="space-y-4">
                    {items.map(({ verification_id, owner, chip }) => (
                        <li
                            key={verification_id}
                            className="bg-white rounded-[1.75rem] border border-slate-100 shadow-sm p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                        >
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">ID verifikasi</p>
                                <p className="font-mono font-black text-lg text-slate-900 mb-2">
                                    {formatVerificationIdDisplay(verification_id)}
                                </p>
                                <p className="font-black text-slate-800">{chip?.nama_produk || 'Produk'}</p>
                                <p className="text-xs text-slate-500 mt-1 uppercase font-bold">{owner.nama}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() =>
                                    setDetailModal({
                                        verification_id,
                                        owner,
                                        chip,
                                    })
                                }
                                className="shrink-0 px-6 py-3 rounded-2xl border-2 border-slate-200 font-black text-xs uppercase tracking-widest text-slate-700 hover:border-red-600 hover:text-red-600 transition text-center"
                            >
                                Detail
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
