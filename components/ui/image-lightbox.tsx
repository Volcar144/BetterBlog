'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, ZoomIn } from 'lucide-react';
import { Button } from './button';

interface ImageLightboxProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
  className?: string;
}

export function ImageLightbox({ src, alt, width = 500, height = 500, caption, className }: ImageLightboxProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className={`relative group cursor-zoom-in ${className || ''}`} onClick={() => setIsOpen(true)}>
        <Image src={src} alt={alt} width={width} height={height} className='rounded-lg' />
        <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg flex items-center justify-center'>
          <ZoomIn className='opacity-0 group-hover:opacity-100 transition-opacity text-white drop-shadow-lg' size={32} />
        </div>
        {caption && <p className='text-sm text-center text-muted-foreground mt-2 italic'>{caption}</p>}
      </div>

      {isOpen && (
        <div className='fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4' onClick={() => setIsOpen(false)}>
          <Button
            variant='ghost'
            size='icon'
            className='absolute top-4 right-4 text-white hover:bg-white/20'
            onClick={() => setIsOpen(false)}
            aria-label='Close lightbox'
          >
            <X size={24} />
          </Button>
          <div className='relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center' onClick={(e) => e.stopPropagation()}>
            <Image src={src} alt={alt} width={width} height={height} className='max-w-full max-h-full object-contain' />
          </div>
          {caption && <p className='absolute bottom-4 left-0 right-0 text-center text-white text-sm px-4'>{caption}</p>}
        </div>
      )}
    </>
  );
}
