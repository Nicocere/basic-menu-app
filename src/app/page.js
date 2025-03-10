"use client";

import styles from './page.module.css';
import Link from 'next/link';
import { useAuth } from '@/context/AuthUserContext';
import { useThemeContext } from '@/context/ThemeSwitchContext';

//client side
import ProductsHome from '@/ClientSide/ProductsHome/ProductsHome';
import CartHome from '@/ClientSide/CartHome/CartHome';
import GuideHome from '@/ClientSide/GuideHome/GuideHome';
import CategoryCarousel from '@/ClientSide/CategoryCarousel/CategoryCarousel';
import PropinasButton from '@/components/PropinasButton/PropinasButton';

export default function Home() {

  const { isDarkMode } = useThemeContext();
  const { user } = useAuth();

  return (
    <div className={`${styles.page} ${isDarkMode ? styles.darkMode : ''}`}>
      <CartHome />
      <PropinasButton />
      <CategoryCarousel />
      <ProductsHome />
      <GuideHome />
      {
        user ? (
          <Link href="/admin" className={styles.adminLink}>
            Perfil Admin
          </Link>
        ) : (
          <Link href="/login" className={styles.adminLink} >Iniciar Sesión
          </Link>
        )
      }

    </div>
  );
}