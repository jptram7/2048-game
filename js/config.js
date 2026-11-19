/* ==========================================================
   js/config.js : THE SETTINGS YOU MAY WANT TO CHANGE
   ==========================================================
   Every number and option of the game lives here, so you never have to hunt
   for them in the code. Change a value, save, refresh.
*/

// ---- Game rules ----
const SIZE = 4;                 // the board is SIZE x SIZE. (The CSS grid is built for 4.)
const WIN_TILE = 2048;          // reaching this tile wins. Try 64 to test the win screen quickly.
const CHANCE_OF_FOUR = 0.1;     // 0.1 = 10% of new tiles are 4, the other 90% are 2

// ---- Timing (milliseconds) ----
const SLIDE_MS = 110;                // how long a tile takes to slide. Try 250 for slow motion.
const WIN_MESSAGE_DELAY_MS = 900;    // wait before "You win!" so you can enjoy the 2048 tile
const GAME_OVER_DELAY_MS = 500;      // wait before "Game over" so you can see the last tile land

// ---- Controls ----
const MIN_SWIPE = 30;           // pixels. A finger movement shorter than this is a tap, not a swipe.

// Each key name maps to a direction. Arrow keys, plus W A S D as a bonus.
const KEY_TO_DIRECTION = {
  ArrowLeft:  "left",
  ArrowRight: "right",
  ArrowUp:    "up",
  ArrowDown:  "down",
  a: "left", d: "right", w: "up", s: "down"
};

// ---- Saved settings (the names used inside the browser's notebook) ----
const STORAGE_KEYS = {
  best: "best2048",
  palette: "palette2048"
};

// ---- Palettes ----
// The colors themselves are in css/palettes.css. This list only says which palettes
// get a dot under the board. "id" must match the data-palette name in the CSS.
// TO ADD A PALETTE: 1) copy a block in css/palettes.css and rename it,
//                   2) add one line here with the same id.
const DEFAULT_PALETTE = "autumn";
const PALETTES = [
  { id: "autumn",          name: "Autumn"          },
  { id: "cool",            name: "Cool"            },
  { id: "neutral",         name: "Neutral"         },
  { id: "summer",          name: "Summer"          },
  { id: "christmas",       name: "Christmas"       },
  { id: "cyberpunk",       name: "Cyberpunk"       },
  { id: "candy",           name: "Candy"           },
  { id: "stranger-things", name: "Stranger Things" },
  { id: "off-pink",        name: "Off-pink"        }
];
