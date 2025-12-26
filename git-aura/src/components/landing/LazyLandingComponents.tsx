'use client';

import dynamic from 'next/dynamic';

export const DynamicThemeToggle = dynamic(() => import('@/components/ThemeToggle'), {
  ssr: false,
});

export const DynamicSingularityLogo = dynamic(() => import('@/components/landing/SingularityLogo'), {
  ssr: false,
});

export const DynamicVisualizerInput = dynamic(() => import('@/components/landing/VisualizerInput'));
