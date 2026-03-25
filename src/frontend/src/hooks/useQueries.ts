import { useMutation, useQuery } from "@tanstack/react-query";
import type { Variant_accessories_dresses_tops_bottoms } from "../backend.d";
import { useActor } from "./useActor";

export function useUserRole() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["userRole"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsSubscribed() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["isSubscribed"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isSubscribed();
    },
    enabled: !!actor && !isFetching,
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

export function useItemsByCategory(
  category: Variant_accessories_dresses_tops_bottoms,
) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["itemsByCategory", category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getItemsByCategory(category);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useTryOnCount() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["tryOnCount"],
    queryFn: async () => {
      if (!actor) return 0n;
      return actor.getTryOnCountToday();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRecordTryOn() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.recordTryOn();
    },
  });
}
