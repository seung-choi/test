import React from 'react';

interface MessageIconProps {
  hasNotification?: boolean;
  isActive?: boolean;
  size?: number;
}

const MessageIcon: React.FC<MessageIconProps> = ({
  hasNotification = false,
  isActive = false,
  size = 34
}) => {
  const getStrokeColor = () => {
    if (isActive) return '#F3F3F3';
    if (hasNotification) return '#DC0000';
    return '#666666';
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 34 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.6949 15.4028L11.4315 18.6734L5.3203 12.7649C5.28395 12.731 5.25114 12.6935 5.22237 12.653C4.80391 12.0233 5.2342 11.1389 6.02929 11.0521L27.4568 8.71553L15.8721 26.8922C15.4476 27.5595 14.4807 27.5606 14.0926 26.928C14.0599 26.8704 14.0352 26.8085 14.0191 26.7442L12.646 21.6209"
        stroke={getStrokeColor()}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default MessageIcon;
