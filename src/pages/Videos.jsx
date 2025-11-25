import { FaRecycle, FaLayerGroup, FaScroll } from 'react-icons/fa';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import styles from './Videos.module.css';

function Videos() {
    useScrollAnimation();

    const videos = [
        {
            icon: <FaRecycle />,
            title: '¿Cómo reciclar?',
            videoId: 'fmb8xMJaT1k',
            description: '¿Querés comenzar a reciclar y no tenés mucha idea de cómo hacerlo? Te damos algunos tips',
            delay: 100
        },
        {
            icon: <FaLayerGroup />,
            title: 'Compost en casa',
            videoId: '9-y8eX9I6C0',
            description: 'Aprende los fundamentos del compostaje para gestionar tus residuos orgánicos y crear abono en casa.',
            delay: 200
        },
        {
            icon: <FaScroll />,
            title: 'Papel sin bastidores',
            videoId: 'CfmbhF5mnYc',
            description: 'Un breve tutorial para hacer papel reciclado con materiales caseros, ¡fácil y sin necesidad de bastidor!',
            delay: 300
        }
    ];

    return (
        <div className={styles.videos}>
            <section className="sub-header header-recursos">
                <h1>Video Talleres</h1>
            </section>

            <section className={styles.videosSection}>
                <div className={styles.videosContainer}>
                    {videos.map((video, index) => (
                        <div
                            key={index}
                            className={`${styles.videoCard} fade-up`}
                            style={{ animationDelay: `${video.delay}ms` }}
                        >
                            <div className={styles.videoIcon}>
                                {video.icon}
                            </div>
                            <h3 className={styles.videoTitle}>{video.title}</h3>

                            <div className={styles.videoEmbed}>
                                <iframe
                                    width="100%"
                                    height="200"
                                    src={`https://www.youtube.com/embed/${video.videoId}`}
                                    frameBorder="0"
                                    allowFullScreen
                                    title={video.title}
                                ></iframe>
                            </div>

                            <p className={styles.videoDescription}>{video.description}</p>

                            <a
                                href={`https://www.youtube.com/watch?v=${video.videoId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.videoButton}
                            >
                                VER
                            </a>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default Videos;
