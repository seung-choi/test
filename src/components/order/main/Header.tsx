import React from 'react';
import styles from '@/styles/components/order/main/header.module.scss';

interface OrderHeaderProps {
    isTableMode: boolean;
    onModeChange: (isTableMode: boolean) => void;
    storeName?: string;
    currentTime?: string;
    batteryLevel?: number;
}

const OrderHeader: React.FC<OrderHeaderProps> = ({
                                                     isTableMode,
                                                     onModeChange,
                                                     storeName = '스타트 하우스',
                                                     currentTime = 'PM 01:45',
                                                     batteryLevel = 100
                                                 }) => {
    const getBatteryColor = (level: number) => {
        if (level <= 20) return '#FF1212';
        if (level <= 50) return '#FFA500';
        return '#00FF00';
    };

    const getBatteryWidth = (level: number) => {
        const maxWidth = 18;
        return Math.max(0, Math.min(maxWidth, (level / 100) * maxWidth));
    };

    const batteryColor = getBatteryColor(batteryLevel);
    const batteryWidth = getBatteryWidth(batteryLevel);

    return (
        <div className={styles.header}>
            <div className={styles.modeSwitch}>
                <div
                    className={`${styles.modeOption} ${!isTableMode ? styles.active : ''}`}
                    onClick={() => onModeChange(false)}
                >
                    테이블 모드
                </div>
                <div
                    className={`${styles.modeOption} ${isTableMode ? styles.active : ''}`}
                    onClick={() => onModeChange(true)}
                >
                    목록 모드
                </div>
            </div>

            <div className={styles.storeInfo}>
                <div className={styles.storeName}>{storeName}</div>
                <img src="/assets/image/global/arrow/arrow-white.svg" alt="arrow"/>
            </div>

            <div className={styles.statusInfo}>
                <div className={styles.currentTime}>{currentTime}</div>
                <div className={styles.batterySection}>
                    <div className={styles.batteryIcon}>
                        <div 
                            className={styles.batteryBody}
                            style={{ 
                                outline: `2px ${batteryColor} solid`
                            }}
                        />
                        <div 
                            className={styles.batteryLevel}
                            style={{ 
                                width: `${batteryWidth}px`,
                                background: batteryColor
                            }}
                        />
                        <div 
                            className={styles.batteryTip}
                            style={{ background: batteryColor }}
                        />
                    </div>
                    <div className={styles.batteryText}>{batteryLevel}%</div>
                </div>
            </div>
        </div>
    );
};

export default OrderHeader;