export interface IUser {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    company: string;
    roles: string[];
    status: string;
}

export interface ILoginResponse {
    tokens: {
        token: string;
        refreshToken: string;
    };
    user: IUser;
}

export interface ICompany {
    _id: string;
    shortName: string;
}
