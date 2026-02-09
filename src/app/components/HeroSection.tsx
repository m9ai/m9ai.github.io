'use client';

import { useEffect, useRef, useState } from 'react';
import { Link } from '@/lib/navigation';
import { useTranslations } from 'next-intl';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRightIcon, SparklesIcon, PlayIcon } from '@heroicons/react/24/outline';

// Animated background particles
function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      particles = [];
      const particleCount = Math.min(50, Math.floor(window.innerWidth / 30));
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.1,
        });
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw connections
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 * (1 - distance / 150)})`;
            ctx.lineWidth = 1;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      // Draw particles
      particles.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${particle.opacity})`;
        ctx.fill();

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
      });

      animationFrameId = requestAnimationFrame(drawParticles);
    };

    resize();
    createParticles();
    drawParticles();

    window.addEventListener('resize', () => {
      resize();
      createParticles();
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
}

// Floating elements
const floatingElements = [
  { icon: '🤖', delay: 0, x: '10%', y: '20%' },
  { icon: '⚡', delay: 0.5, x: '85%', y: '15%' },
  { icon: '🧠', delay: 1, x: '75%', y: '70%' },
  { icon: '💡', delay: 1.5, x: '15%', y: '75%' },
  { icon: '🚀', delay: 2, x: '90%', y: '50%' },
];

export default function HeroSection() {
  const t = useTranslations('hero');
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800"
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '4s' }} />
        
        {/* Particle network */}
        {mounted && <ParticleBackground />}
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Floating elements */}
      {floatingElements.map((el, index) => (
        <motion.div
          key={index}
          className="absolute text-3xl opacity-20 pointer-events-none hidden lg:block"
          style={{ left: el.x, top: el.y }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 6,
            delay: el.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {el.icon}
        </motion.div>
      ))}

      {/* Main content */}
      <motion.div 
        className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-20"
        style={{ y, opacity }}
      >
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 mb-8"
          >
            <SparklesIcon className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              {t('badge') || 'AI-Powered Solutions'}
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            <span className="block text-slate-900 dark:text-white mb-2">
              {t('titleLine1') || 'Transform Your'}
            </span>
            <span className="gradient-text">
              {t('titleLine2') || 'Business with AI'}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            {t('description') || 'Enterprise-grade AI solutions for model deployment, application development, and intelligent agent customization. Scale your business with cutting-edge technology.'}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link
              href="/services"
              className="group flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary-600 text-white text-base font-semibold rounded-2xl transition-all hover:shadow-glow hover:scale-105 btn-shine"
            >
              {t('cta.explore') || 'Explore Services'}
              <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/docs"
              className="group flex items-center gap-2 px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-base font-semibold rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-soft transition-all"
            >
              <PlayIcon className="w-5 h-5" />
              {t('cta.docs') || 'View Documentation'}
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
          >
            {[
              { value: '50+', label: t('stats.clients') || 'Enterprise Clients' },
              { value: '99.9%', label: t('stats.uptime') || 'Uptime SLA' },
              { value: '24/7', label: t('stats.support') || 'Expert Support' },
              { value: '10x', label: t('stats.efficiency') || 'Efficiency Gain' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50"
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <div className="text-2xl sm:text-3xl font-bold gradient-text mb-1">{stat.value}</div>
                <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-slate-300 dark:border-slate-600 flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ opacity: [1, 0.3, 1], y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
