import axios from "axios";
import { HttpMethod } from "../constants/index";

export const axiosInstance = axios.create({});

export const apiConnector = (method: HttpMethod, url: string, bodyData?: any, headers?: any, params?: any) => {
    return axiosInstance({
        method,
        url,
        data: bodyData ? bodyData : undefined,
        headers: headers ? headers : undefined,
        params: params ? params : undefined
    });
};