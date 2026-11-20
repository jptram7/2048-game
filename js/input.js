/* ==========================================================
   js/input.js : CONTROLS (keyboard and swipe)
   ==========================================================
   An "event listener" = "when X happens, run this function".
   Like an Excel macro that fires when you press a key.
     Laptop: the "keydown" event (a key is pressed)
     Phone:  "touchstart" (finger down) and "touchend" (finger up)

   This file only turns a key press or a swipe into a direction
   ("left", "right", "up", "down") and hands it to move() in game.js.
*/

// ---- Swipe ----
// Idea: remember where the finger went down, compare with where it lifted.
//   dx = how far it moved horizontally (right is positive)
//   dy = how far it moved vertically   (down is positive)
// Whichever distance is bigger decides the direction.
//   Example: dx = -80, dy = 15  -> mostly horizontal, negative -> LEFT
//   Example: dx = 10,  dy = 90  -> mostly vertical, positive    -> DOWN
//   Example: dx = 10,  dy = 10  -> shorter than MIN_SWIPE       -> a tap, nothing
function directionFromSwipe(dx, dy) {
  if (Math.max(Math.abs(dx), Math.abs(dy)) < MIN_SWIPE) return null;  // too short
  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? "right" : "left";
  } else {
    return dy > 0 ? "down" : "up";
  }
}

function setupInput() {
  // ---- Keyboard ----
  document.addEventListener("keydown", function (event) {
    const direction = KEY_TO_DIRECTION[event.key];   // look up the pressed key
    if (direction === undefined) return;             // not a game key: ignore it
    event.preventDefault();   // stop the browser's own action (arrow keys scroll the page)
    move(direction);
  });

  // ---- Swipe ----
  let touchStartX = 0;
  let touchStartY = 0;

  boardElement.addEventListener("touchstart", function (event) {
    const touch = event.changedTouches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  }, { passive: true });

  // iPhone Safari can still drag the whole page while a finger moves on the board.
  // preventDefault() on touchmove stops that. It needs passive:false, otherwise the
  // browser ignores preventDefault. Applied to the wrapper so the tiles and the
  // win/game-over overlay are covered too.
  document.querySelector(".board-wrap").addEventListener("touchmove", function (event) {
    event.preventDefault();
  }, { passive: false });

  boardElement.addEventListener("touchend", function (event) {
    const touch = event.changedTouches[0];
    const direction = directionFromSwipe(touch.clientX - touchStartX,
                                         touch.clientY - touchStartY);
    if (direction !== null) move(direction);
  }, { passive: true });
}
