import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
    const { user, ready } = useAuth();
    const location = useLocation();

    if (!ready) {
        return (
            <div className="pt-32 flex justify-center text-slate-500 font-bold text-sm">
                Memuat…
            </div>
        );
    }

    if (!user) {
        const from = `${location.pathname}${location.search}`;
        return <Navigate to={`/masuk?next=${encodeURIComponent(from)}`} replace />;
    }

    return children;
}
