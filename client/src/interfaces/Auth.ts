export interface ILoginFormData {
    email: string;
    password: string;
}

export interface ISignUpFormData extends ILoginFormData {
    firstname: string;
    lastname: string;
}

export interface IAuthSlice {
    signUpData: ISignUpFormData | null;
    loading: boolean;
    accessToken: string | null
}