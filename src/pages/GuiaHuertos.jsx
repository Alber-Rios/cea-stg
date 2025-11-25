import { useScrollAnimation } from '../hooks/useScrollAnimation';
import styles from './GuiaHuertos.module.css';

function GuiaHuertos() {
    useScrollAnimation();

    const steps = [
        {
            title: '1. Elige el lugar adecuado',
            description: 'Busca un espacio que reciba al menos 6 horas de luz solar al día. Puede ser en el jardín, terraza o incluso en el balcón. Si no tienes un área amplia, puedes optar por huertos verticales o maceteros.',
            image: 'https://images.pexels.com/photos/4503264/pexels-photo-4503264.jpeg',
            alt: 'Balcón soleado con macetas',
            reverse: false
        },
        {
            title: '2. Selecciona las plantas según la temporada',
            description: 'Es importante escoger las plantas adecuadas según la época del año. En primavera-verano, las verduras como tomates, lechugas y pimientos son ideales. En otoño-invierno, puedes optar por espinacas, zanahorias y acelgas.',
            image: 'https://images.pexels.com/photos/5529605/pexels-photo-5529605.jpeg',
            alt: 'Tomates maduros en la planta',
            reverse: true
        },
        {
            title: '3. Prepara la tierra',
            description: 'Usa una mezcla de tierra fértil, compost y arena para asegurar que tus plantas reciban los nutrientes necesarios. Si utilizas macetas, asegúrate de que tengan un buen drenaje para evitar que el agua se estanque.',
            image: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg',
            alt: 'Manos sosteniendo tierra fértil',
            reverse: false
        },
        {
            title: '4. Riega adecuadamente',
            description: 'El riego es esencial para el crecimiento de tus plantas. Mantén la tierra húmeda, pero no empapada. Riega temprano en la mañana o al atardecer para evitar que el agua se evapore rápidamente con el sol.',
            image: 'https://images.pexels.com/photos/1084540/pexels-photo-1084540.jpeg',
            alt: 'Regando plantas en macetas',
            reverse: true
        },
        {
            title: '5. Usa compost casero',
            description: 'Aprovecha los desechos orgánicos de la cocina, como cáscaras de frutas, plátanos y verduras, para hacer compost casero. Este abono natural enriquece la tierra, mejora la retención de humedad y fortalece el crecimiento de tus plantas.',
            image: 'https://www.homebiogas.com/wp-content/uploads/2023/09/shutterstock_1583646406-2.jpg',
            alt: 'Restos orgánicos como cáscaras de plátano y frutas en compost',
            reverse: false
        },
        {
            title: '6. Plantas fáciles para principiantes',
            description: 'Si estás comenzando, elige especies resistentes y de rápido crecimiento como lechugas, cebollines, perejil o cilantro. Son ideales para aprender las bases del cultivo y disfrutar resultados en poco tiempo.',
            image: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg',
            alt: 'Lechugas frescas en el huerto',
            reverse: true
        }
    ];

    return (
        <div className={styles.guiaHuertos}>
            <section className="sub-header header-guia">
                <h1>Guía de Huertos Urbanos</h1>
            </section>

            <section className={styles.introSection}>
                <h2 className="section-title">Huertos Urbanos</h2>
                <p className={styles.lead}>
                    Descubre y aprende con esta guía práctica sobre cómo puedes cultivar tus propios alimentos desde tu hogar.
                </p>
                <p className={styles.description}>
                    Tener un huerto en casa es una excelente manera de conectar con la naturaleza y disfrutar de alimentos frescos y saludables. Si estás pensando en empezar, aquí te dejamos una guía práctica de 6 pasos para crear tu propio huerto, incluso si tienes poco espacio.
                </p>
            </section>

            <hr className={styles.divider} />

            <section className={styles.stepsSection}>
                {steps.map((step, index) => (
                    <div
                        key={index}
                        className={`${styles.stepRow} ${step.reverse ? styles.reverse : ''} fade-up`}
                    >
                        <div className={styles.stepContent}>
                            <h3>{step.title}</h3>
                            <p dangerouslySetInnerHTML={{ __html: step.description }}></p>
                        </div>
                        <div className={styles.stepImage}>
                            <img src={step.image} alt={step.alt} loading="lazy" />
                        </div>
                    </div>
                ))}
            </section>

            <hr className={styles.divider} />

            <section className={styles.alertSection}>
                <div className={styles.alert}>
                    <h4>¡Listo para empezar!</h4>
                    <p>
                        Iniciar un huerto en casa no requiere gran espacio ni experiencia. Con un lugar soleado, buen sustrato y un riego adecuado, pronto podrás disfrutar de tus propios alimentos frescos.
                    </p>
                </div>
            </section>
        </div>
    );
}

export default GuiaHuertos;
