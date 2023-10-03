'use client';

import type { Metadata } from 'next';
import { CssBaseline, ThemeProvider } from '@mui/material';

import { darkTheme } from '@/themes';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang='en'>
            <title>Camba v0.1</title>
            <meta
                name='description'
                content='Medical Management Integral Software'
            />
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <body>{children}</body>
            </ThemeProvider>
        </html>
    );
}
