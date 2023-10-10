import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { useForm } from 'react-hook-form';
import {
    Box,
    Button,
    Chip,
    Divider,
    Grid,
    Link,
    TextField,
    Typography,
} from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';

import { AuthLayout } from '../../components/layouts';
import { validations } from '../../utils';

type FormData = {
    email: string;
    password: string;
};

const LoginPage = () => {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();

    const [showError, setShowError] = useState(false);

    const onLoginUser = async ({ email, password }: FormData) => {
        setShowError(false);
        // const isValidLogin = await loginUser(email, password);
        // if (!isValidLogin) {
        //     setShowError(true);
        //     setTimeout(() => {
        //         setShowError(false);
        //     }, 3000);
        //     return;
        // }

        // const destination = router.query.p?.toString() || '/';
        // router.replace(destination);
        console.log({ email, password });
    };

    return (
        <AuthLayout title='Iniciar sesión'>
            <form onSubmit={handleSubmit(onLoginUser)} noValidate>
                <Box sx={{ width: 350, padding: '10px 20px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant='h1' component='h1'>
                                Iniciar sesión
                            </Typography>

                            <Chip
                                label='No se reconoce ese usuario/clave'
                                color='error'
                                icon={<ErrorOutline />}
                                className='fadeIn'
                                sx={{ display: showError ? 'flex' : 'none' }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label='Correo electrónico'
                                type='email'
                                variant='filled'
                                fullWidth
                                {...register('email', {
                                    required: 'Este campo es requerido',
                                    validate: validations.isEmail,
                                })}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label='Contraseña'
                                type='password'
                                variant='filled'
                                fullWidth
                                {...register('password', {
                                    required: 'Este campo es requerido',
                                    minLength: {
                                        value: 8,
                                        message: 'Mínimo 8 caracteres',
                                    },
                                    maxLength: {
                                        value: 16,
                                        message: 'Máximo 16 caracteres',
                                    },
                                    validate: validations.isPassword,
                                })}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type='submit'
                                color='secondary'
                                className='circular-btn'
                                size='large'
                                fullWidth
                            >
                                Ingresar
                            </Button>
                        </Grid>
                        <Grid item xs={12} display='flex' justifyContent='end'>
                            <NextLink
                                href={
                                    router.query.p && router.query.p !== '/'
                                        ? `/auth/register-admin?p=${router.query.p.toString()}`
                                        : '/auth/register-admin'
                                }
                                passHref
                                legacyBehavior
                            >
                                <Link underline='always'>
                                    ¿No tienes cuenta?
                                </Link>
                            </NextLink>
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            display='flex'
                            flexDirection='column'
                            justifyContent='end'
                        >
                            <Divider sx={{ width: '100%', mb: 2 }} />
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </AuthLayout>
    );
};

// export const getServerSideProps: GetServerSideProps = async ({
//     req,
//     query,
// }) => {
//     const session = await getSession({ req });

//     const { p = '/' } = query;

//     if (session) {
//         return {
//             redirect: {
//                 destination: p.toString(),
//                 permanent: false,
//             },
//         };
//     }

//     return {
//         props: {},
//     };
// };

export default LoginPage;
