/**
 * Tile
 * Visual representation of a single Mahjong tile.
 * Accepts `tile` (TileInstance), `tileValues` map, and optional `small` flag.
 */

import { getTileValue } from '../engine/gameEngine';
import styles from './Tile.module.css';

export function Tile({ tile, tileValues, small = false, animIndex = 0 }) {
  const value = getTileValue(tile, tileValues);
  const isDynamic = tile.type === 'dragon' || tile.type === 'wind';

  const cls = [
    styles.tile,
    styles[tile.type],
    small ? styles.small : '',
  ].filter(Boolean).join(' ');

  if (small) {
    return (
      <div className={cls} title={`${tile.name} (${value})`} aria-label={tile.name}>
        <span className={styles.sym}>{tile.sym}</span>
      </div>
    );
  }

  return (
    <div
      className={cls}
      style={{ animationDelay: `${animIndex * 70}ms` }}
      title={tile.name}
      aria-label={`${tile.name}, value ${value}`}
    >
      <span className={styles.valueBadge}>{value}</span>
      <span className={styles.sym}>{tile.sym}</span>
      <span className={styles.name}>{tile.name}</span>
      {isDynamic && (
        <span className={styles.dynamicDot} title="Dynamic value tile" />
      )}
    </div>
  );
}
