import React, { useEffect, useRef } from 'react';

interface AnimatedSectionProps {
    children: React.ReactNode;
    className?: string;
    id?: string;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({ children, className = '', id }) => {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.remove('animate-fade-out');
                        entry.target.classList.add('animate-fade-in');
                        entry.target.classList.remove('opacity-0');
                    } else {
                        entry.target.classList.remove('animate-fade-in');
                        entry.target.classList.add('animate-fade-out');
                    }
                });
            },
            {
                threshold: [0, 0.1],
                rootMargin: "-150px 0px -150px 0px"
            }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            id={id}
            className={`opacity-0 ${className}`}
        >
            {children}
        </section>
    );
};

export default AnimatedSection;