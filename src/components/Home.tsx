import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/App';

const Typewriter: React.FC<{ text: string; speed?: number; delay?: number }> = ({ text, speed = 30, delay = 0 }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const elementRef = React.useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                    } else {
                        setIsVisible(false);
                        setDisplayedText(''); // Reset text when out of view
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) {
            setDisplayedText('');
            return;
        }

        let timer: ReturnType<typeof setInterval>;
        
        const startTimeout = setTimeout(() => {
            setDisplayedText('');
            let i = 0;
            timer = setInterval(() => {
                if (i < text.length) {
                    setDisplayedText(text.substring(0, i + 1));
                    i++;
                } else {
                    clearInterval(timer);
                }
            }, speed);
        }, delay);

        return () => {
            clearTimeout(startTimeout);
            if (timer) clearInterval(timer);
        };
    }, [text, speed, delay, isVisible]);

    return (
        <span ref={elementRef}>
            {displayedText}
            <span className="animate-pulse">|</span>
        </span>
    );
};

const Home: React.FC = () => {
    const { t } = useLanguage();

    return (
        <section id="home" className="min-h-screen flex flex-col justify-center animate-fade-in">
            <div className="space-y-4">
                <p className="text-xl text-red-400 font-medium h-8">
                    <Typewriter text={t.headerSubtitle} speed={40} delay={500} />
                </p>
                <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight">
                    {t.headerTitle}
                    <span className="text-red-500">.</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-300 pt-4 max-w-xl">
                    {t.home.intro}
                </p>
                <p className="text-slate-400 md:text-lg leading-relaxed max-w-xl">
                    {t.home.paragraph1}
                </p>
            </div>
        </section>
    );
};

export default Home;