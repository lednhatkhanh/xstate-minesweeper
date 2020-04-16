import React from "react";
import { AppProps } from "next/app";
import Head from "next/head";
import { ThemeProvider, CSSReset, ColorModeProvider } from "@chakra-ui/core";

const NextMinesweeperApp = (props: AppProps) => {
  const { Component, pageProps } = props;

  return (
    <>
      <Head>
        <title>Next Minesweeper</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider>
        <ColorModeProvider value="dark">
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CSSReset />
          <Component {...pageProps} />
        </ColorModeProvider>
      </ThemeProvider>
    </>
  );
};

export default NextMinesweeperApp;
