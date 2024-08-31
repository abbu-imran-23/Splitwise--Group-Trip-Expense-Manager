import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const navigate = useNavigate();

  // Access Token
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    if (accessToken) {
      navigate("/home");
    }
  }, [accessToken, navigate]);

  // Render the children if there is no access token
  return <>{!accessToken && children}</>;
};

export default PublicRoute;
