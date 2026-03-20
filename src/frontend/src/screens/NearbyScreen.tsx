import { MapPin, Navigation, Phone } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

type Category = "all" | "hospital" | "police" | "shelter";

interface NearbyService {
  id: string;
  category: "hospital" | "police" | "shelter";
  name: string;
  distance: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
}

const SERVICES: NearbyService[] = [
  {
    id: "h1",
    category: "hospital",
    name: "City General Hospital",
    distance: "0.8 km",
    address: "15 Medical Center Dr, Downtown",
    phone: "102",
    lat: 28.6139,
    lng: 77.209,
  },
  {
    id: "h2",
    category: "hospital",
    name: "St. Mary's Medical Center",
    distance: "1.4 km",
    address: "88 Health Ave, Midtown",
    phone: "1800-102-102",
    lat: 28.62,
    lng: 77.215,
  },
  {
    id: "h3",
    category: "hospital",
    name: "Apollo Emergency Clinic",
    distance: "2.1 km",
    address: "22 Apollo Road, North Block",
    phone: "1066",
    lat: 28.625,
    lng: 77.22,
  },
  {
    id: "p1",
    category: "police",
    name: "Central Police Station",
    distance: "0.5 km",
    address: "1 Police Headquarters Rd",
    phone: "100",
    lat: 28.618,
    lng: 77.21,
  },
  {
    id: "p2",
    category: "police",
    name: "District Police Post",
    distance: "1.2 km",
    address: "45 Law & Order St, Eastside",
    phone: "100",
    lat: 28.616,
    lng: 77.213,
  },
  {
    id: "p3",
    category: "police",
    name: "Emergency Response Unit",
    distance: "2.5 km",
    address: "77 Rapid Response Blvd",
    phone: "112",
    lat: 28.63,
    lng: 77.225,
  },
  {
    id: "s1",
    category: "shelter",
    name: "Community Safety Center",
    distance: "0.3 km",
    address: "10 Shelter Lane, Central Park Area",
    phone: "1070",
    lat: 28.614,
    lng: 77.207,
  },
  {
    id: "s2",
    category: "shelter",
    name: "City Sports Complex Shelter",
    distance: "1.0 km",
    address: "Stadium Road, West District",
    phone: "1070",
    lat: 28.61,
    lng: 77.205,
  },
  {
    id: "s3",
    category: "shelter",
    name: "Riverside Relief Camp",
    distance: "1.8 km",
    address: "River Embankment, South End",
    phone: "1077",
    lat: 28.608,
    lng: 77.202,
  },
  {
    id: "s4",
    category: "shelter",
    name: "Government School Relief Hub",
    distance: "2.2 km",
    address: "24 Education Street, Township",
    phone: "1077",
    lat: 28.635,
    lng: 77.23,
  },
];

const CATEGORY_CONFIG = {
  hospital: { emoji: "🏥", label: "Hospital", bg: "#DBEAFE", text: "#1E40AF" },
  police: { emoji: "🚔", label: "Police", bg: "#EDE9FE", text: "#5B21B6" },
  shelter: { emoji: "🏠", label: "Shelter", bg: "#D1FAE5", text: "#065F46" },
};

const TABS: { id: Category; label: string; emoji: string }[] = [
  { id: "all", label: "All", emoji: "📍" },
  { id: "hospital", label: "Hospitals", emoji: "🏥" },
  { id: "police", label: "Police", emoji: "🚔" },
  { id: "shelter", label: "Shelters", emoji: "🏠" },
];

export default function NearbyScreen() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");

  const filtered =
    activeCategory === "all"
      ? SERVICES
      : SERVICES.filter((s) => s.category === activeCategory);

  function openMaps(lat: number, lng: number, name: string) {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(name)}`,
      "_blank",
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-border px-5 pt-4 pb-0">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">📍</span>
          <h1 className="text-lg font-extrabold text-foreground">
            Nearby Services
          </h1>
        </div>
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
          {TABS.map((tab) => (
            <button
              type="button"
              key={tab.id}
              data-ocid={`nearby.${tab.id}.tab`}
              onClick={() => setActiveCategory(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                activeCategory === tab.id
                  ? "text-white"
                  : "bg-muted text-muted-foreground"
              }`}
              style={activeCategory === tab.id ? { background: "#D12A22" } : {}}
            >
              <span>{tab.emoji}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 px-4 py-4 space-y-3">
        {filtered.map((service, idx) => {
          const cfg = CATEGORY_CONFIG[service.category];
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="bg-card rounded-2xl shadow-card p-4"
              data-ocid={`nearby.item.${idx + 1}`}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: cfg.bg }}
                >
                  {cfg.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm leading-tight">
                      {service.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-0.5">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{service.address}</span>
                  </div>
                  <span
                    className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-full mt-1"
                    style={{ background: cfg.bg, color: cfg.text }}
                  >
                    {cfg.label} · {service.distance}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <a
                  href={`tel:${service.phone}`}
                  data-ocid={`nearby.item.${idx + 1}`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-white text-xs font-bold"
                  style={{ background: "#D12A22" }}
                >
                  <Phone className="w-3.5 h-3.5" />
                  Call {service.phone}
                </a>

                <button
                  type="button"
                  data-ocid={`nearby.item.${idx + 1}`}
                  onClick={() =>
                    openMaps(service.lat, service.lng, service.name)
                  }
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-muted text-foreground text-xs font-bold"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  Directions
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
