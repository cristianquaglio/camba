'use client';

import { useContext, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
// import { getSession, signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import {
    Box,
    Button,
    Chip,
    Grid,
    Link,
    TextField,
    Typography,
} from '@mui/material';
import { ErrorOutline, InfoOutlined } from '@mui/icons-material';

import { AuthLayout } from '@/components/layouts';
import { validations } from '@/utils';
import { AuthContext } from '@/context/auth';

type formData = {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    company: string;
};

const RegisterPage = () => {
    const router = useRouter();
    const { registerAdmin } = useContext(AuthContext);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<formData>();
    const [showError, setShowError] = useState(false);
    const [returnedMessage, setReturnedMessage] = useState('');

    const onRegisterForm = async ({
        firstName,
        lastName,
        username,
        email,
        password,
        company,
    }: formData) => {
        setShowError(false);

        const { hasError, message } = await registerAdmin(
            firstName,
            lastName,
            username,
            email,
            password,
            company,
        );
        if (hasError) {
            setShowError(true);
            setReturnedMessage(message!);
            setTimeout(() => {
                setShowError(false);
            }, 3000);
        }
        setReturnedMessage(message!);
        setTimeout(() => {
            setReturnedMessage('');
        }, 3000);
        // await signIn('credentials', { email, password });
    };

    return (
        <AuthLayout title='Crear cuenta admin'>
            <form onSubmit={handleSubmit(onRegisterForm)} noValidate>
                <Box sx={{ width: 350, padding: '10px 20px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant='h1' component='h1'>
                                Crear cuenta
                            </Typography>
                            <Chip
                                label='Usuario existente'
                                color='error'
                                icon={<ErrorOutline />}
                                className='fadeIn'
                                sx={{ display: showError ? 'flex' : 'none' }}
                            />
                            <Chip
                                label='Usuario creado. Valide su correo electrónico'
                                color='success'
                                icon={<InfoOutlined />}
                                className='fadeIn'
                                sx={{
                                    display:
                                        returnedMessage.length > 0 && !showError
                                            ? 'flex'
                                            : 'none',
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label='Nombre'
                                variant='filled'
                                fullWidth
                                {...register('firstName', {
                                    required: 'Este campo es requerido',
                                    minLength: {
                                        value: 2,
                                        message: 'Mínimo 2 caracteres',
                                    },
                                })}
                                error={!!errors.firstName}
                                helperText={errors.firstName?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label='Apellido'
                                variant='filled'
                                fullWidth
                                {...register('lastName', {
                                    required: 'Este campo es requerido',
                                    minLength: {
                                        value: 2,
                                        message: 'Mínimo 2 caracteres',
                                    },
                                })}
                                error={!!errors.lastName}
                                helperText={errors.lastName?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label='Usuario (alias)'
                                variant='filled'
                                fullWidth
                                {...register('username', {
                                    required: 'Este campo es requerido',
                                    minLength: {
                                        value: 2,
                                        message: 'Mínimo 2 caracteres',
                                    },
                                })}
                                error={!!errors.username}
                                helperText={errors.username?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label='Correo'
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
                                        value: 6,
                                        message: 'Mínimo 6 caracteres',
                                    },
                                    validate: validations.isPassword,
                                })}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label='Organismo'
                                variant='filled'
                                fullWidth
                                // select
                                {...register('company', {
                                    required: 'Este campo es requerido',
                                    minLength: {
                                        value: 6,
                                        message: 'Mínimo 6 caracteres',
                                    },
                                })}
                                error={!!errors.company}
                                helperText={errors.company?.message}
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
                                Crear cuenta
                            </Button>
                        </Grid>
                        <Grid item xs={12} display='flex' justifyContent='end'>
                            <NextLink
                                href={
                                    router.query.p && router.query.p !== '/'
                                        ? `/auth/login?p=${router.query.p.toString()}`
                                        : '/auth/login'
                                }
                                passHref
                                legacyBehavior
                            >
                                <Link underline='none'>¿Ya tienes cuenta?</Link>
                            </NextLink>
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

export default RegisterPage;
