/**
 * LandingScreen
 * Entry point — new game button + collapsible leaderboard.
 */

import { useState } from 'react';
import styles from './LandingScreen.module.css';

const RANK_MEDALS = ['🥇', '🥈', '🥉', '4.', '5.'];

export function LandingScreen({ leaderboard, onNewGame }) {
  const [showLb, setShowLb] = useState(false);

  return (
    <div className={styles.screen}>
      <div className={styles.inner}>
        <div className={styles.deco} aria-hidden="true">🀇 🀄 🀀 🀅</div>
        <h1 className={styles.title}>
          <span className={styles.titleMuted}>Hand</span> Betting
        </h1>
        <p className={styles.sub}>A Mahjong Tile Game</p>

        <div className={styles.actions}>
          <button className="btn btn-primary" onClick={onNewGame}>
            New Game
          </button>
          <button className="btn" onClick={() => setShowLb(v => !v)}>
            {showLb ? 'Hide Leaderboard' : 'Leaderboard'}
          </button>
        </div>

        {showLb && (
          <div className={styles.leaderboard}>
            <div className={styles.sectionTitle}>Top 5 Scores</div>
            {leaderboard.length === 0 ? (
              <p className={styles.empty}>No scores yet — be the first!</p>
            ) : (
              leaderboard.map((entry, i) => (
                <div key={i} className={styles.lbRow}>
                  <span className={styles.rank}>{RANK_MEDALS[i]}</span>
                  <span className={styles.name}>{entry.name}</span>
                  <span className={styles.score}>{entry.score}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
