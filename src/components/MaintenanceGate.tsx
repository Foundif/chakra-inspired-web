import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { usePlatformSettings } from "@/hooks/usePlatformSettings";
import { useAuth } from "@/hooks/useAuth";
import LaunchingSoon from "@/pages/LaunchingSoon";

/**
 * Blocks the public site when maintenance mode is on.
 * Admins and super admins always see the site. /admin/* routes always pass through
 * so the team can still log in and toggle maintenance off.
 */
const MaintenanceGate = ({ children }: { children: ReactNode }) => {
  const { data, loading } = usePlatformSettings();
  const { isAdmin, isSuperAdmin, loading: authLoading } = useAuth();
  const loc = useLocation();

  if (loading || authLoading) return null;
  const isAdminRoute = loc.pathname.startsWith("/admin");
  if (!data?.maintenance_enabled) return <>{children}</>;
  if (isAdminRoute || isAdmin || isSuperAdmin) return <>{children}</>;

  return (
    <LaunchingSoon
      title={data.maintenance_title}
      message={data.maintenance_message}
      launchAt={data.launch_at}
    />
  );
};

export default MaintenanceGate;
