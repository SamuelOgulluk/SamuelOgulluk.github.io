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
                        entry.target.classList.remove('opacity-0');
                        entry.target.classList.add('animate-fade-in');
                    } else {
                        // When scrolling out, remove the animation class and hide it again
                        // This allows the animation to replay when scrolling back in
                        entry.target.classList.remove('animate-fade-in');
                        entry.target.classList.add('opacity-0');
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: "-50px 0px"
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