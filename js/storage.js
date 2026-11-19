/* ==========================================================
   js/storage.js : REMEMBERING THINGS ON THIS DEVICE
   ==========================================================
   localStorage = a small notebook inside the browser. It keeps values after you
   close the page. Think of it as saved cells: name -> value.

   try/catch = "attempt this; if the browser refuses, don't crash".
   Some browsers block saving (private tabs, some local files). The game still
   works then, it just can't remember the best score or the palette.
*/

function readSetting(name, fallback) {
  try {
    const value = localStorage.getItem(name);
    return value === null ? fallback : value;     // nothing saved yet -> use the fallback
  } catch (error) {
    return fallback;
  }
}

function writeSetting(name, value) {
  try {
    localStorage.setItem(name, value);
  } catch (error) {
    // saving not allowed: ignore
  }
}

// ---- The two things the game remembers ----
function loadBest() {
  return Number(readSetting(STORAGE_KEYS.best, 0)) || 0;
}
function saveBest(value) {
  writeSetting(STORAGE_KEYS.best, value);
}

function loadPalette() {
  const saved = readSetting(STORAGE_KEYS.palette, DEFAULT_PALETTE);
  // Only accept a name that still exists (an old, deleted palette falls back to the default).
  return PALETTES.some(p => p.id === saved) ? saved : DEFAULT_PALETTE;
}
function savePalette(id) {
  writeSetting(STORAGE_KEYS.palette, id);
}
