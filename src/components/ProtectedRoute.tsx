// If a user is not authenticated, ProtectedRoute typically redirects them to the login page
import { useEffect, type JSX } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import type { RootState } from "../store/store";

interface ProtectedRouteProps {
  children: JSX.Element;
  authentication?: boolean;
}

export default function ProtectedRoute({
  children,
  authentication = true,
}: ProtectedRouteProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const authStatus = useSelector((state: RootState) => state.auth.status);

  useEffect(() => {
    if (authentication && !authStatus) {
      navigate("/login", { state: { from: location } });
    } else if (!authentication && authStatus) {
      navigate("/");
    }
  }, [authStatus, authentication, navigate, location]);

  // Otherwise show children
  return <>{children}</>;
}
