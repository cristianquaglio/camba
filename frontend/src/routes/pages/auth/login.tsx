import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Button,
    Chip,
    Grid,
    Link,
    TextField,
    Typography,
} from '@mui/material';
import { CircleOutlined, ErrorOutline } from '@mui/icons-material';
import { useForm } from 'react-hook-form';

import { AuthLayout } from '../../../components/layouts';
import { validators } from '../../../utils';
import { login } from '../../../slices/authSlice';
import { AppDispatch, RootState } from '../../../store/store';

export const LoginPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { hasError, isLoggedIn, isLoading } = useSelector(
        (state: RootState) => state.auth,
    );

    type formData = {
        email: string;
        password: string;
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<formData>();

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/');
        }
    }, [navigate, isLoggedIn]);

    const onLogin = ({ email, password }: formData) => {
        dispatch(login({ email, password }));
    };

    return (
        <AuthLayout>
            <form onSubmit={handleSubmit(onLogin)} noValidate>
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
                                sx={{ display: hasError ? 'flex' : 'none' }}
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
                            {}
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
                                    'Iniciar sesión'
                                )}
                            </Button>
                        </Grid>
                        <Grid item xs={12} display='flex' justifyContent='end'>
                            <Link href='/auth/register'>Registrarse</Link>
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
