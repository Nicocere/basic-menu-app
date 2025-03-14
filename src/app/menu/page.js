"use client";

import CartHome from "@/ClientSide/CartHome/CartHome";
import Home from "../page";
import PropinasButton from "@/components/PropinasButton/PropinasButton";
import CarouselHeader from "@/components/CarouselHeader/CarouselHeader";
import ProductsHome from "@/ClientSide/ProductsHome/ProductsHome";
import GuideHome from "@/ClientSide/GuideHome/GuideHome";
import styles from '../page.module.css'
import { useThemeContext } from "@/context/ThemeSwitchContext";


export default function Propinas() {

  const { isDarkMode } = useThemeContext();


  return (
    <div className={`${styles.page} ${isDarkMode ? styles.darkMode : ''}`} style={{ paddingTop: '100px' }}>

      <h2 className={styles.title}>Menú</h2>

      <CartHome />
      <PropinasButton />
      <ProductsHome />
      <GuideHome />

    </div>
  );

}