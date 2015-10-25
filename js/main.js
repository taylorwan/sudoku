/**************************
  
  MAIN FUNCTION
  
  ************************

  Functions:
  - document.ready
  - main

**************************/

/** Upon document ready
  * - call main
  * - initialize listeners
  */
$( function() {
  main();

  $('.cell').click(clickedCell);
  $(document).on("keydown", editCell);
  $('#toggle-pencil').click(togglePencil);
});


/** Initialize our board
  */
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

  Helpers:
  - getRow
  - getCol
  - getBoard

**************************/


/** Initialize a blank board.
  *
  * We have 9 blocks, which represent the 9 big squares
  * on a sudoku board.
  *
  * Each block has 9 cells, which represent the smaller
  * squares on a sudoku board.
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
  for (var i = 0; i < 9; i++) { // blocks

    var b = i; // block #
    var blockHTML = '<div id="block-' + b + '" class="block">';

    for (var j = 0; j < 9; j++) { // cells for each block

      var r = parseInt(i/3)*3 + parseInt(j/3); // row #
      var c = parseInt(i%3)*3 + parseInt(j%3); // col #

      blockHTML += '<div id="cell-' + r + '-' + c + '"';
      blockHTML += ' class="cell" row="' + r + '"';
      blockHTML += ' col="' + c + '"';
      blockHTML += ' block="' + b +'">';
      blockHTML += '<div class="pencil"></div>';
      blockHTML += '</div>';
    }

    blockHTML += '</div>';
    $board.append(blockHTML);
  }
}


/** Load a puzzle given an 2-D array.
  *
  * "Null" values are represented by a 0 in the array. These
  * cells are given the class "editable".
  * Each cell with a given value has the class "given".
  *
  * @param puzzle - our 2D array, where puzzle[r][c] gives us
  * the cell at a particular row and column. r, c in [0, 9).
  */
function loadPuzzle(puzzle) {
  for (var r = 0; r < 9; r++) {
    for (var c = 0; c < 9; c++) {
      var cur = puzzle[r][c];
      var $cell = getCell(r, c);
      if (cur !== 0) {
        $cell.text(cur).addClass('given');
      } else {
        $cell.addClass('editable');
      }
    }
  }
}


/** Get the row # for a given cell
  * @param $cell - the cell
  * @return row - the row of this cell
  */
function getRow($cell) {
  return $cell.attr('row');
}


/** Get the col # for a given cell
  * @param $cell - the cell
  * @return col - the col of this cell
  */
function getCol($cell) {
  return $cell.attr('col');
}


/** Get the block # for a given cell
  * @param $cell - the cell
  * @return block - the block of this cell
  */
function getBlock($cell) {
  return $cell.attr('block');
}


/** Get the cell element given its row and column
  * @param r - the cell's row
  * @param c - the cell's column
  * @return $cell
  */
function getCell(r, c) {
  return $('#cell-'+ r + '-' + c);
}




/**************************

  INTERACTION

  ************************

  Functions:
  - clickedCell
  - editCell
  - togglePencil

  Helpers:
  - update

**************************/

/** Delegate appropriate action upon cell-click.
  * Make the clicked cell the current cell. Update cells.
  */
function clickedCell() {
  moveCell($(this));
  update();
  boardIsValid();
}


/** Keypress reactions
  * - Edit the value, if a cell is selected.
  * - Backspace deletes value, if a cell is selected
  * - Arrow keys for navigation
  * - If pencil mode, handle accordingly
  */
