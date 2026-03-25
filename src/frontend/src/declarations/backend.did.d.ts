/* eslint-disable */

// @ts-nocheck

import type { ActorMethod } from '@icp-sdk/core/agent';
import type { IDL } from '@icp-sdk/core/candid';
import type { Principal } from '@icp-sdk/core/principal';

export interface ClothingItem {
  'id' : bigint,
  'isPremium' : boolean,
  'name' : string,
  'description' : string,
  'imageUrl' : string,
  'category' : { 'accessories' : null } |
    { 'dresses' : null } |
    { 'tops' : null } |
    { 'bottoms' : null },
}
export interface UserProfile { 'name' : string }
export type UserRole = { 'admin' : null } |
  { 'user' : null } |
  { 'guest' : null };
export interface DentalBooking {
  'id' : string,
  'name' : string,
  'phone' : string,
  'email' : string,
  'service' : string,
  'preferredDate' : string,
  'message' : string,
  'createdAt' : bigint,
}
export interface CryptoPayment {
  'id' : bigint,
  'user' : Principal,
  'txId' : string,
  'coin' : string,
  'status' : { 'pending' : null } | { 'approved' : null } | { 'rejected' : null },
  'createdAt' : bigint,
}
export type CryptoPaymentStatus = { 'pending' : null } | { 'approved' : null } | { 'rejected' : null };
export interface _SERVICE {
  '_initializeAccessControlWithSecret' : ActorMethod<[string], undefined>,
  'activateSubscription' : ActorMethod<[], undefined>,
  'addClothingItem' : ActorMethod<[ClothingItem], bigint>,
  'assignCallerUserRole' : ActorMethod<[Principal, UserRole], undefined>,
  'clearAllData' : ActorMethod<[], undefined>,
  'deactivateSubscription' : ActorMethod<[], undefined>,
  'deleteClothingItem' : ActorMethod<[bigint], undefined>,
  'deleteDentalBooking' : ActorMethod<[bigint], undefined>,
  'getCallerUserProfile' : ActorMethod<[], [] | [UserProfile]>,
  'getCallerUserRole' : ActorMethod<[], UserRole>,
  'getClothingCatalog' : ActorMethod<[], Array<ClothingItem>>,
  'getDentalBookings' : ActorMethod<[], Array<DentalBooking>>,
  'getItemsByCategory' : ActorMethod<
    [
      { 'accessories' : null } |
        { 'dresses' : null } |
        { 'tops' : null } |
        { 'bottoms' : null },
    ],
    Array<ClothingItem>
  >,
  'getTryOnCountToday' : ActorMethod<[], bigint>,
  'getUserProfile' : ActorMethod<[Principal], [] | [UserProfile]>,
  'isCallerAdmin' : ActorMethod<[], boolean>,
  'isSubscribed' : ActorMethod<[], boolean>,
  'recordTryOn' : ActorMethod<[], undefined>,
  'saveCallerUserProfile' : ActorMethod<[UserProfile], undefined>,
  'submitCryptoPayment' : ActorMethod<[string, string], bigint>,
  'getCryptoPendingPayments' : ActorMethod<[], Array<CryptoPayment>>,
  'approveCryptoPayment' : ActorMethod<[bigint], undefined>,
  'rejectCryptoPayment' : ActorMethod<[bigint], undefined>,
  'getMyPaymentStatus' : ActorMethod<[], [] | [CryptoPaymentStatus]>,
  'submitDentalBooking' : ActorMethod<[{
    name: string, phone: string, email: string, service: string,
    preferredDate: string, message: string
  }], string>,
  'updateClothingItem' : ActorMethod<[ClothingItem], undefined>,
}
export declare const idlService: IDL.ServiceClass;
export declare const idlInitArgs: IDL.Type[];
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
