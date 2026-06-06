/**
 * DECK ENGINE
 * Pure functions for deck creation, shuffling, and drawing.
 * No side effects — all return new arrays/objects.
 */

import { ALL_TILE_DEFS, COPIES_PER_TILE } from '../constants/tiles';

/**
 * Fisher-Yates shuffle — returns a new shuffled array.
 * @param {Array} arr
 * @returns {Array}
 */
export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Build one fresh shuffled deck.
 * Each tile definition gets COPIES_PER_TILE unique instances.
 * @returns {Array<TileInstance>}
 */
export function createDeck() {
  const tiles = [];
  ALL_TILE_DEFS.forEach(def => {
    for (let i = 0; i < COPIES_PER_TILE; i++) {
      tiles.push({
        ...def,
        uid: `${def.id}-${i}-${Math.random().toString(36).slice(2)}`,
      });
    }
  });
  return shuffle(tiles);
}

/**
 * Draw `count` tiles from the top of the draw pile.
 * Returns { drawn, remaining } — caller must handle empty pile before calling.
 * @param {Array} drawPile
 * @param {number} count
 * @returns {{ drawn: Array, remaining: Array }}
 */
export function drawTiles(drawPile, count) {
  const remaining = [...drawPile];
  const drawn = remaining.splice(remaining.length - count, count);
  return { drawn, remaining };
}

/**
 * Reshuffle: merge a fresh deck with the discard pile into a new draw pile.
 * @param {Array} discardPile
 * @returns {{ drawPile: Array, discardPile: Array }}
 */
export function reshuffle(discardPile) {
  const freshDeck = createDeck();
  const combined = shuffle([...freshDeck, ...discardPile]);
  return { drawPile: combined, discardPile: [] };
}
