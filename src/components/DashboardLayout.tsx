import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, BarChart2, Settings, LogOut, Workflow } from "lucide-react";
import DashboardOverview from "./DashboardOverview";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("overview");

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "analytics", label: "Analytics", icon: BarChart2 },
    { id: "workflows", label: "Workflows", icon: Workflow },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <Sidebar>
          <SidebarHeader className="p-4">
            <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              AI Synapse
            </h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => setActiveView(item.id)}
                      isActive={activeView === item.id}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <div className="mt-auto p-4">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </Sidebar>
        <main className="flex-1 p-6">
          {activeView === "overview" && <DashboardOverview />}
          {/* Other views will be implemented in subsequent updates */}
        </main>
      </div>
    </SidebarProvider>
  );
}
