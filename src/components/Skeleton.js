'use client';

export default function Skeleton({ className = "" }) {
  return (
    <div 
      className={`animate-pulse bg-white/5 rounded-xl ${className}`}
      style={{
        backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0) 0, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0) 100%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 2s infinite linear'
      }}
    />
  );
}
