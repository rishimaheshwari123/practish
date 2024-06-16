import React from "react";
import Sidebar from "./components/Sidebar";
import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Admin from "./components/admin/Layout";
import Dashboard from "./components/admin/Dashboard";
import UserDashBoard from "./components/user/UserDashboard";
import User from "./components/user/Layout";
import AddProduct from "./components/admin/AddProduct";

const App = () => {
  return (
    <div className="flex gap-5">
      <Sidebar />
      <div className="flex-1 ml-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          {/* Add other routes here */}

          <Route path="/admin" element={<Admin />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="add" element={<AddProduct />} />
          </Route>
          <Route path="/user" element={<User />}>
            <Route path="dashboard" element={<UserDashBoard />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
};

export default App;
