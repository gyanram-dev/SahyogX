import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LayoutDashboard, PlusSquare } from "lucide-react";
import { PortalLayout, NavItem } from "@/components/portal/PortalLayout";

const nav: NavItem[] = [
  { label: "Dashboard", to: "/ngo", icon: LayoutDashboard },
  { label: "Post Task", to: "/ngo/post", icon: PlusSquare },
];

export const Route = createFileRoute("/ngo")({
  component: () => (
    <PortalLayout brand="NGO" brandTag="Command Center" accent="blue" nav={nav}>
      <Outlet />
    </PortalLayout>
  ),
});
