

'use client';

import { EnhancedDashboard } from "@/components/dashboard/EnhancedDashboard";
import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { user } = useUser();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your adventure...</p>
        </div>
      </div>
    );
  }

  return <EnhancedDashboard />;
}
