import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

export default function Analytics() {
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("analytics_data")
        .select(`*, projects(name)`);
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <p className="text-muted-foreground">
          Track your AI performance and metrics
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ChartContainer
              config={{
                performance: {
                  theme: {
                    light: "hsl(217.2, 91.2%, 59.8%)",
                    dark: "hsl(217.2, 91.2%, 59.8%)",
                  },
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData}>
                  <XAxis dataKey="projects.name" />
                  <YAxis />
                  <Tooltip content={({ active, payload }) => {
                    if (!active || !payload) return null;
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="font-medium">{payload[0]?.payload?.projects?.name}</div>
                          <div className="font-medium">{payload[0]?.value}</div>
                        </div>
                      </div>
                    );
                  }} />
                  <Bar
                    dataKey="metric_value"
                    fill="currentColor"
                    className="fill-primary"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}