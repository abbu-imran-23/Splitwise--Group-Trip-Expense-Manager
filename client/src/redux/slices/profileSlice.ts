import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
    user: {
        _id: "",
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        avatar: "",
        trips: "",
        acceptedPaymentMethods: "",
        paymentsToBePaid: "",
        paymentsToBeRecieved: "",
        paymentHistory: "",
        refreshToken: "",
    },
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

export const { setUser, setLoading } = profileSlice.actions;
export default profileSlice.reducer;

