import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ClothingItem {
    id: bigint;
    isPremium: boolean;
    name: string;
    description: string;
    imageUrl: string;
    category: Variant_accessories_dresses_tops_bottoms;
}
export interface UserProfile {
    name: string;
}
export interface DentalBooking {
    id: string;
    name: string;
    phone: string;
    email: string;
    service: string;
    preferredDate: string;
    message: string;
    createdAt: bigint;
}
export interface DentalBookingInput {
    name: string;
    phone: string;
    email: string;
    service: string;
    preferredDate: string;
    message: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_accessories_dresses_tops_bottoms {
    accessories = "accessories",
    dresses = "dresses",
    tops = "tops",
    bottoms = "bottoms"
}
export interface backendInterface {
    activateSubscription(): Promise<void>;
    addClothingItem(item: ClothingItem): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearAllData(): Promise<void>;
    deactivateSubscription(): Promise<void>;
    deleteClothingItem(id: bigint): Promise<void>;
    deleteDentalBooking(id: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getClothingCatalog(): Promise<Array<ClothingItem>>;
    getDentalBookings(): Promise<Array<DentalBooking>>;
    getItemsByCategory(category: Variant_accessories_dresses_tops_bottoms): Promise<Array<ClothingItem>>;
    getTryOnCountToday(): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isSubscribed(): Promise<boolean>;
    recordTryOn(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitDentalBooking(booking: DentalBookingInput): Promise<string>;
    updateClothingItem(item: ClothingItem): Promise<void>;
}
