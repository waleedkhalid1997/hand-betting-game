/**
 * GameScreen
 * Main in-game interface: header, history strip, tile display, and bet controls.
 */

import { useRef } from 'react';
import { Tile } from './Tile';
import { HistoryStrip } from './HistoryStrip';
import { ResultBanner } from './ResultBanner';
import { getHandValue, getDangerousTiles } from '../engine/gameEngine';
import { MAX_RESHUFFLES } from '../constants/tiles';
import styles from './GameScreen.module.css';

export function GameScreen({ state, resolving, onBet, onExit }) {
  const { playerName, score, drawPile, discardPile, reshuffleCount,
          tileValues, currentHand, history, lastResult, phase } = state;

  const handValue   = getHandValue(currentHand, tileValues);
  const dangerous   = getDangerousTiles(tileValues);
  const betsEnabled = phase === 'betting' && !resolving;
  const bannerKey   = useRef(0);
  if (lastResult) bannerKey.current += 0; // stable across renders

  return (
    <div className={styles.screen}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.playerBlock}>
          <span className={styles.playerLabel}>Player</span>
          <strong className={styles.playerName}>{playerName}</strong>
          <div className={styles.reshuffleDots} title={`Reshuffles used: ${reshuffleCount}/${MAX_RESHUFFLES}`}>
            {Array.from({ length: MAX_RESHUFFLES }).map((_, i) => (
              <span
                key={i}
                className={`${styles.dot} ${i < reshuffleCount ? styles.dotUsed : ''}`}
              />
            ))}
          </div>
        </div>

        <div className={styles.deckInfo}>
          <div className={styles.deckStat}>
            <span className={styles.deckVal}>{drawPile.length}</span>
            <span className={styles.deckLabel}>Draw</span>
          </div>
          <div className={styles.deckStat}>
            <span className={styles.deckVal}>{discardPile.length}</span>
            <span className={styles.deckLabel}>Discard</span>
          </div>
        </div>

        <div className={styles.scoreBlock}>
          <span className={styles.scoreLabel}>Score</span>
          <span className={styles.scoreVal}>{score}</span>
        </div>

        <button className="btn btn-danger" onClick={onExit} style={{ fontSize: '0.72rem', padding: '0.4rem 0.9rem' }}>
          Exit
        </button>
      </header>

      {/* History */}
      <HistoryStrip history={history} tileValues={tileValues} />

      {/* Arena */}
      <main className={styles.arena}>
        {/* Danger warning */}
        {dangerous.length > 0 && (
          <div className={styles.warning} role="alert">
            ⚠ Tiles near limit: {dangerous.map(d => `${d.id.toUpperCase()} (${d.value})`).join(' · ')}
          </div>
        )}

        {/* Current hand */}
        <section className={styles.handSection} aria-label="Current hand">
          <span className={styles.handLabel}>Current Hand</span>
          <div className={styles.tilesRow}>
            {currentHand.map((tile, i) => (
              <Tile
                key={tile.uid}
                tile={tile}
                tileValues={tileValues}
                animIndex={i}
              />
            ))}
          </div>
          <div className={styles.handTotal}>{handValue}</div>
          <div className={styles.handTotalLabel}>Hand Value</div>
        </section>

        {/* Bet controls */}
        <section className={styles.betSection} aria-label="Betting controls">
          <p className={styles.betPrompt}>Will the next hand be higher or lower?</p>
          <div className={styles.betButtons}>
            <button
              className={`btn ${styles.btnBet} ${styles.btnHigher}`}
              disabled={!betsEnabled}
              onClick={() => onBet('higher')}
              aria-label="Bet higher"
            >
              ▲ Higher
            </button>
            <button
              className={`btn ${styles.btnBet} ${styles.btnLower}`}
              disabled={!betsEnabled}
              onClick={() => onBet('lower')}
              aria-label="Bet lower"
            >
              ▼ Lower
            </button>
          </div>
        </section>
      </main>

      {/* Result banner */}
      {lastResult && (
        <ResultBanner key={history.length} result={lastResult} />
      )}
    </div>
  );
}
