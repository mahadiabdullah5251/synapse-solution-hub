import React, { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { PlayCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Workflows() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/");
        return;
      }
    };
    checkAuth();
  }, [navigate]);

  const { data: workflows, isLoading, error } = useQuery({
    queryKey: ["workflows"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      console.log("Fetching workflows for user:", user.id);

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
        console.error("Error fetching workflows:", error);
        throw error;
      }
      console.log("Fetched workflows:", data);
      return data;
    },
  });

  const toggleWorkflowMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      console.log("Toggling workflow:", id, "to", !isActive);
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
    onError: (error) => {
      console.error("Error toggling workflow:", error);
      toast.error("Failed to update workflow");
    },
  });

  const executeWorkflowMutation = useMutation({
    mutationFn: async (workflowId: string) => {
      console.log("Executing workflow:", workflowId);
      const { data, error } = await supabase.functions.invoke('execute-workflow', {
        body: { workflowId }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Workflow executed successfully");
    },
    onError: (error) => {
      console.error("Error executing workflow:", error);
      toast.error(`Failed to execute workflow: ${error.message}`);
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
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant={workflow.is_active ? "default" : "secondary"}>
                    {workflow.is_active ? "Active" : "Inactive"}
                  </Badge>
                  <Badge variant="outline">{workflow.projects?.name}</Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => executeWorkflowMutation.mutate(workflow.id)}
                  disabled={!workflow.is_active}
                >
                  <PlayCircle className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}