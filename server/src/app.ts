// Imports
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import AuthRoutes from "./routes/Auth";
import UserRoutes from "./routes/User";
import TripRoutes from "./routes/Trip";
import ExpenseRoutes from "./routes/Expense";
import PaymentMethodRoutes from "./routes/PaymentMethods";
import PaymentRoutes from "./routes/Payment";
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
app.use("/user", UserRoutes);
app.use("/trip", TripRoutes);
app.use("/expense", ExpenseRoutes);
app.use("/paymentMethod", PaymentMethodRoutes);
app.use("/payment", PaymentRoutes);

// Error Handling Middleware
app.use(errorHandler);

export default app;