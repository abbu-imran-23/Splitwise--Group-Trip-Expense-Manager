import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAuthSlice, IChangePassword, ISignUpFormData } from "@/interfaces/Auth";

const initialState: IAuthSlice = {
    signUpData: null,
    loading: false,
    accessToken: localStorage.getItem("accessToken") || null,
    changePasswordData: {
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    }
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setSignUpData: (state, action: PayloadAction<ISignUpFormData>) => {
            state.signUpData = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setAccessToken: (state, action: PayloadAction<string>) => {
            state.accessToken = action.payload;
            localStorage.setItem("authToken", JSON.stringify(action.payload));
        },
        setChangePasswordData: (state, action: PayloadAction<IChangePassword>) => {
            state.changePasswordData = action.payload
        }
    }
})

export const { setSignUpData, setLoading, setAccessToken, setChangePasswordData } = authSlice.actions;
export default authSlice.reducer;

