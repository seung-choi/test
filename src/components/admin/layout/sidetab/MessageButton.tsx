import React, { useState, useRef, useEffect } from 'react';
import styles from '@/styles/components/admin/layout/SideTab.module.scss';
import MessageIcon from './MessageIcon';

interface Message {
  id: string;
  sender: string;
  recipient?: string;
  content: string;
  time: string;
  isSent: boolean;
}

interface MessageButtonProps {
  hasNotification?: boolean;
  onNotificationClear?: () => void;
}

const mockMessages: Message[] = [
  {
    id: '1',
    sender: '그룹명[계정명] or 캐디명',
    content: '@나캐디 미역국을 주문했는데, 좀 맵게 해달라는 요청이 있습니다. 참고해주세요.',
    time: '14:25',
    isSent: false,
  },
  {
    id: '2',
    sender: '그룹명[계정명] or 캐디명',
    content: '@나캐디 내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용',
    time: '14:28',
    isSent: false,
  },
  {
    id: '3',
    recipient: '@받는사람@받는사람@받는사람@받는사람',
    content: '내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용',
    time: '14:30',
    isSent: true,
    sender: '',
  },
  {
    id: '4',
    recipient: '@받는사람@받는사람@받는사람@받는사람',
    content: '내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용',
    time: '14:35',
    isSent: true,
    sender: '',
  },
];

const MessageButton: React.FC<MessageButtonProps> = ({
  hasNotification = false,
  onNotificationClear,
}) => {
  const [showPopover, setShowPopover] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

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
      height: '2.5rem',
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
      {showPopover && (
        <div className={styles.messageBackdrop} onClick={handleClose} />
      )}
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
              {mockMessages.map((message) => (
                <div key={message.id} className={styles.messageItem}>
                  {!message.isSent && (
                    <div className={styles.messageSender}>{message.sender}</div>
                  )}
                  <div className={message.isSent ? styles.sentMessageRow : styles.receivedMessageRow}>
                    {message.isSent && <div className={styles.messageTime}>{message.time}</div>}
                    <div className={message.isSent ? styles.sentBubble : styles.receivedBubble}>
                      <div className={styles.messageContent}>
                        {message.recipient && (
                          <span className={styles.messageRecipient}>{message.recipient}</span>
                        )}
                        {message.recipient && ' '}
                        <span className={styles.messageText}>{message.content}</span>
                      </div>
                    </div>
                    {!message.isSent && <div className={styles.messageTime}>{message.time}</div>}
                  </div>
                </div>
              ))}
            </div>
            <button className={styles.messageCloseButton} onClick={(e) => { e.stopPropagation(); handleClose(); }}>
              닫기
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default MessageButton;
