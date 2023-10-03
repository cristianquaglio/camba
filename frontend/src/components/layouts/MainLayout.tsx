import Head from 'next/head';
import React, { FC } from 'react';

interface Props {
    children: React.ReactNode;
    title: string;
}

export const MainLayout: FC<Props> = ({ title, children }) => {
    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <nav>{/* TODO: NavBar */}</nav>
            {/* TODO: Sidemenu */}
            <main
                style={{
                    margin: '80px auto',
                    maxWidth: '1440px',
                    padding: '0px 30px',
                }}
            >
                {children}
            </main>
            <footer>{/* TODO: Footer */}</footer>
        </>
    );
};
