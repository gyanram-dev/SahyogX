import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LayoutDashboard, PlusSquare, Inbox, AlertTriangle, Wand2, Users, BarChart3 } from "lucide-react";
import { PortalLayout, NavItem } from "@/components/portal/PortalLayout";

const nav: NavItem[] = [
  { label: "Dashboard", to: "/ngo", icon: LayoutDashboard },
  { label: "Post Task", to: "/ngo/post", icon: PlusSquare },
  { label: "Requests", to: "/ngo/requests", icon: Inbox },
  { label: "Needs", to: "/ngo/needs", icon: AlertTriangle },
  { label: "Allocation", to: "/ngo/allocation", icon: Wand2 },
  { label: "Volunteers", to: "/ngo/volunteers", icon: Users },
  { label: "Analytics", to: "/ngo/analytics", icon: BarChart3 },
];

export const Route = createFileRoute("/ngo")({
  component: () => (
    <PortalLayout brand="NGO" brandTag="Command Center" accent="blue" nav={nav}>
      <Outlet />
    </PortalLayout>
  ),
});