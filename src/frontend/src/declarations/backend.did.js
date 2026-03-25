/* eslint-disable */

// @ts-nocheck

import { IDL } from '@icp-sdk/core/candid';

export const ClothingItem = IDL.Record({
  'id' : IDL.Nat,
  'isPremium' : IDL.Bool,
  'name' : IDL.Text,
  'description' : IDL.Text,
  'imageUrl' : IDL.Text,
  'category' : IDL.Variant({
    'accessories' : IDL.Null,
    'dresses' : IDL.Null,
    'tops' : IDL.Null,
    'bottoms' : IDL.Null,
  }),
});
export const UserRole = IDL.Variant({
  'admin' : IDL.Null,
  'user' : IDL.Null,
  'guest' : IDL.Null,
});
export const UserProfile = IDL.Record({ 'name' : IDL.Text });
export const DentalBooking = IDL.Record({
  'id' : IDL.Text,
  'name' : IDL.Text,
  'phone' : IDL.Text,
  'email' : IDL.Text,
  'service' : IDL.Text,
  'preferredDate' : IDL.Text,
  'message' : IDL.Text,
  'createdAt' : IDL.Int,
});

export const idlService = IDL.Service({
  '_initializeAccessControlWithSecret' : IDL.Func([IDL.Text], [], []),
  'activateSubscription' : IDL.Func([], [], []),
  'addClothingItem' : IDL.Func([ClothingItem], [IDL.Nat], []),
  'assignCallerUserRole' : IDL.Func([IDL.Principal, UserRole], [], []),
  'clearAllData' : IDL.Func([], [], []),
  'deactivateSubscription' : IDL.Func([], [], []),
  'deleteClothingItem' : IDL.Func([IDL.Nat], [], []),
  'deleteDentalBooking' : IDL.Func([IDL.Nat], [], []),
  'getCallerUserProfile' : IDL.Func([], [IDL.Opt(UserProfile)], ['query']),
  'getCallerUserRole' : IDL.Func([], [UserRole], ['query']),
  'getClothingCatalog' : IDL.Func([], [IDL.Vec(ClothingItem)], ['query']),
  'getDentalBookings' : IDL.Func([], [IDL.Vec(DentalBooking)], ['query']),
  'getItemsByCategory' : IDL.Func(
      [
        IDL.Variant({
          'accessories' : IDL.Null,
          'dresses' : IDL.Null,
          'tops' : IDL.Null,
          'bottoms' : IDL.Null,
        }),
      ],
      [IDL.Vec(ClothingItem)],
      ['query'],
    ),
  'getTryOnCountToday' : IDL.Func([], [IDL.Nat], ['query']),
  'getUserProfile' : IDL.Func([IDL.Principal], [IDL.Opt(UserProfile)], ['query']),
  'isCallerAdmin' : IDL.Func([], [IDL.Bool], ['query']),
  'isSubscribed' : IDL.Func([], [IDL.Bool], ['query']),
  'recordTryOn' : IDL.Func([], [], []),
  'saveCallerUserProfile' : IDL.Func([UserProfile], [], []),
  'submitDentalBooking' : IDL.Func(
      [IDL.Record({
        'name' : IDL.Text,
        'phone' : IDL.Text,
        'email' : IDL.Text,
        'service' : IDL.Text,
        'preferredDate' : IDL.Text,
        'message' : IDL.Text,
      })],
      [IDL.Text],
      [],
    ),
  'updateClothingItem' : IDL.Func([ClothingItem], [], []),
});

export const idlInitArgs = [];

