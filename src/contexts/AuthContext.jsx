import React, { createContext, useState, useEffect, useContext } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Membuat context untuk autentikasi
const AuthContext = createContext();

// Data pengguna awal
const initialUsers = [
    { 
        username: `${import.meta.env.VITE_REACT_APP_DEMO_USER_NAME}`, 
        password: `${import.meta.env.VITE_REACT_APP_DEMO_USER_PASSWORD}` 
    },
];

export const AuthProvider = ({ children }) => {
    const [cookies, setCookie, removeCookie] = useCookies(['authToken', 'username']);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [users, setUsers] = useState(initialUsers);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    // Cek status login dari cookies saat komponen pertama kali di-mount
    useEffect(() => {
        if (cookies.authToken) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
        setIsLoading(false);
    }, [cookies.authToken]);

    // Fungsi untuk handle login
    const login = (username, password) => {
        const user = users.find((user) => user.username === username && user.password === password);
        if (!user) {
            toast.error('Username atau password salah');
            return;
        }
    
        setIsLoggedIn(true);
        const token = Math.random().toString(36).substring(2);
        const expirationDate = new Date();
        expirationDate.setHours(expirationDate.getHours() + 2); // Kedaluwarsa dalam 2 jam
    
        setCookie('authToken', token, { path: '/', expires: expirationDate });
        setCookie('username', username, { path: '/', expires: expirationDate });
    
        toast.success('Login berhasil!');
        navigate('/');
    };    

    // Fungsi untuk handle register
    const register = (username, email, password) => {
        if (users.some(user => user.username === username || user.email === email)) {
            toast.error('Username atau email sudah terdaftar');
            return;
        }

        setUsers(prevUsers => [...prevUsers, { username, email, password }]);
        toast.success('Registrasi berhasil! Silakan login.');
        navigate('/login');
    };

    // Fungsi untuk handle logout
    const logout = () => {
        // Menampilkan toast konfirmasi logout
        toast((t) => (
            <div className="flex justify-between items-center">
                <span>Apakah Anda yakin ingin logout?</span>
                <div className="flex space-x-2">
                    <button
                        onClick={() => {
                            setIsLoggedIn(false);
                            removeCookie('authToken', { path: '/' }); // Hapus cookie authToken
                            removeCookie('username', { path: '/' }); // Hapus cookie username
                            toast.success('Anda telah logout!');
                            navigate('/login'); // Arahkan ke halaman login
                            toast.dismiss(t.id); // Menghilangkan toast konfirmasi
                        }}
                        className="bg-green-500 text-white px-3 py-1 rounded-md"
                    >
                        Ya
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)} // Menutup toast jika cancel
                        className="bg-red-500 text-white px-3 py-1 rounded-md"
                    >
                        Batal
                    </button>
                </div>
            </div>
        ), {
            duration: Infinity, // Memastikan toast tetap terlihat
            position: 'top-center', // Lokasi toast
        });
    };


    return (
        <AuthContext.Provider value={{ isLoggedIn, isLoading, login, register, logout, users }}>
            {children}
        </AuthContext.Provider>
    );    
};

// Custom hook untuk menggunakan auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};