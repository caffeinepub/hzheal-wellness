import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Map "mo:core/Map";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";
import Runtime "mo:core/Runtime";

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

  public type SalonBooking = {
    id : Nat;
    clientName : Text;
    clientPhone : Text;
    service : Text;
    appointmentDate : Text;
    appointmentTime : Text;
    notes : Text;
    status : { #pending; #confirmed; #cancelled };
    createdAt : Int;
  };

  let dailyFreeLimit = 3;

  // ----- State -----
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let userProfiles = Map.empty<Principal, UserProfile>();

  var subscriptionMonthlyCostCents : Nat = 1000;

  var nextClothingId : Nat = 0;
  let clothingCatalog = Map.empty<Nat, ClothingItem>();
  let tryOnTracking = Map.empty<Principal, TryOnSession>();
  let subscribers = Map.empty<Principal, Bool>();

  var nextBookingId : Nat = 0;
  let dentalBookings = Map.empty<Nat, DentalBooking>();

  var nextCryptoPaymentId : Nat = 0;
  let cryptoPayments = Map.empty<Nat, CryptoPayment>();

  // Salon bookings
  var nextSalonBookingId : Nat = 0;
  let salonBookings = Map.empty<Nat, SalonBooking>();

  // ------ Stripe Integration -----
  var configuration : ?Stripe.StripeConfiguration = null;

  public query func isStripeConfigured() : async Bool {
    configuration != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    configuration := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (configuration) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?value) { value };
    };
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // ----- Admin Setup -----
  // If no admin has been assigned yet, the caller becomes admin.
  // This is a one-time setup function -- once an admin exists, it does nothing.
  public shared ({ caller }) func claimAdminIfNone() : async Bool {
    if (caller.isAnonymous()) { return false };
    if (not accessControlState.adminAssigned) {
      accessControlState.userRoles.add(caller, #admin);
      accessControlState.adminAssigned := true;
      return true;
    };
    return false;
  };

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
    let role = AccessControl.getUserRole(accessControlState, caller);
    switch (role) {
      case (#user) { true };
      case (#admin) { true };
      case (#guest) {
        // Check if caller has an approved crypto payment
        var hasApproved = false;
        for (p in cryptoPayments.values()) {
          if (p.user == caller and p.status == #approved) {
            hasApproved := true;
          };
        };
        hasApproved
      };
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
      case (null) { { date = currentDate; dailyCount = 1 } };
      case (?existing) {
        if (existing.date == currentDate) {
          { existing with dailyCount = existing.dailyCount + 1 };
        } else {
          { date = currentDate; dailyCount = 1 };
        };
      };
    };
    let isUserSubscribed = switch (subscribers.get(caller)) {
      case (?true) { true };
      case (_) { false };
    };
    if (session.dailyCount > dailyFreeLimit and not isUserSubscribed) {
      Runtime.trap("Non-subscribed users can only try on " # dailyFreeLimit.toText() # " items per day.");
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
        if (session.date == currentDate) { session.dailyCount } else { 0 };
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
    let id = nextCryptoPaymentId;
    nextCryptoPaymentId += 1;
    // Auto-approve immediately and grant access
    cryptoPayments.add(id, {
      id;
      user = caller;
      txId;
      coin;
      status = #approved;
      createdAt = Time.now();
    });
    subscribers.add(caller, true);
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
        // Grant subscriber role (user role) to the payment submitter
        AccessControl.assignRole(accessControlState, caller, p.user, #user);
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
    // Allow any caller to check their own payment status
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

  // ----- Salon Booking Management -----
  public shared func submitSalonBooking(booking : {
    clientName : Text;
    clientPhone : Text;
    service : Text;
    appointmentDate : Text;
    appointmentTime : Text;
    notes : Text;
  }) : async Nat {
    let id = nextSalonBookingId;
    nextSalonBookingId += 1;
    salonBookings.add(id, {
      id;
      clientName = booking.clientName;
      clientPhone = booking.clientPhone;
      service = booking.service;
      appointmentDate = booking.appointmentDate;
      appointmentTime = booking.appointmentTime;
      notes = booking.notes;
      status = #pending;
      createdAt = Time.now();
    });
    id;
  };

  public query ({ caller }) func getSalonBookings() : async [SalonBooking] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view salon bookings");
    };
    salonBookings.values().toArray();
  };

  public shared ({ caller }) func updateSalonBookingStatus(id : Nat, status : { #pending; #confirmed; #cancelled }) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update salon bookings");
    };
    switch (salonBookings.get(id)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?b) { salonBookings.add(id, { b with status }) };
    };
  };

  public shared ({ caller }) func deleteSalonBooking(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete salon bookings");
    };
    salonBookings.remove(id);
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
    salonBookings.clear();
    nextClothingId := 0;
    nextBookingId := 0;
    nextCryptoPaymentId := 0;
    nextSalonBookingId := 0;
    configuration := null;
  };
};
