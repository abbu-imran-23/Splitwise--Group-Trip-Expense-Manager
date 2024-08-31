import { Routes, Route } from "react-router-dom";
import { Login } from "./pages/auth/Login";
import { SignUp } from "./pages/auth/Signup";
import Home from "./pages/Home";
import PublicRoute from "./routes/PublicRoute";
import PrivateRoute from "./routes/PrivateRoute";

const App = () => {
  return (
    <div className="bg-black h-screen flex justify-center items-center">
      <Routes>
        /*** Public Routes ***/
        <Route
          path="login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="signup"
          element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          }
        />
        /*** Private Routes ***/
        <Route
          path="home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
