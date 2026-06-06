/**
 * ResultBanner
 * Animated overlay shown briefly after each round resolves.
 */

import { useEffect, useState } from 'react';
import styles from './ResultBanner.module.css';

export function ResultBanner({ result, key: _key }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 1500);
    return () => clearTimeout(t);
  }, [_key]);

  if (!result || !visible) return null;

  const { won, prevValue, newValue, direction } = result;
  const arrow = direction === 'higher' ? '▲' : '▼';

  return (
    <div
      className={`${styles.banner} ${won ? styles.win : styles.lose}`}
      role="status"
      aria-live="polite"
    >
      <span className={styles.label}>{won ? 'Win' : 'Loss'}</span>
      <span className={styles.values}>{prevValue} {arrow} {newValue}</span>
    </div>
  );
}
