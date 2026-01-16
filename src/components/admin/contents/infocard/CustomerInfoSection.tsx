import React from 'react';
import styles from '@/styles/components/admin/contents/InfoCard.module.scss';
import { CustomerInfo } from '@/types';
import { getTagAltText, getTagImage } from '@/utils/tag';
import type { CustomerInfoSectionProps } from '@/types';

const CustomerInfoSection: React.FC<CustomerInfoSectionProps> = ({
  customerInfo,
  tags,
  onMessageClick,
}) => {
  return (
    <div className={styles.customerSection}>
      <div className={styles.customerHeader}>
        <div className={styles.tags}>
          {tags.map((tag, index) => (
            <div key={index} className={`${styles.tag} ${styles[`${tag}Tag`] || styles.defaultTag}`}>
              <img src={getTagImage(tag)} alt={getTagAltText(tag)} />
            </div>
          ))}
        </div>
        <div className={styles.customerInfo}>
          <div className={styles.customerMain}>
            <span className={styles.customerName}>
              {customerInfo.name}({customerInfo.group})
            </span>
            <span className={styles.customerTime}>{customerInfo.time}</span>
          </div>
          <button style={{ cursor: 'pointer' }} onClick={onMessageClick}>
            <img src="/assets/image/admin/info-card/meassage.svg" alt="메시지" />
          </button>
        </div>
      </div>
      <div className={styles.membersList}>
        {customerInfo.members.join(' ')}
      </div>
    </div>
  );
};

export default CustomerInfoSection;
