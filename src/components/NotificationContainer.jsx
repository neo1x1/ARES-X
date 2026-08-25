import React from 'react';
import { useNotificationStore } from '../state/notificationStore';
import { FiX, FiAlertCircle, FiCheckCircle, FiInfo } from 'react-icons/fi';
import './NotificationContainer.css';

function NotificationContainer() {
  const notifications = useNotificationStore((state) => state.notifications);
  const removeNotification = useNotificationStore((state) => state.removeNotification);

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <div key={notification.id} className={`notification notification-${notification.type}`}>
          <div className="notification-icon">
            {notification.type === 'error' && <FiAlertCircle size={18} />}
            {notification.type === 'success' && <FiCheckCircle size={18} />}
            {notification.type === 'info' && <FiInfo size={18} />}
            {notification.type === 'warning' && <FiAlertCircle size={18} />}
          </div>
          <div className="notification-content">
            {notification.title && (
              <div className="notification-title">{notification.title}</div>
            )}
            {notification.message && (
              <div className="notification-message">{notification.message}</div>
            )}
          </div>
          <button
            className="notification-close"
            onClick={() => removeNotification(notification.id)}
          >
            <FiX size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}

export default NotificationContainer;
