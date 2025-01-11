"use client"

import styles from './navBar.module.css';

export default function NavBar() {
  return (
    <header className={styles.header}>
      <h1 className={styles['header-title']}>ANTONIO</h1>
      <h3 className={styles['header-subtitle']}>resto</h3>
    </header>
  );
}