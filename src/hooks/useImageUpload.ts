import { useState } from 'react';
import { toast } from 'react-toastify';
import imageCompression from 'browser-image-compression';
import apiClient from '@/services/api';

interface ImageUploadOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  initialQuality?: number;
}

interface UseImageUploadReturn {
  uploading: boolean;
  uploadImages: (files: FileList | null, currentImages: string[]) => Promise<string[]>;
}

const DEFAULT_OPTIONS: ImageUploadOptions = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  initialQuality: 0.8,
};

export const useImageUpload = (options: ImageUploadOptions = {}): UseImageUploadReturn => {
  const [uploading, setUploading] = useState(false);

  const compressionOptions = {
    ...DEFAULT_OPTIONS,
    ...options,
    useWebWorker: true,
  };

  const compressImage = async (file: File): Promise<File> => {
    if (file.size <= 1024 * 1024) {
      return file;
    }

    try {
      const originalSize = (file.size / 1024 / 1024).toFixed(2);
      console.log(`Compressing image: ${file.name}, Size: ${originalSize} MB`);

      const compressedFile = await imageCompression(file, compressionOptions);
      const compressedSize = (compressedFile.size / 1024 / 1024).toFixed(2);

      console.log(`✅ Compressed from ${originalSize}MB to ${compressedSize}MB`);
      return compressedFile;
    } catch (error) {
      console.warn('⚠️ Compression failed, using original file:', error);
      return file;
    }
  };

  const uploadSingleImage = async (file: File): Promise<string> => {
    const compressedFile = await compressImage(file);

    console.log(
      `Uploading image: ${compressedFile.name}, Size: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`
    );

    const formData = new FormData();
    formData.append('image', compressedFile);

    const response = await apiClient.post('/api/upload/product-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!response.data?.data?.url) {
      throw new Error('No URL returned from upload');
    }

    console.log(`Successfully uploaded: ${response.data.data.url}`);
    return response.data.data.url;
  };

  const uploadImages = async (
    files: FileList | null,
    currentImages: string[] = []
  ): Promise<string[]> => {
    if (!files || files.length === 0) {
      return currentImages;
    }

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = await uploadSingleImage(file);
        uploadedUrls.push(url);
      }

      toast.success(`${uploadedUrls.length} image(s) uploaded successfully!`);
      return [...currentImages, ...uploadedUrls];
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload images');
      return currentImages;
    } finally {
      setUploading(false);
    }
  };

  return { uploading, uploadImages };
};
