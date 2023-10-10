import { FC, useReducer } from 'react';
import axios from 'axios';

import { AuthContext, authReducer } from '.';
import { ICompany, IValidationEmailResponse } from '../../interfaces';

export interface AuthState {
    companies: ICompany[];
}

const Auth_INITIAL_STATE: AuthState = {
    companies: [],
};

interface Props {
    children: React.ReactNode;
}

export const AuthProvider: FC<Props> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, Auth_INITIAL_STATE);

    const registerAdmin = async (
        firstName: string,
        lastName: string,
        username: string,
        email: string,
        password: string,
        company: string,
    ): Promise<{ hasError: boolean; message?: string }> => {
        try {
            const { data } = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/users/admin`,
                {
                    firstName,
                    lastName,
                    username,
                    email,
                    password,
                    company,
                },
            );
            const { message } = data;
            return {
                hasError: false,
                message,
            };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return {
                    hasError: true,
                    message: 'Error conectando al servidor',
                };
            }
            return {
                hasError: true,
                message: 'No se pudo crear el usuario',
            };
        }
    };

    const getCompanies = async (): Promise<
        | { hasError: boolean; message: string }
        | { _id: string; shortName: string }[]
    > => {
        try {
            const { data } = await axios.get<ICompany[]>(
                `${process.env.NEXT_PUBLIC_API_URL}/companies`,
            );
            if (!data) {
                return {
                    hasError: true,
                    message: 'Error trayendo los organismos',
                };
            }
            const companies = data.map(({ _id, shortName }) => {
                return { _id, shortName };
            });
            return companies;
        } catch (error) {
            return {
                hasError: true,
                message: 'Error trayendo los organismos',
            };
        }
    };

    const validateEmail = async (
        token: string,
    ): Promise<IValidationEmailResponse> => {
        try {
            const { data } = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/confirm?token=${token}`,
            );
            const { statusCode, message } = data;
            return { statusCode, message };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return error.response?.data;
            }
            return {
                error: 'Unknown Error',
                statusCode: 500,
                message: 'Error validando el email',
            };
        }
    };

    return (
        <AuthContext.Provider
            value={{ ...state, registerAdmin, getCompanies, validateEmail }}
        >
            {children}
        </AuthContext.Provider>
    );
};
