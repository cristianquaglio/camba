import { createContext } from 'react';
import { ICompany, IValidationEmailResponse } from '../../interfaces';

interface ContextProps {
    companies: ICompany[];
    registerAdmin: (
        firstName: string,
        lastName: string,
        username: string,
        email: string,
        password: string,
        company: string,
    ) => Promise<{ hasError: boolean; message?: string | undefined }>;
    getCompanies: () => Promise<any>;
    validateEmail: (token: string) => Promise<IValidationEmailResponse>;
}

export const AuthContext = createContext({} as ContextProps);
