import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function Workflows() {
  const queryClient = useQueryClient();

  const { data: workflows, isLoading, error } = useQuery({
    queryKey: ["workflows"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("workflows")
        .select(`
          *,
          projects (
            name,
            description
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        toast.error("Failed to fetch workflows");
        throw error;
      }
      return data;
    },
  });

  const toggleWorkflowMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { error } = await supabase
        .from("workflows")
        .update({ is_active: !isActive })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
      toast.success("Workflow updated successfully");
    },
    onError: () => {
      toast.error("Failed to update workflow");
    },
  });

  if (error) {
    return <div>Error loading workflows</div>;
  }

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
                onCheckedChange={() => 
                  toggleWorkflowMutation.mutate({
                    id: workflow.id,
                    isActive: workflow.is_active
                  })
                }
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