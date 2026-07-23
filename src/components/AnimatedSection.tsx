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

    node.classList.add('is-pending');

    const reveal = () => {
      node.classList.remove('is-pending');
      node.classList.add('is-visible');
    };

    // Fallback if IntersectionObserver is delayed/unavailable
    const fallback = window.setTimeout(reveal, 1200);

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
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
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
