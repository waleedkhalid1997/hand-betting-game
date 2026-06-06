/**
 * GAME ENGINE
 * Pure state-transition functions. No React, no side effects.
 * Every function takes state and returns a new state object.
 * This makes the engine trivially testable and easy to extend.
 */

import {
  DYNAMIC_TILE_IDS,
  DYNAMIC_VALUE_MIN,
  DYNAMIC_VALUE_MAX,
  MAX_RESHUFFLES,
  HAND_SIZE,
} from '../constants/tiles';
import { createDeck, drawTiles, reshuffle } from './deck.js';

// ─── INITIAL STATE ────────────────────────────────────────────────────────────

/**
 * Build the initial game state for a new session.
 * @param {string} playerName
 * @returns {GameState}
 */
export function createInitialState(playerName) {
  // Seed dynamic values: every non-number tile starts at 5
  const tileValues = {};
  DYNAMIC_TILE_IDS.forEach(id => { tileValues[id] = 5; });

  return {
    playerName,
    score: 0,
    drawPile: createDeck(),
    discardPile: [],
    reshuffleCount: 0,
    tileValues,          // { [tileId]: currentValue }
    currentHand: [],
    history: [],         // Array<HandRecord>
    phase: 'betting',    // 'betting' | 'resolving' | 'gameover'
    lastResult: null,    // { won, prevValue, newValue, direction } | null
    gameOverReason: '',
  };
}

// ─── VALUE HELPERS ────────────────────────────────────────────────────────────

/**
 * Get the current effective value of a tile.
 * @param {TileInstance} tile
 * @param {{ [id: string]: number }} tileValues
 * @returns {number}
 */
export function getTileValue(tile, tileValues) {
  if (tile.type === 'number') return tile.baseValue;
  return tileValues[tile.id] ?? 5;
}

/**
 * Sum total value of a hand.
 * @param {TileInstance[]} hand
 * @param {{ [id: string]: number }} tileValues
 * @returns {number}
 */
export function getHandValue(hand, tileValues) {
  return hand.reduce((sum, tile) => sum + getTileValue(tile, tileValues), 0);
}

/**
 * Returns tiles whose values are dangerously close to game-over limits.
 * @param {{ [id: string]: number }} tileValues
 * @returns {Array<{ id: string, value: number }>}
 */
export function getDangerousTiles(tileValues) {
  return Object.entries(tileValues)
    .filter(([, v]) => v <= 1 || v >= 9)
    .map(([id, value]) => ({ id, value }));
}

// ─── STATE TRANSITIONS ────────────────────────────────────────────────────────

/**
 * Draw the opening hand. Handles reshuffle if needed.
 * Returns updated state (may set phase:'gameover').
 * @param {GameState} state
 * @returns {GameState}
 */
export function dealOpeningHand(state) {
  return _drawNewHand(state);
}

/**
 * Process a bet ('higher' | 'lower').
 * Draws a new hand, evaluates win/loss, updates values, records history.
 * @param {GameState} state
 * @param {'higher'|'lower'} direction
 * @returns {GameState}
 */
export function processBet(state, direction) {
  const prevHand = state.currentHand;
  const prevValue = getHandValue(prevHand, state.tileValues);

  // Discard previous hand
  const discardPile = [...state.discardPile, ...prevHand];

  // Draw new hand (handles reshuffle internally)
  let next = { ...state, discardPile, currentHand: [] };
  next = _drawNewHand(next);
  if (next.phase === 'gameover') return next;

  const newValue = getHandValue(next.currentHand, next.tileValues);
  const won = direction === 'higher' ? newValue > prevValue : newValue < prevValue;

  // Score update: win = +newValue, loss = -floor(newValue/2), floor at 0
  const scoreDelta = won ? newValue : -Math.floor(newValue / 2);
  const score = Math.max(0, next.score + scoreDelta);

  // Update dynamic tile values for tiles in the PREVIOUS hand
  const tileValues = _updateDynamicValues(prevHand, next.tileValues, won);

  // Check game-over conditions on tile values
  const breached = _findBreachedTile(prevHand, tileValues);
  if (breached) {
    const dir = tileValues[breached.id] <= DYNAMIC_VALUE_MIN ? 'reached 0' : 'reached 10';
    return {
      ...next,
      score,
      tileValues,
      phase: 'gameover',
      gameOverReason: `${breached.name} value ${dir}!`,
      lastResult: { won, prevValue, newValue, direction },
    };
  }

  // Record history
  const record = {
    round: state.history.length + 1,
    tiles: prevHand,
    value: prevValue,
    newValue,
    direction,
    won,
  };

  return {
    ...next,
    score,
    tileValues,
    phase: 'betting',
    history: [...state.history, record],
    lastResult: { won, prevValue, newValue, direction },
  };
}

// ─── PRIVATE HELPERS ──────────────────────────────────────────────────────────

/**
 * Draw HAND_SIZE tiles, reshuffling if needed.
 * Mutates nothing — returns new state.
 */
function _drawNewHand(state) {
  let { drawPile, discardPile, reshuffleCount } = state;

  // Ensure enough tiles; reshuffle if needed
  if (drawPile.length < HAND_SIZE) {
    reshuffleCount += 1;
    if (reshuffleCount >= MAX_RESHUFFLES) {
      return {
        ...state,
        drawPile,
        discardPile,
        reshuffleCount,
        phase: 'gameover',
        gameOverReason: 'The Draw Pile ran out for the 3rd time.',
      };
    }
    const reshuffled = reshuffle(discardPile);
    drawPile = [...drawPile, ...reshuffled.drawPile];
    discardPile = reshuffled.discardPile;
  }

  const { drawn, remaining } = drawTiles(drawPile, HAND_SIZE);
  return {
    ...state,
    drawPile: remaining,
    discardPile,
    reshuffleCount,
    currentHand: drawn,
  };
}

/**
 * Update dynamic (dragon/wind) tile values based on win/loss.
 */
function _updateDynamicValues(hand, tileValues, won) {
  const updated = { ...tileValues };
  hand.forEach(tile => {
    if (DYNAMIC_TILE_IDS.includes(tile.id)) {
      updated[tile.id] = (updated[tile.id] ?? 5) + (won ? 1 : -1);
    }
  });
  return updated;
}

/**
 * Find the first tile in a hand that has breached value bounds.
 * Returns the tile definition or null.
 */
function _findBreachedTile(hand, tileValues) {
  for (const tile of hand) {
    if (!DYNAMIC_TILE_IDS.includes(tile.id)) continue;
    const v = tileValues[tile.id];
    if (v <= DYNAMIC_VALUE_MIN || v >= DYNAMIC_VALUE_MAX) return tile;
  }
  return null;
}
