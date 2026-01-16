'use client';

import React, { useState } from 'react';
import BaseModal from './BaseModal';
import styles from '@/styles/components/order/modal/MemoModal.module.scss';
import type { MemoModalProps } from '@/types';

const MemoModal: React.FC<MemoModalProps> = ({ isOpen, onClose, onSave }) => {
  const [memo, setMemo] = useState('');

  const handleSave = () => {
    onSave(memo);
    setMemo('');
    onClose();
  };

  const footer = (
    <button className={styles.saveButton} onClick={handleSave}>
      저장하기
    </button>
  );

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="요청 메모 등록" width={1318} footer={footer}>
      <div className={styles.memoContent}>
        <textarea
          className={styles.textarea}
          placeholder="요청사항을 입력하세요"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
        />
      </div>
    </BaseModal>
  );
};

export default MemoModal;
