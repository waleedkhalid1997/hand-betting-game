/**
 * useGameState
 * Central React hook for all game state and actions.
 * Components call actions here; no component touches the engine directly.
 */

import { useState, useCallback } from 'react';
import {
  createInitialState,
  dealOpeningHand,
  processBet,
} from '../engine/gameEngine';

export function useGameState() {
  const [state, setState] = useState(null);
  const [resolving, setResolving] = useState(false);

  /** Start a brand-new game session */
  const startGame = useCallback((playerName) => {
    const initial = createInitialState(playerName);
    const dealt = dealOpeningHand(initial);
    setState(dealt);
    setResolving(false);
  }, []);

  /** Place a bet — disables buttons during animation window */
  const placeBet = useCallback((direction) => {
    if (resolving || !state || state.phase !== 'betting') return;
    setResolving(true);

    const next = processBet(state, direction);
    setState(next);

    // Re-enable betting after result banner animation
    if (next.phase !== 'gameover') {
      setTimeout(() => setResolving(false), 1600);
    }
  }, [state, resolving]);

  /** Reset state (exit mid-game) */
  const resetGame = useCallback(() => {
    setState(null);
    setResolving(false);
  }, []);

  return { state, resolving, startGame, placeBet, resetGame };
}
