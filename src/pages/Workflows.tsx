import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function Workflows() {
  const { data: workflows, isLoading, refetch } = useQuery({
    queryKey: ["workflows"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workflows")
        .select(`*, projects(name)`);
      
      if (error) throw error;
      return data;
    },
  });

  const toggleWorkflow = async (id: string, currentState: boolean) => {
    const { error } = await supabase
      .from("workflows")
      .update({ is_active: !currentState })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update workflow status");
      return;
    }

    toast.success("Workflow status updated");
    refetch();
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Workflows</h2>
        <p className="text-muted-foreground">
          Manage your AI workflows and automations
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {workflows?.map((workflow) => (
          <Card key={workflow.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {workflow.name}
              </CardTitle>
              <Switch
                checked={workflow.is_active}
                onCheckedChange={() => toggleWorkflow(workflow.id, workflow.is_active)}
              />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {workflow.description}
              </p>
              <div className="flex items-center space-x-2">
                <Badge variant={workflow.is_active ? "default" : "secondary"}>
                  {workflow.is_active ? "Active" : "Inactive"}
                </Badge>
                <Badge variant="outline">{workflow.projects?.name}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}