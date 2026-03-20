import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Shield, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useLogSOSEvent } from "../hooks/useQueries";
import { useGetAllDisasterAlerts } from "../hooks/useQueries";

type Tab = "home" | "alerts" | "nearby" | "guidelines" | "contacts";

const quickCards = [
  {
    id: "alerts",
    emoji: "🚨",
    title: "Disaster Alerts",
    desc: "Live updates",
    color: "#FEE2E2",
    iconBg: "#D12A22",
  },
  {
    id: "nearby",
    emoji: "📍",
    title: "Nearby Services",
    desc: "Find help fast",
    color: "#FEF3C7",
    iconBg: "#D97706",
  },
  {
    id: "guidelines",
    emoji: "📖",
    title: "Safety Tips",
    desc: "Stay prepared",
    color: "#D1FAE5",
    iconBg: "#059669",
  },
  {
    id: "contacts",
    emoji: "👥",
    title: "Contacts",
    desc: "Quick dial",
    color: "#E0E7FF",
    iconBg: "#4F46E5",
  },
];

export default function HomeScreen({
  onNavigate,
}: { onNavigate: (tab: Tab) => void }) {
  const [sosConfirm, setSosConfirm] = useState(false);
  const [sosSent, setSosSent] = useState(false);
  const logSOS = useLogSOSEvent();
  const { data: alerts, isLoading: alertsLoading } = useGetAllDisasterAlerts();

  const criticalAlert =
    alerts?.find((a) => a.severity === "critical") ?? alerts?.[0];

  async function handleSOS() {
    let location: string | null = null;
    try {
      const pos = await new Promise<GeolocationPosition>((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej, { timeout: 5000 }),
      );
      location = `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`;
    } catch {
      location = null;
    }
    await logSOS.mutateAsync(location);
    setSosConfirm(false);
    setSosSent(true);
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <div
        className="relative w-full flex flex-col items-center justify-end pb-8 pt-16"
        style={{
          minHeight: 320,
          backgroundImage:
            "url('/assets/generated/hero-disaster-flood.dim_800x450.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(180,20,10,0.82) 100%)",
          }}
        />

        {/* Header */}
        <div className="absolute top-0 left-0 right-0 flex items-center gap-2 px-5 pt-5 z-10">
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-extrabold text-xl tracking-tight">
            DisasterSafe
          </span>
        </div>

        {/* Hero text */}
        <div className="relative z-10 text-center px-6 mb-4">
          <h1 className="text-white font-extrabold text-3xl leading-tight drop-shadow-lg">
            Stay Safe.
            <br />
            Act Fast.
          </h1>
          <p className="text-white/80 text-sm mt-2">
            Emergency response at your fingertips
          </p>
        </div>

        {/* SOS Button */}
        <div
          className="relative z-10 flex items-center justify-center"
          style={{ height: 200 }}
        >
          {/* Rings */}
          <div className="absolute w-44 h-44 rounded-full border-2 border-white/20 ring-pulse-1" />
          <div className="absolute w-36 h-36 rounded-full border-2 border-white/30 ring-pulse-2" />
          <div className="absolute w-28 h-28 rounded-full border-2 border-white/40 ring-pulse-3" />
          {/* Core button */}

          <button
            type="button"
            data-ocid="sos.primary_button"
            onClick={() => setSosConfirm(true)}
            className="relative w-24 h-24 rounded-full flex flex-col items-center justify-center sos-pulse focus:outline-none focus-visible:ring-4 focus-visible:ring-white/60"
            style={{
              background:
                "linear-gradient(135deg, #C81D16 0%, #D12A22 50%, #E84040 100%)",
              boxShadow: "0 8px 32px rgba(200,29,22,0.6)",
            }}
            aria-label="Activate SOS Emergency Alert"
          >
            <span className="text-2xl font-black text-white tracking-widest">
              SOS
            </span>
            <span className="text-[9px] text-white/80 font-semibold uppercase mt-0.5">
              Tap to Alert
            </span>
          </button>
        </div>
      </div>

      {/* Alert banner */}
      {alertsLoading && (
        <div className="mx-4 mt-4">
          <Skeleton
            className="h-12 w-full rounded-xl"
            data-ocid="alerts.loading_state"
          />
        </div>
      )}
      {!alertsLoading && criticalAlert && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 mt-4 rounded-xl px-4 py-3 flex items-start gap-3"
          style={{ background: "#FEE2E2", border: "1.5px solid #D12A22" }}
          data-ocid="alerts.panel"
        >
          <AlertTriangle
            className="w-5 h-5 mt-0.5 flex-shrink-0"
            style={{ color: "#D12A22" }}
          />
          <div className="flex-1 min-w-0">
            <p
              className="text-xs font-bold uppercase"
              style={{ color: "#D12A22" }}
            >
              {criticalAlert.alertType.toUpperCase()} ALERT —{" "}
              {criticalAlert.severity.toUpperCase()}
            </p>
            <p className="text-xs text-foreground/80 truncate">
              {criticalAlert.message}
            </p>
          </div>
        </motion.div>
      )}

      {/* Quick access cards */}
      <div className="px-4 mt-5">
        <h2 className="text-sm font-bold text-foreground/60 uppercase tracking-wider mb-3">
          Quick Access
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {quickCards.map((card) => (
            <motion.button
              key={card.id}
              data-ocid={`home.${card.id}.button`}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate(card.id as Tab)}
              className="flex flex-col items-start p-4 rounded-2xl bg-card shadow-card text-left transition-shadow hover:shadow-card-hover"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-3"
                style={{ background: card.color }}
              >
                {card.emoji}
              </div>
              <span className="text-sm font-bold text-foreground leading-tight">
                {card.title}
              </span>
              <span className="text-xs text-muted-foreground mt-0.5">
                {card.desc}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Resources */}
      <div className="px-4 mt-6 pb-4" style={{ background: "" }}>
        <h2 className="text-sm font-bold text-foreground/60 uppercase tracking-wider mb-3">
          Resources
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl overflow-hidden bg-brand-peach shadow-card">
            <img
              src="/assets/generated/emergency-contacts-illustration.dim_400x300.png"
              alt="Emergency Contacts"
              className="w-full h-24 object-cover"
            />
            <p className="text-center text-xs font-bold py-2 px-2 text-foreground">
              EMERGENCY CONTACTS
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden bg-brand-peach shadow-card">
            <img
              src="/assets/generated/safety-checklist-illustration.dim_400x300.png"
              alt="Safety Checklist"
              className="w-full h-24 object-cover"
            />
            <p className="text-center text-xs font-bold py-2 px-2 text-foreground">
              PERSONAL CHECKLISTS
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-4 px-4 text-xs text-muted-foreground">
        © {new Date().getFullYear()}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground transition-colors"
        >
          caffeine.ai
        </a>
      </footer>

      {/* SOS confirm modal */}
      <AnimatePresence>
        {sosConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center"
            style={{ background: "rgba(0,0,0,0.6)" }}
            data-ocid="sos.dialog"
          >
            <motion.div
              initial={{ y: 60 }}
              animate={{ y: 0 }}
              exit={{ y: 60 }}
              className="w-full max-w-[430px] bg-white rounded-t-3xl p-6"
            >
              <div className="w-12 h-1 rounded-full bg-border mx-auto mb-5" />
              <div className="text-center mb-6">
                <div
                  className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4"
                  style={{ background: "#FEE2E2" }}
                >
                  <span className="text-4xl">🆘</span>
                </div>
                <h3 className="text-xl font-extrabold text-foreground">
                  Send SOS Alert?
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  This will send an emergency alert with your current location
                  to rescue services.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  data-ocid="sos.cancel_button"
                  onClick={() => setSosConfirm(false)}
                  className="flex-1 py-3 rounded-xl font-semibold text-sm bg-muted text-foreground"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  data-ocid="sos.confirm_button"
                  onClick={handleSOS}
                  disabled={logSOS.isPending}
                  className="flex-1 py-3 rounded-xl font-extrabold text-sm text-white disabled:opacity-70"
                  style={{
                    background: "linear-gradient(135deg, #C81D16, #D12A22)",
                  }}
                >
                  {logSOS.isPending ? "Sending..." : "Yes, Send SOS"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SOS sent confirmation */}
      <AnimatePresence>
        {sosSent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.6)" }}
            data-ocid="sos.success_state"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="w-72 bg-white rounded-3xl p-8 text-center"
            >
              <div
                className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4"
                style={{ background: "#DCFCE7" }}
              >
                <span className="text-4xl">✅</span>
              </div>
              <h3 className="text-xl font-extrabold text-foreground">
                SOS Alert Sent!
              </h3>
              <p className="text-sm text-muted-foreground mt-2 mb-5">
                Help is on the way. Stay calm and stay safe.
              </p>

              <button
                type="button"
                data-ocid="sos.close_button"
                onClick={() => setSosSent(false)}
                className="w-full py-3 rounded-xl font-bold text-white"
                style={{ background: "#059669" }}
              >
                OK
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
