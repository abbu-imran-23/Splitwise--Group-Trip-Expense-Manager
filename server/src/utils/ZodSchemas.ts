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

export { SignUpSchema, LoginSchema }