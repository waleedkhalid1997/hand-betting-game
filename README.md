# Hand Betting Game 🀄

A web-based Mahjong tile betting game built with React + Vite.

## Setup

```bash
npm install
npm run dev      # development server at http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview production build
```

No environment variables required.

---

## How to Play

1. Enter your name on the landing screen.
2. A hand of 4 Mahjong tiles is dealt. Look at the hand's total value.
3. Bet whether the **next** hand's total will be **Higher** or **Lower**.
4. Win = +new hand value to score. Loss = -½ new hand value (floored at 0).
5. Game ends when:
   - A Dragon or Wind tile's value hits **0 or 10**.
   - The Draw Pile runs out **3 times**.

---

## Architecture

```
src/
  constants/tiles.js        — Tile definitions (add new tiles here only)
  engine/
    deck.js                 — Pure shuffle/draw/reshuffle utilities
    gameEngine.js           — Pure state transition functions (no React)
  hooks/
    useGameState.js         — React state wrapper around the engine
    useLeaderboard.js       — localStorage top-5 persistence
  components/
    LandingScreen.jsx/.css  — Entry point with leaderboard toggle
    NameScreen.jsx/.css     — Player name input
    GameScreen.jsx/.css     — Main gameplay UI
    GameOverScreen.jsx/.css — Final score summary
    Tile.jsx/.css           — Single tile renderer (full + small variants)
    HistoryStrip.jsx/.css   — Scrollable previous hands
    ResultBanner.jsx/.css   — Animated win/loss overlay
  styles/global.css         — Design tokens + shared button styles
  App.jsx                   — Screen router
```

### Key design decisions

- **Pure engine**: `gameEngine.js` and `deck.js` contain zero React — every function takes state and returns new state. This makes logic trivially testable and easy to extend without touching UI.
- **Single state object**: All game state lives in one `G` object managed by `useGameState`. Adding a new field to the game requires touching only the engine and one hook.
- **Tile extensibility**: Adding a new tile type is one array entry in `constants/tiles.js`. Value behaviour is determined by whether the tile ID is in `DYNAMIC_TILE_IDS` — no switch statements scattered through the codebase.
- **CSS Modules**: Every component has its own `.module.css`. Global tokens live in `styles/global.css`.

