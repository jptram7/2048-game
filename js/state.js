/* ==========================================================
   js/state.js : WHAT THE GAME REMEMBERS WHILE YOU PLAY
   ==========================================================
   A "variable" is a named box holding a value that CAN change (let).
   All the changing facts of the game are listed here in one place,
   so you can always see "what does the game know right now?".
*/

// ---- The data ----
let board = createEmptyBoard();   // the table of numbers (the truth of the game)
let score = 0;
let best = loadBest();            // the best score, read from the browser's notebook

// ---- Game flags ----
let paused = false;               // true while a win / game-over message is showing
let keepPlaying = false;          // true after the player chose to continue past the win tile
let gameId = 0;                   // counts games, so a late message from an old game is ignored

// ---- Tile name tags (needed so tiles can slide) ----
// If render() wiped and redrew every tile after each move, tiles could never SLIDE,
// because the old tile would no longer exist. So every tile gets a permanent ID number,
// like a name tag. After a move we only tell each tile its NEW row and column,
// and CSS (transition) does the sliding by itself.
//
// ids is a second table, the same shape as board:
//   board:  [[0, 2, 0, 0],        ids:  [[0, 7, 0, 0],
//            [0, 0, 4, 0], ...]          [0, 0, 8, 0], ...]
// "The tile in row 0, column 1 holds a 2 and has the name tag 7."
let ids = createEmptyBoard();     // ids[r][c] = name tag of the tile there (0 = no tile)
let nextId = 1;
function newTileId() { return nextId++; }   // hand out 1, 2, 3, ... never repeating

// ---- Messages from the rules (game.js) to the drawing (view.js) ----
const mergeIds = new Set();       // a "Set" = a list without duplicates. Tiles that should POP.
let ghosts = [];                  // old tiles that slide into a merge and then disappear
