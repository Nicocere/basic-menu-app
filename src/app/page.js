import styles from './page.module.css';
import Link from 'next/link';

export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Bienvenido al Bar</h1>
      </header>
      <main className={styles.main}>
        <section className={styles.menu}>
          <h2>Menú</h2>
          <ul>
            <li>Cerveza - $5</li>
            <li>Vino - $8</li>
            <li>Whisky - $10</li>
          </ul>
        </section>
        <section className={styles.order}>
          <h2>Ordenar</h2>
          <form>
            <label>
              Producto:
              <select>
                <option value="cerveza">Cerveza</option>
                <option value="vino">Vino</option>
                <option value="whisky">Whisky</option>
              </select>
            </label>
            <label>
              Cantidad:
              <input type="number" min="1" />
            </label>
            <button type="submit">Ordenar</button>
          </form>
        </section>
        <section className={styles.admin}>
          <Link href="/admin">
            <button>Ir a Admin</button>
          </Link>
        </section>
      </main>
      <footer className={styles.footer}>
        <p>© 2023 Bar Menu App</p>
      </footer>
    </div>
  );
}