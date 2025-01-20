import React from "react";
import MainLayout from "@/components/Layout/MainLayout";

const Settings = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>
    </MainLayout>
  );
};

export default Settings;