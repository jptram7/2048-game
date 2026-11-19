/* ==========================================================
   js/view.js : DRAWING THE GAME ON THE SCREEN
   ==========================================================
   Rule: render() looks at the table and makes the screen match it.
   Any time the table changes, call render() again.
   Analogy: a chart in Excel that redraws when the cells change.

   This file only DRAWS. It never decides what happens in the game.
*/

// ---- Grab the boxes from the HTML so JavaScript can fill them ----
const boardElement  = document.getElementById("board");
const tileLayer     = document.getElementById("tile-layer");
const overlay       = document.getElementById("overlay");
const overlayTitle  = document.getElementById("overlay-title");
const overlayBtn    = document.getElementById("overlay-btn");
const scoreElement  = document.getElementById("score");
const bestElement   = document.getElementById("best");

// ---- Drawing bookkeeping ----
const tileEls = new Map();      // a "Map" = a lookup table: tile id -> its HTML element
const dyingIds = new Set();     // merged-away tiles that are still sliding before they vanish
let overlayAction = null;       // what the overlay button does right now

function setupView() {
  document.documentElement.style.setProperty("--slide-ms", SLIDE_MS + "ms");   // tell the CSS the slide time
  buildBackground();
  overlayBtn.addEventListener("click", () => { if (overlayAction) overlayAction(); });
}

// Build the empty background cells once. They never change.
function buildBackground() {
  for (let i = 0; i < SIZE * SIZE; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    boardElement.appendChild(cell);
  }
}

// ---- Tiles ----

// Remove all tile pictures (used when a new game starts).
function clearTiles() {
  tileLayer.innerHTML = "";
  tileEls.clear();
  dyingIds.clear();
}

// Which CSS class gives this number its color? 8 -> "v-8", 4096 -> "v-big".
// (The CSS has one color rule per number up to 2048; bigger tiles share "v-big".)
function valueClass(value) {
  return value > 2048 ? "v-big" : "v-" + value;
}

// Tell a tile where to stand. CSS turns this change into a slide.
function placeTile(el, r, c) {
  el.style.setProperty("--r", r);
  el.style.setProperty("--c", c);
}

// Make the HTML for one tile.
function createTileElement(id, value, r, c, delay) {
  const el = document.createElement("div");
  el.className = "tile";
  placeTile(el, r, c);                     // position BEFORE adding to the page: no slide-in from nowhere

  const isMerge = mergeIds.has(id);        // born from a merge? then "pop", otherwise "appear"
  mergeIds.delete(id);

  const face = document.createElement("div");
  face.className = "tile-face " + (isMerge ? "pop" : "appear") + " " + valueClass(value);
  face.style.setProperty("--delay", delay + "ms");
  face.textContent = value;

  if (isMerge) el.style.zIndex = 2;        // the merged tile sits on top of the ghosts
  el.appendChild(face);
  tileLayer.appendChild(el);
  tileEls.set(id, el);
  return el;
}

// Make the screen match the table.
//   isMove = true  -> new and merged tiles wait for the slide to finish before appearing
function render(isMove) {
  const delay = isMove ? SLIDE_MS : 0;
  const alive = new Set();                 // name tags that exist after this move

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const value = board[r][c];
      if (value === 0) { ids[r][c] = 0; continue; }

      if (ids[r][c] === 0) ids[r][c] = newTileId();   // table edited by hand? give it a tag
      const id = ids[r][c];
      alive.add(id);

      const el = tileEls.get(id);
      if (el === undefined) {
        createTileElement(id, value, r, c, delay);    // brand new tile
      } else {
        placeTile(el, r, c);                          // existing tile: just move it (slides!)
      }
    }
  }

  // Ghosts: the two tiles that merged slide to the merge spot, then vanish.
  for (const g of ghosts) {
    const el = tileEls.get(g.id);
    if (el === undefined) continue;
    placeTile(el, g.r, g.c);
    dyingIds.add(g.id);
    setTimeout(() => {
      el.remove();
      tileEls.delete(g.id);
      dyingIds.delete(g.id);
    }, SLIDE_MS + 20);
  }
  ghosts = [];

  // Clean up: remove any tile that no longer exists in the table.
  for (const [id, el] of tileEls) {
    if (!alive.has(id) && !dyingIds.has(id)) {
      el.remove();
      tileEls.delete(id);
    }
  }
}

// ---- Score ----

function showScore(currentScore, bestScore) {
  scoreElement.textContent = currentScore;
  bestElement.textContent = bestScore;
}

// The "+4" that floats up from the score when you merge.
function showScoreGain(amount) {
  if (amount <= 0) return;
  const tag = document.createElement("div");
  tag.className = "score-add";
  tag.textContent = "+" + amount;
  scoreElement.parentElement.appendChild(tag);
  setTimeout(() => tag.remove(), 800);
}

// ---- Win / game-over message ----

function showOverlay(title, buttonText, action) {
  overlayTitle.textContent = title;
  overlayBtn.textContent = buttonText;
  overlayAction = action;
  overlay.classList.add("show");           // reveal (CSS: .overlay.show { display: flex })
}

function hideOverlay() {
  overlay.classList.remove("show");
}