function editCell(e) {
  var code = e.keyCode;
  var val = String.fromCharCode(code);

  var $cell = $('.current-cell');
  var r = parseInt(getRow($cell));
  var c = parseInt(getCol($cell));

  if (code === 8) { // backspace
    e.preventDefault();
    $cell.html('<div class="pencil"></div>');
  }  else if (code == 80) { // "p": toggle-pencil
    togglePencil();
  } else if (code === 37) { // left
    c -= 1;
    if (c < 0) {
      c += 9;
    }
    moveCell(getCell(r,c));
  } else if (code === 38) { // up
    r -= 1;
    if (r < 0) {
      r += 9;
    }
    moveCell(getCell(r,c));
  } else if (code === 39) { // right
    c += 1;
    c %= 9;
    moveCell(getCell(r,c));
  } else if (code === 40) { // down
    r += 1;
    r %= 9;
    moveCell(getCell(r,c));
  }

  // if editable and value is valid
  else if ($cell.hasClass('editable') && valueIsValid(val)) {
  
    // pencil mode
    if ($('#board').hasClass('pencil-mode-active')) {
      var $pencil = $cell.find('.pencil');
      var removed = false;
      $pencil.find('span').each(function() {
        $t = $(this);
        if ($t.text() === val) {
          $(this).detach();
          removed = true;
        }
      });
      if (!removed) {
        $pencil.append('<span>' + val + '</span>');
      }
    }
  
    // non-pencil mode
    else {
      $cell.text(val);
      boardIsValid();
    }
  }

  // update board
  update();
}


/** Toggle editing state between pencil and regular
  */
function togglePencil() {
  $('#board').toggleClass('pencil-mode-active');
  var $button = $('#toggle-pencil');
  $button.toggleClass('active');
  if ($button.hasClass('active')) {
    $button.find('.current').text('On');
  } else {
    $button.find('.current').text('Off');
  }
}


/** Move current cell to a given cell.
  * @param $cell - new current cell
  */
function moveCell($cell) {
  if ($('.current-cell') !== $cell) {
    $('.current-cell').removeClass('current-cell');
  }
  $cell.addClass('current-cell');
}


/** Update the current board
  * - highlights
  * - possible values
  */
function update() {
  updateHighlights();
  updatePossibleValues();
}




/**************************

  VALIDATION

  ************************

  Functions:
  - boardIsValid
  - rowIsValid
  - colIsValid
  - blockIsValid
  - valueIsValid
  - possibleValues
  - updatePossibleValues

  Helpers:
  - valueInArray
  - falseArray
  - cellText
  - pencilText

**************************/

/** Check if current board is valid
  * - check each row
  * - check each column
  * - check each block
  */
function boardIsValid() {
  for (var i = 0; i < 9; i++) {
    rowIsValid(i);
    colIsValid(i);
    blockIsValid(i);
  }
}


/** Given a particular row, check if it is valid
  * If invalid, highlight row in red
  * @param r - row to check
  * @return - array of values (true if in row, false otherwise)
  */
function rowIsValid(r) {
  arr = falseArray();
  for (var c = 0; c < 9; c++) {
    if (valueInArray(getCell(r, c), arr)) {
      highlightRow(r, 'red');
    }
  }
  return arr;
}


/** Given a particular column, check if it is valid
  * If invalid, highlight column in red
  * @param c - column to check
  * @return - array of values (true if in column, false otherwise)
  */
function colIsValid(c) {
  arr = falseArray();
  for (var r = 0; r < 9; r++) {
    if (valueInArray(getCell(r, c), arr)) {
      highlightCol(c, 'red');
    }
  }
  return arr;
}


/** Given a particular block, check if it is valid
  * If invalid, highlight block in red
  * @param b - block to check
  * @return - array of values (true if in block, false otherwise)
  */
function blockIsValid(b) {
  arr = falseArray();
  var $block = $('#block-' + b);
  $block.find('.cell').each(function() {
    if (valueInArray($(this), arr)) {
      highlightBlock(b, 'red');
    }
  });
  return arr;
}


/** Given a particular value, check if it is valid
  * @param v - value to check
  * @return true if value is in [1, 9]
  */
function valueIsValid(v) {
  v = parseInt(v);
  return v > 0 && v < 10;
}


/** Generate array of possible values for a given cell.
  * @param $cell - current cell
  * @return array of valid values for this cell
  */
