import React, { useState, useEffect, useRef } from "react";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaFolder,
  FaUsers,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setToken, setUser } from "../redux/authSlice";

const ToggleSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const navLinks = [
    { id: 1, title: "Dashboard", icon: <FaHome />, link: "/" },
    { id: 2, title: "Projects", icon: <FaFolder />, link: "/projects" },
    { id: 3, title: "Team", icon: <FaUsers />, link: "/team" },
    { id: 4, title: "Settings", icon: <FaCog />, link: "/settings" },
    { id: 5, title: "Register", icon: <FaCog />, link: "/register" },
    { id: 6, title: "Login", icon: <FaCog />, link: "/login" },
    { id: 6, title: "Product", icon: <FaCog />, link: "/admin/add" },
  ];

  const handleLogout = () => {
    dispatch(setToken(null));
    dispatch(setUser(null));
    navigate("/");
  };
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="relative">
      <nav
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-50 bg-gray-800 text-white transform transition-all duration-300 ease-in-out ${
          isOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="p-4 flex flex-col h-full">
          {isOpen && (
            <div className="text-2xl font-bold text-center mb-4 fixed right-2 top-5">
              Logo
            </div>
          )}
          <ul className="flex flex-col gap-3 mt-16 text-2xl">
            {isLoaded &&
              navLinks.map((link, index) => (
                <Link
                  to={link.link}
                  key={link.id}
                  className={`p-2 cursor-pointer flex gap-2 items-center transition-all text-2xl duration-300 ${
                    activeLink === link.id
                      ? "bg-gray-300 text-black font-bold hover:bg-yellow-600"
                      : "hover:bg-gray-700"
                  } ${
                    activeLink === link.id ? "border-r-4 border-blue-500" : ""
                  }`}
                  style={{
                    animationDelay: isOpen ? `${index * 500}ms` : "0ms",
                  }}
                  onClick={() => {
                    setIsOpen(false);
                    setActiveLink(link.id);
                  }}
                >
                  <p className={`text-white ${isOpen ? "text-black" : ""}`}>
                    {link.icon}
                  </p>
                  {isOpen && <p>{link.title}</p>}
                </Link>
              ))}
          </ul>
          <button
            className="mt-auto p-2 bg-gray-700 text-white rounded-md w-full text-left hover:bg-gray-600 transition-all duration-300 flex items-center"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="text-2xl" />
            {isOpen && <span className="ml-2">Logout</span>}
          </button>
        </div>
      </nav>
      <button
        className="fixed top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded-md hover:bg-gray-700 focus:outline-none transition-transform duration-300"
        onClick={handleToggle}
      >
        {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
      </button>
    </div>
  );
};

export default ToggleSidebar;