export const idlFactory = ({ IDL }) => {
  const ClothingItem = IDL.Record({
    'id' : IDL.Nat,
    'isPremium' : IDL.Bool,
    'name' : IDL.Text,
    'description' : IDL.Text,
    'imageUrl' : IDL.Text,
    'category' : IDL.Variant({
      'accessories' : IDL.Null,
      'dresses' : IDL.Null,
      'tops' : IDL.Null,
      'bottoms' : IDL.Null,
    }),
  });
  const UserRole = IDL.Variant({
    'admin' : IDL.Null,
    'user' : IDL.Null,
    'guest' : IDL.Null,
  });
  const UserProfile = IDL.Record({ 'name' : IDL.Text });
  const DentalBooking = IDL.Record({
    'id' : IDL.Text,
    'name' : IDL.Text,
    'phone' : IDL.Text,
    'email' : IDL.Text,
    'service' : IDL.Text,
    'preferredDate' : IDL.Text,
    'message' : IDL.Text,
    'createdAt' : IDL.Int,
  });
  const CryptoPaymentStatus = IDL.Variant({
    'pending' : IDL.Null,
    'approved' : IDL.Null,
    'rejected' : IDL.Null,
  });
  const CryptoPayment = IDL.Record({
    'id' : IDL.Nat,
    'user' : IDL.Principal,
    'txId' : IDL.Text,
    'coin' : IDL.Text,
    'status' : CryptoPaymentStatus,
    'createdAt' : IDL.Int,
  });

  return IDL.Service({
    '_initializeAccessControlWithSecret' : IDL.Func([IDL.Text], [], []),
    'activateSubscription' : IDL.Func([], [], []),
    'addClothingItem' : IDL.Func([ClothingItem], [IDL.Nat], []),
    'assignCallerUserRole' : IDL.Func([IDL.Principal, UserRole], [], []),
    'clearAllData' : IDL.Func([], [], []),
    'deactivateSubscription' : IDL.Func([], [], []),
    'deleteClothingItem' : IDL.Func([IDL.Nat], [], []),
    'deleteDentalBooking' : IDL.Func([IDL.Nat], [], []),
    'getCallerUserProfile' : IDL.Func([], [IDL.Opt(UserProfile)], ['query']),
    'getCallerUserRole' : IDL.Func([], [UserRole], ['query']),
    'getClothingCatalog' : IDL.Func([], [IDL.Vec(ClothingItem)], ['query']),
    'getDentalBookings' : IDL.Func([], [IDL.Vec(DentalBooking)], ['query']),
    'getItemsByCategory' : IDL.Func(
        [
          IDL.Variant({
            'accessories' : IDL.Null,
            'dresses' : IDL.Null,
            'tops' : IDL.Null,
            'bottoms' : IDL.Null,
          }),
        ],
        [IDL.Vec(ClothingItem)],
        ['query'],
      ),
    'getTryOnCountToday' : IDL.Func([], [IDL.Nat], ['query']),
    'getUserProfile' : IDL.Func([IDL.Principal], [IDL.Opt(UserProfile)], ['query']),
    'isCallerAdmin' : IDL.Func([], [IDL.Bool], ['query']),
    'isSubscribed' : IDL.Func([], [IDL.Bool], ['query']),
    'recordTryOn' : IDL.Func([], [], []),
    'saveCallerUserProfile' : IDL.Func([UserProfile], [], []),
    'submitDentalBooking' : IDL.Func(
        [IDL.Record({
          'name' : IDL.Text,
          'phone' : IDL.Text,
          'email' : IDL.Text,
          'service' : IDL.Text,
          'preferredDate' : IDL.Text,
          'message' : IDL.Text,
        })],
        [IDL.Text],
        [],
      ),
    'submitCryptoPayment' : IDL.Func([IDL.Text, IDL.Text], [IDL.Nat], []),
    'getCryptoPendingPayments' : IDL.Func([], [IDL.Vec(CryptoPayment)], ['query']),
    'approveCryptoPayment' : IDL.Func([IDL.Nat], [], []),
    'rejectCryptoPayment' : IDL.Func([IDL.Nat], [], []),
    'getMyPaymentStatus' : IDL.Func([], [IDL.Opt(CryptoPaymentStatus)], ['query']),
    'updateClothingItem' : IDL.Func([ClothingItem], [], []),
  });
};

export const init = ({ IDL }) => { return []; };
