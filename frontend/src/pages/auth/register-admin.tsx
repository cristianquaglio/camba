'use client';

import { useContext, useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
// import { getSession, signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Grid,
    Link,
    MenuItem,
    TextField,
    Typography,
} from '@mui/material';
import { ErrorOutline, InfoOutlined } from '@mui/icons-material';

import { AuthLayout } from '@/components/layouts';
import { validations } from '@/utils';
import { AuthContext } from '@/context/auth';
import { fetchData } from 'next-auth/client/_utils';

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
    const { registerAdmin, getCompanies } = useContext(AuthContext);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        resetField,
    } = useForm<formData>();
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isOk, setIsOk] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [companies, setCompanies] = useState([]);
    // const [companies, setCompanies] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setCompanies(await getCompanies());
        };
        fetchData();
    }, []);

    const onRegisterForm = async ({
        firstName,
        lastName,
        username,
        email,
        password,
        company,
    }: formData) => {
        setIsLoading(true);
        const { hasError, message } = await registerAdmin(
            firstName,
            lastName,
            username,
            email,
            password,
            company,
        );
        setIsLoading(false);
        if (hasError) {
            setShowError(true);
            setErrorMessage(message!);
            setTimeout(() => {
                setShowError(false);
            }, 3000);
        }
        if (!hasError) {
            reset();
            resetField('company');
            setIsOk(true);
            setTimeout(() => {
                setIsOk(false);
            }, 6000);
        }

        // await signIn('credentials', { email, password });
    };

    return (
        <AuthLayout title='Crear cuenta admin'>
            <form onSubmit={handleSubmit(onRegisterForm)} noValidate>
                <Box sx={{ width: 350, padding: '10px 20px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant='h1' component='h1'>
                                Crear cuenta admin
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
                                    display: isOk ? 'flex' : 'none',
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
                                defaultValue=''
                                fullWidth
                                select
                                {...register('company', {
                                    required: 'Este campo es requerido',
                                    minLength: {
                                        value: 6,
                                        message: 'Mínimo 6 caracteres',
                                    },
                                })}
                                error={!!errors.company}
                                helperText={errors.company?.message}
                            >
                                {companies.map(({ _id, shortName }) => (
                                    <MenuItem key={_id} value={_id}>
                                        {shortName}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            {isLoading ? (
                                <CircularProgress />
                            ) : (
                                <Button
                                    type='submit'
                                    color='secondary'
                                    className='circular-btn'
                                    size='large'
                                    fullWidth
                                >
                                    Crear cuenta
                                </Button>
                            )}
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
