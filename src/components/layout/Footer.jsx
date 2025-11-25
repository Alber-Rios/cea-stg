import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import styles from './Footer.module.css';

function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                <div className={styles.footerSection}>
                    <h2>CEA</h2>
                    <p>Educando para un futuro más verde y sostenible desde el corazón de Santiago.</p>
                    <div className={styles.socialLinks}>
                        <a href="#" aria-label="Facebook"><FaFacebookF /></a>
                        <a href="https://www.instagram.com/medioambientestgo/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
                        <a href="#" aria-label="Twitter"><FaTwitter /></a>
                        <a href="#" aria-label="YouTube"><FaYoutube /></a>
                    </div>
                </div>
                <div className={styles.footerSection}>
                    <h3>Enlaces Rápidos</h3>
                    <ul>
                        <li><Link to="/">Inicio</Link></li>
                        <li><Link to="/nosotros">Nosotros</Link></li>
                        <li><Link to="/proyectos">Proyectos</Link></li>
                        <li><Link to="/recursos">Recursos</Link></li>
                        <li><Link to="/contacto">Contacto</Link></li>
                    </ul>
                </div>
                <div className={styles.footerSection}>
                    <h3>Contáctanos</h3>
                    <p><FaMapMarkerAlt /> Av. Beauchef 1327, Santiago</p>
                    <p><FaPhone /> (2) 2827 1299</p>
                    <p><FaEnvelope /> contacto@cea-santiago.cl</p>
                </div>
            </div>
            <div className={styles.footerBottom}>
                <p>© 2025 Centro Educativo Ambiental (CEA) | Todos los derechos reservados.</p>
            </div>
        </footer>
    );
}

export default Footer;
