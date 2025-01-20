import React from "react";
import MainLayout from "@/components/Layout/MainLayout";
import StatCard from "@/components/Dashboard/StatCard";
import RecentActivity from "@/components/Dashboard/RecentActivity";
import CreditUtilization from "@/components/Dashboard/CreditUtilization";
import { IndianRupee, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";

const Index = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, Priya</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total ITC Available"
            value="₹5,00,000"
            icon={IndianRupee}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="ITC Utilized"
            value="₹4,00,000"
            icon={TrendingUp}
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="Pending Claims"
            value="₹50,000"
            icon={AlertTriangle}
            trend={{ value: 5, isPositive: false }}
          />
          <StatCard
            title="Compliance Score"
            value="95%"
            icon={CheckCircle2}
            trend={{ value: 2, isPositive: true }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CreditUtilization />
          </div>
          <div>
            <RecentActivity />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;