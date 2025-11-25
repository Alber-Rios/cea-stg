import { FaBookReader, FaVideo } from 'react-icons/fa';
import Card from '../components/common/Card';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import styles from './Recursos.module.css';

function Recursos() {
    useScrollAnimation();

    return (
        <div className={styles.recursos}>
            <section className="sub-header header-recursos">
                <h1>Recursos Educativos</h1>
            </section>

            <section className={styles.cardsSection}>
                <div className={styles.cardsContainer}>
                    <Card
                        icon={<FaBookReader />}
                        title="Biblioteca Digital"
                        description="Accede a nuestros manuales gratuitos de compostaje, vermicultura y guías de eficiencia hídrica."
                        delay={100}
                    />
                    <Card
                        icon={<FaVideo />}
                        title="Videos Educativos"
                        description="Cápsulas educativas grabadas para aprender desde casa."
                        link="/videos"
                        delay={200}
                    />
                </div>
            </section>
        </div>
    );
}

export default Recursos;
