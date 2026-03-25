import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

actor {
  // ----- Types -----
  public type UserProfile = {
    name : Text;
  };

  public type ClothingItem = {
    id : Nat;
    name : Text;
    category : {
      #tops;
      #bottoms;
      #dresses;
      #accessories;
    };
    imageUrl : Text;
    description : Text;
    isPremium : Bool;
  };

  public type TryOnSession = {
    date : Int;
    dailyCount : Nat;
  };

  public type DentalBooking = {
    id : Text;
    name : Text;
    phone : Text;
    email : Text;
    service : Text;
    preferredDate : Text;
    message : Text;
    createdAt : Int;
  };

  public type CryptoPayment = {
    id : Nat;
    user : Principal;
    txId : Text;
    coin : Text;
    status : { #pending; #approved; #rejected };
    createdAt : Int;
  };

  let dailyFreeLimit = 3;

  // ----- State -----
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let userProfiles = Map.empty<Principal, UserProfile>();

  // Kept for upgrade compatibility with previous version (was used by Stripe)
  var subscriptionMonthlyCostCents : Nat = 1000;
  var configuration : ?{ allowedCountries : [Text]; secretKey : Text } = null;

  var nextClothingId : Nat = 0;
  let clothingCatalog = Map.empty<Nat, ClothingItem>();
  let tryOnTracking = Map.empty<Principal, TryOnSession>();
  let subscribers = Map.empty<Principal, Bool>();

  // Dental bookings
  var nextBookingId : Nat = 0;
  let dentalBookings = Map.empty<Nat, DentalBooking>();

  // Crypto payments
  var nextCryptoPaymentId : Nat = 0;
  let cryptoPayments = Map.empty<Nat, CryptoPayment>();

  // ----- User Profile Management -----
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // ----- Clothing Management -----
  public query func getClothingCatalog() : async [ClothingItem] {
    clothingCatalog.values().toArray();
  };

  public query func getItemsByCategory(category : { #tops; #bottoms; #dresses; #accessories }) : async [ClothingItem] {
    clothingCatalog.values().filter(func(item) { item.category == category }).toArray();
  };

  public shared ({ caller }) func addClothingItem(item : ClothingItem) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add clothing items");
    };
    let newId = nextClothingId;
    nextClothingId += 1;
    clothingCatalog.add(newId, { item with id = newId });
    newId;
  };

  public shared ({ caller }) func updateClothingItem(item : ClothingItem) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update clothing items");
    };
    if (clothingCatalog.containsKey(item.id)) {
      clothingCatalog.add(item.id, item);
    } else {
      Runtime.trap("Cannot update non-existing clothing item with id " # item.id.toText());
    };
  };

  public shared ({ caller }) func deleteClothingItem(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete clothing items");
    };
    if (clothingCatalog.containsKey(id)) {
      clothingCatalog.remove(id);
    } else {
      Runtime.trap("Cannot delete non-existing clothing item with id " # id.toText());
    };
  };

  // ----- Subscription Management -----
  public query ({ caller }) func isSubscribed() : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check subscription status");
    };
    switch (subscribers.get(caller)) {
      case (?true) { true };
      case (_) { false };
    };
  };

  public shared ({ caller }) func activateSubscription() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can activate subscriptions");
    };
    subscribers.add(caller, true);
  };

  public shared ({ caller }) func deactivateSubscription() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can deactivate subscriptions");
    };
    subscribers.add(caller, false);
  };

  // ----- Try-On Tracking -----
  public shared ({ caller }) func recordTryOn() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can record try-ons");
    };
    let currentDate = (Time.now() / 1_000_000_000) / (60 * 60 * 24);
    let session = switch (tryOnTracking.get(caller)) {
      case (null) {
        {
          date = currentDate;
          dailyCount = 1;
        };
      };
      case (?existing) {
        if (existing.date == currentDate) {
          {
            existing with dailyCount = existing.dailyCount + 1;
          };
        } else {
          {
            date = currentDate;
            dailyCount = 1;
          };
        };
      };
    };

    let isUserSubscribed = switch (subscribers.get(caller)) {
      case (?true) { true };
      case (_) { false };
    };

    if (session.dailyCount > dailyFreeLimit and not isUserSubscribed) {
      Runtime.trap("Non-subscribed users can only try on " # dailyFreeLimit.toText() # " items per day. Please subscribe for unlimited access.");
    };

    tryOnTracking.add(caller, session);
  };

  public query ({ caller }) func getTryOnCountToday() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check try-on count");
    };
    let currentDate = (Time.now() / 1_000_000_000) / (60 * 60 * 24);
    switch (tryOnTracking.get(caller)) {
      case (null) { 0 };
      case (?session) {
        if (session.date == currentDate) {
          session.dailyCount;
        } else {
          0;
        };
      };
    };
  };

  // ----- Dental Booking Management -----
  public shared func submitDentalBooking(booking : {
    name : Text;
    phone : Text;
    email : Text;
    service : Text;
    preferredDate : Text;
    message : Text;
  }) : async Text {
    let id = nextBookingId;
    nextBookingId += 1;
    let idText = id.toText();
    dentalBookings.add(id, {
      id = idText;
      name = booking.name;
      phone = booking.phone;
      email = booking.email;
      service = booking.service;
      preferredDate = booking.preferredDate;
      message = booking.message;
      createdAt = Time.now();
    });
    idText;
  };

  public query ({ caller }) func getDentalBookings() : async [DentalBooking] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view bookings");
    };
    dentalBookings.values().toArray();
  };

  public shared ({ caller }) func deleteDentalBooking(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete bookings");
    };
    dentalBookings.remove(id);
  };

  // ----- Crypto Payment Management -----
  public shared ({ caller }) func submitCryptoPayment(txId : Text, coin : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit payments");
    };
    let id = nextCryptoPaymentId;
    nextCryptoPaymentId += 1;
    cryptoPayments.add(id, {
      id;
      user = caller;
      txId;
      coin;
      status = #pending;
      createdAt = Time.now();
    });
    id;
  };

  public query ({ caller }) func getCryptoPendingPayments() : async [CryptoPayment] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view payments");
    };
    cryptoPayments.values().toArray();
  };

  public shared ({ caller }) func approveCryptoPayment(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can approve payments");
    };
    switch (cryptoPayments.get(id)) {
      case (null) { Runtime.trap("Payment not found") };
      case (?p) {
        cryptoPayments.add(id, { p with status = #approved });
        subscribers.add(p.user, true);
      };
    };
  };

  public shared ({ caller }) func rejectCryptoPayment(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can reject payments");
    };
    switch (cryptoPayments.get(id)) {
      case (null) { Runtime.trap("Payment not found") };
      case (?p) {
        cryptoPayments.add(id, { p with status = #rejected });
      };
    };
  };

  public query ({ caller }) func getMyPaymentStatus() : async ?{ #pending; #approved; #rejected } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    // Find the latest payment by this user
    var latest : ?CryptoPayment = null;
    for (p in cryptoPayments.values()) {
      if (p.user == caller) {
        switch (latest) {
          case (null) { latest := ?p };
          case (?l) { if (p.id > l.id) { latest := ?p } };
        };
      };
    };
    switch (latest) {
      case (null) { null };
      case (?p) { ?p.status };
    };
  };

  // ----- Utility -----
  public shared ({ caller }) func clearAllData() : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can clear all data");
    };
    clothingCatalog.clear();
    tryOnTracking.clear();
    subscribers.clear();
    userProfiles.clear();
    dentalBookings.clear();
    cryptoPayments.clear();
    nextClothingId := 0;
    nextBookingId := 0;
    nextCryptoPaymentId := 0;
    configuration := null;
  };
};
