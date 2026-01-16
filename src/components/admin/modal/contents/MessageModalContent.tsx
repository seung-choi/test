'use client';

import React, { useMemo, useState, useRef, useEffect } from 'react';
import CommonModalLayout from '@/components/admin/modal/CommonModalLayout';
import commonStyles from '@/styles/components/admin/modal/CommonModal.module.scss';
import styles from '@/styles/components/admin/modal/MessageModal.module.scss';
import { EventMessageHistoryItem, MessageFormData } from '@/types';
import { useEventMsgHisList } from '@/hooks/api';
import type { MessageModalContentProps } from '@/types';

const MessageModalContent: React.FC<MessageModalContentProps> = ({
  title,
  recipients = [],
  bookingId,
  onSubmit,
  onClose,
}) => {
  const isClient = typeof window !== 'undefined';
  const [formData, setFormData] = useState<MessageFormData>({
    content: '',
    image: undefined,
  });
  const [selectedRecipient, setSelectedRecipient] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const recipientOptions = useMemo(() => {
    return recipients.filter((recipient) => Boolean(recipient));
  }, [recipients]);

  const { eventMsgHistory } = useEventMsgHisList({
    enabled: Boolean(bookingId),
  });

  const storageKey = useMemo(
    () => `messageDraft:${bookingId ?? 'default'}`,
    [bookingId]
  );

  const filteredHistory = useMemo(() => {
    if (!bookingId) return [] as EventMessageHistoryItem[];
    return eventMsgHistory.filter((item) => item.toId === String(bookingId));
  }, [eventMsgHistory, bookingId]);

  useEffect(() => {
    if (!isClient) return;
    const stored = window.sessionStorage.getItem(storageKey);
    if (!stored) {
      setFormData({ content: '', image: undefined });
      setSelectedRecipient('');
      return;
    }
    try {
      const parsed = JSON.parse(stored) as { content?: string; recipient?: string };
      setFormData((prev) => ({
        ...prev,
        content: parsed.content ?? '',
        image: undefined,
      }));
      setSelectedRecipient(parsed.recipient ?? '');
    } catch {
      setFormData({ content: '', image: undefined });
      setSelectedRecipient('');
    }
  }, [isClient, storageKey]);

  useEffect(() => {
    if (!isClient) return;
    const payload = JSON.stringify({
      content: formData.content,
      recipient: selectedRecipient,
    });
    window.sessionStorage.setItem(storageKey, payload);
  }, [isClient, storageKey, formData.content, selectedRecipient]);

  useEffect(() => {
    if (!selectedRecipient && recipientOptions.length > 0) {
      setSelectedRecipient(recipientOptions[0]);
    }
    if (selectedRecipient && !recipientOptions.includes(selectedRecipient)) {
      setSelectedRecipient(recipientOptions[0] ?? '');
    }
  }, [recipientOptions, selectedRecipient]);

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
    onSubmit({
      ...formData,
      recipient: selectedRecipient,
    });
    if (isClient) {
      window.sessionStorage.removeItem(storageKey);
    }
    setFormData({ content: '', image: undefined });
    setSelectedRecipient(recipientOptions[0] ?? '');
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
    <CommonModalLayout
      title={title}
      buttons={buttons}
      className={styles.messageModal}
      contentClassName={styles.messageContent}
      headerRight={
        <button type="button" className={styles.closeButton} onClick={onClose} aria-label="닫기">
          <img src="/assets/image/global/x/x.svg" alt="닫기" />
        </button>
      }
    >
      <div className={styles.formContainer}>
        <div className={styles.labelColumn}>
          <div className={styles.label}>받는 분</div>
          <div className={styles.label}>내용</div>
          <div className={styles.label}>이미지</div>
        </div>

        <div className={styles.inputColumn}>
          <div className={styles.inputWrapper}>
            <div className={styles.selectBox}>
              <span className={selectedRecipient ? styles.selectedText : styles.placeholderText}>
                {selectedRecipient || '받는 분이 없습니다.'}
              </span>
            </div>
          </div>

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

      {filteredHistory.length > 0 && (
        <div className={styles.historySection}>
          <div className={styles.historyHeader}>
            <div className={`${styles.headerCell} ${styles.timeColumn}`}>시간</div>
            <div className={`${styles.headerCell} ${styles.senderColumn}`}>보낸사람</div>
            <div className={`${styles.headerCell} ${styles.contentColumn}`}>메시지 내용</div>
            <div className={`${styles.headerCell} ${styles.imageColumn}`}>사진</div>
          </div>
          <div className={styles.historyBody}>
            {filteredHistory.map((item) => (
              <div key={item.eventNo} className={styles.historyRow}>
                <div className={`${styles.cell} ${styles.timeColumn}`}>{item.createdDt}</div>
                <div className={`${styles.cell} ${styles.senderColumn}`}>{item.fromNm}</div>
                <div className={`${styles.cell} ${styles.contentColumn}`}>
                  <span className={styles.recipientText}>@{item.toNm}</span>
                  <span className={styles.messageText}> {item.eventCont}</span>
                </div>
                <div className={`${styles.cell} ${styles.imageColumn}`}>
                  {item.eventImg ? (
                    <img src={item.eventImg} alt="첨부 이미지" className={styles.historyImage} />
                  ) : (
                    <span className={styles.noImage}>-</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </CommonModalLayout>
  );
};

export default MessageModalContent;
