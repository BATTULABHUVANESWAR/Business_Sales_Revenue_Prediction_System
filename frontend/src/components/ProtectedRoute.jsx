import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const isLoggedIn =
    sessionStorage.getItem("isLoggedIn") === "true";

  const userEmail =
    sessionStorage.getItem("userEmail");

  if (!isLoggedIn || !userEmail) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}