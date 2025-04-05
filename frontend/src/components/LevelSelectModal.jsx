import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LevelSelectModal.module.css';

const LevelSelectModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLevelSelect = (level) => {
    onClose();
    switch (level.toLowerCase()) {
      case 'easy':
        navigate('/easy');
        break;
      case 'medium':
        navigate('/medium');
        break;
      case 'hard':
        navigate('/memory-card-game');
        break;
      default:
        navigate('/easy');
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <h2 className={styles.title}>Select Difficulty</h2>
        <div className={styles.levelGrid}>
          <button
            className={`${styles.levelButton} ${styles.easy}`}
            onClick={() => handleLevelSelect('easy')}
          >
            <span className={styles.levelTitle}>Easy</span>
            <span className={styles.levelDescription}>4x4 Grid</span>
            <span className={styles.levelInfo}>Perfect for beginners</span>
          </button>
          
          <button
            className={`${styles.levelButton} ${styles.medium}`}
            onClick={() => handleLevelSelect('medium')}
          >
            <span className={styles.levelTitle}>Medium</span>
            <span className={styles.levelDescription}>6x6 Grid</span>
            <span className={styles.levelInfo}>For experienced players</span>
          </button>
          
          <button
            className={`${styles.levelButton} ${styles.hard}`}
            onClick={() => handleLevelSelect('hard')}
          >
            <span className={styles.levelTitle}>Hard</span>
            <span className={styles.levelDescription}>8x8 Grid</span>
            <span className={styles.levelInfo}>For memory masters</span>
          </button>
        </div>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export default LevelSelectModal; 