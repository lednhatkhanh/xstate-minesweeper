import React from "react";
import { Box, Text } from "@chakra-ui/core";
import { useMachine } from "@xstate/react";

import { minesweeperGameMachine } from "~/machines";
import { GameBoard, WelcomeScreen, GameActions } from "~/components";
import { createGameBoard, placeMines } from "~/game";

const HomePage = () => {
  const [state, send] = useMachine(minesweeperGameMachine, {
    devTools: process.env.NODE_ENV !== "production",
  });

  const handleStartGame = React.useCallback(
    (level: "normal" | "hard") => {
      const { boardWithMines, totalMines } = (() => {
        switch (level) {
          case "normal": {
            const totalMines = 10;
            const plainBoard = createGameBoard(9);
            const boardWithMines = placeMines(plainBoard, 10);
            return { boardWithMines, totalMines };
          }
          case "hard":
          default: {
            const totalMines = 40;
            const plainBoard = createGameBoard(16);
            const boardWithMines = placeMines(plainBoard, totalMines);
            return { boardWithMines, totalMines };
          }
        }
      })();

      send({ type: "START", gameBoard: boardWithMines, totalMines });
    },
    [send],
  );

  const handleReveal = React.useCallback(
    (rowIndex: number, columnIndex: number) => {
      send({ type: "REVEAL_CELL", rowIndex, columnIndex });
    },
    [send],
  );

  const handleFlag = React.useCallback(
    (rowIndex: number, columnIndex: number) => {
      send({ type: "FLAG", rowIndex, columnIndex });
    },
    [send],
  );

  const handleRemoveFlag = React.useCallback(
    (rowIndex: number, columnIndex: number) => {
      send({ type: "REMOVE_FLAG", rowIndex, columnIndex });
    },
    [send],
  );

  const handleResetGame = React.useCallback(() => {
    send({ type: "RESET" });
  }, [send]);

  return (
    <Box as="main" w="100vw" h="100vh" display="flex" alignItems="center" justifyContent="center">
      {state.matches("standingBy") && <WelcomeScreen onStart={handleStartGame} />}

      <Box display="grid" gridAutoFlow="row" gridAutoRows="auto" gridGap={10}>
        <Box height={50}>
          {state.matches("ended") && (
            <Text color="pink.400" fontWeight="extrabold" fontSize={32}>
              {state.context.revealedBomb ? "You lost!" : "You won the game!"}
            </Text>
          )}
        </Box>

        {state.matches("standingBy") === false && (
          <Box display="grid" gridTemplateColumns="repeat(2, auto)" gridColumnGap={32}>
            <GameBoard
              gameBoard={state.context.gameBoard}
              onReveal={handleReveal}
              onFlag={handleFlag}
              onRemoveFlag={handleRemoveFlag}
            />

            <GameActions
              size={state.context.gameBoard.length}
              totalMines={state.context.totalMines}
              onReset={handleResetGame}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HomePage;
