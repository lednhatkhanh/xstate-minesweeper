import React from "react";
import { Box, Text, Button } from "@chakra-ui/core";

type Props = {
  onReset: () => void;
  size: number;
  totalMines: number;
};

export const GameActions: React.FC<Props> = ({ onReset, size, totalMines }) => {
  return (
    <Box display="grid" gridAutoRows="min-content" gridAutoFlow="row" gridRowGap={10}>
      <Box>
        <Text>
          <Text as="span" color="pink.400" fontSize={40} mr={2}>
            {size}x{size}
          </Text>
          board
        </Text>

        <Text>
          <Text as="span" color="pink.400" fontSize={40} mr={2}>
            {totalMines}
          </Text>
          mines
        </Text>
      </Box>

      <Button variantColor="pink" width={200} onClick={onReset}>
        Reset
      </Button>
    </Box>
  );
};
