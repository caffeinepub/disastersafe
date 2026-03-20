import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Plus, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AlertType, Severity } from "../backend.d";
import type { DisasterAlert } from "../backend.d";
import { useActor } from "../hooks/useActor";
import {
  useAddDisasterAlert,
  useDeleteDisasterAlert,
  useGetAllDisasterAlerts,
} from "../hooks/useQueries";

const DISASTER_ICONS: Record<string, string> = {
  flood: "🌊",
  earthquake: "🌍",
  fire: "🔥",
  tsunami: "🌊",
  storm: "🌪️",
};

const SEVERITY_CONFIG: Record<
  string,
  { label: string; bg: string; text: string }
> = {
  low: { label: "Low", bg: "#D1FAE5", text: "#065F46" },
  medium: { label: "Medium", bg: "#FEF3C7", text: "#92400E" },
  high: { label: "High", bg: "#FFEDD5", text: "#9A3412" },
  critical: { label: "Critical", bg: "#FEE2E2", text: "#991B1B" },
};

const SAMPLE_ALERTS = [
  {
    alertType: AlertType.flood,
    severity: Severity.critical,
    location: "Downtown River District",
    message:
      "Severe flooding expected. Evacuate low-lying areas immediately. Roads may be impassable.",
  },
  {
    alertType: AlertType.earthquake,
    severity: Severity.high,
    location: "City Center & Suburbs",
    message:
      "Magnitude 5.8 earthquake detected. Aftershocks possible. Inspect buildings for damage.",
  },
  {
    alertType: AlertType.fire,
    severity: Severity.medium,
    location: "Northern Hills Forest",
    message:
      "Wildfire spreading rapidly due to high winds. Residents within 5km advised to evacuate.",
  },
];

