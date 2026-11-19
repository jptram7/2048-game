/* ==========================================================
   js/main.js : START-UP (runs last)
   ==========================================================
   Wire everything together and start the first game.
*/

setupView();       // build the empty board cells, connect the overlay button
setupPalettes();   // the dots under the board, and the saved palette
setupInput();      // keyboard and swipe

// The New Game button.
document.getElementById("restart").addEventListener("click", startGame);

startGame();       // the game starts when the page opens

/* ----------------------------------------------------------
   OFFLINE INSTALL
   ----------------------------------------------------------
   Register the service worker (sw.js) so the phone saves the game for offline use.
   This only runs when the game is opened from a web address (http/https).
   When you open index.html by double-clicking it (file://), it is already offline
   and this block does nothing.
*/
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  navigator.serviceWorker.register("sw.js").catch(function () {
    // not allowed here (for example a private tab): the game still works online
  });
}
