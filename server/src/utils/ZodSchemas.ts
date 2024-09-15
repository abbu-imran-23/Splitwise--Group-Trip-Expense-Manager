import { z } from "zod";

const SignUpSchema = z.object({
    firstname: z.string().min(1, "First Name is required"),
    lastname: z.string().min(1, "Last Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

const LoginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

const updateUserDetailsSchema = z.object({
    firstname: z.string().min(1, "First Name is required"),
    lastname: z.string().min(1, "Last Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().length(10, "Invalid Phone Number")
});

const changePasswordSchema = z.object({
    currentPassword: z.string().min(6, "Password must be atleast 6 Charcters"),
    newPassword: z.string().min(6, "Password must be atleast 6 Charcters"),
    confirmPassword: z.string().min(6, "Password must be atleast 6 Charcters"),
})

export { SignUpSchema, LoginSchema, updateUserDetailsSchema, changePasswordSchema }