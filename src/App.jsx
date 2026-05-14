import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import Contact from './pages/Contact';
import GuestNfcCheck from './pages/GuestNfcCheck';
import NfcTransferRequest from './pages/NfcTransferRequest';
import NfcOwnershipRegister from './pages/NfcOwnershipRegister';
import NfcOwnershipConfirm from './pages/NfcOwnershipConfirm';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProfileLayout from './pages/profile/ProfileLayout';
import ProfileHome from './pages/profile/ProfileHome';
import ProfileProducts from './pages/profile/ProfileProducts';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const MainLayout = () => (
  <>
    <Navbar />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen flex flex-col font-sans selection:bg-red-600 selection:text-white">
          <ScrollToTop />
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/tentang" element={<About />} />
              <Route path="/produk" element={<Products />} />
              <Route path="/kontak" element={<Contact />} />
              <Route path="/daftar" element={<RegisterPage />} />
              <Route path="/masuk" element={<LoginPage />} />
              <Route path="/cek-nfc" element={<GuestNfcCheck />} />
              <Route
                path="/cek-nfc/registrasi"
                element={
                  <ProtectedRoute>
                    <NfcOwnershipRegister />
                  </ProtectedRoute>
                }
              />
              <Route path="/cek-nfc/konfirmasi-kepemilikan" element={<NfcOwnershipConfirm />} />
              <Route path="/cek-nfc/pindah-pemilik" element={<NfcTransferRequest />} />
              <Route
                path="/profil"
                element={
                  <ProtectedRoute>
                    <ProfileLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<ProfileHome />} />
                <Route path="produk" element={<ProfileProducts />} />
              </Route>
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
