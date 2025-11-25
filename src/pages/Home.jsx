import { useEffect } from 'react';
import { FaSeedling, FaRecycle, FaDove } from 'react-icons/fa';
import Hero from '../components/common/Hero';
import Card from '../components/common/Card';
import EventsList from '../components/events/EventsList';
import Calendar from '../components/events/Calendar';
import LocationMap from '../components/location/LocationMap';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import styles from './Home.module.css';

function Home() {
    useScrollAnimation();

    return (
        <div className={styles.home}>
            <Hero
                title="CEA"
                subtitle="Educación Ambiental para un futuro sostenible"
            />

            <section className={styles.cardsSection}>
                <div className={styles.cardsContainer}>
                    <Card
                        icon={<FaSeedling />}
                        title="Nuestros Proyectos"
                        description="Descubre cómo trabajamos para proteger la biodiversidad local."
                        link="/proyectos"
                        delay={100}
                    />
                    <Card
                        icon={<FaRecycle />}
                        title="Recursos Educativos"
                        description="Materiales didácticos para escuelas y comunidades."
                        link="/recursos"
                        delay={200}
                    />
                    <Card
                        icon={<FaDove />}
                        title="Voluntariado"
                        description="Únete a nuestra red y sé parte del cambio positivo."
                        delay={300}
                    />
                </div>
            </section>

            <section className={`${styles.eventsSection} fade-up events-section`}>
                <div className="leaf-animation-container"></div>

                <h2 className="section-title">Próximos Eventos</h2>
                <div className={styles.eventsContainer}>
                    <EventsList />
                    <Calendar />
                </div>
            </section>

            <LocationMap />
        </div>
    );
}

export default Home;
