import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../firebase";
import Devices from "../pages/Devices/Devices";
import Sidebar from "../components/Sidebar/Sidebar";
import Products from "../pages/Products/Products";
import Blogs from "../pages/Blogs/Blogs";
import AddBlog from "../pages/AddBlog/AddBlog";
import Messages from "../pages/Messages/Messages";
import Orders from "../pages/Orders/Orders";
import Login from "../pages/Login/Login";


const ProtectedRoute = ({ children }) => {
  const auth = getAuth(app);
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Public Route Component (for login page)
const PublicRoute = ({ children }) => {
  const auth = getAuth(app);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Layout Component (for routes with sidebar)
const LayoutWithSidebar = ({ children }) => {
  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: "20%" }}>
        <Sidebar />
      </div>
      <div style={{ width: "80%" }}>
        {children}
      </div>
    </div>
  );
};

const Routing = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route - Login */}
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />

        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <LayoutWithSidebar>
              <Devices />
            </LayoutWithSidebar>
          </ProtectedRoute>
        } />
        <Route path="/products" element={
          <ProtectedRoute>
            <LayoutWithSidebar>
              <Products />
            </LayoutWithSidebar>
          </ProtectedRoute>
        } />

        <Route path="/blogs" element={
          <ProtectedRoute>
            <LayoutWithSidebar>
              <Blogs />
            </LayoutWithSidebar>
          </ProtectedRoute>
        } />

        <Route path="/blogs/add-blog" element={
          <ProtectedRoute>
            <LayoutWithSidebar>
              <AddBlog />
            </LayoutWithSidebar>
          </ProtectedRoute>
        } />

        <Route path="/messages" element={
          <ProtectedRoute>
            <LayoutWithSidebar>
              <Messages />
            </LayoutWithSidebar>
          </ProtectedRoute>
        } />

        <Route path="/orders" element={
          <ProtectedRoute>
            <LayoutWithSidebar>
              <Orders />
            </LayoutWithSidebar>
          </ProtectedRoute>
        } />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Routing;