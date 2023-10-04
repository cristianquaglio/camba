import React, { FC } from 'react';
import Head from 'next/head';

import { NavBar } from '../ui/NavBar';
import { SideMenu } from '../ui/SideMenu';

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
            <nav>
                <NavBar />
            </nav>
            <SideMenu />
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
