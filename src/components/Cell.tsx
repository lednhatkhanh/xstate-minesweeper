import React from "react";
import { CellModel } from "~/game";
import { Box, Text } from "@chakra-ui/core";

type Props = {
  cell: CellModel;
  onReveal: (rowIndex: number, columnIndex: number) => void;
  onFlag: (rowIndex: number, columnIndex: number) => void;
  onRemoveFlag: (rowIndex: number, columnIndex: number) => void;
  rowIndex: number;
  columnIndex: number;
};

export const Cell: React.FC<Props> = ({ cell, onRemoveFlag, onFlag, onReveal, rowIndex, columnIndex }) => {
  const textColor = React.useMemo(() => {
    switch (cell.count) {
      case 1:
        return "green.500";
      case 2:
        return "blue.500";
      case 3:
        return "yellow.500";
      case 4:
        return "orange.500";
      default:
        return "red.500";
    }
  }, [cell.count]);

  const onClick = React.useCallback(() => {
    onReveal(rowIndex, columnIndex);
  }, [rowIndex, columnIndex, onReveal]);

  const handleContextMenu = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault();

      if (cell.isFlagged) {
        onRemoveFlag(rowIndex, columnIndex);
      } else {
        onFlag(rowIndex, columnIndex);
      }
    },
    [cell.isFlagged, columnIndex, onFlag, onRemoveFlag, rowIndex],
  );

  return (
    <Box
      h={10}
      w={10}
      borderLeft="1px solid"
      borderBottom="1px solid"
      borderColor="gray.600"
      display="flex"
      alignItems="center"
      justifyContent="center"
      cursor={!cell.isRevealed && "pointer"}
      position="relative"
      backgroundColor={cell.isRevealed ? "transparent" : "pink.300"}
      onClick={onClick}
      onContextMenu={handleContextMenu}
    >
      {cell.isRevealed && cell.isBomb && <img src="/bomb.png" alt="Bomb" />}

      {cell.isRevealed && !cell.isBomb && cell.count > 0 && (
        <Text fontWeight="extrabold" fontSize={20} color={textColor}>
          {cell.count}
        </Text>
      )}

      {!cell.isRevealed && cell.isFlagged && <img src="/flag.png" alt="Flag" />}
    </Box>
  );
};
