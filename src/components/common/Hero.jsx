import { useEffect, useRef } from 'react';
import styles from './Hero.module.css';

function Hero({ title, subtitle }) {
    const heroRef = useRef(null);

    useEffect(() => {
        const heroSection = heroRef.current;
        if (!heroSection) return;

        // Crear hojas flotantes
        for (let i = 0; i < 5; i++) {
            let leaf = document.createElement('div');
            leaf.className = 'leaf';
            heroSection.appendChild(leaf);
        }

        // Cleanup
        return () => {
            const leaves = heroSection.querySelectorAll('.leaf');
            leaves.forEach(leaf => leaf.remove());
        };
    }, []);

    return (
        <section className={styles.hero} ref={heroRef}>
            <h1 className="fade-up">{title}</h1>
            <p className="fade-in delay-200">{subtitle}</p>
        </section>
    );
}

export default Hero;
