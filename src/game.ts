export type CellModel = {
  isFlagged: boolean;
  isRevealed: boolean;
  count: number;
  isBomb: boolean;
};

export type GameBoardModel = CellModel[][];

export function createGameBoard(size: number): GameBoardModel {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => ({ isRevealed: false, isFlagged: false, count: 0, isBomb: false })),
  );
}

export function placeMines(gameBoard: GameBoardModel, totalMines: number) {
  const copiedGameBoard = JSON.parse(JSON.stringify(gameBoard));
  const createRandomIndex = () => Math.floor(Math.random() * copiedGameBoard.length);
  let leftoverMines = totalMines;

  while (leftoverMines > 0) {
    const rowIndex = createRandomIndex();
    const columnIndex = createRandomIndex();

    if (!copiedGameBoard[rowIndex][columnIndex].isBomb) {
      copiedGameBoard[rowIndex][columnIndex].isBomb = true;
      leftoverMines -= 1;
    }
  }

  return copiedGameBoard;
}

export function checkValidCell(gameBoard: GameBoardModel, rowIndex: number, columnIndex: number) {
  return gameBoard[rowIndex] && gameBoard[rowIndex][columnIndex];
}

export function checkRevealed(gameBoard: GameBoardModel, rowIndex: number, columnIndex: number) {
  if (!checkValidCell(gameBoard, rowIndex, columnIndex)) {
    throw new Error("Cell does not exist");
  }

  return gameBoard[rowIndex][columnIndex].isRevealed;
}

export function setFlag(gameBoard: GameBoardModel, rowIndex: number, columnIndex: number) {
  if (!checkValidCell(gameBoard, rowIndex, columnIndex)) {
    throw new Error("Cell does not exist");
  }

  if (checkRevealed(gameBoard, rowIndex, columnIndex)) {
    return;
  }

  gameBoard[rowIndex][columnIndex].isFlagged = true;
}

export function removeFlag(gameBoard: GameBoardModel, rowIndex: number, columnIndex: number) {
  if (!checkValidCell(gameBoard, rowIndex, columnIndex)) {
    throw new Error("Cell does not exist");
  }

  if (checkRevealed(gameBoard, rowIndex, columnIndex)) {
    return;
  }

  gameBoard[rowIndex][columnIndex].isFlagged = false;
}

export function revealCell(gameBoard: GameBoardModel, rowIndex: number, columnIndex: number) {
  if (!checkValidCell(gameBoard, rowIndex, columnIndex)) {
    throw new Error("Cell does not exist");
  }

  gameBoard[rowIndex][columnIndex].isRevealed = true;
}

export function checkBombCell(gameBoard: GameBoardModel, rowIndex: number, columnIndex: number) {
  if (!checkValidCell(gameBoard, rowIndex, columnIndex)) {
    return false;
  }

  return gameBoard[rowIndex][columnIndex].isBomb;
}

export function countAdjacentBombs(gameBoard: GameBoardModel, rowIndex: number, columnIndex: number) {
  if (!checkValidCell(gameBoard, rowIndex, columnIndex)) {
    throw new Error("Cell does not exist");
  }

  if (checkBombCell(gameBoard, rowIndex, columnIndex)) {
    throw new Error("Cell a bomb cell");
  }

  const countIfBombCell = (countRowIndex: number, countColumnIndex: number) => {
    if (!checkValidCell(gameBoard, countRowIndex, countColumnIndex)) {
      return 0;
    }

    return checkBombCell(gameBoard, countRowIndex, countColumnIndex) ? 1 : 0;
  };

  return (
    // North
    countIfBombCell(rowIndex - 1, columnIndex) +
    // South
    countIfBombCell(rowIndex + 1, columnIndex) +
    //East
    countIfBombCell(rowIndex, columnIndex + 1) +
    // West
    countIfBombCell(rowIndex, columnIndex - 1) +
    // North-East
    countIfBombCell(rowIndex - 1, columnIndex + 1) +
    // North-West
    countIfBombCell(rowIndex - 1, columnIndex - 1) +
    // South-East
    countIfBombCell(rowIndex + 1, columnIndex + 1) +
    // South-West
    countIfBombCell(rowIndex + 1, columnIndex - 1)
  );
}

export function revealAllCellsWithoutAdjacentBombs(
  gameBoard: GameBoardModel,
  rowIndex: number,
  columnIndex: number,
  checkedPositions: { [key: string]: true } = {},
) {
  if (checkedPositions[`${rowIndex}${columnIndex}`]) {
    return;
  }

  if (!checkValidCell(gameBoard, rowIndex, columnIndex)) {
    return;
  }

  if (checkRevealed(gameBoard, rowIndex, columnIndex)) {
    return;
  }

  if (checkBombCell(gameBoard, rowIndex, columnIndex)) {
    revealCell(gameBoard, rowIndex, columnIndex);
    return;
  }

  const adjacentBombsCount = countAdjacentBombs(gameBoard, rowIndex, columnIndex);
  if (adjacentBombsCount > 0) {
    gameBoard[rowIndex][columnIndex].count = adjacentBombsCount;
    revealCell(gameBoard, rowIndex, columnIndex);
    return;
  }

  revealCell(gameBoard, rowIndex, columnIndex);

  ([
    // North
    [rowIndex - 1, columnIndex],
    // South
    [rowIndex + 1, columnIndex],
    // East
    [rowIndex, columnIndex + 1],
    // West
    [rowIndex, columnIndex - 1],
    // North-East
    [rowIndex - 1, columnIndex + 1],
    // North-West
    [rowIndex - 1, columnIndex - 1],
    // South-East
    [rowIndex + 1, columnIndex + 1],
    // South-West
    [rowIndex + 1, columnIndex - 1],
  ] as [number, number][]).forEach(([currentRowIndex, currentColumnIndex]) => {
    revealAllCellsWithoutAdjacentBombs(gameBoard, currentRowIndex, currentColumnIndex, {
      ...checkedPositions,
      [`${rowIndex},${columnIndex}`]: true,
    });
  });
}
