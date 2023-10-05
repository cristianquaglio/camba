import type { AppProps } from 'next/app';
import { CssBaseline, ThemeProvider } from '@mui/material';

import { darkTheme, lightTheme } from '../themes';
import '@/styles/globals.css';
import { AuthProvider } from '@/context/auth';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <AuthProvider>
            <ThemeProvider theme={lightTheme}>
                <CssBaseline />
                <Component {...pageProps} />
            </ThemeProvider>
        </AuthProvider>
    );
}
