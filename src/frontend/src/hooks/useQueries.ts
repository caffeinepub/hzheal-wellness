import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CryptoPayment } from "../backend";
import { useActor } from "./useActor";

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsSubscribed() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isSubscribed"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isSubscribed();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMyPaymentStatus() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["myPaymentStatus"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyPaymentStatus();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePendingPayments() {
  const { actor, isFetching } = useActor();
  return useQuery<CryptoPayment[]>({
    queryKey: ["pendingPayments"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCryptoPendingPayments();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 10000,
  });
}

export function useSubmitPayment() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ txId, coin }: { txId: string; coin: string }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.submitCryptoPayment(txId, coin);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myPaymentStatus"] });
      qc.invalidateQueries({ queryKey: ["isSubscribed"] });
    },
  });
}

export function useApprovePayment() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.approveCryptoPayment(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pendingPayments"] });
    },
  });
}

export function useRejectPayment() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.rejectCryptoPayment(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pendingPayments"] });
    },
  });
}

// Legacy exports for old pages
export type { DentalBooking } from "../backend";

export function useSubmitBooking() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (booking: {
      service: string;
      clientName: string;
      appointmentDate: string;
      appointmentTime: string;
      notes: string;
      clientPhone: string;
    }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.submitSalonBooking(booking);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["salonBookings"] });
    },
  });
}

export function useSalonBookings() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["salonBookings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSalonBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDeleteBooking() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.deleteSalonBooking(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["salonBookings"] });
    },
  });
}

export function useClothingCatalog() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["clothingCatalog"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getClothingCatalog();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRecordTryOn() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not authenticated");
      return actor.recordTryOn();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tryOnCount"] });
    },
  });
}

export function useTryOnCount() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["tryOnCount"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getTryOnCountToday();
    },
    enabled: !!actor && !isFetching,
  });
}
