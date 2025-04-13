import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Authentication from "./pages/Authentication.tsx";
import AdminHome from "./pages/Admin/Home.tsx";
import AdminDashboard from "./pages/Admin/Dashboard.tsx";
import UserHome from "./pages/User/Home.tsx";
import UserDashboard from "./pages/User/Dashboard.tsx";
import NotFound from "./pages/NotFound.tsx";

const ProtectedRoute = ({ children, allowedRole }: { children: any; allowedRole: string }) => {
  const { access_token, role } = useAuth();

  if (!access_token || role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const router = createBrowserRouter([
  { path: "/", element: <Authentication /> },
  {
    path: "/admin/home",
    element: (
      <ProtectedRoute allowedRole="Admin">
        <AdminHome />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/dashboard/:id",
    element: (
      <ProtectedRoute allowedRole="Admin">
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/user/home",
    element: (
      <ProtectedRoute allowedRole="User">
        <UserHome />
      </ProtectedRoute>
    ),
  },
  {
    path: "/user/dashboard/:id",
    element: (
      <ProtectedRoute allowedRole="User">
        <UserDashboard />
      </ProtectedRoute>
    ),
  },
  { path: "/*", element: <NotFound /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
