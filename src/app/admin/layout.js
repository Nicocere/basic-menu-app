"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthUserContext';
import style from './AdminHome.module.css';
import { FaUser, FaEnvelope, FaClock, FaCheckCircle, FaSignOutAlt } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';
import { useAsync } from 'react-use';

export default function RootLayout({ children }) {
    const { user, signOut } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    const { value: authUser, loading: authLoading } = useAsync(async () => {
        return new Promise((resolve) => {
            const interval = setInterval(() => {
                if (user !== undefined) {
                    clearInterval(interval);
                    resolve(user);
                }
            }, 100);
        });
    }, [user]);

    useEffect(() => {
        if (!authLoading && !authUser) {
            router.push('/login');
        } else if (authUser) {
            setLoading(false);
        }
    }, [authLoading, authUser, router]);

    if (loading || authLoading) {
        return (
            <div className={style.loaderContainer}>
                <ClipLoader size={50} color={"#123abc"} loading={loading || authLoading} />
                <p>Cargando sus datos, aguarde...</p>
            </div>
        );
    }


    const handleSignOut = async () => {
        await signOut();
        router.push('/login');
    };


    return (
        <main className={style.mainAdmin}>
            {authUser && (
                <div className={style.userInfoContainer}>
                    <div className={style.userHeader}>  
                        <div className={style.userAvatar}>
                        <FaUser className={style.userIcon} />
                        <h2>Información del Usuario</h2>
                        </div>
                        <button onClick={handleSignOut} className={style.signOutButton}>
                            <FaSignOutAlt className={style.signOutIcon} />
                            Cerrar Sesión
                        </button>
                    </div>
                    
                    <div className={style.userDetails}>
                        <div className={style.infoItem}>
                            <FaEnvelope className={style.icon} />
                            <div>
                                <span className={style.label}>Email:</span>
                                <span className={style.value}>{authUser.email}</span>
                            </div>
                        </div>

                        <div className={style.infoItem}>
                            <FaClock className={style.icon} />
                            <div>
                                <span className={style.label}>Último acceso:</span>
                                <span className={style.value}>
                                    {new Date(authUser.last_sign_in_at).toLocaleString()}
                                </span>
                            </div>
                        </div>

                        <div className={style.infoItem}>
                            <FaCheckCircle className={style.icon} />
                            <div>
                                <span className={style.label}>Estado:</span>
                                <span className={style.value}>{authUser.role}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {children}
        </main>
    );
}