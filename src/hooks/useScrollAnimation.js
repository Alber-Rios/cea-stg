import { useEffect } from 'react';

export function useScrollAnimation(dependencies = []) {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains('fade-up') || entry.target.classList.contains('fade-in')) {
            entry.target.classList.add('element-visible');
          }
          
          if (entry.target.classList.contains('events-section') || entry.target.classList.contains('location-section')) {
            const container = entry.target.querySelector('.leaf-animation-container');
            if (container && !container.dataset.generated) {
              generateSideLeaves(container);
              container.dataset.generated = 'true';
            }
          }
          
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Pequeño delay para asegurar que el DOM se ha actualizado
    setTimeout(() => {
        const elements = document.querySelectorAll('.fade-up, .fade-in, .events-section, .location-section');
        elements.forEach(el => observer.observe(el));
    }, 100);

    return () => {
      observer.disconnect();
    };
  }, dependencies);
}

function generateSideLeaves(container) {
  for (let i = 0; i < 6; i++) {
    let leaf = document.createElement('div');
    leaf.className = 'side-leaf';
    leaf.style.top = 10 + Math.random() * 80 + '%';
    if (Math.random() > 0.5) {
      leaf.style.left = '-30px';
      leaf.classList.add('animate-leaf-left');
    } else {
      leaf.style.right = '-30px';
      leaf.classList.add('animate-leaf-right');
    }
    const size = 20 + Math.random() * 15;
    leaf.style.width = `${size}px`;
    leaf.style.height = `${size}px`;
    leaf.style.animationDelay = Math.random() * 2 + 's';
    container.appendChild(leaf);
  }
}
