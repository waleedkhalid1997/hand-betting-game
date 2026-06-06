/**
 * HistoryStrip
 * Scrollable strip showing the last N hands (most recent first).
 */

import { Tile } from './Tile';
import styles from './HistoryStrip.module.css';

const MAX_VISIBLE = 14;

export function HistoryStrip({ history, tileValues }) {
  if (!history || history.length === 0) {
    return (
      <div className={styles.strip}>
        <span className={styles.empty}>Hand history will appear here</span>
      </div>
    );
  }

  const visible = [...history].reverse().slice(0, MAX_VISIBLE);

  return (
    <div className={styles.strip} role="log" aria-label="Hand history">
      {visible.map((record) => (
        <div key={record.round} className={styles.hand}>
          <span className={styles.round}>#{record.round}</span>
          <div className={styles.tiles}>
            {record.tiles.map(tile => (
              <Tile
                key={tile.uid}
                tile={tile}
                tileValues={tileValues}
                small
              />
            ))}
          </div>
          <span className={`${styles.meta} ${record.won ? styles.win : styles.lose}`}>
            {record.value} → {record.newValue} · {record.won ? 'W' : 'L'}
          </span>
        </div>
      ))}
    </div>
  );
}
