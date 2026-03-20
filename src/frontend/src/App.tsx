import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import AlertsScreen from "./screens/AlertsScreen";
import ContactsScreen from "./screens/ContactsScreen";
import GuidelinesScreen from "./screens/GuidelinesScreen";
import HomeScreen from "./screens/HomeScreen";
import NearbyScreen from "./screens/NearbyScreen";

const queryClient = new QueryClient();

type Tab = "home" | "alerts" | "nearby" | "guidelines" | "contacts";

const tabs: { id: Tab; label: string; emoji: string }[] = [
  { id: "home", label: "Home", emoji: "🏠" },
  { id: "alerts", label: "Alerts", emoji: "🚨" },
  { id: "nearby", label: "Nearby", emoji: "📍" },
  { id: "guidelines", label: "Tips", emoji: "📖" },
  { id: "contacts", label: "Contacts", emoji: "👥" },
];

function AppContent() {
  const [activeTab, setActiveTab] = useState<Tab>("home");

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Mobile frame max-width */}
      <div
        className="flex flex-col flex-1 max-w-[430px] mx-auto w-full relative"
        style={{ minHeight: "100dvh" }}
      >
        {/* Screen content */}
        <main className="flex-1 overflow-y-auto pb-20">
          {activeTab === "home" && <HomeScreen onNavigate={setActiveTab} />}
          {activeTab === "alerts" && <AlertsScreen />}
          {activeTab === "nearby" && <NearbyScreen />}
          {activeTab === "guidelines" && <GuidelinesScreen />}
          {activeTab === "contacts" && <ContactsScreen />}
        </main>

        {/* Bottom navigation */}
        <nav
          className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-border z-50"
          style={{ boxShadow: "0 -2px 12px rgba(0,0,0,0.08)" }}
        >
          <div className="flex items-center justify-around px-2 py-2">
            {tabs.map((tab) => (
              <button
                type="button"
                key={tab.id}
                data-ocid={`nav.${tab.id}.tab`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all min-w-0 flex-1 ${
                  activeTab === tab.id
                    ? "text-brand-red"
                    : "text-muted-foreground"
                }`}
              >
                <span className="text-xl leading-none">{tab.emoji}</span>
                <span
                  className={`text-[10px] font-semibold leading-none ${
                    activeTab === tab.id
                      ? "text-brand-red"
                      : "text-muted-foreground"
                  }`}
                >
                  {tab.label}
                </span>
                {activeTab === tab.id && (
                  <span
                    className="block w-4 h-0.5 rounded-full mt-0.5"
                    style={{ background: "#D12A22" }}
                  />
                )}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
      <Toaster position="top-center" />
    </QueryClientProvider>
  );
}
