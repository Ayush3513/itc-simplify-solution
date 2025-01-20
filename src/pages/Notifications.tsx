import React from "react";
import MainLayout from "@/components/Layout/MainLayout";

const Notifications = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Notifications</h1>
        <p className="text-gray-600">View important alerts and updates</p>
      </div>
    </MainLayout>
  );
};

export default Notifications;