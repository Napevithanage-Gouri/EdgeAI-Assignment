import { lazy, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Authentication from "./pages/Authentication.tsx";
import NavBar from "./components/NavBar";

const AdminHome = lazy(() => import("./pages/Admin/Home.tsx"));
const AdminDashboard = lazy(() => import("./pages/Admin/ManageDevices.tsx"));
const UserHome = lazy(() => import("./pages/User/Home.tsx"));
const UserDashboard = lazy(() => import("./pages/User/Dashboard.tsx"));
const ManageUser = lazy(() => import("./pages/Admin/ManageUser.tsx"));
const UserStream = lazy(() => import("./pages/User/Stream.tsx"));
const UserDevices = lazy(() => import("./pages/Admin/UserDevices.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));


const ProtectedRoute = ({ children, allowedRole }: { children: any; allowedRole: string }) => {
  const { access_token, role } = useAuth();

  if (!access_token || role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <NavBar />
      {children}
    </>
  );
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
    path: "/admin/dashboard",
    element: (
      <ProtectedRoute allowedRole="Admin">
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/devices/:email",
    element: (
      <ProtectedRoute allowedRole="Admin">
        <UserDevices />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/users",
    element: (
      <ProtectedRoute allowedRole="Admin">
        <ManageUser />
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
    path: "/user/dashboard/:device",
    element: (
      <ProtectedRoute allowedRole="User">
        <UserDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/user/stream/:device",
    element: (
      <ProtectedRoute allowedRole="User">
        <UserStream />
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
