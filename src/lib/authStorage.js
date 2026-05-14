import { normalizeGmail, isValidGmail, normalizeOwnerNameAddress } from './nfcOwnershipRegistry';

const STORAGE_USERS = 'sazime_user_accounts';
const STORAGE_SESSION = 'sazime_session_user_id';

/** Akun lokal demo: sinkron dengan data pemilik di Cek NFC (password untuk buka panel pelanggan). */
const DEMO_OWNER_EMAIL = normalizeGmail('penerima@gmail.com');
const DEMO_OWNER_PASSWORD = 'Password1';

function readUsers() {
    let users;
    try {
        users = JSON.parse(localStorage.getItem(STORAGE_USERS) || '[]');
    } catch {
        users = [];
    }
    if (!Array.isArray(users)) users = [];

    const idx = users.findIndex((u) => u.email === DEMO_OWNER_EMAIL);
    if (idx === -1) {
        users.push({
            id: `seed-penerima-${Date.now()}`,
            name: 'PEMILIK DEMO',
            email: DEMO_OWNER_EMAIL,
            password: DEMO_OWNER_PASSWORD,
            alamat: '',
            created_at: new Date().toISOString(),
        });
        writeUsers(users);
    } else if (users[idx].password !== DEMO_OWNER_PASSWORD) {
        users[idx] = { ...users[idx], password: DEMO_OWNER_PASSWORD };
        writeUsers(users);
    }
    return users;
}

function writeUsers(users) {
    localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
}

export function normalizeAccountName(value) {
    return String(value ?? '').toUpperCase().trim();
}

/**
 * Akun demo di localStorage — di produksi gunakan backend dan hash password.
 */
export function registerAccount({ name, email, password }) {
    const nama = normalizeAccountName(name);
    const em = normalizeGmail(email);
    if (nama.length < 2) throw new Error('Nama wajib diisi.');
    if (!isValidGmail(em)) throw new Error('Gunakan Gmail aktif (@gmail.com).');
    if (!password || password.length < 6) throw new Error('Password minimal 6 karakter.');

    const users = readUsers();
    if (users.some((u) => u.email === em)) throw new Error('Email sudah terdaftar. Masuk ke akun Anda.');

    const user = {
        id: `${Date.now()}`,
        name: nama,
        email: em,
        password,
        alamat: '',
        created_at: new Date().toISOString(),
    };
    users.push(user);
    writeUsers(users);
    return user;
}

export function loginAccount(email, password) {
    const em = normalizeGmail(email);
    const users = readUsers();
    const user = users.find((u) => u.email === em);
    if (!user || user.password !== password) throw new Error('Email atau password salah.');
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        alamat: user.alamat ? normalizeOwnerNameAddress(user.alamat) : '',
    };
}

/** Cek password akun landing tanpa mengubah sesi login (untuk buka data pemilik di halaman Cek NFC). */
export function verifyAccountPassword(email, password) {
    const em = normalizeGmail(email);
    const u = readUsers().find((x) => x.email === em);
    return Boolean(u && u.password === password);
}

export function setSessionUserId(id) {
    if (id) localStorage.setItem(STORAGE_SESSION, id);
    else localStorage.removeItem(STORAGE_SESSION);
}

export function getSessionUserId() {
    return localStorage.getItem(STORAGE_SESSION);
}

export function getUserById(id) {
    if (!id) return null;
    const users = readUsers();
    const user = users.find((u) => u.id === id);
    if (!user) return null;
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        alamat: user.alamat ? normalizeOwnerNameAddress(user.alamat) : '',
    };
}

export function updateAccountProfile(userId, patch) {
    if (!userId) throw new Error('Sesi tidak valid.');
    const users = readUsers();
    const idx = users.findIndex((u) => u.id === userId);
    if (idx === -1) throw new Error('Akun tidak ditemukan.');
    const row = { ...users[idx] };
    if (patch.name != null) row.name = normalizeAccountName(patch.name);
    if (patch.alamat != null) row.alamat = normalizeOwnerNameAddress(patch.alamat);
    users[idx] = row;
    writeUsers(users);
    return getUserById(userId);
}

export function getPublicSessionUser() {
    const id = getSessionUserId();
    return getUserById(id);
}
