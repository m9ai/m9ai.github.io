'use client';

import React from 'react';

interface VideoPlayerProps {
  src: string;
}

export default function VideoPlayer({ src }: VideoPlayerProps) {
  // 支持多种视频源：直接 URL、YouTube、Bilibili
  const getEmbedUrl = (url: string): string => {
    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }

    // Bilibili
    const bilibiliMatch = url.match(/bilibili\.com\/video\/(BV[\w]+)/i);
    if (bilibiliMatch) {
      return `https://player.bilibili.com/player.html?bvid=${bilibiliMatch[1]}&autoplay=0`;
    }

    // 直接 URL
    return url;
  };

  const isEmbed = src.includes('youtube.com') || src.includes('bilibili.com');

  if (isEmbed) {
    return (
      <div className="my-6 aspect-video rounded-xl overflow-hidden bg-slate-900">
        <iframe
          src={getEmbedUrl(src)}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Embedded video"
        />
      </div>
    );
  }

  return (
    <div className="my-6 rounded-xl overflow-hidden bg-slate-900">
      <video
        src={src}
        controls
        className="w-full aspect-video"
        preload="metadata"
      >
        您的浏览器不支持视频播放
      </video>
    </div>
  );
}
