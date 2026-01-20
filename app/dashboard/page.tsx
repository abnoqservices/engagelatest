import type { Metadata } from "next";
import { ProductEventMetrics } from "@/components/dashboardanalytics/ProductEventMetrics";
import React from "react";
import MonthlyTarget from "@/components/dashboardanalytics/MonthlyTarget";
import MonthlySalesChart from "@/components/dashboardanalytics/MonthlySalesChart";
import StatisticsChart from "@/components/dashboardanalytics/StatisticsChart";
import RecentOrders from "@/components/dashboardanalytics/RecentOrders";
import DemographicCard from "@/components/dashboardanalytics/DemographicCard";
import { DashboardLayout } from "@/components/dashboard/layout"
export const metadata: Metadata = {
  title:
    "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function Ecommerce() {
  return (
    
<DashboardLayout>
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <ProductEventMetrics />

        <MonthlySalesChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget />
      </div>

      <div className="col-span-12">
        <StatisticsChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <DemographicCard />
      </div>

      <div className="col-span-12 xl:col-span-7">
        <RecentOrders />
      </div>
    </div>
    </DashboardLayout>
  );
}
