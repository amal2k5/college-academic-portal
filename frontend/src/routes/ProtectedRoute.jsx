import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("access");
  const role  = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect to their own home instead of a 403 page
    if (role === "PLATFORM_ADMIN") return <Navigate to="/admin" replace />;
    if (role === "COLLEGE_ADMIN")  return <Navigate to="/college-admin" replace />;
    if (role === "HOD")            return <Navigate to="/hod" replace />;

    // Unknown role → logout
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;