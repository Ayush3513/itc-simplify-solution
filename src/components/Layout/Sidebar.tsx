import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  CreditCard,
  FileCheck,
  BarChart3,
  Bell,
  Settings,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: CreditCard, label: "ITC Eligibility", path: "/itc-eligibility" },
    { icon: FileCheck, label: "Reconciliation", path: "/reconciliation" },
    { icon: BarChart3, label: "Analytics", path: "/analytics" },
    { icon: Bell, label: "Notifications", path: "/notifications" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <div className="hidden lg:flex h-screen w-64 flex-col bg-white border-r border-gray-200 p-4">
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold">ITC</span>
        </div>
        <span className="text-xl font-semibold">ITC Manager</span>
      </div>
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary-100 text-primary-800"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;