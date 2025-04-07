import { useContext } from "react";
import { Navigate, Outlet } from "react-router";
import { UserContext } from "../context/UserContext";

const ProtectedRoute = () => {
  const {user} = useContext(UserContext) // Check if token exists
  const token = user?.token
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
