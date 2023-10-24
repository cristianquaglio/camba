import axios from 'axios';
import { ICompany } from '../interfaces/user.interface';

const AUTH_URI = 'http://localhost:5001/auth';

const APP_URI = 'http://localhost:5001';

const login = async (email: string, password: string) => {
    const { data } = await axios.post(`${AUTH_URI}/login`, { email, password });
    const { tokens, user } = data;
    return { tokens, user };
};

const getCompanies = async () => {
    const { data } = await axios.get<ICompany[]>(`${APP_URI}/companies`);
    if (!data) return [];
    const companies = data.map(({ _id, shortName }) => {
        return { _id, shortName };
    });
    return companies;
};

const registerAdmin = async (
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    password: string,
    company: string,
) => {
    return await axios.post(`${APP_URI}/users/admin`, {
        firstName,
        lastName,
        username,
        email,
        password,
        company,
    });
};

const AuthService = {
    login,
    getCompanies,
    registerAdmin,
};

export default AuthService;
