// const BASE_URL = process.env.REACT_APP_BASE_URL

// console.log("Base Url", BASE_URL);

// // AUTH ENDPOINTS
// export const authEndpoints = {
//     SIGNUP_API: `${BASE_URL}/auth/signup`,
//     LOGIN_API: `${BASE_URL}/auth/login`,
// }

// const BASE_URL = process.env.REACT_APP_BASE_URL;

// console.log("Base Url", BASE_URL);

export const authEndpoints = {
    SIGNUP_API: `http://localhost:4000/auth/signup`,
    LOGIN_API: `http://localhost:4000/auth/login`,
    LOGOUT_API: `http://localhost:4000/auth/logout`,
    CHANGE_PASSWORD_API: `http://localhost:4000/auth/change-password`,
};

export const userEndpoints = {
    FETCH_USER_API: `http://localhost:4000/user/getUserDetails`,
    UPDATE_USER_API: `http://localhost:4000/user/updateUserDetails`,
    DELETE_USER_API: `http://localhost:4000/user/deleteUser`,
};