function possibleValues($cell) {
  var rowValidVals = rowIsValid(getRow($cell));
  var colValidVals = colIsValid(getCol($cell));
  var blockValidVals = blockIsValid(getBlock($cell));
  var values = [];
  for (var i = 0; i < 9; i++) {
    if (rowValidVals[i] || colValidVals[i] || blockValidVals[i]) {
      continue;
    }
    values.push(i+1);
  }
  return values;
}


/** Update possible values for current cell if editable.
  */
function updatePossibleValues() {
  var $cell = $('.current-cell');
  var $possible = $('#possible-values .current');
  if ($cell[0] === undefined) {
    $possible.text('No square selected.');
  } else if ($cell.hasClass('given')) {
    $possible.text('Given value');
  } else {
    $possible.text(possibleValues($cell));
  }
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

  var text = cellText($cell);

  // if square is empty, ignore
  if (text === '') {
    return false;
  }

  var cur = parseInt(text) - 1;
  if (!arr[cur]) { // not yet in array
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


/** Grab only the cell's value from a given cell
  * @param $c - the given cell
  */
function cellText($c) {
  var val = $c.text();
  var pencilVals = pencilText($c);
  for (var p in pencilVals) {
    val = val.replace(pencilVals[p], '');
  }
  return val;
}


/** Grab only the pencil's value from a given cell
  * @param $c - the given cell
  * @return an array of pencil values
  */
function pencilText($c) {
  arr = [];
  $c.find('span').each(function() {
    arr.push($(this).text());
  });
  return arr;
}




/**************************
  
  HIGHLIGHTING

  ************************

  Functions:
  - highlightRow
  - highlightCol
  - highlightBlock
  - updateHighlights

  Helpers:
  - lowlight
  - highlight
  - resetHighlights

**************************/

/** Highlight a particular row
  * @param r - row to highlight
  * @param color (optional) if there is a color, specify that here
  */
function highlightRow(r, color) {
  for (var c = 0; c < 9; c++) {
    lowlight(getCell(r, c), color);
  }
}


/** Highlight a particular column
  * @param c - column to highlight
  * @param color (optional) if there is a color, specify that here
  */
function highlightCol(c, color) {
  for (var r = 0; r < 9; r++) {
    lowlight(getCell(r, c), color);
  }
}


/** Highlight a particular block
  * @param b - block to highlight
  * @param color (optional) if there is a color, specify that here
  */
function highlightBlock(b, color) {
  var $block = $('#block-' + b);
  $block.find('.cell').each(function() {
    lowlight($(this), color);
  });
}


/** Highlight a particular number
  * @param n - number to highlight
  * @param color (optional) if there is a color, specify that here
  */
function highlightNumber(n, color) {
  for (var c = 0; c < 9; c++) {
    for (var r = 0; r < 9; r++) {
      $cell = getCell(r, c);

       // if cell is not current cell and matches our number
      if ($cell !== $('.current-cell') && $cell.text() === n) {
        lowlight($cell, color);
        continue;
      }
    }
  }
}


/** Lowlight a cell
  * @param $cell - block to lowlight
  * @param color (optional) if there is a color, specify that here
  */
function lowlight($cell, color) {
  if (color) {
    $cell.addClass(color);
  } else {
    $cell.addClass('lowlight');
  }
}


/** Update highlights for current cell
  * - highlight current row
  * - highlight current column
  * - highlight current block
  * - highlight current number
  */
function updateHighlights() {
  resetHighlights();
  $cell = $('.current-cell');
  if ($cell) {
    highlightRow(getRow($cell));
    highlightCol($cell.attr('col'));
    highlightBlock(getBlock($cell));
    if ($cell.text() !== '') {
      highlightNumber($cell.text(), 'green');
    }
  }
}


/** Remove all highlights
  * - lowlights
  * - greens
  * - reds
  */
function resetHighlights() {
  $('.lowlight').removeClass('lowlight');
  $('.green').removeClass('green');
  $('.red').removeClass('red');
}




/**************************
  TEST VALUES
**************************/

/** Hard-coded puzzles for testing
  */

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
