import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAuthSlice, ISignUpFormData } from "@/interfaces/Auth";

const initialState: IAuthSlice = {
    signUpData: null,
    loading: false,
    accessToken: localStorage.getItem("accessToken") || null,
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
    }
})

export const { setSignUpData, setLoading, setAccessToken } = authSlice.actions;
export default authSlice.reducer;

