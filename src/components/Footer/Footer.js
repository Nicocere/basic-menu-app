import styles from './footer.module.css';
import { FaWhatsapp, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <FaWhatsapp className={styles.icon} />
          <p className={styles.text}>Compartí el menú por Whatsapp</p>
          <p className={styles.text}>+54 911 4447 8490</p>
        </div>
        <div className={styles.footerSection}>
          <FaMapMarkerAlt className={styles.icon} />
          <p className={styles.text}>Cómo llegar</p>
          <p className={styles.text}>Contactanos por Whatsapp</p>
          <p className={styles.text}>Podés hacer tu reserva o pedido para Take Away</p>
        </div>
        <div className={styles.footerSection}>
          <FaClock className={styles.icon} />
          <p className={styles.text}>Horario:</p>
          <p className={styles.text}>Todos los días</p>
          <p className={styles.text}>8 AM a 2AM</p>
          <p className={styles.text}>Av. del Libertador 8888</p>
          <p className={styles.text}>Nuñez</p>
          <p className={styles.text}>Ciudad de Buenos Aires</p>
          <p className={styles.text}>Argentina</p>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p className={styles.text}>© Powered by RestoMenuQR - 2020</p>
      </div>
    </footer>
  );
}