import React from "react";
import { Box, Button } from "@chakra-ui/core";

type Props = {
  onStart: (level: "normal" | "hard") => void;
};

export const WelcomeScreen: React.FC<Props> = ({ onStart }) => {
  const onNormalButtonClick = React.useCallback(() => {
    onStart("normal");
  }, [onStart]);

  const onHardButtonClick = React.useCallback(() => {
    onStart("hard");
  }, [onStart]);

  return (
    <Box display="grid" gridAutoFlow="row" gridAutoRows="min-content" gridRowGap={30}>
      <Button variantColor="pink" size="lg" minW={200} onClick={onNormalButtonClick}>
        Normal
      </Button>
      <Button variantColor="pink" size="lg" minW={200} onClick={onHardButtonClick}>
        Hard
      </Button>
    </Box>
  );
};
