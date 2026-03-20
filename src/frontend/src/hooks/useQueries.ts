import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AlertType, Severity } from "../backend.d";
import { useActor } from "./useActor";

export function useGetAllDisasterAlerts() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["disasterAlerts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDisasterAlerts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllEmergencyContacts() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["emergencyContacts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllEmergencyContacts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllSafetyGuidelines() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["safetyGuidelines"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSafetyGuidelines();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddDisasterAlert() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      alertType: AlertType;
      severity: Severity;
      location: string;
      message: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.addDisasterAlert(
        data.alertType,
        data.severity,
        data.location,
        data.message,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["disasterAlerts"] }),
  });
}

export function useDeleteDisasterAlert() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteDisasterAlert(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["disasterAlerts"] }),
  });
}

export function useAddEmergencyContact() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      phoneNumber: string;
      relationship: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.addEmergencyContact(
        data.name,
        data.phoneNumber,
        data.relationship,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["emergencyContacts"] }),
  });
}

export function useDeleteEmergencyContact() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteEmergencyContact(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["emergencyContacts"] }),
  });
}

export function useLogSOSEvent() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (location: string | null) => {
      if (!actor) throw new Error("No actor");
      return actor.logSOSEvent(location);
    },
  });
}
