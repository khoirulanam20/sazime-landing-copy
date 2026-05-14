const STORAGE_CONFIRMED = 'sazime_ownership_confirmed';
const STORAGE_PENDING = 'sazime_ownership_pending';

function readConfirmedMap() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_CONFIRMED) || '{}');
    } catch {
        return {};
    }
}

function readPendingList() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_PENDING) || '[]');
    } catch {
        return [];
    }
}

/** Nama & alamat disimpan huruf besar; Gmail huruf kecil @gmail.com */
export function normalizeOwnerNameAddress(value) {
    return String(value ?? '').toUpperCase();
}

/** Hanya huruf kecil; jika tidak ada @, tambahkan @gmail.com */
export function normalizeGmail(value) {
    let s = String(value ?? '').trim().toLowerCase().replace(/\s/g, '');
    if (!s) return '';
    if (!s.includes('@')) s = `${s}@gmail.com`;
    return s;
}

/** Wajib alamat Gmail aktif (@gmail.com). */
export function isValidGmail(s) {
    if (!s || typeof s !== 'string') return false;
    return /^[^\s@]+@gmail\.com$/i.test(s.trim());
}

export function getConfirmedOwner(verificationId) {
    if (!verificationId) return null;
    const map = readConfirmedMap();
    return map[verificationId] || null;
}

function writeConfirmedMap(map) {
    localStorage.setItem(STORAGE_CONFIRMED, JSON.stringify(map));
}

function writePendingList(list) {
    localStorage.setItem(STORAGE_PENDING, JSON.stringify(list));
}

function makeToken() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
    return `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

/**
 * Pembeli pertama: konfirmasi dikirim ke Gmail pemohon (peran Sazime — diverifikasi di produksi via backend).
 * @returns {{ token: string, confirmUrl: string }}
 */
export function submitFirstOwnerPending(verificationId, applicant) {
    const vid = String(verificationId).replace(/\D/g, '').slice(0, 10);
    if (vid.length !== 10) throw new Error('ID tidak valid');
    if (getConfirmedOwner(vid)) throw new Error('Sudah ada pemilik konsumen terdaftar untuk produk ini.');

    const pending = readPendingList();
    if (pending.some((p) => p.verification_id === vid && p.kind === 'first_owner')) {
        throw new Error('Pendaftaran masih menunggu konfirmasi email.');
    }

    const gmail = normalizeGmail(applicant.gmail);
    if (!isValidGmail(gmail)) throw new Error('Gunakan alamat Gmail aktif (@gmail.com).');

    const token = makeToken();
    const row = {
        id: Date.now(),
        verification_id: vid,
        kind: 'first_owner',
        applicant: {
            nama: normalizeOwnerNameAddress(applicant.nama),
            alamat: normalizeOwnerNameAddress(applicant.alamat),
            gmail,
        },
        token,
        created_at: new Date().toISOString(),
        confirm_sent_to: gmail,
    };
    pending.push(row);
    writePendingList(pending);

    const confirmUrl = `/cek-nfc/konfirmasi-kepemilikan?token=${encodeURIComponent(token)}`;
    return { token, confirmUrl };
}

/**
 * Pindah tangan: konfirmasi dikirim ke Gmail pemilik terdaftar saat ini (bukan Sazime).
 */
export function submitTransferPending(verificationId, applicant) {
    const vid = String(verificationId).replace(/\D/g, '').slice(0, 10);
    if (vid.length !== 10) throw new Error('ID tidak valid');

    const current = getConfirmedOwner(vid);
    if (!current) throw new Error('Belum ada pemilik terdaftar. Lakukan registrasi pembeli pertama dulu.');

    const gmail = normalizeGmail(applicant.gmail);
    if (!isValidGmail(gmail)) throw new Error('Gunakan alamat Gmail aktif (@gmail.com).');
    if (gmail === current.gmail) throw new Error('Gmail pemohon harus berbeda dengan pemilik saat ini.');

    const pending = readPendingList();
    if (pending.some((p) => p.verification_id === vid && p.kind === 'transfer')) {
        throw new Error('Pengajuan pindah tangan masih menunggu konfirmasi pemilik sebelumnya.');
    }

    const token = makeToken();
    const row = {
        id: Date.now(),
        verification_id: vid,
        kind: 'transfer',
        applicant: {
            nama: normalizeOwnerNameAddress(applicant.nama),
            alamat: normalizeOwnerNameAddress(applicant.alamat),
            gmail,
        },
        token,
        created_at: new Date().toISOString(),
        confirm_sent_to: current.gmail,
        previous_owner: { ...current },
    };
    pending.push(row);
    writePendingList(pending);

    const confirmUrl = `/cek-nfc/konfirmasi-kepemilikan?token=${encodeURIComponent(token)}`;
    return { token, confirmUrl };
}

export function findPendingByToken(token) {
    if (!token) return null;
    return readPendingList().find((p) => p.token === token) || null;
}

export function confirmPendingByToken(token) {
    const list = readPendingList();
    const idx = list.findIndex((p) => p.token === token);
    if (idx === -1) return { ok: false, error: 'Tautan tidak valid atau sudah dipakai.' };

    const row = list[idx];
    const map = readConfirmedMap();

    const newOwner = {
        verification_id: row.verification_id,
        nama: row.applicant.nama,
        alamat: row.applicant.alamat,
        gmail: row.applicant.gmail,
        confirmed_at: new Date().toISOString(),
        registration_kind: row.kind === 'first_owner' ? 'first' : 'transfer',
    };

    map[row.verification_id] = newOwner;
    writeConfirmedMap(map);

    list.splice(idx, 1);
    writePendingList(list);

    return { ok: true, owner: newOwner };
}

/** Daftar chip yang gmail pemiliknya sama dengan akun (untuk menu Profil → Produk). */
export function getConfirmedProductsByGmail(gmail) {
    const g = normalizeGmail(gmail);
    if (!g) return [];
    const map = readConfirmedMap();
    return Object.entries(map)
        .filter(([, owner]) => owner.gmail === g)
        .map(([verification_id, owner]) => ({ verification_id, owner }));
}
