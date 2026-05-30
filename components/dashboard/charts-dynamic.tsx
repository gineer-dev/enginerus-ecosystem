"use client";

import dynamic from "next/dynamic";

export const DashboardChartsDynamic = dynamic(
  () => import("@/components/dashboard/charts").then((module) => module.DashboardCharts),
  {
    ssr: false,
    loading: () => <div className="h-80 rounded-lg border bg-card" />,
  },
);
