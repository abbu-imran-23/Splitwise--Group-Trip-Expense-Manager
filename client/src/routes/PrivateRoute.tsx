import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const navigate = useNavigate();

  // Access Token
  const accessToken = localStorage.getItem("accessToken");

  // Make Api Call to verify token
  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
    }
  }, [accessToken, navigate]);

  // Render the children if accessToken exists
  return <>{accessToken && children}</>;
};

export default PrivateRoute;
