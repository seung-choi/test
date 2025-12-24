import React, { useState } from 'react';
import {Snackbar, Alert, CircularProgress} from '@mui/material';
import styles from "@/styles/components/admin/drawer/SalesManagement.module.scss";

const ExcelDownloadButton: React.FC<{ onDownload: () => Promise<void> | void }> = ({onDownload}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error';
    }>({
        open: false,
        message: '',
        severity: 'success'
    });

    const handleDownload = async () => {
        try {
            setIsLoading(true);
            await onDownload();
            setNotification({
                open: true,
                message: '엑셀 파일 다운로드가 완료되었습니다.',
                severity: 'success'
            });
        } catch (error) {
            setNotification({
                open: true,
                message: '엑셀 다운로드 중 오류가 발생했습니다.',
                severity: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <button
                className={styles.excelButton}
                onClick={handleDownload}
            >
                {isLoading ? <CircularProgress size={28} /> : <img src="/assets/image/admin/excel.svg" alt="엑셀" className={styles.excelIcon} />}
                <div className={styles.excelButtonText}>엑셀로 내보내기</div>
            </button>
            <Snackbar
                open={notification.open}
                autoHideDuration={3000}
                onClose={() => setNotification(prev => ({ ...prev, open: false }))}
            >
                <Alert severity={notification.severity} onClose={() => setNotification(prev => ({ ...prev, open: false }))}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default ExcelDownloadButton;