import { createMachine, assign } from "xstate";
import {
  GameBoardModel,
  checkValidCell,
  removeFlag,
  setFlag,
  revealAllCellsWithoutAdjacentBombs,
  checkBombCell,
} from "~/game";

type Context = {
  gameBoard: GameBoardModel;
  revealedBomb: boolean;
  totalMines: number;
};

type StartEvent = { type: "START"; gameBoard: GameBoardModel; totalMines: number };
type FlagEvent = { type: "FLAG"; rowIndex: number; columnIndex: number };
type RemoveFlagEvent = { type: "REMOVE_FLAG"; rowIndex: number; columnIndex: number };
type RevealCellEvent = { type: "REVEAL_CELL"; rowIndex: number; columnIndex: number };
type ResetEvent = { type: "RESET" };
type Event = StartEvent | ResetEvent | FlagEvent | RemoveFlagEvent | RevealCellEvent;

type State =
  | {
      value: "standingBy";
      context: Context;
    }
  | { value: "playing"; context: Context }
  | { value: "ended"; context: Context };

export const minesweeperGameMachine = createMachine<Context, Event, State>(
  {
    id: "minesweeperGame",
    initial: "standingBy",
    context: {
      gameBoard: [],
      revealedBomb: false,
      totalMines: 0,
    },
    states: {
      standingBy: {
        type: "atomic",
        entry: "resetGame",
      },
      playing: {
        type: "atomic",
        on: {
          "": [
            {
              target: "ended",
              cond: "hasRevealedBomb",
            },
            {
              target: "ended",
              cond: "hasRevealAllCells",
            },
          ],
          FLAG: {
            actions: "setFlag",
          },
          REMOVE_FLAG: {
            actions: "removeFlag",
          },
          REVEAL_CELL: {
            actions: ["revealCell", "checkBomb"],
          },
        },
      },
      ended: {
        type: "atomic",
      },
    },
    on: {
      START: {
        target: "playing",
        actions: ["setGameBoard", "setTotalMines"],
      },
      RESET: {
        target: "standingBy",
        actions: "",
      },
    },
  },
  {
    guards: {
      hasRevealedBomb: (context) => context.revealedBomb,
      hasRevealAllCells: (context) =>
        context.gameBoard.every((row) => row.every((cell) => (cell.isBomb ? !cell.isRevealed : cell.isRevealed))),
    },
    actions: {
      setGameBoard: assign({ gameBoard: (_context, event: StartEvent) => event.gameBoard }),
      setTotalMines: assign({ totalMines: (_context, event: StartEvent) => event.totalMines }),
      setFlag: assign({
        gameBoard: (context, event: FlagEvent) => {
          const draftGameBoard = JSON.parse(JSON.stringify(context.gameBoard));

          checkValidCell(draftGameBoard, event.rowIndex, event.columnIndex) &&
            setFlag(draftGameBoard, event.rowIndex, event.columnIndex);

          return draftGameBoard;
        },
      }),
      removeFlag: assign({
        gameBoard: (context, event: FlagEvent) => {
          const draftGameBoard = JSON.parse(JSON.stringify(context.gameBoard));

          checkValidCell(draftGameBoard, event.rowIndex, event.columnIndex) &&
            removeFlag(draftGameBoard, event.rowIndex, event.columnIndex);

          return draftGameBoard;
        },
      }),
      revealCell: assign({
        gameBoard: (context, event: FlagEvent): GameBoardModel => {
          const draftGameBoard = JSON.parse(JSON.stringify(context.gameBoard)) as GameBoardModel;

          revealAllCellsWithoutAdjacentBombs(draftGameBoard, event.rowIndex, event.columnIndex);

          return draftGameBoard;
        },
      }),
      checkBomb: assign({
        revealedBomb: (context, event: RevealCellEvent) =>
          checkValidCell(context.gameBoard, event.rowIndex, event.columnIndex) &&
          checkBombCell(context.gameBoard, event.rowIndex, event.columnIndex),
      }),
      resetGame: assign({ gameBoard: [], revealedBomb: false, totalMines: 0 } as Context),
    },
  },
);
