// Imports
import { ILoginFormData, ISignUpFormData } from "@/interfaces/Auth";
import { Dispatch } from "@reduxjs/toolkit";
import { setLoading, setSignUpData } from "../../redux/slices/authSlice"
import { apiConnector } from "../apiConnector";
import { authEndpoints } from "../endPoints";
import { HttpMethod } from "@/constants";
import { setUser } from "@/redux/slices/profileSlice";
import { NavigateFunction } from "react-router-dom";
import { toast } from "react-hot-toast"

const { SIGNUP_API, LOGIN_API, LOGOUT_API } = authEndpoints;

/***   Signup Api  ***/

export const signup = (signUpData: ISignUpFormData, navigate: NavigateFunction) => {
    return async (dispatch: Dispatch) => {

        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true));

        try {
            const apiResponse = await apiConnector(HttpMethod.POST, SIGNUP_API, signUpData);
            const response = apiResponse.data;

            if (!response.success) {
                toast.error(response.message)
            }

            dispatch(setSignUpData(signUpData));

            toast.success("Registered Successfully");
            navigate("/login");
        } catch (err: any) {
            console.log("Err while Calling Signup Api", err);
            const errResponse = err.response?.data;
            toast.error(errResponse?.message || "Signup Failed")
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId)
        }

    }
}

/***   Login Api  ***/

export const login = (loginCredentials: ILoginFormData, navigate: NavigateFunction) => {
    return async (dispatch: Dispatch) => {

        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true));

        try {
            const apiResponse = await apiConnector(HttpMethod.POST, LOGIN_API, loginCredentials);
            const response = apiResponse.data;

            if (!response.success) {
                toast.error(response.message)
            }

            // Store Tokens in local storage
            localStorage.setItem("accessToken", response.data?.accessToken)
            localStorage.setItem("refreshToken", response.data?.refreshToken)

            dispatch(setUser(response.data));

            toast.success("Login Successful");
            navigate("/home");
        } catch (err: any) {
            console.log("Err while Calling Login Api", err);
            const errResponse = err.response?.data;
            toast.error(errResponse?.message || "Login Failed")
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId)
        }

    }
}

/***   Logout Api  ***/

export const logout = (navigate: NavigateFunction) => {
    return async (dispatch: Dispatch) => {

        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true));

        try {
            const apiResponse = await apiConnector(HttpMethod.POST, LOGOUT_API, {}, {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            });
            const response = apiResponse.data;
            console.log("Logout Api Response............", response);

            if (!response.success) {
                toast.error(response.message)
            }

            // Remove Stored Tokens from local storage
            localStorage.removeItem("accessToken")
            localStorage.removeItem("refreshToken")

            toast.success("Logout Successful");
            navigate("/login");
        } catch (err: any) {
            console.log("Err while Calling Login Api", err);
            const errResponse = err.response?.data;
            toast.error(errResponse?.message || "Logout Failed")
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId)
        }

    }
}