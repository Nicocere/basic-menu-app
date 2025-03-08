"use client";

import { motion } from 'framer-motion';
import styles from './page.module.css';
// Add to imports
// SUPABASE
import Link from 'next/link';
import { useAuth } from '@/context/AuthUserContext';
import { useThemeContext } from '@/context/ThemeSwitchContext';
import ProductsHome from '@/ClientSide/ProductsHome/ProductsHome';
import CartHome from '@/ClientSide/CartHome/CartHome';
import GuideHome from '@/ClientSide/GuideHome/GuideHome';
import CategoryCarousel from '@/ClientSide/CategoryCarousel/CategoryCarousel';

export default function Home() {

  const { isDarkMode } = useThemeContext();
  const { user } = useAuth();



  return (
    <div className={`${styles.page} ${isDarkMode ? styles.darkMode : ''}`}>
  <CartHome />
    
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