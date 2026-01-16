import React, { useState, useRef, useEffect } from 'react';
import styles from '@/styles/components/admin/layout/SideTab.module.scss';
import MessageIcon from './MessageIcon';
import { useEventMsgHisList } from '@/hooks/api';
import storage from '@/utils/storage';
import type { MessageButtonProps } from '@/types';

const MessageButton: React.FC<MessageButtonProps> = ({
  hasNotification = false,
  isTablet = false,
  onNotificationClear,
}) => {
  const [showPopover, setShowPopover] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const { eventMsgHistory } = useEventMsgHisList();
  const userId = String(storage.session.get('userId') || '');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowPopover(false);
      }
    };

    if (showPopover) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPopover]);

  const handleClick = () => {
    setShowPopover(!showPopover);
    if (!showPopover && onNotificationClear) {
      onNotificationClear();
    }
  };

  const handleClose = () => {
    setShowPopover(false);
  };

  const getButtonStyle = () => {
    const baseStyle = {
      height: isTablet ? '1.825rem' : '2.5rem',
      alignItems: 'center' as const,
    };

    if (showPopover) {
      return {
        ...baseStyle,
        background: '#666666',
        outline: '1px #7B7B7B solid',
        outlineOffset: '-1px'
      };
    }

    if (hasNotification) {
      return {
        ...baseStyle,
        background: '#F7D2D2',
        outline: '1px rgba(219.94, 0, 0, 0.20) solid',
        outlineOffset: '-1px'
      };
    }

    return baseStyle;
  };

  return (
    <>
      <div
        className={styles.menuItem}
        ref={buttonRef}
        onClick={handleClick}
        style={getButtonStyle()}
      >
        <div className={styles.menuIcon}>
          <MessageIcon hasNotification={hasNotification} isActive={showPopover} />
        </div>
        {showPopover && (
          <div
            className={styles.messageBackdrop}
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
          />
        )}
        {showPopover && (
          <div ref={popoverRef} className={styles.messagePopover}>
            <div className={styles.messagePopoverHeader}>
              <h3 className={styles.messagePopoverTitle}>전체 메시지 내역</h3>
              <button className={styles.messageCloseIcon} onClick={(e) => { e.stopPropagation(); handleClose(); }}>
                <svg width="18" height="18" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 2L21 21M2 21L21 2" stroke="#666666" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <div className={styles.messageDivider} />
            <div className={styles.messageList}>
              {eventMsgHistory.map((message) => {
                const isSent = userId && message.fromId === userId;
                return (
                <div key={message.eventNo} className={styles.messageItem}>
                  {!isSent && <div className={styles.messageSender}>{message.fromNm}</div>}
                  <div className={isSent ? styles.sentMessageRow : styles.receivedMessageRow}>
                    {isSent && <div className={styles.messageTime}>{message.createdDt}</div>}
                    <div className={isSent ? styles.sentBubble : styles.receivedBubble}>
                      <div className={styles.messageContent}>
                        <span className={styles.messageRecipient}>@{message.toNm}</span>
                        <span className={styles.messageText}> {message.eventCont}</span>
                      </div>
                      {message.eventImg && (
                        <img src={message.eventImg} alt="첨부 이미지" className={styles.messageImage} />
                      )}
                    </div>
                    {!isSent && <div className={styles.messageTime}>{message.createdDt}</div>}
                  </div>
                </div>
              )})}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MessageButton;
