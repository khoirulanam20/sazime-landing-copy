import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { getPublicSessionUser, loginAccount, registerAccount, setSessionUserId, updateAccountProfile } from '../lib/authStorage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => getPublicSessionUser());

    const login = useCallback((email, password) => {
        const u = loginAccount(email, password);
        setSessionUserId(u.id);
        setUser(u);
        return u;
    }, []);

    const register = useCallback(({ name, email, password }) => {
        const full = registerAccount({ name, email, password });
        setSessionUserId(full.id);
        setUser({ id: full.id, name: full.name, email: full.email, alamat: full.alamat || '' });
        return full;
    }, []);

    const updateProfile = useCallback((patch) => {
        if (!user?.id) throw new Error('Belum masuk.');
        const u = updateAccountProfile(user.id, patch);
        setUser(u);
        return u;
    }, [user]);

    const logout = useCallback(() => {
        setSessionUserId(null);
        setUser(null);
    }, []);

    const value = useMemo(
        () => ({ user, ready: true, login, register, logout, updateProfile }),
        [user, login, register, logout, updateProfile],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components -- hook diekspor bersama provider
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth harus dipakai di dalam AuthProvider');
    return ctx;
}
