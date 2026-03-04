// If a user is not authenticated, ProtectedRoute typically redirects them to the login page
import { useState, useEffect, type JSX } from "react";
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
  const [loading, setLoading] = useState(true);

  const authStatus = useSelector((state: RootState) => state.auth.status);

  useEffect(() => {
    if (authentication && !authStatus) {
      navigate("/login", { state: { from: location } });
    } else if (!authentication && authStatus) {
      navigate("/");
    }

    // Stop loader
    setLoading(false);
  }, [authStatus, authentication, navigate, location]);

  // Show loader during redirect check
  if (loading) {
    return (
      <h1 className="text-center mt-10 text-base sm:text-lg font-medium">
        Loading...
      </h1>
    );
  }

  // Otherwise show children
  return <>{children}</>;
}