function formatTime(ts: bigint) {
  const ms = Number(ts / 1_000_000n);
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) return "Just now";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AlertsScreen() {
  const { data: alerts, isLoading } = useGetAllDisasterAlerts();
  const addAlert = useAddDisasterAlert();
  const deleteAlert = useDeleteDisasterAlert();
  const { actor } = useActor();
  const [seeded, setSeeded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    alertType: AlertType.flood,
    severity: Severity.medium,
    location: "",
    message: "",
  });

  useEffect(() => {
    if (!actor || seeded || isLoading) return;
    if (alerts && alerts.length === 0) {
      setSeeded(true);
      Promise.all(
        SAMPLE_ALERTS.map((a) =>
          actor.addDisasterAlert(
            a.alertType,
            a.severity,
            a.location,
            a.message,
          ),
        ),
      ).then(() => {
        // queries auto-invalidated via mutation; manually reload
      });
    } else {
      setSeeded(true);
    }
  }, [actor, alerts, isLoading, seeded]);

  async function handleAdd() {
    if (!form.location || !form.message) {
      toast.error("Please fill all fields");
      return;
    }
    await addAlert.mutateAsync(form);
    toast.success("Alert added");
    setShowModal(false);
    setForm({
      alertType: AlertType.flood,
      severity: Severity.medium,
      location: "",
      message: "",
    });
  }

  async function handleDelete(id: bigint) {
    await deleteAlert.mutateAsync(id);
    toast.success("Alert removed");
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-border px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🚨</span>
          <h1 className="text-lg font-extrabold text-foreground">
            Disaster Alerts
          </h1>
        </div>

        <button
          type="button"
          data-ocid="alerts.open_modal_button"
          onClick={() => setShowModal(true)}
          className="w-9 h-9 rounded-full flex items-center justify-center text-white"
          style={{ background: "#D12A22" }}
          aria-label="Add new alert"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-4 space-y-3">
        {isLoading &&
          [1, 2, 3].map((i) => (
            <Skeleton
              key={i}
              className="h-28 w-full rounded-2xl"
              data-ocid="alerts.loading_state"
            />
          ))}

        {!isLoading && (!alerts || alerts.length === 0) && (
          <div
            className="flex flex-col items-center justify-center py-16 text-center"
            data-ocid="alerts.empty_state"
          >
            <span className="text-5xl mb-4">✅</span>
            <p className="font-bold text-foreground">No active alerts</p>
            <p className="text-sm text-muted-foreground mt-1">
              All clear! Stay prepared.
            </p>
          </div>
        )}

        <AnimatePresence>
          {alerts?.map((alert: DisasterAlert, idx: number) => {
            const sev = SEVERITY_CONFIG[alert.severity] ?? SEVERITY_CONFIG.low;
            return (
              <motion.div
                key={String(alert.id)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-card rounded-2xl shadow-card p-4"
                data-ocid={`alerts.item.${idx + 1}`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: sev.bg }}
                  >
                    {DISASTER_ICONS[alert.alertType] ?? "⚠️"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-bold text-sm capitalize">
                        {alert.alertType}
                      </span>
                      <span
                        className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: sev.bg, color: sev.text }}
                      >
                        {sev.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {alert.location}
                    </p>
                    <p className="text-xs text-foreground/80 mt-1 line-clamp-2">
                      {alert.message}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1.5">
                      {formatTime(alert.timestamp)}
                    </p>
                  </div>

                  <button
                    type="button"
                    data-ocid={`alerts.delete_button.${idx + 1}`}
                    onClick={() => handleDelete(alert.id)}
                    className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 hover:bg-red-100 transition-colors"
                    aria-label="Delete alert"
                  >
                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Add Alert Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center"
            style={{ background: "rgba(0,0,0,0.5)" }}
            data-ocid="alerts.dialog"
          >
            <motion.div
              initial={{ y: 80 }}
              animate={{ y: 0 }}
              exit={{ y: 80 }}
              className="w-full max-w-[430px] bg-white rounded-t-3xl p-6 pb-8"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-extrabold">Add New Alert</h3>

                <button
                  type="button"
                  data-ocid="alerts.close_button"
                  onClick={() => setShowModal(false)}
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="alert-type"
                    className="text-xs font-semibold text-muted-foreground uppercase"
                  >
                    Disaster Type
                  </label>
                  <select
                    id="alert-type"
                    data-ocid="alerts.select"
                    value={form.alertType}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        alertType: e.target.value as AlertType,
                      }))
                    }
                    className="w-full mt-1.5 px-3 py-2.5 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {Object.values(AlertType).map((t) => (
                      <option key={t} value={t}>
                        {DISASTER_ICONS[t]}{" "}
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="alert-severity"
                    className="text-xs font-semibold text-muted-foreground uppercase"
                  >
                    Severity
                  </label>
                  <select
                    id="alert-severity"
                    data-ocid="alerts.select"
                    value={form.severity}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        severity: e.target.value as Severity,
                      }))
                    }
                    className="w-full mt-1.5 px-3 py-2.5 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {Object.values(Severity).map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="alert-location"
                    className="text-xs font-semibold text-muted-foreground uppercase"
                  >
                    Location
                  </label>
                  <input
                    id="alert-location"
                    data-ocid="alerts.input"
                    type="text"
                    value={form.location}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, location: e.target.value }))
                    }
                    placeholder="e.g. Downtown River District"
                    className="w-full mt-1.5 px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label
                    htmlFor="alert-message"
                    className="text-xs font-semibold text-muted-foreground uppercase"
                  >
                    Message
                  </label>
                  <textarea
                    id="alert-message"
                    data-ocid="alerts.textarea"
                    rows={3}
                    value={form.message}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, message: e.target.value }))
                    }
                    placeholder="Describe the situation..."
                    className="w-full mt-1.5 px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                <button
                  type="button"
                  data-ocid="alerts.submit_button"
                  onClick={handleAdd}
                  disabled={addAlert.isPending}
                  className="w-full py-3.5 rounded-xl font-extrabold text-white text-sm disabled:opacity-70"
                  style={{
                    background: "linear-gradient(135deg, #C81D16, #D12A22)",
                  }}
                >
                  {addAlert.isPending ? "Adding..." : "Add Alert"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
