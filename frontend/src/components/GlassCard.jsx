import React from 'react';

/**
 * GlassCard — reusable glassmorphism card with optional hover glow and gradient border
 * Props:
 *   className  - extra Tailwind classes
 *   hover      - enable hover lift + glow
 *   gradient   - show gradient border on hover
 *   children
 */
export default function GlassCard({ children, className = '', hover = false, gradient = false }) {
  const base = 'glass rounded-2xl';
  const hoverStyles = hover
    ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(124,92,255,0.2)] hover:border-purple-500/30'
    : '';
  const gradientStyles = gradient ? 'gradient-border' : '';

  return (
    <div className={`${base} ${hoverStyles} ${gradientStyles} ${className}`}>
      {children}
    </div>
  );
}
