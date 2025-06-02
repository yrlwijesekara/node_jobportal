import React, { useState, useEffect } from 'react';
import styles from '../styles/Notification.module.css';

type NotificationProps = {
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  duration?: number;
};

const NotificationBanner: React.FC<NotificationProps> = ({ 
  message, 
  type, 
  duration = 5000 
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <div className={`${styles.notification} ${styles[type]}`}>
      <p>{message}</p>
      <button onClick={() => setVisible(false)} className={styles.closeBtn}>×</button>
    </div>
  );
};

export default NotificationBanner;