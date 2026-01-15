'use client';

import React, { useState, useRef } from 'react';
import CommonModalLayout from '@/components/admin/modal/CommonModalLayout';
import commonStyles from '@/styles/components/admin/modal/CommonModal.module.scss';
import styles from '@/styles/components/admin/modal/MessageModal.module.scss';
import { MessageFormData } from '@/types';

interface MessageModalContentProps {
  title: string;
  onSubmit: (data: MessageFormData) => void;
  onClose: () => void;
}

const MessageModalContent: React.FC<MessageModalContentProps> = ({
  title,
  onSubmit,
  onClose,
}) => {
  const [formData, setFormData] = useState<MessageFormData>({
    content: '',
    image: undefined,
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: keyof MessageFormData, value: string | File) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleInputChange('image', file);
    }
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const buttons = (
    <button
      type="button"
      className={commonStyles.cancelButton}
      onClick={onClose}
    >
      닫기
    </button>
  );

  return (
    <CommonModalLayout title={title} buttons={buttons} contentClassName={styles.messageContent}>
      <div className={styles.formContainer}>
        <div className={styles.labelColumn}>
          <div className={styles.label}>내용</div>
          <div className={styles.label}>이미지</div>
        </div>

        <div className={styles.inputColumn}>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              className={styles.textInput}
              placeholder="메시지 내용을 입력하세요."
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
            />
          </div>

          <div className={styles.inputWrapper}>
            <div className={styles.fileInputContainer}>
              <span className={styles.placeholderText}>
                {formData.image ? formData.image.name : '이미지 파일만 첨부하세요.'}
              </span>
              <button
                type="button"
                className={styles.attachButton}
                onClick={handleFileSelect}
              >
                첨부
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>
          </div>
        </div>

        <div className={styles.submitButtonContainer}>
          <button
            type="button"
            className={styles.submitButton}
            onClick={handleSubmit}
          >
            전송
          </button>
        </div>
      </div>
    </CommonModalLayout>
  );
};

export default MessageModalContent;
