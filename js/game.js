/* ==========================================================
   js/game.js : THE GAME FLOW (what happens, and when)
   ==========================================================
   This is the "director". It uses:
     board.js  for the rules (slide, merge, can I still move?)
     state.js  for the variables
     view.js   to draw
   Read this file top to bottom to follow one game:
     startGame -> (player moves) move -> addRandomTile -> refreshScore -> render -> checkEnd
*/

// ---- Spawning ----

// Pick one empty cell at random and put a 2 or 4 in it.
function addRandomTile() {
  const empty = getEmptyCells(board);
  if (empty.length === 0) return;       // board full: nothing to do

  // Math.random() gives a number from 0 up to (not including) 1.
  // Multiply by the number of free cells, round down -> a random list position.
  // Example: 12 free cells -> a whole number from 0 to 11.
  const pick = Math.floor(Math.random() * empty.length);
  const spot = empty[pick];

  // Most of the time the new tile is a 2, sometimes a 4 (see CHANCE_OF_FOUR in config.js).
  board[spot.r][spot.c] = (Math.random() < CHANCE_OF_FOUR) ? 4 : 2;
  ids[spot.r][spot.c] = newTileId();    // every tile gets its own name tag
}

// ---- Score ----

// Update the best score (and save it) and show both numbers.
function refreshScore() {
  if (score > best) {
    best = score;
    saveBest(best);
  }
  showScore(score, best);
}

// ---- Starting a game ----

function startGame() {
  gameId++;                  // a new game invalidates any pending "You win!" / "Game over"
  score = 0;
  paused = false;            // a new game is playable again
  keepPlaying = false;
  hideOverlay();

  board = createEmptyBoard();   // all zeros
  ids = createEmptyBoard();     // tile name tags, same shape as the board
  mergeIds.clear();
  ghosts = [];
  clearTiles();                 // remove old tile pictures

  refreshScore();
  addRandomTile();              // first tile
  addRandomTile();              // second tile
  render();                     // draw it
}

// ---- Moving ----

// Handle one move in any direction ("left", "right", "up", "down").
function move(direction) {
  if (paused) return;                     // no moves while a message is showing

  const newBoard = createEmptyBoard();    // the table after the move
  const newIds = createEmptyBoard();      // which tile sits where after the move
  const newGhosts = [];                   // tiles that slide in and then vanish
  let gained = 0;                         // points earned by this move

  for (let line = 0; line < SIZE; line++) {
    // 1. Read this line in "sliding order" (the first cell is the one we slide toward).
    const lineValues = [];
    for (let pos = 0; pos < SIZE; pos++) {
      const p = coordsFor(direction, line, pos);
      lineValues.push(board[p.r][p.c]);
    }

    // 2. Slide and merge it (see board.js).
    const result = slideRowLeft(lineValues);
    gained += result.gained;

    // 3. Write it back, and keep track of which tile went where.
    for (let pos = 0; pos < SIZE; pos++) {
      const dest = coordsFor(direction, line, pos);
      newBoard[dest.r][dest.c] = result.values[pos];

      const from = result.sources[pos];            // undefined for an empty cell
      if (from === undefined) continue;

      if (from.length === 1) {
        // A tile that just slid: the SAME tile, new position.
        const s = coordsFor(direction, line, from[0]);
        newIds[dest.r][dest.c] = ids[s.r][s.c];
      } else {
        // Two tiles merged: a NEW tile is born, and the two old ones become
        // "ghosts" that slide to the spot and disappear.
        const mergedId = newTileId();
        newIds[dest.r][dest.c] = mergedId;
        mergeIds.add(mergedId);
        from.forEach(index => {
          const s = coordsFor(direction, line, index);
          newGhosts.push({ id: ids[s.r][s.c], r: dest.r, c: dest.c });
        });
      }
    }
  }

  // A move only counts if something actually changed.
  // (Pressing left when everything is already at the left does nothing.)
  if (JSON.stringify(newBoard) === JSON.stringify(board)) return;

  board = newBoard;
  ids = newIds;
  ghosts = newGhosts;
  score += gained;
  addRandomTile();                        // a new tile appears
  refreshScore();
  showScoreGain(gained);                  // floating "+4"
  render(true);                           // true = "this was a move": animate the slide
  checkEnd();                             // did the player just win or lose?
}

// ---- Winning and losing ----

// Show a message a moment later, so the player first SEES the last tile land
// (or the winning tile pop). setTimeout = "run this after N milliseconds".
function showOverlayLater(title, buttonText, action, waitMs) {
  const thisGame = gameId;
  setTimeout(() => {
    if (thisGame === gameId) showOverlay(title, buttonText, action);  // skip if a new game started meanwhile
  }, waitMs);
}

// Called after every successful move.
function checkEnd() {
  if (hasTile(board, WIN_TILE) && !keepPlaying) {
    paused = true;                  // freeze the keys right away
    launchConfetti();               // celebrate!
    showOverlayLater("You win!", "Keep going", () => {
      keepPlaying = true;           // do not show the win message again this game
      paused = false;
      hideOverlay();
    }, WIN_MESSAGE_DELAY_MS);
  } else if (!hasMoves(board)) {
    paused = true;
    showOverlayLater("Game over", "Try again", startGame, GAME_OVER_DELAY_MS);
  }
}
