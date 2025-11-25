import { useScrollAnimation } from '../hooks/useScrollAnimation';
import styles from './Nosotros.module.css';

function Nosotros() {
    useScrollAnimation();

    return (
        <div className={styles.nosotros}>
            <section className="sub-header header-nosotros">
                <h1>Quiénes Somos</h1>
            </section>

            <section className={`${styles.contentSection} events-section`} style={{ marginTop: 0 }}>
                <h2 className="section-title">Nuestra Misión</h2>
                <p style={{ lineHeight: '1.6', color: '#555', marginBottom: '20px' }}>
                    El <strong>Centro Educativo Ambiental (CEA)</strong> es una iniciativa ubicada en el corazón del Parque
                    O'Higgins, dependiente de la Dirección de Medio Ambiente de Santiago.
                </p>
                <p style={{ lineHeight: '1.6', color: '#555' }}>
                    Nuestra misión es fomentar la <strong>conciencia ecológica</strong> en la comunidad a través de la educación
                    práctica. Nos enfocamos en promover la economía circular, la biodiversidad urbana y la agricultura
                    sostenible mediante talleres gratuitos, operativos de reciclaje y la recuperación de espacios verdes para
                    todos los vecinos y vecinas de Santiago.
                </p>
            </section>
        </div>
    );
}

export default Nosotros;
