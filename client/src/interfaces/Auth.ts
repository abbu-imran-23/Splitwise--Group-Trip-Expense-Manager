export interface ILoginFormData {
    email: string;
    password: string;
}

export interface ISignUpFormData extends ILoginFormData {
    firstname: string;
    lastname: string;
}

export interface IChangePassword {
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
}

export interface IAuthSlice {
    signUpData: ISignUpFormData | null;
    loading: boolean;
    accessToken: string | null
    changePasswordData: IChangePassword
}

export interface IProfileDetails {
    firstname: string;
    lastname: string;
    email: string;
    phone: string
}
