# 2048

A 2048 game that runs in the browser and works offline (installable on a phone).

## Where things are

| File | Job | Chapter |
|---|---|---|
| `index.html` | The skeleton: boxes, buttons, which files to load | 2 |
| `css/palettes.css` | All the colors, one block per palette | 10 |
| `css/style.css` | Layout, tiles, animations | 3, 10 |
| `js/config.js` | Every setting: speeds, win tile, keys, palette list | |
| `js/storage.js` | Saving best score and palette in the browser | 8 |
| `js/board.js` | Rules: slide, merge, can the player still move (no screen code) | 4, 6, 7 |
| `js/state.js` | Variables the game remembers: board, score, flags | 5 |
| `js/view.js` | Drawing: tiles, score, win/lose overlay | 5, 10 |
| `js/effects.js` | Confetti | 9 |
| `js/palettes.js` | The palette dots under the board | 10 |
| `js/game.js` | Game flow: start, move, win, lose | 5-9 |
| `js/input.js` | Keyboard and swipe | 5, 8 |
| `js/main.js` | Start-up, offline registration | 11 |
| `sw.js`, `manifest.webmanifest`, icons | Offline and install on phone | 11 |

The scripts load in the order listed in `index.html`. A file can only use things defined in files above it.

## Common changes

- **Change a color:** edit the hex code in `css/palettes.css`.
- **Add a palette:** copy a block in `css/palettes.css`, rename it, add one line in `PALETTES` in `js/config.js`.
- **Test the win screen fast:** set `WIN_TILE = 64` in `js/config.js`.
- **Slower slide:** raise `SLIDE_MS` in `js/config.js`.

## Publish on GitHub Pages (works on iPhone)

1. Create a **public** repository on github.com.
2. Add file > Upload files. Drag in everything inside this folder (the `css` and `js` folders too). Commit.
3. Settings > Pages > Deploy from a branch > `main` / `(root)` > Save.
4. After about a minute the game is at `https://YOUR-USERNAME.github.io/REPO-NAME/`.
5. On the iPhone, open that address in Safari while online, then Share > Add to Home Screen. Test it in Airplane Mode.

## Updating after a change

Upload the changed files to the repo, and in `sw.js` change `game2048-v2` to `game2048-v3` (then v4, ...).
Without that bump, phones keep serving the old saved copy.
