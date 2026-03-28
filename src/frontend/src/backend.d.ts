import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface SalonBooking {
    id: bigint;
    service: string;
    status: Variant_cancelled_pending_confirmed;
    clientName: string;
    createdAt: bigint;
    appointmentDate: string;
    appointmentTime: string;
    notes: string;
    clientPhone: string;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface DentalBooking {
    id: string;
    service: string;
    name: string;
    createdAt: bigint;
    email: string;
    message: string;
    preferredDate: string;
    phone: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface CryptoPayment {
    id: bigint;
    status: Variant_pending_approved_rejected;
    coin: string;
    createdAt: bigint;
    txId: string;
    user: Principal;
}
export interface ClothingItem {
    id: bigint;
    isPremium: boolean;
    name: string;
    description: string;
    imageUrl: string;
    category: Variant_accessories_dresses_tops_bottoms;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface UserProfile {
    name: string;
}
export interface http_header {
    value: string;
    name: string;
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
export enum Variant_cancelled_pending_confirmed {
    cancelled = "cancelled",
    pending = "pending",
    confirmed = "confirmed"
}
export enum Variant_pending_approved_rejected {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export interface backendInterface {
    activateSubscription(): Promise<void>;
    addClothingItem(item: ClothingItem): Promise<bigint>;
    approveCryptoPayment(id: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearAllData(): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    deactivateSubscription(): Promise<void>;
    deleteClothingItem(id: bigint): Promise<void>;
    deleteDentalBooking(id: bigint): Promise<void>;
    deleteSalonBooking(id: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getClothingCatalog(): Promise<Array<ClothingItem>>;
    getCryptoPendingPayments(): Promise<Array<CryptoPayment>>;
    getDentalBookings(): Promise<Array<DentalBooking>>;
    getItemsByCategory(category: Variant_accessories_dresses_tops_bottoms): Promise<Array<ClothingItem>>;
    getMyPaymentStatus(): Promise<Variant_pending_approved_rejected | null>;
    getSalonBookings(): Promise<Array<SalonBooking>>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getTryOnCountToday(): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    isSubscribed(): Promise<boolean>;
    recordTryOn(): Promise<void>;
    rejectCryptoPayment(id: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    submitCryptoPayment(txId: string, coin: string): Promise<bigint>;
    submitDentalBooking(booking: {
        service: string;
        name: string;
        email: string;
        message: string;
        preferredDate: string;
        phone: string;
    }): Promise<string>;
    submitSalonBooking(booking: {
        service: string;
        clientName: string;
        appointmentDate: string;
        appointmentTime: string;
        notes: string;
        clientPhone: string;
    }): Promise<bigint>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateClothingItem(item: ClothingItem): Promise<void>;
    updateSalonBookingStatus(id: bigint, status: Variant_cancelled_pending_confirmed): Promise<void>;
}
