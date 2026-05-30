"use client";

import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardSeries } from "@/lib/constants/enginerus";

const colors = ["#782324", "#ffcc00", "#ef6b21", "#3c8a63", "#111827"];

export function DashboardCharts() {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <Card className="border-white/75 bg-white/92 shadow-[0_16px_28px_rgba(29,35,39,0.1)]">
        <CardHeader>
          <CardTitle>Service Volume</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart data={dashboardSeries.serviceVolume}>
              <CartesianGrid stroke="#dfd6cb" strokeDasharray="3 3" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="PMS" stackId="a" fill="#782324" radius={[8, 8, 0, 0]} />
              <Bar dataKey="Diagnostics" stackId="a" fill="#ffcc00" />
              <Bar dataKey="Dyno" stackId="a" fill="#ef6b21" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="border-white/75 bg-white/92 shadow-[0_16px_28px_rgba(29,35,39,0.1)]">
        <CardHeader>
          <CardTitle>Job Status Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <PieChart>
              <Pie data={dashboardSeries.jobStatus} dataKey="value" nameKey="name" outerRadius={110} label>
                {dashboardSeries.jobStatus.map((entry, index) => <Cell key={entry.name} fill={colors[index % colors.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="border-white/75 bg-white/92 shadow-[0_16px_28px_rgba(29,35,39,0.1)]">
        <CardHeader>
          <CardTitle>Inventory Movement</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart data={dashboardSeries.inventoryMovement}>
              <CartesianGrid stroke="#dfd6cb" strokeDasharray="3 3" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="Receive" fill="#3c8a63" radius={[8, 8, 0, 0]} />
              <Bar dataKey="Usage" fill="#782324" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="border-white/75 bg-white/92 shadow-[0_16px_28px_rgba(29,35,39,0.1)]">
        <CardHeader>
          <CardTitle>Dyno Session Trend</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <LineChart data={dashboardSeries.dynoTrend}>
              <CartesianGrid stroke="#dfd6cb" strokeDasharray="3 3" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Line dataKey="sessions" stroke="#782324" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
