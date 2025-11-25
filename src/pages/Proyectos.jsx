import { FaRecycle, FaCarrot, FaSeedling } from 'react-icons/fa';
import Card from '../components/common/Card';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import styles from './Proyectos.module.css';

function Proyectos() {
    useScrollAnimation();

    return (
        <div className={styles.proyectos}>
            <section className="sub-header header-proyectos">
                <h1>Nuestros Proyectos</h1>
            </section>

            <section className={styles.cardsSection}>
                <div className={styles.cardsContainer}>
                    <Card
                        icon={<FaRecycle />}
                        title="Santiago Recicla"
                        description="Red de puntos fijos y móviles para la gestión de vidrio, plásticos (PET 1), papeles y cartones en tu barrio."
                        link="/puntos-reciclaje"
                        delay={100}
                    />
                    <Card
                        icon={<FaCarrot />}
                        title="Huertos Urbanos"
                        description="Aprende a cultivar tus propios alimentos y plantas medicinales en casa."
                        link="/guia-huertos"
                        delay={200}
                    />
                    <Card
                        icon={<FaSeedling />}
                        title="Reforestación Nativa"
                        description="Recuperación de espacios degradados utilizando especies de flora nativa de la zona central."
                        delay={300}
                    />
                </div>
            </section>
        </div>
    );
}

export default Proyectos;
