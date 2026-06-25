import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("access");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === "PLATFORM_ADMIN") return <Navigate to="/admin" replace />;

    if (role === "COLLEGE_ADMIN")
      return <Navigate to="/college-admin" replace />;

    if (role === "HOD") return <Navigate to="/hod" replace />;
    
    if (role === "STUDENT") {
      return <Navigate to="/student" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
