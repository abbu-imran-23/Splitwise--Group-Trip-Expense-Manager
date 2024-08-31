// Imports
import dotenv from "dotenv";
import dbConnect from "./configs/dbConnect";
import app from "./app";

// Import Backend PORT Number
dotenv.config({
    path: "./env"
});
const PORT = process.env.PORT || 8000;

// Database Connection
dbConnect().then(() => {
    // Server listening
    app.listen(PORT, () => {
        console.log(`Server running at PORT ${PORT}`);
    })
}).catch((err) => {
    console.error("DB Connection Error", err);
    throw err;
})



