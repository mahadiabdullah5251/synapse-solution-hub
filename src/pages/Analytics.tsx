import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function Analytics() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log("No session found in Analytics");
        toast.error("Please sign in to view analytics");
        navigate("/");
        return;
      }
    };
    checkAuth();
  }, [navigate]);

  const { data: analyticsData, isLoading, error } = useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      console.log("Fetching analytics data for user:", session.user.id);

      // First get user's projects
      const { data: projects, error: projectsError } = await supabase
        .from("projects")
        .select("id");

      if (projectsError) {
        console.error("Error fetching projects:", projectsError);
        throw projectsError;
      }

      if (!projects?.length) {
        console.log("No projects found");
        return [];
      }

      const projectIds = projects.map(p => p.id);
      
      const { data, error } = await supabase
        .from("analytics_data")
        .select(`
          *,
          projects (
            name,
            description
          )
        `)
        .in('project_id', projectIds)
        .order('timestamp', { ascending: false });
      
      if (error) {
        console.error("Error fetching analytics data:", error);
        toast.error("Failed to fetch analytics data");
        throw error;
      }
      
      console.log("Fetched analytics data:", data);
      return data;
    },
    retry: 1,
  });

  if (error) {
    console.error("Analytics error:", error);
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-semibold">Error loading analytics data</h3>
          <p className="text-muted-foreground">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  if (!analyticsData?.length) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-semibold">No analytics data available</h3>
          <p className="text-muted-foreground">Create some projects to see analytics</p>
        </div>
      </div>
    );
  }

  const chartConfig = {
    metric: {
      label: "Metric Value",
      theme: {
        light: "hsl(var(--primary))",
        dark: "hsl(var(--primary))",
      },
    },
  };

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
            <ChartContainer config={chartConfig}>
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