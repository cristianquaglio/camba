import { useContext, useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Box, CircularProgress, Link, Typography } from '@mui/material';
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';
import UnsubscribeOutlinedIcon from '@mui/icons-material/UnsubscribeOutlined';

import { AuthContext } from '@/context/auth';
import { AuthLayout } from '@/components/layouts';

const ConfirmEmailPage = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const { validateEmail } = useContext(AuthContext);
    const [isValid, setIsValid] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (token && token?.length > 0) {
            fetchData(token);
        }
    }, [token]);

    const fetchData = async (token: string) => {
        const { statusCode } = await validateEmail(token);
        if (statusCode === 204) {
            setIsValid(true);
        } else {
            setIsValid(false);
        }
        setIsLoaded(true);
    };

    return (
        <AuthLayout title='Confirmar e-mail'>
            {isLoaded ? (
                isValid ? (
                    <Box
                        display='flex'
                        justifyContent='center'
                        alignItems='center'
                        height='calc(100vh - 200px)'
                        sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
                    >
                        <HowToRegOutlinedIcon fontSize='large' />
                        <Typography marginLeft={2}>
                            Email- confirmado{' '}
                            <NextLink
                                href='/auth/login'
                                passHref
                                legacyBehavior
                            >
                                <Link>Inicie sesión</Link>
                            </NextLink>
                        </Typography>
                    </Box>
                ) : (
                    <Box
                        display='flex'
                        justifyContent='center'
                        alignItems='center'
                        height='calc(100vh - 200px)'
                        sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
                    >
                        <UnsubscribeOutlinedIcon fontSize='large' />
                        <Typography marginLeft={2}>
                            El token ya no es válido o no es requerido
                        </Typography>
                    </Box>
                )
            ) : (
                <CircularProgress />
            )}
        </AuthLayout>
    );
};

export default ConfirmEmailPage;
