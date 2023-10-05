import { createContext } from 'react';
import { ICompany } from '../../interfaces/company';

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
}

export const AuthContext = createContext({} as ContextProps);
