'use client';

import { useRef, useEffect, useState, useCallback } from 'react';

interface TechGridBackgroundProps {
  color?: string;
  accentColor?: string;
  gridSize?: number;
  lineWidth?: number;
  pointSize?: number;
  animationSpeed?: number;
  density?: number;
}

const TechGridBackground = ({
  color = 'rgba(16, 185, 129, 0.1)',
  accentColor = 'rgba(16, 185, 129, 0.8)',
  gridSize = 40,
  lineWidth = 0.5,
  pointSize = 2,
  animationSpeed = 1,
  density = 0.02,
}: TechGridBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const [points, setPoints] = useState<Array<{ x: number; y: number; speed: number; opacity: number }>>([]);

  // 生成随机点
  const generatePoints = useCallback((width: number, height: number) => {
    const newPoints: Array<{ x: number; y: number; speed: number; opacity: number }> = [];
    const totalPoints = Math.floor((width * height) / (gridSize * gridSize) * density);

    for (let i = 0; i < totalPoints; i++) {
      // 确保点落在网格交叉点上
      const x = Math.floor(Math.random() * (width / gridSize)) * gridSize;
      const y = Math.floor(Math.random() * (height / gridSize)) * gridSize;
      const speed = 0.5 + Math.random() * animationSpeed;
      const opacity = 0.3 + Math.random() * 0.7;

      newPoints.push({ x, y, speed, opacity });
    }

    return newPoints;
  }, [gridSize, density, animationSpeed]);

  // 初始化和调整大小
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
        setPoints(generatePoints(canvas.width, canvas.height));
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, [generatePoints]);

  // 动画循环
  useEffect(() => {
    if (points.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = 0;

    const animate = (timestamp: number) => {
      if (!lastTime) lastTime = timestamp;
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;

      // 清空画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 绘制网格
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;

      // 绘制水平线
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // 绘制垂直线
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // 更新并绘制点
      ctx.fillStyle = accentColor;
      points.forEach(point => {
        // 移动点
        point.y = (point.y + point.speed * deltaTime * 0.01) % canvas.height;

        // 绘制点
        ctx.beginPath();
        ctx.globalAlpha = point.opacity;
        ctx.arc(point.x, point.y, pointSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        // 绘制垂直线条轨迹
        ctx.beginPath();
        ctx.strokeStyle = accentColor;
        ctx.globalAlpha = point.opacity * 0.3;
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(point.x, point.y - 40);
        ctx.stroke();
        ctx.globalAlpha = 1;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [points, color, accentColor, gridSize, lineWidth, pointSize]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    />
  );
};

export default TechGridBackground;