/* ==========================================================
   js/board.js : THE RULES OF THE BOARD (pure logic)
   ==========================================================
   This file knows nothing about the screen, the score display or the browser.
   It only works on tables of numbers. That makes it easy to test:
   you can call any function here with a table and check the answer.

   The big idea: the game does NOT "know" what is on the screen.
   It knows a table of numbers. The screen is just a picture of that table.

   The table: 4 rows x 4 columns.  0 means "empty cell".
   Excel view:        Python view:
     A  B  C  D         [[0, 2, 0, 0],
   1 0  2  0  0          [0, 0, 4, 0],
   2 0  0  4  0          [0, 0, 0, 0],
   3 0  0  0  0          [0, 0, 0, 0]]
   4 0  0  0  0

   Reading a cell: board[row][column]. Counting starts at 0.
   board[0][1] = top row, second cell from the left.
*/

// A new table filled with zeros.
function createEmptyBoard() {
  const grid = [];
  for (let r = 0; r < SIZE; r++) {       // repeat for every row
    const row = [];
    for (let c = 0; c < SIZE; c++) {     // repeat for every column
      row.push(0);
    }
    grid.push(row);
  }
  return grid;
}

// The position of every empty cell.
// Example result: [ {r:0, c:0}, {r:0, c:2}, {r:1, c:1}, ... ]
// Each {r, c} is a small "object": a labeled pair, like a row in a table.
function getEmptyCells(grid) {
  const empty = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] === 0) {
        empty.push({ r: r, c: c });
      }
    }
  }
  return empty;
}

// Is there a tile with this value anywhere? (.flat() turns the table into one long list.)
function hasTile(grid, value) {
  return grid.flat().includes(value);
}

// Can the player still move?
// Yes if there is an empty cell, OR two neighbors (right or below) are equal.
// Checking only right and below covers every pair exactly once.
function hasMoves(grid) {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] === 0) return true;
      if (c + 1 < SIZE && grid[r][c] === grid[r][c + 1]) return true;
      if (r + 1 < SIZE && grid[r][c] === grid[r + 1][c]) return true;
    }
  }
  return false;
}

/* ----------------------------------------------------------
   SLIDE AND MERGE: the core of the game
   ----------------------------------------------------------
   The trick: write the logic for ONE direction only (left), for ONE row only.
   Then reuse it for everything else.

   One row, to the left, in 3 steps. Take [0, 2, 0, 2]:
     1. Remove the zeros (slide):   [0,2,0,2] -> [2,2]
     2. Merge equal neighbors:      [2,2]     -> [4]
     3. Add zeros back at the end:  [4]       -> [4,0,0,0]

   slideRowLeft returns THREE things:
     values  = the new row, e.g. [4, 4, 0, 0]
     sources = for each new cell, the old positions that made it,
               e.g. [[0, 1], [2]] means: new cell 0 = old cells 0 and 1 merged,
                                         new cell 1 = old cell 2 slid over.
               (The animation uses this to know which tile went where.)
     gained  = the points earned by the merges in this row

   Examples (look at the values):
     [2, 2, 4, 0]  ->  [4, 4, 0, 0]
     [2, 2, 2, 2]  ->  [4, 4, 0, 0]   (two merges, NOT one 8)
     [2, 2, 2, 0]  ->  [4, 2, 0, 0]   (the left pair merges first)
     [4, 0, 0, 4]  ->  [8, 0, 0, 0]
     [2, 4, 8, 16] ->  [2, 4, 8, 16]  (nothing to do)
*/
function slideRowLeft(row) {
  // Step 1: keep only the non-zero numbers, in order, remembering their old position.
  const tiles = [];
  row.forEach((n, index) => {
    if (n !== 0) tiles.push({ value: n, index: index });
  });

  // Step 2: walk through them, merging equal neighbors.
  const values = [];
  const sources = [];
  let gained = 0;
  let i = 0;
  while (i < tiles.length) {
    if (i + 1 < tiles.length && tiles[i].value === tiles[i + 1].value) {
      const merged = tiles[i].value * 2;   // two equal tiles become one double tile
      values.push(merged);
      sources.push([tiles[i].index, tiles[i + 1].index]);
      gained += merged;                    // merging scores points
      i += 2;                              // skip BOTH tiles (a tile merges only once per move)
    } else {
      values.push(tiles[i].value);         // no partner: keep it as is
      sources.push([tiles[i].index]);
      i += 1;
    }
  }

  // Step 3: pad the end with zeros until the row has SIZE cells.
  while (values.length < SIZE) {
    values.push(0);
  }
  return { values: values, sources: sources, gained: gained };
}

/* The other 3 directions: a "coordinate translator".
   Imagine we always slide a LINE "to the left" in our heads.
   coordsFor() converts "line number + position in that line" into the real
   row and column on the board, for the chosen direction:

     LEFT : line = row,    position 0 is the left end      -> (row=line,   col=pos)
     RIGHT: line = row,    position 0 is the RIGHT end     -> (row=line,   col=3-pos)
     UP   : line = column, position 0 is the TOP end       -> (row=pos,    col=line)
     DOWN : line = column, position 0 is the BOTTOM end    -> (row=3-pos,  col=line)
*/
function coordsFor(direction, line, pos) {
  if (direction === "left")  return { r: line,            c: pos };
  if (direction === "right") return { r: line,            c: SIZE - 1 - pos };
  if (direction === "up")    return { r: pos,             c: line };
  /* down */                 return { r: SIZE - 1 - pos,  c: line };
}
