/**
 * TILE DEFINITIONS
 * Single source of truth for every tile in the game.
 * To add a new tile type, add an entry here — no other file needs changing.
 */

export const TILE_TYPES = {
  number: [
    { id: 'n1', sym: '🀇', name: '1 Man', type: 'number', baseValue: 1 },
    { id: 'n2', sym: '🀈', name: '2 Man', type: 'number', baseValue: 2 },
    { id: 'n3', sym: '🀉', name: '3 Man', type: 'number', baseValue: 3 },
    { id: 'n4', sym: '🀊', name: '4 Man', type: 'number', baseValue: 4 },
    { id: 'n5', sym: '🀋', name: '5 Man', type: 'number', baseValue: 5 },
    { id: 'n6', sym: '🀌', name: '6 Man', type: 'number', baseValue: 6 },
    { id: 'n7', sym: '🀍', name: '7 Man', type: 'number', baseValue: 7 },
    { id: 'n8', sym: '🀎', name: '8 Man', type: 'number', baseValue: 8 },
    { id: 'n9', sym: '🀏', name: '9 Man', type: 'number', baseValue: 9 },
  ],
  dragon: [
    { id: 'dg', sym: '🀄', name: 'Red Dragon',   type: 'dragon', baseValue: 5 },
    { id: 'dw', sym: '🀅', name: 'Green Dragon', type: 'dragon', baseValue: 5 },
    { id: 'dp', sym: '🀆', name: 'White Dragon', type: 'dragon', baseValue: 5 },
  ],
  wind: [
    { id: 'we', sym: '🀀', name: 'East Wind',  type: 'wind', baseValue: 5 },
    { id: 'ws', sym: '🀁', name: 'South Wind', type: 'wind', baseValue: 5 },
    { id: 'ww', sym: '🀂', name: 'West Wind',  type: 'wind', baseValue: 5 },
    { id: 'wn', sym: '🀃', name: 'North Wind', type: 'wind', baseValue: 5 },
  ],
};

/** All tile definitions in a flat array */
export const ALL_TILE_DEFS = [
  ...TILE_TYPES.number,
  ...TILE_TYPES.dragon,
  ...TILE_TYPES.wind,
];

/** IDs of tiles whose values are dynamic (non-number) */
export const DYNAMIC_TILE_IDS = [
  ...TILE_TYPES.dragon.map(t => t.id),
  ...TILE_TYPES.wind.map(t => t.id),
];

/** Number of copies of each tile in a deck */
export const COPIES_PER_TILE = 4;

/** Number of tiles drawn per hand */
export const HAND_SIZE = 4;

/** Dynamic value bounds that trigger game over */
export const DYNAMIC_VALUE_MIN = 0;
export const DYNAMIC_VALUE_MAX = 10;

/** How many reshuffles are allowed before game over */
export const MAX_RESHUFFLES = 3;
