import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useEffect } from "react";
import { AlertType } from "../backend.d";
import type { SafetyGuideline } from "../backend.d";
import { useActor } from "../hooks/useActor";
import { useGetAllSafetyGuidelines } from "../hooks/useQueries";

const DISASTER_META: Record<
  string,
  { emoji: string; color: string; bg: string; label: string }
> = {
  flood: { emoji: "🌊", color: "#1E40AF", bg: "#DBEAFE", label: "Flood" },
  earthquake: {
    emoji: "🌍",
    color: "#78350F",
    bg: "#FEF3C7",
    label: "Earthquake",
  },
  fire: { emoji: "🔥", color: "#9A3412", bg: "#FFEDD5", label: "Fire" },
  storm: { emoji: "🌪️", color: "#4B5563", bg: "#F3F4F6", label: "Storm" },
  tsunami: { emoji: "🌊", color: "#065F46", bg: "#D1FAE5", label: "Tsunami" },
};

const SEED_GUIDELINES: Array<{ disasterType: AlertType; tips: string[] }> = [
  {
    disasterType: AlertType.flood,
    tips: [
      "Move to higher ground immediately and avoid walking in moving water.",
      "Do not drive through flooded roads; just 15cm of water can knock you over.",
      "Turn off utilities at the main switches if safe to do so.",
      "Disconnect electrical appliances before vacating.",
      "Listen to emergency broadcasts and follow evacuation orders.",
      "After returning home, clean and disinfect everything that got wet.",
    ],
  },
  {
    disasterType: AlertType.earthquake,
    tips: [
      "Drop to your hands and knees before the earthquake knocks you down.",
      "Take cover under a sturdy desk or table and hold on until shaking stops.",
      "Stay away from windows, outside walls, and heavy furniture.",
      "If outdoors, move away from buildings, streetlights, and utility wires.",
      "After shaking stops, check for injuries and hazards like gas leaks.",
      "Expect aftershocks and be prepared to Drop, Cover, and Hold On again.",
    ],
  },
  {
    disasterType: AlertType.fire,
    tips: [
      "Alert everyone in the building and activate the fire alarm.",
      "Evacuate immediately using stairs — never use elevators.",
      "Stay low to the ground where air is cleaner if there is smoke.",
      "Close doors behind you to slow fire spread; touch door before opening.",
      "If clothes catch fire: Stop, Drop, and Roll to smother flames.",
      "Once out, stay out — never go back into a burning building.",
    ],
  },
  {
    disasterType: AlertType.storm,
    tips: [
      "Stay indoors away from windows and glass doors during the storm.",
      "Unplug electronic equipment before the storm arrives.",
      "Bring outdoor furniture, decorations, and garbage cans inside.",
      "If outside when storm hits, seek sturdy shelter immediately.",
      "Avoid flooded areas and downed power lines after the storm.",
      "Use flashlights instead of candles if power is out.",
    ],
  },
  {
    disasterType: AlertType.tsunami,
    tips: [
      "If you feel a strong coastal earthquake, immediately move inland.",
      "Move to high ground — at least 30 meters above sea level.",
      "Never wait to watch the wave; a tsunami can travel 800 km/h.",
      "Follow official evacuation routes and avoid shortcuts.",
      "Do not return to coastal areas until officials declare it safe.",
      "A tsunami is a series of waves; subsequent waves may be larger.",
    ],
  },
];

export default function GuidelinesScreen() {
  const { data: guidelines, isLoading } = useGetAllSafetyGuidelines();
  const { actor } = useActor();
  const [seeded, setSeeded] = useState(false);
  const [openType, setOpenType] = useState<string | null>("flood");

  useEffect(() => {
    if (!actor || seeded || isLoading) return;
    if (guidelines && guidelines.length === 0) {
      setSeeded(true);
      // Guidelines are typically seeded by backend; use what's available
    } else {
      setSeeded(true);
    }
  }, [actor, guidelines, isLoading, seeded]);

  // Merge backend data with seed data (backend takes precedence)
  const mergedGuidelines = SEED_GUIDELINES.map((seed) => {
    const backendData = guidelines?.find(
      (g: SafetyGuideline) => g.disasterType === seed.disasterType,
    );
    return backendData ?? seed;
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-border px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📖</span>
          <h1 className="text-lg font-extrabold text-foreground">
            Safety Guidelines
          </h1>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          Know what to do before disaster strikes
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-4 space-y-3">
        {isLoading &&
          [1, 2, 3, 4, 5].map((i) => (
            <Skeleton
              key={i}
              className="h-14 w-full rounded-2xl"
              data-ocid="guidelines.loading_state"
            />
          ))}

        {!isLoading &&
          mergedGuidelines.map((guideline, idx) => {
            const meta = DISASTER_META[guideline.disasterType] ?? {
              emoji: "⚠️",
              color: "#374151",
              bg: "#F3F4F6",
              label: guideline.disasterType,
            };
            const isOpen = openType === guideline.disasterType;

            return (
              <div
                key={guideline.disasterType}
                className="bg-card rounded-2xl shadow-card overflow-hidden"
                data-ocid={`guidelines.item.${idx + 1}`}
              >
                <button
                  type="button"
                  data-ocid="guidelines.toggle"
                  onClick={() =>
                    setOpenType(isOpen ? null : guideline.disasterType)
                  }
                  className="w-full flex items-center gap-3 p-4 text-left"
                  aria-expanded={isOpen}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: meta.bg }}
                  >
                    {meta.emoji}
                  </div>
                  <div className="flex-1">
                    <span className="font-bold text-sm text-foreground">
                      {meta.label} Safety
                    </span>
                    <p className="text-[11px] text-muted-foreground">
                      {guideline.tips.length} safety tips
                    </p>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div
                        className="px-4 pb-4 pt-0"
                        style={{ borderTop: `1.5px solid ${meta.bg}` }}
                      >
                        <ol className="space-y-2 mt-3">
                          {guideline.tips.map((tip: string, tipIdx: number) => (
                            <li
                              key={tip.slice(0, 20)}
                              className="flex items-start gap-3"
                            >
                              <span
                                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5"
                                style={{
                                  background: meta.bg,
                                  color: meta.color,
                                }}
                              >
                                {tipIdx + 1}
                              </span>
                              <span className="text-xs text-foreground/80 leading-relaxed">
                                {tip}
                              </span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
      </div>
    </div>
  );
}
