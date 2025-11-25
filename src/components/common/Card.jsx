import { Link } from 'react-router-dom';
import styles from './Card.module.css';

function Card({ icon, title, description, link, delay = 0 }) {
    const delayClass = delay > 0 ? `delay-${delay}` : '';

    return (
        <div className={`${styles.card} fade-up ${delayClass}`}>
            <div className={styles.cardIcon}>{icon}</div>
            <h3>{title}</h3>
            <p>{description}</p>
            {link && (
                <Link to={link} className="btn-link">
                    <button className="btn-small">VER MÁS</button>
                </Link>
            )}
            {!link && <button className="btn-small">VER MÁS</button>}
        </div>
    );
}

export default Card;
