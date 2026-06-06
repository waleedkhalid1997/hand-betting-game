/**
 * NameScreen
 * Collects the player's name before starting a game session.
 */

import { useState } from 'react';
import styles from './NameScreen.module.css';

export function NameScreen({ onStart, onBack }) {
  const [name, setName] = useState('');

  const handleStart = () => {
    onStart(name.trim() || 'Anonymous');
  };

  return (
    <div className={styles.screen}>
      <div className={styles.card}>
        <h2 className={styles.heading}>Enter Your Name</h2>
        <p className={styles.sub}>Your score will be saved to the leaderboard</p>
        <input
          className={styles.input}
          type="text"
          placeholder="Player name…"
          maxLength={20}
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleStart()}
          autoFocus
        />
        <button className={`btn btn-primary ${styles.full}`} onClick={handleStart}>
          Start Game
        </button>
        <button className={`btn ${styles.full} ${styles.back}`} onClick={onBack}>
          Back
        </button>
      </div>
    </div>
  );
}
