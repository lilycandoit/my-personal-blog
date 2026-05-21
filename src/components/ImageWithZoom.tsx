'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ImageWithZoomProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  objectFit?: 'cover' | 'contain';
  aspectRatio?: string;
  borderRadius?: string;
  sizes?: string;
  quality?: number;
}

export default function ImageWithZoom({
  src,
  alt,
  width,
  height,
  objectFit = 'cover',
  aspectRatio,
  borderRadius = '12px',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality,
}: ImageWithZoomProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: aspectRatio || 'auto',
          overflow: 'hidden',
          borderRadius,
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.02)';
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        }}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          style={{
            width: '100%',
            height: '100%',
            objectFit,
          }}
          sizes={sizes}
          quality={quality}
        />
      </div>

      {/* Modal for zoomed image */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            cursor: 'zoom-out',
            padding: '2rem',
          }}
        >
          <div
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
            }}
          >
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              style={{
                width: 'auto',
                height: 'auto',
                maxWidth: '90vw',
                maxHeight: '90vh',
                objectFit: 'contain',
              }}
              sizes="90vw"
              quality={quality}
            />
          </div>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              fontSize: '1.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}
