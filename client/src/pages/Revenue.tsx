"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  PieChart,
  Pie,
  Label,
  LabelList,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

import dataJson from "./data.json";
import { format } from "date-fns";
import * as React from "react";

// Random data for chart visualization
const generateRandomData = () => {
  return [
    { browser: "Politics", desktop: 3123, mobile: 4215 },
    { browser: "Art", desktop: 2789, mobile: 1567 },
    { browser: "Environment", desktop: 4897, mobile: 2196 },
    { browser: "Health", desktop: 5234, mobile: 6879 },
    { browser: "Housing", desktop: 3421, mobile: 1845 },
  ];
};

const graphchartData = generateRandomData();

export function SubscriberThemes({ }: { selectedMonth?: Date }) {
  return (
    <Card>
      <CardHeader className="items-center pb-0">
        <CardTitle className="font-bold text-lg">What Do Subscribers Want?</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={graphchartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="browser"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col text-center gap-2 text-base">
        <div className="leading-none text-muted-foreground">
        Non-subscribers are driving higher event counts in Health (6,879) and Politics (4,215), highlighting significant engagement with on-the-go topics. To capitalize on this trend, focus on mobile-first content strategies, such as bite-sized articles or push notifications, to sustain and grow engagement in these high-performing categories.
        </div>
      </CardFooter>
    </Card>
  );
}

interface VisitorData {
  value: number;
  fill: string;
}

interface MonthData {
  Subscribers: VisitorData;
  NonSubscribers: VisitorData;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { value } = payload[0];
    return (
      <div style={{ backgroundColor: "#000", padding: "5px", border: "1px solid #ccc", color: "#fff" }}>
        <p>{`Visitors: ${value}`}</p>
      </div>
    );
  }
  return null;
};

const eventConfig = {
  visitors: { label: "Visitors" },
  Subscribers: { label: "Subscribers", color: "hsl(var(--chart-sub))" },
  NonSubscribers: { label: "Non Subscribers", color: "hsl(var(--chart-nonsub))" },
};

export function EventCount({ selectedMonth }: { selectedMonth?: Date }) {
  const selectedMonthName = selectedMonth ? format(selectedMonth, "MMM") : "Jan";

  const graphData = dataJson.graphs.find(
    (graph) => graph.title === "Subscribers vs Non-Subscribers"
  )?.data;

  if (!graphData) {
    return <div>No data available</div>;
  }

  const monthData: MonthData = {
    Subscribers: graphData.Subscribers
      ? {
          value: Number(graphData.Subscribers[selectedMonthName as keyof typeof graphData.Subscribers]) || 0,
          fill: eventConfig["Subscribers"].color,
        }
      : { value: 0, fill: "" },
    NonSubscribers: graphData.NonSubscribers
      ? {
          value: Number(graphData.NonSubscribers[selectedMonthName as keyof typeof graphData.NonSubscribers]) || 0,
          fill: eventConfig['NonSubscribers'].color,
        }
      : { value: 0, fill: "" },
  };

  const sortedData = Object.entries(monthData)
    .map(([cate, data]) => ({
      cate,
      visitors: data.value,
      fill: data.fill,
    }))
    .sort((a, b) => b.visitors - a.visitors);

  return (
    <Card>
      <CardHeader className="items-center pb-0">
        <CardTitle className="font-bold text-lg">How Do Subscribers and Non-Subscribers Compare?</CardTitle>
        <CardDescription>Showing data for {selectedMonthName} 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={eventConfig}>
          <BarChart accessibilityLayer data={sortedData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="cate" tickLine={false} tickMargin={10} axisLine={false} />
            <ChartTooltip content={<CustomTooltip />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="visitors" radius={8}>
              <LabelList position="top" offset={5} className="fill-text" fontSize={12} />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col text-center gap-2 text-base">
        <div className="leading-none text-muted-foreground">
        In January, Non-Subscribers contributed three times as many events (7,500) compared to Subscribers (2,500). This highlights a significant opportunity to engage this larger audience. Consider implementing targeted strategies like offering free trials or exclusive previews to convert Non-Subscribers into loyal Subscribers during this early period of the year.
        </div>
      </CardFooter>
    </Card>
  );
}

const chartConfig: Record<string, { label: string; color: string }> = {
  Politics: { label: "Politics", color: "hsl(var(--chart-a1))" },
  Arts: { label: "Art & Culture", color: "hsl(var(--chart-a2))" },
  Environment: { label: "Environment", color: "hsl(var(--chart-a3))" },
  Health: { label: "Health", color: "hsl(var(--chart-a4))" },
  Housing: { label: "Housing", color: "hsl(var(--chart-a5))" },
  desktop: { label: "Subscribers", color: "hsl(var(--chart-sub))" },
  mobile: { label: "Non-Subscribers", color: "hsl(var(--chart-nonsub))" },
};

export function RevenueAttribution({ selectedMonth }: { selectedMonth?: Date }) {
  const selectedMonthName = selectedMonth ? format(selectedMonth, "MMM") : "Jan";

  function isChartConfigKey(key: string): key is keyof typeof chartConfig {
    return key in chartConfig;
  }

  const revenueData = Object.entries(
    dataJson.graphs.find((graph) => graph.title === "Revenue per Article Theme (USD)")?.data || {}
  ).map(([theme, revenuePerMonth]) => {
    const revenue = (revenuePerMonth as Record<string, number>)[selectedMonthName] || 0;

    return {
      theme,
      revenue,
      color: isChartConfigKey(theme) ? chartConfig[theme].color : "#ff0",
    };
  });

  const totalRevenue = React.useMemo(() => {
    return revenueData.reduce((acc, curr) => acc + curr.revenue, 0);
  }, [revenueData]);

  const chartData = revenueData.map((data) => ({
    browser: data.theme,
    visitors: data.revenue,
    fill: data.color,
  }));

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle className="font-bold text-lg">Where Is the Revenue Coming From?</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-text text-4xl font-bold"
                        >
                          {totalRevenue.toLocaleString()}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col text-center gap-2 text-base">
        <div className="leading-none text-muted-foreground">
        Politics and Health consistently generated the highest revenue across the year, peaking at $205 and $165 in December, respectively. These themes highlight significant profit potential. To maximize revenue, consider investing in sustained coverage, exclusive content, or partnerships in these areas while exploring strategies to boost engagement and monetization for underperforming themes like Arts and Housing.
        </div>
      </CardFooter>
    </Card>
  );
}

type RevenueProps = {
  selectedMonth?: Date;
};

const Revenue: React.FC<RevenueProps> = ({ selectedMonth }) => {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <EventCount selectedMonth={selectedMonth} />
        <SubscriberThemes selectedMonth={selectedMonth} />
        <RevenueAttribution selectedMonth={selectedMonth} />
      </div>
    </>
  );
};

export default Revenue;