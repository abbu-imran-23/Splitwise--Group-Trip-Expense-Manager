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

export { loginSchema, signupSchema }

