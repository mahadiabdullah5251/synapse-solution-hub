import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { LayoutDashboard, Settings, Workflow, BarChart2, Menu } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              AI Synapse
            </span>
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    <Menu className="w-4 h-4 mr-2" />
                    Menu
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-4 w-[400px]">
                      <Link to="/dashboard" className="flex items-center space-x-2 p-2 hover:bg-accent rounded-md">
                        <LayoutDashboard className="w-4 h-4" />
                        <div>
                          <div className="font-medium">Dashboard</div>
                          <div className="text-sm text-muted-foreground">View your project overview</div>
                        </div>
                      </Link>
                      <Link to="/analytics" className="flex items-center space-x-2 p-2 hover:bg-accent rounded-md">
                        <BarChart2 className="w-4 h-4" />
                        <div>
                          <div className="font-medium">Analytics</div>
                          <div className="text-sm text-muted-foreground">Track your AI performance</div>
                        </div>
                      </Link>
                      <Link to="/workflows" className="flex items-center space-x-2 p-2 hover:bg-accent rounded-md">
                        <Workflow className="w-4 h-4" />
                        <div>
                          <div className="font-medium">Workflows</div>
                          <div className="text-sm text-muted-foreground">Manage your AI workflows</div>
                        </div>
                      </Link>
                      <Link to="/settings" className="flex items-center space-x-2 p-2 hover:bg-accent rounded-md">
                        <Settings className="w-4 h-4" />
                        <div>
                          <div className="font-medium">Settings</div>
                          <div className="text-sm text-muted-foreground">Configure your preferences</div>
                        </div>
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-primary transition-colors">
              Features
            </a>
            <a href="#use-cases" className="text-gray-600 hover:text-primary transition-colors">
              Use Cases
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-primary transition-colors">
              Pricing
            </a>
            <Button className="bg-primary hover:bg-primary/90">Get Started</Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;