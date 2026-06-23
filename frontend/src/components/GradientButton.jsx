import React from 'react';

/**
 * GradientButton — animated gradient CTA button
 * Props:
 *   onClick    - click handler
 *   className  - extra Tailwind classes
 *   disabled   - disable state
 *   size       - 'sm' | 'md' | 'lg'
 *   children
 */
const SIZE_MAP = {
  sm: 'px-4 py-2 text-sm rounded-xl',
  md: 'px-6 py-3 text-sm rounded-xl',
  lg: 'px-8 py-4 text-base rounded-2xl',
};

export default function GradientButton({
  children,
  onClick,
  className = '',
  disabled = false,
  size = 'md',
  type = 'button',
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn-gradient font-semibold tracking-tight ${SIZE_MAP[size]} ${className} ${
        disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : 'cursor-pointer'
      }`}
    >
      {children}
    </button>
  );
}
