import styles from './footer.module.css';
import { 
  FaWhatsapp, 
  FaMapMarkerAlt, 
  FaClock, 
  FaInstagram, 
  FaFacebook, 
  FaPhone,
  FaEnvelope,
  FaCalendarAlt
} from 'react-icons/fa';
import Link from 'next/link';

export default function Footer() {
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/5491144478490', '_blank');
  };

  const handleMapClick = () => {
    window.open('https://goo.gl/maps/yourLocation', '_blank');
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footerGrid}>
        <div className={`${styles.footerSection} ${styles.contact}`}>
          <h3 className={styles.sectionTitle}>Contacto</h3>
          <div className={styles.contactItem} onClick={handleWhatsAppClick}>
            <FaWhatsapp className={styles.icon} />
            <div className={styles.contactInfo}>
              <p className={styles.text}>Pedidos por WhatsApp</p>
              <p className={styles.highlight}>+54 911 4447 8490</p>
            </div>
          </div>
          <div className={styles.contactItem} onClick={handleMapClick}>
            <FaMapMarkerAlt className={styles.icon} />
            <div className={styles.contactInfo}>
              <p className={styles.text}>Av. del Libertador 8888</p>
              <p className={styles.text}>Nuñez, CABA</p>
            </div>
          </div>
        </div>

        <div className={`${styles.footerSection} ${styles.hours}`}>
          <h3 className={styles.sectionTitle}>Horarios</h3>
          <div className={styles.scheduleItem}>
            <FaClock className={styles.icon} />
            <div>
              <p className={styles.text}>Abierto todos los días</p>
              <p className={styles.highlight}>8:00 AM - 2:00 AM</p>
            </div>
          </div>
          <button className={styles.reserveButton} onClick={handleWhatsAppClick}>
            <FaCalendarAlt className={styles.buttonIcon} />
            Hacer una reserva
          </button>
        </div>

        <div className={`${styles.footerSection} ${styles.social}`}>
          <h3 className={styles.sectionTitle}>Seguinos</h3>
          <div className={styles.socialLinks}>
            <a href="#" className={styles.socialIcon}><FaInstagram /></a>
            <a href="#" className={styles.socialIcon}><FaFacebook /></a>
            <a href="#" className={styles.socialIcon}><FaEnvelope /></a>
          </div>
          <div className={styles.newsletter}>
            <input type="email" placeholder="Suscribite al newsletter" className={styles.emailInput} />
            <button className={styles.subscribeButton}>Suscribirse</button>
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p className={styles.text}>© {new Date().getFullYear()} RestoMenuQR - Todos los derechos reservados</p>
      </div>
    </footer>
  );
}