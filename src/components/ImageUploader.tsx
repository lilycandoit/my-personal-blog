'use client';
import { useState, useRef, DragEvent } from 'react';
import { Upload, X, Image as ImageIcon, Star, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { formatImageSize, prepareImageForUpload } from '@/lib/imageCompression';

interface UploadedImage {
  id: string;
  url: string;
  filename: string;
  size: number;
  width?: number;
  height?: number;
}

type UploadStatus = 'queued' | 'compressing' | 'uploading' | 'saving' | 'done' | 'failed';

interface UploadItem {
  id: string;
  name: string;
  originalSize: number;
  finalSize?: number;
  previewUrl?: string;
  status: UploadStatus;
  message?: string;
}

interface ImageUploaderProps {
  images: UploadedImage[];
  onImagesChange: (images: UploadedImage[]) => void;
  maxImages?: number;
  coverImageId?: string;
  onCoverImageChange?: (imageId: string) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

function makeUploadId(file: File) {
  return `${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID()}`;
}

function statusLabel(status: UploadStatus) {
  switch (status) {
    case 'queued':
      return 'Queued';
    case 'compressing':
      return 'Compressing';
    case 'uploading':
      return 'Uploading';
    case 'saving':
      return 'Saving';
    case 'done':
      return 'Done';
    case 'failed':
      return 'Failed';
  }
}

export default function ImageUploader({
  images,
  onImagesChange,
  maxImages = 10,
  coverImageId = '',
  onCoverImageChange,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadItems, setUploadItems] = useState<UploadItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isUploading = uploadItems.some((item) => !['done', 'failed'].includes(item.status));

  const updateUploadItem = (id: string, updates: Partial<UploadItem>) => {
    setUploadItems((items) => items.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    handleFiles(Array.from(e.dataTransfer.files));
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
      e.target.value = '';
    }
  };

  const handleFiles = async (files: File[]) => {
    setError(null);

    const remainingSlots = maxImages - images.length;
    if (remainingSlots <= 0) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    const selectedFiles = files.slice(0, remainingSlots);
    if (files.length > remainingSlots) {
      setError(`Only ${remainingSlots} more image${remainingSlots === 1 ? '' : 's'} can be added.`);
    }

    const newItems = selectedFiles.map((file) => ({
      id: makeUploadId(file),
      name: file.name,
      originalSize: file.size,
      previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      status: 'queued' as UploadStatus,
    }));

    setUploadItems((items) => [...newItems, ...items.filter((item) => item.status !== 'done')]);

    const uploadedImages: UploadedImage[] = [];

    for (const [index, file] of selectedFiles.entries()) {
      const item = newItems[index];

      try {
        if (!ALLOWED_TYPES.includes(file.type)) {
          throw new Error('Only PNG, JPG, WebP, and GIF images are supported.');
        }

        updateUploadItem(item.id, { status: 'compressing', message: 'Preparing image...' });
        const prepared = await prepareImageForUpload(file);

        if (prepared.finalSize > MAX_FILE_SIZE) {
          throw new Error(
            `${file.name} is still too large after compression (${formatImageSize(prepared.finalSize)}). Maximum is ${formatImageSize(MAX_FILE_SIZE)}.`
          );
        }

        updateUploadItem(item.id, {
          status: 'uploading',
          finalSize: prepared.finalSize,
          message: prepared.note || 'Uploading to Cloudinary...',
        });

        const formData = new FormData();
        formData.append('file', prepared.file);
        formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'blog_unsigned');

        const cloudinaryResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );

        if (!cloudinaryResponse.ok) {
          throw new Error('Cloudinary upload failed.');
        }

        const cloudinaryData = await cloudinaryResponse.json();

        updateUploadItem(item.id, { status: 'saving', message: 'Saving image...' });

        const dbResponse = await fetch('/api/images/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: cloudinaryData.secure_url,
            filename: file.name,
            size: prepared.finalSize,
            mimeType: prepared.file.type,
            width: cloudinaryData.width,
            height: cloudinaryData.height,
          }),
        });

        if (!dbResponse.ok) {
          const errorData = await dbResponse.json();
          throw new Error(errorData.error || 'Failed to save image metadata.');
        }

        const data = await dbResponse.json();
        uploadedImages.push(data.image);
        updateUploadItem(item.id, {
          status: 'done',
          message: prepared.compressed ? `Compressed to ${formatImageSize(prepared.finalSize)}` : 'Uploaded',
        });
      } catch (err) {
        updateUploadItem(item.id, {
          status: 'failed',
          message: err instanceof Error ? err.message : 'Failed to upload image.',
        });
      }
    }

    if (uploadedImages.length > 0) {
      onImagesChange([...images, ...uploadedImages]);
    }
  };

  const handleDelete = async (imageId: string) => {
    try {
      const response = await fetch(`/api/images/${imageId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete image');
      }

      const nextImages = images.filter((img) => img.id !== imageId);
      onImagesChange(nextImages);

      if (coverImageId === imageId) {
        onCoverImageChange?.('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete image');
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${isDragging ? 'var(--color-primary)' : 'var(--color-border)'}`,
          borderRadius: '12px',
          padding: '2rem',
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: isDragging ? 'rgba(59, 130, 246, 0.05)' : 'white',
          transition: 'all 0.2s ease',
          marginBottom: '1.5rem',
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />

        <Upload
          size={40}
          style={{
            margin: '0 auto 1rem',
            color: isDragging ? 'var(--color-primary)' : 'var(--color-muted)',
          }}
        />

        <p style={{ color: 'var(--color-text)', marginBottom: '0.5rem', fontWeight: 500 }}>
          {isUploading ? 'Preparing uploads...' : 'Drop images here or click to browse'}
        </p>
        <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem' }}>
          PNG, JPG, WebP, GIF up to 10MB after compression (max {maxImages} images)
        </p>
      </div>

      {error && (
        <div
          style={{
            padding: '0.75rem 1rem',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            color: '#991b1b',
            fontSize: '0.875rem',
            marginBottom: '1rem',
          }}
        >
          {error}
        </div>
      )}

      {uploadItems.length > 0 && (
        <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1.25rem' }}>
          {uploadItems.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '48px 1fr',
                gap: '0.75rem',
                alignItems: 'center',
                padding: '0.75rem',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                background: item.status === 'failed' ? '#fef2f2' : '#fff',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '48px',
                  height: '48px',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  background: '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {item.previewUrl ? (
                  <Image src={item.previewUrl} alt="" fill style={{ objectFit: 'cover' }} sizes="48px" unoptimized />
                ) : (
                  <ImageIcon size={20} />
                )}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem' }}>
                  <strong style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</strong>
                  <span style={{ fontSize: '0.8rem', color: item.status === 'failed' ? '#b91c1c' : 'var(--color-muted)' }}>
                    {statusLabel(item.status)}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: item.status === 'failed' ? '#991b1b' : 'var(--color-muted)' }}>
                  {['queued', 'compressing', 'uploading', 'saving'].includes(item.status) && <Loader2 size={14} />}
                  {item.status === 'done' && <CheckCircle size={14} />}
                  {item.status === 'failed' && <AlertCircle size={14} />}
                  <span>
                    {item.message || `${formatImageSize(item.originalSize)} selected`}
                    {item.finalSize && item.finalSize !== item.originalSize ? ` (${formatImageSize(item.finalSize)})` : ''}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {onCoverImageChange && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
              <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '0.875rem' }}>
                Cover image: {coverImageId ? 'selected below' : 'Auto (first image)'}
              </p>
              {coverImageId && (
                <button
                  type="button"
                  onClick={() => onCoverImageChange('')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-primary)',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    padding: 0,
                  }}
                >
                  Use first image automatically
                </button>
              )}
            </div>
          )}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: '1rem',
            }}
          >
            {images.map((image, index) => {
              const isCover = coverImageId ? coverImageId === image.id : index === 0;

              return (
                <div
                  key={image.id}
                  style={{
                    position: 'relative',
                    aspectRatio: '1',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: isCover ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                    backgroundColor: '#f9fafb',
                  }}
                >
                  <Image src={image.url} alt={image.filename} fill style={{ objectFit: 'cover' }} sizes="150px" />

                  {isCover && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '0.5rem',
                        left: '0.5rem',
                        backgroundColor: 'rgba(37, 99, 235, 0.95)',
                        color: 'white',
                        borderRadius: '999px',
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                      }}
                    >
                      Cover
                    </div>
                  )}

                  {onCoverImageChange && !isCover && (
                    <button
                      type="button"
                      onClick={() => onCoverImageChange(image.id)}
                      title="Set as cover"
                      style={{
                        position: 'absolute',
                        top: '0.5rem',
                        left: '0.5rem',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '999px',
                        height: '28px',
                        padding: '0 0.55rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        cursor: 'pointer',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                      }}
                    >
                      <Star size={13} />
                      Cover
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDelete(image.id)}
                    style={{
                      position: 'absolute',
                      top: '0.5rem',
                      right: '0.5rem',
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <X size={16} />
                  </button>

                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      color: 'white',
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.75rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {image.filename}
                    <div style={{ fontSize: '0.65rem', opacity: 0.8, marginTop: '0.125rem' }}>
                      {formatImageSize(image.size)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
