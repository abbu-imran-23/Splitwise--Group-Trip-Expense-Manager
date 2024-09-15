import { Routes, Route } from "react-router-dom";
import { Login } from "./pages/auth/Login";
import { SignUp } from "./pages/auth/Signup";
import Home from "./pages/Home";
import PublicRoute from "./routes/PublicRoute";
import PrivateRoute from "./routes/PrivateRoute";
import Profile from "./components/core/Profile";
import ChangePassword from "./components/core/ChangePassword";

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
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        >
          <Route path="profile" element={<Profile />} />
          <Route path="profile/change-password" element={<ChangePassword />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
