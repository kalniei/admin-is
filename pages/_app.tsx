import * as React from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import theme from '../src/styles/theme';
import createEmotionCache from '../src/utils/createEmotionCache';
import '../src/styles/globals.css';
import MainLayout from '../components/MainLayout';
import { Theme, ThemeProvider, StyledEngineProvider } from '@mui/material/styles';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Impro Silesia Admin</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme} {...pageProps}>
          <CssBaseline />
          <MainLayout {...pageProps}>
            <Component {...pageProps} />
          </MainLayout>
        </ThemeProvider>
      </StyledEngineProvider>
    </CacheProvider>
  );
}
