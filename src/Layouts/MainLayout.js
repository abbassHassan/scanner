import React from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";

const MainLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logout();
      navigate("/login");
    } catch {
      console.error("Failed to log out");
    }
  };

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-black text-white p-4 h-[100vh] sticky top-0 flex flex-col">
        <h1 className="text-2xl mb-4">Admin Panel</h1>
        <nav className="flex-grow">
          <ul>
            <li className="mb-2">
              <Link to="/products" className="text-white hover:text-gray-400">
                Products
              </Link>
            </li>
            <li className="mt-auto">
              <Link
                to="/login"
                onClick={handleLogout}
                className="text-red-500 hover:text-red-300"
              >
                Log Out
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-grow p-4 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
