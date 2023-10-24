import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Chip,
    Grid,
    Link,
    MenuItem,
    TextField,
    Typography,
} from '@mui/material';
import {
    CircleOutlined,
    ErrorOutline,
    InfoOutlined,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';

import { AuthLayout } from '../../../components/layouts';
import { validators } from '../../../utils';
import { getCompanies, registerAdmin } from '../../../slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';

export const RegisterPage = () => {
    const dispatch = useDispatch<AppDispatch>();

    const companies = useSelector((state: RootState) => state.auth.companies);

    const { isLoading, isRegistered, hasError } = useSelector(
        (state: RootState) => state.auth,
    );

    const [showLegend, setShowLegend] = useState(false);

    type formData = {
        firstName: string;
        lastName: string;
        username: string;
        email: string;
        password: string;
        company: string;
    };

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<formData>();

    useEffect(() => {
        dispatch(getCompanies());
    }, [dispatch]);

    useEffect(() => {
        if (isRegistered) reset();
    }, [isRegistered]);

    const onRegister = async ({
        firstName,
        lastName,
        username,
        email,
        password,
        company,
    }: formData) => {
        setShowLegend(false);
        dispatch(
            registerAdmin({
                firstName,
                lastName,
                username,
                email,
                password,
                company,
            }),
        );
        setShowLegend(true);
        setTimeout(() => {
            setShowLegend(false);
        }, 6000);
    };

    return (
        <AuthLayout>
            <form onSubmit={handleSubmit(onRegister)} noValidate>
                <Box sx={{ width: 350, padding: '10px 20px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant='h1' component='h1'>
                                Registrar usuario
                            </Typography>
                            {showLegend && (
                                <>
                                    <Chip
                                        label='Usuario duplicado'
                                        color='error'
                                        icon={<ErrorOutline />}
                                        className='fadeIn'
                                        sx={{
                                            display: hasError ? 'flex' : 'none',
                                        }}
                                    />
                                    <>
                                        <Chip
                                            label='Usuario registrado correctamente'
                                            color='success'
                                            icon={<InfoOutlined />}
                                            className='fadeIn'
                                            sx={{
                                                display: isRegistered
                                                    ? 'flex'
                                                    : 'none',
                                                mb: 1,
                                            }}
                                        />
                                        <Chip
                                            label='Revise su correo para validar su cuenta'
                                            color='success'
                                            icon={<InfoOutlined />}
                                            className='fadeIn'
                                            sx={{
                                                display: isRegistered
                                                    ? 'flex'
                                                    : 'none',
                                            }}
                                        />
                                    </>
                                </>
                            )}
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label='Nombre'
                                variant='filled'
                                fullWidth
                                {...register('firstName', {
                                    required: 'Este campo es requerido',
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
                                })}
                                error={!!errors.lastName}
                                helperText={errors.lastName?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label='Usuario'
                                variant='filled'
                                fullWidth
                                {...register('username', {
                                    required: 'Este campo es requerido',
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
                                    validate: validators.isEmail,
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
                                    validate: validators.isPassword,
                                })}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id='company'
                                label='Organismo'
                                variant='filled'
                                defaultValue=''
                                fullWidth
                                select
                                {...register('company', {
                                    required: 'Este campo es requerido',
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
                            <Button
                                type='submit'
                                color='secondary'
                                className='circular-btn'
                                size='large'
                                fullWidth
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <CircleOutlined />
                                ) : (
                                    'Registrar usuario'
                                )}
                            </Button>
                        </Grid>
                        <Grid item xs={12} display='flex' justifyContent='end'>
                            <Link href='/auth/login'>Iniciar sesión</Link>
                        </Grid>
                        <Grid item xs={12} display='flex' justifyContent='end'>
                            <Link href='/auth/register'>Recuperar clave</Link>
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </AuthLayout>
    );
};
