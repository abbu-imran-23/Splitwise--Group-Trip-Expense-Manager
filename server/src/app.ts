// Imports
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import AuthRoutes from "./routes/Auth";
import errorHandler from "./middlewares/ErrorHandler";

const app = express();

/****  Middlewares  ****/
// Parse JSON 
app.use(express.json({
    limit: "16kb"
}));

// Parse URL encoded payloads
app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}));

// Cookie Parser
app.use(cookieParser());

// CORS
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

// Serve Static Files
app.use(express.static("public"));

// Routes
app.use("/auth", AuthRoutes);

// Error Handling Middleware
app.use(errorHandler);

export default app;