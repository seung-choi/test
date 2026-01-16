import React, { useRef } from 'react';
import styles from '@/styles/components/admin/modal/ProductModal.module.scss';
import type { ImageUploadProps } from '@/types';

const ImageUpload: React.FC<ImageUploadProps> = ({ image, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onChange(file);
    }
  };

  const imageUrl = image instanceof File ? URL.createObjectURL(image) : image;

  return (
    <>
      <div className={styles.imageUpload} onClick={handleClick}>
        <div className={styles.imagePreview}>
          {imageUrl ? (
            <img src={imageUrl} alt="preview" className={styles.previewImage} />
          ) : (
            <div className={styles.uploadIcon}>
              <img src="/assets/image/global/cross.svg" alt="upload" />
            </div>
          )}
          <div className={styles.imageCount}>
            <span className={styles.current}>{image ? 1 : 0}</span>
            <span className={styles.separator}> / </span>
            <span className={styles.max}>1</span>
          </div>
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleChange}
      />
    </>
  );
};

export default ImageUpload;
