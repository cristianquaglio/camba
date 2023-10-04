import { ClassNames } from '@emotion/react';
import { SearchOutlined } from '@mui/icons-material';
import {
    AppBar,
    Box,
    Button,
    IconButton,
    Link,
    Toolbar,
    Typography,
} from '@mui/material';
import NextLink from 'next/link';

export const NavBar = () => {
    return (
        <AppBar>
            <Toolbar>
                <NextLink href='/' passHref legacyBehavior>
                    <Link
                        display='flex'
                        alignItems='center'
                        sx={{ textDecoration: 'none' }}
                    >
                        <Typography>Camba |</Typography>
                        <Typography sx={{ ml: 0.5 }}>v0.1</Typography>
                    </Link>
                </NextLink>
                <Box sx={{ flex: 1 }} />
                {/* pantallas grandes */}
                <IconButton
                    sx={{ display: { xs: 'none', sm: 'flex' } }}
                    className='fadeIn'
                >
                    <SearchOutlined />
                </IconButton>
                {/* pantallas pequeñas */}
                <IconButton sx={{ display: { xs: 'flex', sm: 'none' } }}>
                    <SearchOutlined />
                </IconButton>
                <Button>Menú</Button>
            </Toolbar>
        </AppBar>
    );
};
