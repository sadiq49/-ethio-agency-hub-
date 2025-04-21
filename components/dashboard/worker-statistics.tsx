"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  {
    name: "Jan",
    Registered: 25,
    Abroad: 18,
    InProcess: 7,
  },
  {
    name: "Feb",
    Registered: 32,
    Abroad: 22,
    InProcess: 10,
  },
  {
    name: "Mar",
    Registered: 51,
    Abroad: 35,
    InProcess: 16,
  },
  {
    name: "Apr",
    Registered: 48,
    Abroad: 40,
    InProcess: 8,
  },
  {
    name: "May",
    Registered: 61,
    Abroad: 48,
    InProcess: 13,
  },
  {
    name: "Jun",
    Registered: 65,
    Abroad: 50,
    InProcess: 15,
  },
  {
    name: "Jul",
    Registered: 72,
    Abroad: 55,
    InProcess: 17,
  },
  {
    name: "Aug",
    Registered: 75,
    Abroad: 57,
    InProcess: 18,
  },
  {
    name: "Sep",
    Registered: 78,
    Abroad: 63,
    InProcess: 15,
  },
  {
    name: "Oct",
    Registered: 85,
    Abroad: 65,
    InProcess: 20,
  },
  {
    name: "Nov",
    Registered: 93,
    Abroad: 70,
    InProcess: 23,
  },
  {
    name: "Dec",
    Registered: 98,
    Abroad: 75,
    InProcess: 23,
  },
];

export default function WorkerStatistics() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="name"
            className="text-xs"
            stroke="#888888"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            className="text-xs"
            stroke="#888888"
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">
                          Month
                        </span>
                        <span className="font-bold">
                          {payload[0].payload.name}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">
                          Registered
                        </span>
                        <span className="font-bold text-blue-500">
                          {payload[0].value}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">
                          Abroad
                        </span>
                        <span className="font-bold text-green-500">
                          {payload[1].value}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">
                          In Process
                        </span>
                        <span className="font-bold text-yellow-500">
                          {payload[2].value}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="Registered"
            fill="hsl(var(--chart-1))"
            stroke="hsl(var(--chart-1))"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="Abroad"
            fill="hsl(var(--chart-2))"
            stroke="hsl(var(--chart-2))"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="InProcess"
            fill="hsl(var(--chart-3))"
            stroke="hsl(var(--chart-3))"
            strokeWidth={2}
          />
          <Legend />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}