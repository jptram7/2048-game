/* ==========================================================
   js/palettes.js : THE PALETTE SWITCHER (the dots under the board)
   ==========================================================
   The colors live in css/palettes.css and the list of palettes in js/config.js.
   This file only does two things: set the attribute <html data-palette="...">
   and remember the choice.
*/

function applyPalette(id) {
  document.documentElement.dataset.palette = id;             // <html data-palette="id">
  document.querySelectorAll(".swatch").forEach(dot => {
    const isCurrent = dot.dataset.palette === id;
    dot.classList.toggle("active", isCurrent);               // highlight the chosen dot
    dot.setAttribute("aria-pressed", isCurrent);
  });
}

function buildSwatches() {
  const row = document.getElementById("swatches");
  PALETTES.forEach(p => {
    const dot = document.createElement("button");
    dot.className = "swatch";
    dot.dataset.palette = p.id;      // this also lets the dot show its own colors
    dot.title = p.name;              // tooltip on hover
    dot.setAttribute("aria-label", p.name + " palette");
    dot.addEventListener("click", () => {
      applyPalette(p.id);
      savePalette(p.id);
      dot.blur();                    // give the keyboard back to the game
    });
    row.appendChild(dot);
  });
}

function setupPalettes() {
  buildSwatches();
  applyPalette(loadPalette());
}
