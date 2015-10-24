/**************************
  TEST VALUES
**************************/

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



/**************************
  
  MAIN FUNCTION
  
  ************************

  Functions:
  - document.ready
  - main

**************************/

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




/**************************

  BOARD

  ************************

  Functions:
  - initBoard
  - loadPuzzle

**************************/


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
      $block += '<div id="cell-' + r + '-' + c + '" class="cell" row="' + r + '" col="' + c + '"></div>';
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




/**************************

  VALIDATION

  ************************

  Functions:
  - boardIsValid
  - rowIsValid
  - colIsValid
  - blockIsValid

  Helpers:
  - valueInArray
  - falseArray

**************************/

/** Check if current board is valid
  * - check each row
  * - check each column
  * - check each block
  * @return true if all checks pass, false otherwise.
  */
function boardIsValid() {
  for (var i = 0; i < 9; i++) {
    if (!rowIsValid(i)) {
      return false;
    } if (!colIsValid(i)) {
      return false;
    } if (!blockIsValid(i)) {
      return false;
    }
  }
  return true;
}


/** Given a particular row, check if it is valid
  * @param r - row to check
  * @return true if all checks pass, false otherwise.
  */
function rowIsValid(r) {
  arr = falseArray();
  for (var c = 0; c < 9; c++) {
    if (valueInArray($('#cell-' + r + '-' + c), arr)) {
      return false;
    }
  }
  return true;
}


/** Given a particular column, check if it is valid
  * @param c - column to check
  * @return true if all checks pass, false otherwise.
  */
function colIsValid(c) {
  arr = falseArray();
  for (var r = 0; r < 9; r++) {
    if (valueInArray($('#cell-' + r + '-' + c), arr)) {
      return false;
    }
  }
  return true;
}


/** Given a particular board, check if it is valid
  * @param b - board to check
  * @return true if all checks pass, false otherwise.
  */
function blockIsValid(b) {
  arr = falseArray();
  var $block = $('#block-' + b);
  $block.find('cell').each(function() {
    if (valueInArray($(this), arr)) {
      return false;
    }
  });
  return true;
}


/** Check if our current value is marked true in our array.
  * Used for validating rows, columns, and blocks.
  * 
  * If our value is in the array, return true.
  * Otherwise, mark the current value to be in the array and
  * return false.
  * 
  * @param cur - current value
  * @param arr - array
  * @return true if our value is in the array, false otherwise.
  */
function valueInArray($cell, arr) {
  var cur = parseInt($cell.text()) - 1;
  if (!arr[cur]) {
    arr[cur] = true;
    return false;
  }
  return true;
}


/** Generate array with 9 values, all false.
  * Used for validating rows, columns, and blocks.
  */
function falseArray() {
  fArr = [];
  for (var i = 0; i < 9; i++) {
    fArr[i] = false;
  }
  return fArr;
}




/**************************
  
  HIGHLIGHTING

  ************************

  Functions:
  - highlightRow
  - highlightCol
  - highlightBlock

  Helpers:
  - lowlight
  - highlight

**************************/

/** Highlight a particular row
  * @param r - row to highlight
  * @return true if all checks pass, false otherwise.
  */
function highlightRow(r) {
  for (var c = 0; c < 9; c++) {
    lowlight($('#cell-' + r + '-' + c));
  }
}

/** Highlight a particular column
  * @param c - column to highlight
  * @return true if all checks pass, false otherwise.
  */
function highlightCol(c) {
  for (var r = 0; r < 9; r++) {
    lowlight($('#cell-' + r + '-' + c));
  }
}

/** Highlight a particular block
  * @param b - block to highlight
  * @return true if all checks pass, false otherwise.
  */
function highlightBlock(b) {
  var $block = $('#block-' + b);
  $block.find('cell').each(function() {
    lowlight($(this));
  });
}

/** Lowlight a cell
  * @param $cell - block to lowlight
  */
function lowlight($cell) {
  $cell.addClass('lowlight');
}

/** Highlight the current cell
  * Used to highlight the current cell
  */
function highlightCurrent() {
  $('.currentCell').addClass('highlight');
}