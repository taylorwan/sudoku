/* Hard-coded puzzles for testing */

testPuzzleEasy = [
  [5,9,0,  0,0,2,  0,7,0], // 1-1, 1-2, 1-3, 1-4, 1-5, 1-6, 1-7, 1-8, 1-9
  [8,4,0,  0,6,5,  9,0,0], // 2-1, 2-2, 2-3, 2-4, 2-5, 2-6, 2-7, 2-8, 2-9
  [0,0,1,  0,0,3,  8,0,0], // 3-1, 3-2, 3-3, 3-4, 3-5, 3-6, 3-7, 3-8, 3-9
  
  [0,1,0,  2,0,0,  6,0,0], // 4-1, 4-2, 4-3, 4-4, 4-5, 4-6, 4-7, 4-8, 4-9
  [0,7,0,  5,0,6,  0,3,0], // 5-1, 5-2, 5-3, 5-4, 5-5, 5-6, 5-7, 5-8, 5-9
  [0,0,6,  0,0,4,  0,1,0], // 6-1, 6-2, 6-3, 6-4, 6-5, 6-6, 6-7, 6-8, 6-9
  
  [0,0,2,  4,0,0,  3,0,0], // 7-1, 7-2, 7-3, 7-4, 7-5, 7-6, 7-7, 7-8, 7-9
  [0,0,8,  6,3,0,  0,9,2], // 8-1, 8-2, 8-3, 8-4, 8-5, 8-6, 8-7, 8-8, 8-9
  [0,3,0,  9,0,0,  0,6,5]  // 9-1, 9-2, 9-3, 9-4, 9-5, 9-6, 9-7, 9-8, 9-9
];

testPuzzleMedium = [
  [6,7,0,  1,4,0,  0,0,0],
  [0,0,0,  0,8,0,  6,7,0],
  [0,0,5,  6,0,0,  0,0,2],
  
  [5,0,8,  7,0,0,  0,6,0],
  [2,0,0,  5,0,8,  0,0,4],
  [0,3,0,  0,0,9,  8,0,5],
  
  [8,0,0,  0,0,6,  2,0,0],
  [0,6,7,  0,5,0,  0,0,0],
  [0,0,0,  0,1,7,  0,3,6]
];

testPuzzleHard = [
  [6,0,0,  0,0,5,  0,0,2],
  [0,0,0,  6,0,1,  3,4,0],
  [0,8,4,  0,7,0,  0,6,0],
  
  [0,0,7,  0,0,8,  0,0,0],
  [0,2,0,  0,6,0,  0,3,0],
  [0,0,0,  4,0,0,  5,0,0],
  
  [0,5,0,  0,9,0,  8,1,0],
  [0,4,2,  8,0,6,  0,0,0],
  [8,0,0,  5,0,0,  0,0,6]
];

/** Upon document ready
  * - initialize listeners
  * - call main
  */
$( function() {
  main();
});

/* Initialize our board */
function main() {
  initBoard();
  loadPuzzle(testPuzzleHard);
}

/** Initialize a blank board.
  *
  * We have 9 blocks, which represent the 9 big squares on a
  * sudoku board.
  *
  * Each block has 9 cells, which represent the smaller squares
  * on a sudoku board.
  *
  * The numbering for both is as follows:
  * .-----------.
  * | 1 | 2 | 3 |
  * |---.---.---|
  * | 4 | 5 | 6 |
  * |---.---.---|
  * | 7 | 8 | 9 |
  * .-----------.
  */
function initBoard() {
  var $board = $('#board');
  for (var i = 0; i < 9; i++) {
    var $block = '<div id="block-' + (i+1) + '" class="block">';

    for (var j = 0; j < 9; j++) {
      var r = parseInt(i/3)*3 + parseInt(j/3) + 1;
      var c = parseInt(i%3)*3 + parseInt(j%3) + 1;
      $block += '<div id="cell-' + r + '-' + c + '" class="cell"></div>';
    }

    $block += '</div>';
    $board.append($block);
  }
}

/** Load a puzzle given an 2-D array.
  *
  * "Null" values are represented by a 0 in the array. These cells
  * are given the class "editable".
  * Each cell with a given value has the class "given".
  *
  * @param puzzle - our 2D array, where puzzle[r][c] gives us the
  * cell at a particular row and column. 0 < r,c < 9.
  */
function loadPuzzle(puzzle) {
  for (var r = 0; r < 9; r++) {
    for (var c = 0; c < 9; c++) {
      var cur = puzzle[r][c];
      if (cur !== 0) {
        $('#cell-'+ (r+1) + '-' + (c+1)).text(cur).addClass('given');
      } else {
        $('#cell-'+ (r+1) + '-' + (c+1)).addClass('editable');
      }
    }
  }
}
