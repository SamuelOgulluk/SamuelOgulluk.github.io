import React, { useRef, useEffect } from 'react';

const BackgroundAnimation: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        const particles: Particle[] = [];
        const mouse = {
            x: null as number | null,
            y: null as number | null,
            radius: 120
        };

        window.addEventListener('mousemove', (event) => {
            mouse.x = event.x;
            mouse.y = event.y;
        });

        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        class Particle {
            x: number;
            y: number;
            size: number;
            speedX: number;
            speedY: number;

            constructor(width: number, height: number) {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 2.5 + 2; // Smaller nodes
                this.speedX = (Math.random() * 0.4 - 0.2); // Slower speed
                this.speedY = (Math.random() * 0.4 - 0.2);
            }

            update(width: number, height: number) {
                // Wall collision
                if (this.x > width || this.x < 0) this.speedX *= -1;
                if (this.y > height || this.y < 0) this.speedY *= -1;

                // Center repulsion (keep particles away from the content area)
                const centerX = width / 2;
                const centerWidth = 800; // Wider content area to push particles further
                const minX = centerX - centerWidth / 2;
                const maxX = centerX + centerWidth / 2;
                
                // If particle is in the center area, push it towards the edges
                if (this.x > minX && this.x < maxX) {
                    const distFromCenter = Math.abs(this.x - centerX);
                    const pushForce = 0.1 * (1 - distFromCenter / (centerWidth / 2));
                    if (this.x < centerX) {
                        this.speedX -= pushForce;
                    } else {
                        this.speedX += pushForce;
                    }
                }
                
                // Mouse interaction
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = this.x - mouse.x;
                    const dy = this.y - mouse.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouse.radius) {
                        const force = (mouse.radius - distance) / mouse.radius;
                        this.x += dx / distance * force * 1.5;
                        this.y += dy / distance * force * 1.5;
                    }
                }

                this.x += this.speedX;
                this.y += this.speedY;
            }

            draw(context: CanvasRenderingContext2D) {
                context.fillStyle = 'rgba(255, 100, 100, 1)'; // Brighter, less intense red
                context.beginPath();
                context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                context.fill();
            }
        }

        const init = () => {
            particles.length = 0; // Clear existing particles
            const numberOfParticles = (canvas.width * canvas.height) / 6000; // Higher density for more particles
            for (let i = 0; i < numberOfParticles; i++) {
                const particle = new Particle(canvas.width, canvas.height);
                // Ensure initial positions are not in the center content area
                const centerX = canvas.width / 2;
                const centerWidth = 600;
                while (particle.x > centerX - centerWidth/2 && particle.x < centerX + centerWidth/2) {
                    particle.x = Math.random() * canvas.width;
                }
                particles.push(particle);
            }
        }

        const connect = () => {
            let opacityValue = 1;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    const distance = Math.sqrt(
                        (particles[a].x - particles[b].x) * (particles[a].x - particles[b].x) +
                        (particles[a].y - particles[b].y) * (particles[a].y - particles[b].y)
                    );

                    if (distance < 130) { // Keep same connection distance
                        opacityValue = 1 - (distance / 130);
                        ctx.strokeStyle = `rgba(255, 100, 100, ${opacityValue * 1.5})`; // Brighter, less intense red
                        ctx.lineWidth = 1.2; // Even thinner lines
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (const particle of particles) {
                particle.update(canvas.width, canvas.height);
                particle.draw(ctx);
            }
            connect();
            animationFrameId = requestAnimationFrame(animate);
        };

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            init();
        };
        
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10 bg-zinc-900/30" />;
};

export default BackgroundAnimation;