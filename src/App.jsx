/**
 * App
 * Top-level component. Manages screen routing and wires game + leaderboard hooks.
 *
 * Screens:
 *   'landing'  → LandingScreen
 *   'name'     → NameScreen
 *   'game'     → GameScreen
 *   'gameover' → GameOverScreen
 */

import { useState, useEffect } from 'react';
import { LandingScreen }  from './components/LandingScreen';
import { NameScreen }     from './components/NameScreen';
import { GameScreen }     from './components/GameScreen';
import { GameOverScreen } from './components/GameOverScreen';
import { useGameState }   from './hooks/useGameState';
import { useLeaderboard } from './hooks/useLeaderboard';
import './styles/global.css';

export default function App() {
  const [screen, setScreen] = useState('landing');
  const { state, resolving, startGame, placeBet, resetGame } = useGameState();
  const { leaderboard, addScore, refreshLeaderboard } = useLeaderboard();

  // Auto-navigate to gameover when phase changes
  useEffect(() => {
    if (state?.phase === 'gameover') {
      addScore(state.playerName, state.score);
      // Brief delay so result banner can show before transition
      setTimeout(() => setScreen('gameover'), 1700);
    }
  }, [state?.phase]); // eslint-disable-line

  const handleNewGameClick = () => setScreen('name');

  const handleStart = (name) => {
    startGame(name);
    setScreen('game');
  };

  const handleExit = () => {
    if (state && state.score > 0) addScore(state.playerName, state.score);
    resetGame();
    refreshLeaderboard();
    setScreen('landing');
  };

  const handlePlayAgain = () => {
    resetGame();
    setScreen('name');
  };

  const handleMainMenu = () => {
    resetGame();
    refreshLeaderboard();
    setScreen('landing');
  };

  return (
    <>
      {screen === 'landing'  && (
        <LandingScreen
          leaderboard={leaderboard}
          onNewGame={handleNewGameClick}
        />
      )}
      {screen === 'name' && (
        <NameScreen
          onStart={handleStart}
          onBack={() => setScreen('landing')}
        />
      )}
      {screen === 'game' && state && (
        <GameScreen
          state={state}
          resolving={resolving}
          onBet={placeBet}
          onExit={handleExit}
        />
      )}
      {screen === 'gameover' && state && (
        <GameOverScreen
          state={state}
          onPlayAgain={handlePlayAgain}
          onMainMenu={handleMainMenu}
        />
      )}
    </>
  );
}
