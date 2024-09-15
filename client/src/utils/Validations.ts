import { z } from "zod";

const loginSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid Email"),
    password: z.string().min(6, "Password must be atleast 6 Charcters")
})

const signupSchema = z.object({
    firstname: z.string().min(1, "Please enter firstname"),
    lastname: z.string().min(1, "Please enter lastname"),
    email: z.string().min(1, "Email is required").email("Invalid Email"),
    password: z.string().min(6, "Password must be atleast 6 Charcters")
})

const changePasswordSchema = z.object({
    currentPassword: z.string().min(6, "Password must be atleast 6 Charcters"),
    newPassword: z.string().min(6, "Password must be atleast 6 Charcters"),
    confirmPassword: z.string().min(6, "Password must be atleast 6 Charcters"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"], // Set the error on the confirmPassword field
    message: "New password do not match with confirm password",
});

const profileDetailsSchema = z.object({
    firstname: z.string().min(1, "Please enter firstname"),
    lastname: z.string().min(1, "Please enter lastname"),
    email: z.string().min(1, "Email is required").email("Invalid Email"),
    phone: z.string().length(10, "Phone Number is not having 10 digits")
})

export { loginSchema, signupSchema, changePasswordSchema, profileDetailsSchema }

