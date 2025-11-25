import { FaMapMarkerAlt, FaPhone, FaClock } from 'react-icons/fa';
import styles from './LocationMap.module.css';

function LocationMap() {
    return (
        <section className={`${styles.locationSection} fade-up`}>
            <div className="leaf-animation-container"></div>

            <h2 className="section-title">Dónde Encontrarnos</h2>
            <div className={styles.locationContainer}>
                <div className={styles.locationInfo}>
                    <h3>CEA - Centro Educativo Ambiental</h3>
                    <p>
                        <FaMapMarkerAlt /> <strong>Dirección:</strong><br />
                        Av. Beauchef 1327, Santiago, Región Metropolitana, Chile<br />
                        (Interior Parque O'Higgins)
                    </p>

                    <p>
                        <FaPhone /> <strong>Teléfono:</strong><br />
                        (2) 2827 1299
                    </p>

                    <p>
                        <FaClock /> <strong>Horario de Atención:</strong><br />
                        Lunes a Viernes: 9:00 AM - 18:00 PM
                    </p>
                </div>

                <div className={styles.mapContainer}>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3328.965654814603!2d-70.6648453848007!3d-33.46406398077275!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662c51959e2ebb:0x7280586c410f2f46!2sCEA%20-%20Centro%20Educativo%20Ambiental!5e0!3m2!1ses!2scl!4v1678901234567!5m2!1ses!2scl"
                        width="100%"
                        height="300"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Ubicación CEA"
                    ></iframe>
                </div>
            </div>
        </section>
    );
}

export default LocationMap;
