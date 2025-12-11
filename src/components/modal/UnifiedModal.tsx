"use client";

import { useState, useRef, useEffect } from 'react';
import styles from '@/styles/components/modal/MessageModal.module.scss';
import alertStyles from '@/styles/components/AlertModal.module.scss';
import useUnifiedModal from '@/hooks/useUnifiedModal';
import { MessageFormData } from '@/types';
import { Button } from '@/components/Button';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';

const UnifiedModal = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { alertModal, messageModal, closeAlertModal, closeMessageModal } = useUnifiedModal();

  const [formData, setFormData] = useState<MessageFormData>({
    recipient: '',
    content: '',
    image: undefined,
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAlertOk = () => {
    alertModal.actionUrl ? router.push(alertModal.actionUrl) : alertModal.okCallback?.();
    closeAlertModal();
  };

  const handleAlertCancel = () => {
    if (alertModal?.cancleCallback) {
      alertModal.cancleCallback?.();
      closeAlertModal();
    } else {
      closeAlertModal();
    }
  };

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      closeMessageModal();
    }
  };

  useEffect(() => {
    if (messageModal.isShow) {
      setFormData({
        recipient: '',
        content: '',
        image: undefined,
      });
      setIsDropdownOpen(false);
    }
  }, [messageModal.isShow]);

  const handleInputChange = (field: keyof MessageFormData, value: string | File) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRecipientSelect = (recipient: string) => {
    handleInputChange('recipient', recipient);
    setIsDropdownOpen(false);
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

  const handleMessageSubmit = () => {
    if (messageModal.mode === 'message') {
      if (!formData.recipient || !formData.content) {
        alert('받는 분과 내용을 모두 입력해주세요.');
        return;
      }
      messageModal.onSubmit?.(formData);
    } else {
      messageModal.onSubmit?.();
    }
    closeMessageModal();
  };

  const handleMessageCancel = () => {
    messageModal.onCancel?.();
    closeMessageModal();
  };

  return (
    <>
      {alertModal.isShow && (
        <div className={alertStyles["alert-popup"]}>
          <div className={alertStyles["alert-popup-inner"]}>
            <p className={alertStyles["alert-popup-desc"]}>{alertModal.desc}</p>
            <div className={alertStyles["alert-popup-button-container"]}>
              <Button
                type="button"
                label={alertModal.cancleBtnLabel || t("alertModal.cancel")}
                onClick={handleAlertCancel}
              />
              <Button
                type="button"
                label={alertModal.okBtnLabel || t("alertModal.ok")}
                primary={true}
                onClick={handleAlertOk}
              />
            </div>
          </div>
        </div>
      )}

      {messageModal.isShow && (
        <div className={styles.overlay} onClick={handleOverlayClick}>
          <div ref={modalRef} className={styles.modal}>
            <div className={styles.header}>
              <h2 className={styles.title}>{messageModal.title}</h2>
              <button className={styles.closeButton} onClick={closeMessageModal}>
                <div className={styles.closeIcon} />
              </button>
            </div>

            <div className={styles.divider} />

            {messageModal.mode === 'message' && (
              <div className={styles.content}>
                <div className={styles.formContainer}>
                  <div className={styles.labelColumn}>
                    <div className={styles.label}>받는 분</div>
                    <div className={styles.label}>내용</div>
                    <div className={styles.label}>이미지</div>
                  </div>

                  <div className={styles.inputColumn}>
                    <div className={styles.inputWrapper}>
                      <div
                        className={styles.selectBox}
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      >
                        <span className={formData.recipient ? styles.selectedText : styles.placeholderText}>
                          {formData.recipient || '선택하기'}
                        </span>
                        <div className={`${styles.arrow} ${isDropdownOpen ? styles.arrowUp : styles.arrowDown}`} />
                      </div>

                      {isDropdownOpen && messageModal.recipients && (
                        <div className={styles.dropdown}>
                          {messageModal.recipients.map((recipient, index) => (
                            <div
                              key={index}
                              className={styles.dropdownItem}
                              onClick={() => handleRecipientSelect(recipient)}
                            >
                              {recipient}
                            </div>
                          ))}
                        </div>
                      )}
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
                      onClick={handleMessageSubmit}
                    >
                      전송
                    </button>
                  </div>
                </div>
              </div>
            )}

            {messageModal.mode === 'cancel' && (
              <div className={styles.cancelContent}>
                <p className={styles.cancelMessage}>
                  {messageModal.desc || '정말로 주문을 취소하시겠습니까?'}
                </p>
              </div>
            )}

            <div className={styles.buttonContainer}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={handleMessageCancel}
              >
                {messageModal.cancleBtnLabel || (messageModal.mode === 'message' ? '닫기' : '아니오')}
              </button>

              {messageModal.mode === 'cancel' && (
                <button
                  type="button"
                  className={styles.confirmButton}
                  onClick={handleMessageSubmit}
                >
                  {messageModal.okBtnLabel || '예, 취소합니다'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UnifiedModal;