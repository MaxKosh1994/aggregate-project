import React, { useState } from 'react';
import styles from './Sidebar.module.css';
import { DOMTreeAnalyzer } from '@/features/DOMTreeAnalyzer';

export const Sidebar = (): React.JSX.Element => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleSidebar = (): void => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.container}>
      <button onClick={toggleSidebar} className={styles.sidebarButton}>
        {isOpen ? 'Close Sidebar' : 'Open Sidebar'}
      </button>
      <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <DOMTreeAnalyzer />
      </div>
    </div>
  );
};

export default Sidebar;
