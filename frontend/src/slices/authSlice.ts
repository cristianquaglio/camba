import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

import { ICompany, IUser } from '../interfaces/user.interface';
import AuthService from '../services/auth.service';

interface authState {
    isLoggedIn: boolean;
    user: IUser | undefined;
    hasError: boolean;
    isLoading: boolean;
    isRegistered: boolean;
    companies: ICompany[];
}

const initialState: authState = {
    isLoggedIn: false,
    user: undefined,
    hasError: false,
    isLoading: false,
    isRegistered: false,
    companies: [],
};

export const login = createAsyncThunk(
    'auth/login',
    async (
        { email, password }: { email: string; password: string },
        thunkAPI,
    ) => {
        try {
            const { tokens, user } = await AuthService.login(email, password);
            const { token, refreshToken } = tokens;
            Cookies.set('token', token, { secure: true, sameSite: 'None' });
            Cookies.set('refresh-token', refreshToken, {
                secure: true,
                sameSite: 'None',
            });
            return { token, refreshToken, user };
        } catch (error: any) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    },
);

export const registerAdmin = createAsyncThunk(
    'auth/register-admin',
    async (
        {
            firstName,
            lastName,
            username,
            email,
            password,
            company,
        }: {
            firstName: string;
            lastName: string;
            username: string;
            email: string;
            password: string;
            company: string;
        },
        thunkAPI,
    ) => {
        try {
            await AuthService.registerAdmin(
                firstName,
                lastName,
                username,
                email,
                password,
                company,
            );
        } catch (error: any) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    },
);

export const getCompanies = createAsyncThunk('auth/companies', async () => {
    try {
        const companies = await AuthService.getCompanies();
        return companies;
    } catch (error: any) {
        const message =
            (error.response &&
                error.response.data &&
                error.response.data.message) ||
            error.message ||
            error.toString();
        return message;
    }
});

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state, action) => {
                state.isLoggedIn = true;
                state.hasError = false;
                state.user = action.payload.user;
                state.isLoading = false;
            })
            .addCase(login.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoggedIn = false;
                state.hasError = true;
                state.user = undefined;
                state.isLoading = false;
            })
            .addCase(getCompanies.fulfilled, (state, action) => {
                state.companies = action.payload;
            })
            .addCase(registerAdmin.fulfilled, (state, action) => {
                state.hasError = false;
                state.isLoading = false;
                state.isRegistered = true;
            })
            .addCase(registerAdmin.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(registerAdmin.rejected, (state, action) => {
                state.hasError = true;
                state.isLoading = false;
                state.isRegistered = false;
            });
    },
});

export default authSlice.reducer;
