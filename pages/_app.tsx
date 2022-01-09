import * as React from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../src/styles/theme';
import '../src/styles/globals.css';
import MainLayout from '../components/MainLayout';
import { Theme, ThemeProvider, StyledEngineProvider } from '@mui/material/styles';

function App({ Component, pageProps }: AppProps): JSX.Element {
  React.useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles?.parentElement?.removeChild(jssStyles);
    }
  }, []);
  return (
    <>
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
    </>
  );
}

export default App;
