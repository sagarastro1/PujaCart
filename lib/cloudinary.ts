import { CldUploadWidget } from 'next-cloudinary';

export const cloudinaryUploadOptions = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  uploadPreset: 'pujacart_products', // Create this preset in Cloudinary
  folder: 'pujacart',
  multiple: true,
  maxFileSize: 5000000, // 5MB
};

export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'pujacart_products');

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload failed:', error);
    throw error;
  }
};
