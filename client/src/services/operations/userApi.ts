// Imports
import { Dispatch } from "@reduxjs/toolkit";
import { setLoading, setUser } from "../../redux/slices/profileSlice"
import { apiConnector } from "../apiConnector";
import { userEndpoints } from "../endPoints";
import { HttpMethod } from "@/constants";
import { toast } from "react-hot-toast"
import { NavigateFunction } from "react-router-dom";
import { IProfileDetails } from "@/interfaces/Auth";

const { FETCH_USER_API, DELETE_USER_API, UPDATE_USER_API } = userEndpoints;

/***   Fetch User Api  ***/

export const fetchUser = () => {
    return async (dispatch: Dispatch) => {

        dispatch(setLoading(true));

        try {
            const apiResponse = await apiConnector(HttpMethod.GET, FETCH_USER_API, {}, {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            });
            const response = apiResponse.data;

            if (!response.success) {
                toast.error(response.message);
                return;
            }

            setUser(response.data);
            console.log("Api Response", response.data);

        } catch (err: any) {
            console.log("Err while Calling Fetch User Api", err);
            const errResponse = err.response?.data;
            toast.error(errResponse?.message || "Failed to fetch User Details")
        } finally {
            dispatch(setLoading(false));
        }

    }
}

/***   Delete User Api  ***/

export const deleteUser = (navigate: NavigateFunction) => {
    return async (dispatch: Dispatch) => {

        const toastId = toast.loading("Deleting User..")
        dispatch(setLoading(true));

        try {
            const apiResponse = await apiConnector(HttpMethod.DELETE, DELETE_USER_API, {}, {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            });
            const response = apiResponse.data;

            if (!response.success) {
                toast.error(response.message);
                return;
            }

            // Remove Stored Tokens from local storage
            localStorage.removeItem("accessToken")
            localStorage.removeItem("refreshToken")

            toast.success("Account Deleted Successfully");
            navigate("/login");

        } catch (err: any) {
            console.log("Err while Calling Fetch User Api", err);
            const errResponse = err.response?.data;
            toast.error(errResponse?.message || "Failed to Delete User Account")
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }

    }
}

/***   Update User Api  ***/

export const updateUserDetails = (updatedProfileDetails: IProfileDetails) => {
    return async (dispatch: Dispatch) => {

        const toastId = toast.loading("Updating Profile Details...")
        dispatch(setLoading(true));

        try {
            const apiResponse = await apiConnector(HttpMethod.PUT, UPDATE_USER_API, updatedProfileDetails, {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            });
            const response = apiResponse.data;

            if (!response.success) {
                toast.error(response.message);
                return;
            }

            toast.success("Profile Updated Successfully");

        } catch (err: any) {
            console.log("Err while Calling User Details Update Api", err);
            const errResponse = err.response?.data;
            toast.error(errResponse?.message || "Failed to update User profile")
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }

    }
}