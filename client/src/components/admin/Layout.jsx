import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const Admin = () => {
  const { token, user } = useSelector((state) => state.auth);

  if (!token || !user) {
    // If the user or token is not loaded yet, you might show a loading spinner or return null
    return null;
  }

  const isAdmin = user.role === "admin";

  if (!isAdmin) {
    return <Navigate to="/login" />;
  }

  return <div>{isAdmin && <Outlet />}</div>;
};

export default Admin;
