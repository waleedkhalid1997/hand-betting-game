/**
 * useLeaderboard
 * Manages top-5 high scores persisted in localStorage.
 */

import { useState, useCallback } from 'react';

const STORAGE_KEY = 'hbg_leaderboard_v1';
const MAX_ENTRIES = 5;

function loadLeaderboard() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveLeaderboard(entries) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Silently fail — localStorage may be unavailable
  }
}

export function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState(loadLeaderboard);

  const addScore = useCallback((name, score) => {
    const updated = [...loadLeaderboard(), { name, score, date: new Date().toLocaleDateString() }]
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_ENTRIES);
    saveLeaderboard(updated);
    setLeaderboard(updated);
    return updated;
  }, []);

  const refreshLeaderboard = useCallback(() => {
    setLeaderboard(loadLeaderboard());
  }, []);

  return { leaderboard, addScore, refreshLeaderboard };
}
