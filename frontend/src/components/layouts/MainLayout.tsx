import React, { FC } from 'react';

import { NavBar } from '../ui';

interface Props {
    children: React.ReactNode;
    title: string;
}

export const MainLayout: FC<Props> = ({ children, title }) => {
    return (
        <>
            <nav>
                <NavBar title={title} />
            </nav>
            {/* SideMenu */}
            <main
                style={{
                    margin: '80px auto',
                    maxWidth: '1440px',
                    padding: '0px 30px',
                }}
            >
                {children}
            </main>
            <footer>{/* Footer */}</footer>
        </>
    );
};
