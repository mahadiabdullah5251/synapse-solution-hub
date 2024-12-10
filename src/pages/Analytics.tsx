import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function Analytics() {
  const { data: analyticsData, isLoading, error } = useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("analytics_data")
        .select(`
          *,
          projects (
            name,
            description
          )
        `)
        .order('timestamp', { ascending: false });
      
      if (error) {
        toast.error("Failed to fetch analytics data");
        throw error;
      }
      return data;
    },
  });

  if (error) {
    return <div>Error loading analytics data</div>;
  }

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
            <ChartContainer>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData}>
                  <XAxis dataKey="projects.name" />
                  <YAxis />
                  <Tooltip />
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