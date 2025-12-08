import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RoleRoute = ({ children, role }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  if (user.role !== role) return <Navigate to="/not-authorized" />;

  return children;
};

export default RoleRoute;
