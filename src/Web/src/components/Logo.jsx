import React from 'react';
import { cn } from '@/lib/utils';

// Instagram-style wordmark rendered with the signature gradient.
const Logo = ({ className }) => (
  <span
    className={cn(
      'ig-gradient-text select-none font-["Segoe_UI"] text-3xl font-semibold tracking-tight',
      className
    )}
    style={{ fontFamily: "'Segoe Script', 'Brush Script MT', cursive" }}
  >
    Instagram
  </span>
);

export default Logo;
