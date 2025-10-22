import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("auth_token");

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/Login" replace />;
  }

  // Otherwise, render the protected page
  return children;
}
