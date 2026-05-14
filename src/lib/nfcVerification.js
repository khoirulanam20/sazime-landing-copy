import { nfcChips } from '../data/nfcChips';

/** Kategori 3 digit; dipakai saat penerbitan ID (tahun + kategori + nomor reset per kategori). */
export const NFC_PRODUCT_CATEGORIES = [
    { code: '001', label: 'Sangkar Murai' },
    { code: '002', label: 'Sangkar Lovebird' },
    { code: '003', label: 'Sangkar Kenari' },
];

export function normalizeVerificationId(raw) {
    return String(raw ?? '')
        .replace(/\D/g, '')
        .slice(0, 10);
}

export function formatVerificationIdDisplay(id10) {
    const s = normalizeVerificationId(id10);
    if (s.length !== 10) return String(id10 ?? '');
    return `${s.slice(0, 2)} ${s.slice(2, 5)} ${s.slice(5, 10)}`;
}

export function findChipByVerificationId(raw) {
    const v = normalizeVerificationId(raw);
    if (v.length !== 10) return null;
    return nfcChips.find((c) => c.verification_id === v) ?? null;
}

function extractTenDigitsFromString(str) {
    const digits = String(str).replace(/\D/g, '');
    if (digits.length >= 10) return digits.slice(0, 10);
    return null;
}

function tryVerificationIdFromUrl(urlStr) {
    try {
        const u = new URL(urlStr, typeof window !== 'undefined' ? window.location.origin : 'https://localhost');
        const q =
            u.searchParams.get('v') ||
            u.searchParams.get('verification_id') ||
            u.searchParams.get('verivication_id');
        if (q) {
            const n = normalizeVerificationId(q);
            if (n.length === 10) return n;
        }
        const pathMatch = u.pathname.match(/(\d{10})(?:\/|$)/);
        if (pathMatch) return pathMatch[1];
    } catch {
        /* ignore */
    }
    const fallback = extractTenDigitsFromString(urlStr);
    return fallback && fallback.length === 10 ? fallback : null;
}

/**
 * Input dari NFC reader USB mode "keyboard" (wedge): bisa URL verifikasi atau 10 digit.
 */
export function verificationIdFromWedgeInput(raw) {
    const s = String(raw ?? '').trim();
    if (!s) return null;
    if (/^https?:\/\//i.test(s) || /^www\./i.test(s) || (s.includes('?') && /v=|verification_id|verivication_id/i.test(s))) {
        const href = s.startsWith('www.') ? `https://${s}` : /^https?:\/\//i.test(s) ? s : `https://${s}`;
        const id = tryVerificationIdFromUrl(href);
        if (id) return id;
    }
    const digits = normalizeVerificationId(s);
    if (digits.length === 10) return digits;
    return tryVerificationIdFromUrl(s);
}

/** Ekstrak 10 digit verification_id dari satu NDEF record (Web NFC). */
export function parseNdefRecordForVerificationId(record) {
    if (!record?.data) return null;
    const buf = record.data.buffer instanceof ArrayBuffer ? new Uint8Array(record.data) : record.data;

    if (record.recordType === 'url') {
        let urlStr = '';
        try {
            const dec = new TextDecoder();
            // Well-known URL: byte 0 = prefix code; sisanya path (tanpa skema)
            if (buf.length > 1) {
                const code = buf[0];
                const prefixes = [
                    '',
                    'http://www.',
                    'https://www.',
                    'http://',
                    'https://',
                ];
                const rest = dec.decode(buf.slice(1));
                const prefix = prefixes[code] ?? '';
                urlStr = prefix + rest;
            }
        } catch {
            urlStr = new TextDecoder().decode(buf);
        }
        return tryVerificationIdFromUrl(urlStr);
    }

    if (record.recordType === 'text') {
        try {
            const dec = new TextDecoder(record.encoding || 'utf-8');
            const text = dec.decode(buf);
            const ten = extractTenDigitsFromString(text);
            return ten && ten.length === 10 ? ten : null;
        } catch {
            const text = new TextDecoder().decode(buf);
            const ten = extractTenDigitsFromString(text);
            return ten && ten.length === 10 ? ten : null;
        }
    }

    const asText = new TextDecoder().decode(buf);
    const ten = extractTenDigitsFromString(asText);
    return ten && ten.length === 10 ? ten : null;
}

export function parseNdefMessageForVerificationId(message) {
    if (!message?.records?.length) return null;
    for (const record of message.records) {
        const id = parseNdefRecordForVerificationId(record);
        if (id) return id;
    }
    return null;
}

/**
 * Web NFC (Chrome Android). Resolves ke string 10 digit verification_id.
 */
export function scanNfcForVerificationId() {
    return new Promise((resolve, reject) => {
        if (typeof window === 'undefined' || !('NDEFReader' in window)) {
            reject(new Error('Web NFC tidak tersedia di perangkat ini. Buka halaman dari tautan pada tag NFC.'));
            return;
        }

        const ndef = new window.NDEFReader();
        const timeoutMs = 30000;
        let settled = false;

        const cleanup = () => {
            ndef.removeEventListener('reading', onRead);
            ndef.removeEventListener('readingerror', onErr);
        };

        const timeout = setTimeout(() => {
            if (settled) return;
            settled = true;
            cleanup();
            reject(new Error('Waktu habis. Tempel tag NFC ke perangkat dan coba lagi.'));
        }, timeoutMs);

        function onRead(event) {
            if (settled) return;
            const id = parseNdefMessageForVerificationId(event.message);
            if (id) {
                settled = true;
                clearTimeout(timeout);
                cleanup();
                resolve(id);
            }
        }

        function onErr() {
            if (settled) return;
            settled = true;
            clearTimeout(timeout);
            cleanup();
            reject(new Error('Gagal membaca NFC.'));
        }

        ndef.addEventListener('reading', onRead);
        ndef.addEventListener('readingerror', onErr);

        ndef.scan().catch((e) => {
            if (settled) return;
            settled = true;
            clearTimeout(timeout);
            cleanup();
            reject(e instanceof Error ? e : new Error('Tidak bisa memulai pemindaian NFC.'));
        });
    });
}
