import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Home, Compass, Activity, User } from "lucide-react";
import { PortalLayout, NavItem } from "@/components/portal/PortalLayout";

const nav: NavItem[] = [
  { label: "Home", to: "/volunteer", icon: Home },
  { label: "Opportunities", to: "/volunteer/opportunities", icon: Compass },
  { label: "My Activity", to: "/volunteer/activity", icon: Activity },
  { label: "Profile", to: "/volunteer/profile", icon: User },
];

export const Route = createFileRoute("/volunteer")({
  component: () => (
    <PortalLayout brand="Volunteer" brandTag="Volunteer Portal" accent="emerald" nav={nav}>
      <Outlet />
    </PortalLayout>
  ),
});
