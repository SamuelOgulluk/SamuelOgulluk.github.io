import React, { useEffect, useRef } from 'react';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({ children, className = '', id }) => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const reveal = () => {
      node.classList.remove('is-pending');
      node.classList.add('is-visible');
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      reveal();
      return;
    }

    node.classList.add('is-pending');
    const fallback = window.setTimeout(reveal, 800);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            window.clearTimeout(fallback);
            reveal();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -24px 0px' }
    );

    observer.observe(node);
    return () => {
      window.clearTimeout(fallback);
      observer.disconnect();
    };
  }, []);

  return (
    <section ref={sectionRef} id={id} className={`section reveal ${className}`}>
      {children}
    </section>
  );
};

export default AnimatedSection;
