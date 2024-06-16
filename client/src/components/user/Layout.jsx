import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const User = () => {
  const { token, user } = useSelector((state) => state.auth);

  if (!token || !user) {
    return null;
  }

  const isUser = user.role === "user";

  if (!isUser) {
    return <Navigate to="/login" />;
  }

  return <div>{isUser && <Outlet />}</div>;
};

export default User;
