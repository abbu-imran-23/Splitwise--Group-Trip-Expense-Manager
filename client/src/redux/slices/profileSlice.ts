import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    loading: false,
}

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<any>) => {
            state.user = action.payload?.loggedInUser;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    }
})

export const { setUser } = profileSlice.actions;
export default profileSlice.reducer;

