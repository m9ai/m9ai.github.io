'use client';

import { useRef, useEffect, useState } from 'react';
import { isDarkMode, watchDarkMode } from '../lib/theme-utils';

// 节流函数
const throttle = <T extends (...args: Parameters<T>) => void>(func: T, limit: number): (...args: Parameters<T>) => void => {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= limit) {
      func(...args);
      lastCall = now;
    }
  };
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  opacity: number;
  update: () => void;
  draw: () => void;
}

const ParticleCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const throttledResizeRef = useRef<(...args: unknown[]) => void>(() => { });
  const handleMouseMoveRef = useRef<(e: MouseEvent) => void>(() => { });
  const [isRendered, setIsRendered] = useState(false);
  const [isDark, setIsDarkMode] = useState(isDarkMode());

  useEffect(() => {
    setIsRendered(true);
  }, []);

  watchDarkMode((isDarkMode) => {
    setIsDarkMode(isDarkMode);
  })

  useEffect(() => {
    if (!isRendered) return;

    // 声明事件处理函数变量并初始化为空函数
    const throttledResize: (...args: unknown[]) => void = () => { };
    let handleMouseMove: (e: MouseEvent) => void = () => { };

    const canvas = canvasRef.current;
    if (!canvas) {
      return () => {
        window.removeEventListener('resize', throttledResize);
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置Canvas尺寸
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
      }
    };

    // 使用节流优化窗口调整事件 (100ms间隔)
    throttledResizeRef.current = throttle(() => {
      resizeCanvas();
    }, 100);

    // 使用节流优化鼠标移动事件 (50ms间隔)
    handleMouseMoveRef.current = throttle((e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }, 50);

    window.addEventListener('resize', throttledResizeRef.current);
    resizeCanvas();

    // 粒子数组
    const particlesArray: Particle[] = [];
    const numberOfParticles = 80;

    // 粒子颜色选项 - 科技感蓝绿色调
    const particleColors = [
      'rgba(16, 185, 129, 0.7)', // 翠绿
      'rgba(52, 211, 153, 0.7)', // 浅绿
      'rgba(110, 231, 183, 0.7)', // 淡绿
      'rgba(209, 250, 229, 0.7)'  // 极浅绿
    ];

    // 创建粒子
    class ParticleClass implements Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      opacity: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.color = particleColors[Math.floor(Math.random() * particleColors.length)];
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // 边界检测
        if (this.x > canvas!.width) this.x = 0;
        else if (this.x < 0) this.x = canvas!.width;

        if (this.y > canvas!.height) this.y = 0;
        else if (this.y < 0) this.y = canvas!.height;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 初始化粒子
    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new ParticleClass());
    }

    // 鼠标交互
    const mouse = {
      x: 0,
      y: 0,
      radius: 150
    };

    // 使用节流优化鼠标移动事件 (50ms间隔)
    handleMouseMove = throttle((e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }, 80);

    window.addEventListener('mousemove', handleMouseMoveRef.current);

    // 动画循环
    let animationFrameId: number;

    const animate = () => {
      if (!ctx || !canvas) return;

      // 半透明背景，创建轨迹效果
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 更新和绘制粒子
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }

      // 粒子连线效果
      connectParticles();

      animationFrameId = requestAnimationFrame(animate);
    };

    // 粒子连线逻辑
    const connectParticles = () => {
      if (!ctx) return;

      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x;
          const dy = particlesArray[a].y - particlesArray[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // 粒子间连线
          if (distance < 100) {
            const opacity = 1 - distance / 100;
            ctx.strokeStyle = `rgba(16, 185, 129, ${opacity * 0.2})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }

          // 鼠标与粒子连线
          const dxMouse = particlesArray[a].x - mouse.x;
          const dyMouse = particlesArray[a].y - mouse.y;
          const distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

          if (distanceMouse < mouse.radius) {
            const opacity = 1 - distanceMouse / mouse.radius;
            ctx.strokeStyle = `rgba(16, 185, 129, ${opacity * 0.4})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }
    };

    if(!isDark) animate();

    // 清理函数
    return () => {
      window.removeEventListener('resize', throttledResizeRef.current);
      window.removeEventListener('mousemove', handleMouseMoveRef.current);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isRendered, isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0 dark:bg-slate-800"
      aria-hidden="true"
    />
  );
};

export default ParticleCanvas;