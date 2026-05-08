import { createAdminClient } from "@/lib/supabase/admin";
import { Bell } from "lucide-react";

async function getScheduledInfo() {
  try {
    const db = createAdminClient();
    const { data } = await db
      .from("site_settings")
      .select("key, value")
      .in("key", ["maintenance_scheduled_at", "maintenance_mode"]);
    const s = Object.fromEntries((data ?? []).map((r) => [r.key, r.value]));
    return {
      scheduledAt: s.maintenance_scheduled_at || null,
      maintenanceOn: s.maintenance_mode === "true",
    };
  } catch {
    return { scheduledAt: null, maintenanceOn: false };
  }
}

export default async function ScheduledMaintenanceBanner() {
  const { scheduledAt, maintenanceOn } = await getScheduledInfo();

  // Don't show during active maintenance (visitors are on /onderhoud anyway)
  if (!scheduledAt || maintenanceOn) return null;

  const parsedDate = new Date(scheduledAt);
  if (isNaN(parsedDate.getTime()) || parsedDate <= new Date()) return null;

  return (
    <div className="mt-16 bg-amber-50 border-b border-amber-200 px-4 py-2.5 text-center text-sm text-amber-800">
      <Bell className="inline-block w-3.5 h-3.5 mr-1.5 mb-0.5 text-amber-600" />
      <span className="font-semibold">Gepland onderhoud:</span>{" "}
      {parsedDate.toLocaleDateString("nl-NL", { day: "numeric", month: "long" })} om{" "}
      {parsedDate.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })}.{" "}
      De site is dan tijdelijk niet bereikbaar.
    </div>
  );
}
