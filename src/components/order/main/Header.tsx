import React from 'react';
import styles from '@/styles/components/order/main/header.module.scss';
import OrderHeaderShell from '@/components/order/common/OrderHeaderShell';
import type { OrderHeaderProps } from '@/types';
import { getBatteryColor, getBatteryWidth } from '@/utils';

const OrderHeader: React.FC<OrderHeaderProps> = ({
                                                     isTableMode,
                                                     onModeChange,
                                                     storeName = '스타트 하우스',
                                                     currentTime = 'PM 01:45',
                                                     batteryLevel = 100
                                                 }) => {
    const batteryColor = getBatteryColor(batteryLevel);
    const batteryWidth = getBatteryWidth(batteryLevel);

    return (
        <OrderHeaderShell
            variant="main"
            left={(
                <div className={styles.modeSwitch}>
                    <div
                        className={`${styles.modeOption} ${isTableMode ? styles.active : ''}`}
                        onClick={() => onModeChange(true)}
                    >
                        테이블 모드
                    </div>
                    <div
                        className={`${styles.modeOption} ${!isTableMode ? styles.active : ''}`}
                        onClick={() => onModeChange(false)}
                    >
                        목록 모드
                    </div>
                </div>
            )}
            center={(
                <div className={styles.storeInfo}>
                    <div className={styles.storeName}>{storeName}</div>
                    <img src="/assets/image/global/arrow/arrow-white.svg" alt="arrow"/>
                </div>
            )}
            right={(
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
            )}
        />
    );
};

export default OrderHeader;
