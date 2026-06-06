/**
 * GameOverScreen
 * Final score summary with reason for game ending.
 */

import styles from './GameOverScreen.module.css';

export function GameOverScreen({ state, onPlayAgain, onMainMenu }) {
  const { score, gameOverReason, playerName } = state;

  return (
    <div className={styles.screen}>
      <div className={styles.card}>
        <h1 className={styles.heading}>Game Over</h1>
        <p className={styles.sub}>Session Complete · {playerName}</p>

        <div className={styles.scoreBig}>{score}</div>
        <div className={styles.scoreBigLabel}>Final Score</div>

        <div className={styles.reason} role="status">
          {gameOverReason}
        </div>

        <div className={styles.actions}>
          <button className="btn btn-primary" style={{ width: '200px' }} onClick={onPlayAgain}>
            Play Again
          </button>
          <button className="btn" style={{ width: '200px' }} onClick={onMainMenu}>
            Main Menu
          </button>
        </div>
      </div>
    </div>
  );
}
