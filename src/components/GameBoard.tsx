import React from "react";
import { Box, Text, Icon } from "@chakra-ui/core";

import { GameBoardModel } from "~/game";

import { Cell } from "./Cell";

type Props = {
  gameBoard: GameBoardModel;
  onReveal: (rowIndex: number, columnIndex: number) => void;
  onFlag: (rowIndex: number, columnIndex: number) => void;
  onRemoveFlag: (rowIndex: number, columnIndex: number) => void;
};

export const GameBoard: React.FC<Props> = ({ gameBoard, onReveal, onFlag, onRemoveFlag }) => {
  return (
    <Box color="pink.400" display="grid" gridTemplateRows="1fr auto" gridRowGap={6} justifyItems="center">
      <Box borderTop="1px solid" borderRight="1px solid" borderColor="gray.600">
        {gameBoard.map((row, rowIndex) => (
          <Box key={rowIndex} display="flex">
            {row.map((cell, columnIndex) => (
              <Cell
                key={columnIndex}
                cell={cell}
                rowIndex={rowIndex}
                columnIndex={columnIndex}
                onFlag={onFlag}
                onReveal={onReveal}
                onRemoveFlag={onRemoveFlag}
              />
            ))}
          </Box>
        ))}
      </Box>

      <Box display="grid" gridTemplateColumns="auto 1fr" gridColumnGap={3} alignItems="center">
        <Icon name="info" />
        <Text>Right click on a cell to place or remove the flag</Text>
      </Box>
    </Box>
  );
};
