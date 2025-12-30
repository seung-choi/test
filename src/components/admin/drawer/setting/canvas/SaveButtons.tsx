'use client';

import React from 'react';
import styles from '@/styles/components/admin/drawer/canvas/saveButtons.module.scss';

interface SaveButtonsProps {
    onEdit: () => void;
    onSave: () => void;
}

const SaveButtons: React.FC<SaveButtonsProps> = ({ onEdit, onSave }) => {
    return (
        <div className={styles.container}>
            <button className={styles.editButton} onClick={onEdit}>
                <span>수정</span>
            </button>
            <button className={styles.saveButton} onClick={onSave}>
                <span>저장</span>
            </button>
        </div>
    );
};

export default SaveButtons;
