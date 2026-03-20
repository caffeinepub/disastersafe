import { Skeleton } from "@/components/ui/skeleton";
import { Phone, Plus, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { EmergencyContact } from "../backend.d";
import { useActor } from "../hooks/useActor";
import {
  useAddEmergencyContact,
  useDeleteEmergencyContact,
  useGetAllEmergencyContacts,
} from "../hooks/useQueries";

const RELATIONSHIP_COLORS: Record<string, { bg: string; text: string }> = {
  Police: { bg: "#EDE9FE", text: "#5B21B6" },
  Ambulance: { bg: "#DBEAFE", text: "#1E40AF" },
  "Fire Brigade": { bg: "#FFEDD5", text: "#9A3412" },
  Family: { bg: "#D1FAE5", text: "#065F46" },
  Friend: { bg: "#FEF3C7", text: "#92400E" },
  Doctor: { bg: "#FCE7F3", text: "#9D174D" },
  Other: { bg: "#F3F4F6", text: "#374151" },
};

const SEED_CONTACTS = [
  { name: "Police", phoneNumber: "100", relationship: "Police" },
  { name: "Ambulance", phoneNumber: "102", relationship: "Ambulance" },
  { name: "Fire Brigade", phoneNumber: "101", relationship: "Fire Brigade" },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function getAvatarColor(name: string) {
  const colors = [
    "#D12A22",
    "#F3702A",
    "#059669",
    "#4F46E5",
    "#D97706",
    "#0891B2",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export default function ContactsScreen() {
  const { data: contacts, isLoading } = useGetAllEmergencyContacts();
  const addContact = useAddEmergencyContact();
  const deleteContact = useDeleteEmergencyContact();
  const { actor } = useActor();
  const [seeded, setSeeded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phoneNumber: "",
    relationship: "Family",
  });

  useEffect(() => {
    if (!actor || seeded || isLoading) return;
    if (contacts && contacts.length === 0) {
      setSeeded(true);
      Promise.all(
        SEED_CONTACTS.map((c) =>
          actor.addEmergencyContact(c.name, c.phoneNumber, c.relationship),
        ),
      );
    } else {
      setSeeded(true);
    }
  }, [actor, contacts, isLoading, seeded]);

  async function handleAdd() {
    if (!form.name || !form.phoneNumber) {
      toast.error("Please fill name and phone number");
      return;
    }
    await addContact.mutateAsync(form);
    toast.success("Contact added");
    setShowModal(false);
    setForm({ name: "", phoneNumber: "", relationship: "Family" });
  }

  async function handleDelete(id: bigint) {
    await deleteContact.mutateAsync(id);
    toast.success("Contact removed");
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-border px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">👥</span>
          <h1 className="text-lg font-extrabold text-foreground">
            Emergency Contacts
          </h1>
        </div>

        <button
          type="button"
          data-ocid="contacts.open_modal_button"
          onClick={() => setShowModal(true)}
          className="w-9 h-9 rounded-full flex items-center justify-center text-white"
          style={{ background: "#D12A22" }}
          aria-label="Add new contact"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* List */}
      <div className="flex-1 px-4 py-4 space-y-3">
        {isLoading &&
          [1, 2, 3].map((i) => (
            <Skeleton
              key={i}
              className="h-20 w-full rounded-2xl"
              data-ocid="contacts.loading_state"
            />
          ))}

        {!isLoading && (!contacts || contacts.length === 0) && (
          <div
            className="flex flex-col items-center justify-center py-16 text-center"
            data-ocid="contacts.empty_state"
          >
            <span className="text-5xl mb-4">📋</span>
            <p className="font-bold text-foreground">No contacts yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Add emergency contacts for quick calling
            </p>
          </div>
        )}

        <AnimatePresence>
          {contacts?.map((contact: EmergencyContact, idx: number) => {
            const relCfg =
              RELATIONSHIP_COLORS[contact.relationship] ??
              RELATIONSHIP_COLORS.Other;
            const avatarColor = getAvatarColor(contact.name);

            return (
              <motion.div
                key={String(contact.id)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ delay: idx * 0.04 }}
                className="bg-card rounded-2xl shadow-card p-4"
                data-ocid={`contacts.item.${idx + 1}`}
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-extrabold text-base flex-shrink-0"
                    style={{ background: avatarColor }}
                  >
                    {getInitials(contact.name)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-foreground">
                      {contact.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {contact.phoneNumber}
                    </p>
                    <span
                      className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-full mt-1"
                      style={{ background: relCfg.bg, color: relCfg.text }}
                    >
                      {contact.relationship}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    <a
                      href={`tel:${contact.phoneNumber}`}
                      data-ocid={`contacts.item.${idx + 1}`}
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                      style={{ background: "#D12A22" }}
                      aria-label={`Call ${contact.name}`}
                    >
                      <Phone className="w-4 h-4" />
                    </a>

                    <button
                      type="button"
                      data-ocid={`contacts.delete_button.${idx + 1}`}
                      onClick={() => handleDelete(contact.id)}
                      className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-red-100 transition-colors"
                      aria-label={`Delete ${contact.name}`}
                    >
                      <Trash2 className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Add Contact Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center"
            style={{ background: "rgba(0,0,0,0.5)" }}
            data-ocid="contacts.dialog"
          >
            <motion.div
              initial={{ y: 80 }}
              animate={{ y: 0 }}
              exit={{ y: 80 }}
              className="w-full max-w-[430px] bg-white rounded-t-3xl p-6 pb-8"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-extrabold">
                  Add Emergency Contact
                </h3>

                <button
                  type="button"
                  data-ocid="contacts.close_button"
                  onClick={() => setShowModal(false)}
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="text-xs font-semibold text-muted-foreground uppercase"
                  >
                    Full Name
                  </label>
                  <input
                    id="contact-name"
                    data-ocid="contacts.input"
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                    placeholder="e.g. Dr. Sharma"
                    className="w-full mt-1.5 px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-phone"
                    className="text-xs font-semibold text-muted-foreground uppercase"
                  >
                    Phone Number
                  </label>
                  <input
                    id="contact-phone"
                    data-ocid="contacts.input"
                    type="tel"
                    value={form.phoneNumber}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, phoneNumber: e.target.value }))
                    }
                    placeholder="e.g. 9876543210"
                    className="w-full mt-1.5 px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-rel"
                    className="text-xs font-semibold text-muted-foreground uppercase"
                  >
                    Relationship
                  </label>
                  <select
                    id="contact-rel"
                    data-ocid="contacts.select"
                    value={form.relationship}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, relationship: e.target.value }))
                    }
                    className="w-full mt-1.5 px-3 py-2.5 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {Object.keys(RELATIONSHIP_COLORS).map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  data-ocid="contacts.submit_button"
                  onClick={handleAdd}
                  disabled={addContact.isPending}
                  className="w-full py-3.5 rounded-xl font-extrabold text-white text-sm disabled:opacity-70"
                  style={{
                    background: "linear-gradient(135deg, #C81D16, #D12A22)",
                  }}
                >
                  {addContact.isPending ? "Adding..." : "Add Contact"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
