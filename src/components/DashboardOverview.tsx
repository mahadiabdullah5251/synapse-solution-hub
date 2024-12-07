import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, Users, Activity, Zap } from "lucide-react";

export default function DashboardOverview() {
  const stats = [
    {
      title: "Active Projects",
      value: "12",
      icon: BarChart2,
      trend: "+2.5%",
      description: "vs. last month",
    },
    {
      title: "Workflows",
      value: "24",
      icon: Activity,
      trend: "+12%",
      description: "vs. last month",
    },
    {
      title: "AI Decisions",
      value: "1,234",
      icon: Zap,
      trend: "+8.1%",
      description: "vs. last month",
    },
    {
      title: "Team Members",
      value: "6",
      icon: Users,
      trend: "+1",
      description: "this week",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your AI Synapse activity.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">{stat.trend}</span>{" "}
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}