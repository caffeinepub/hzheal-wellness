import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  Clock,
  FileText,
  Loader2,
  LogOut,
  Phone,
  Scissors,
  Trash2,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { SalonBooking } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useDeleteBooking,
  useIsAdmin,
  useSalonBookings,
} from "../hooks/useQueries";

function StatusBadge({ status }: { status: string }) {
  if (status === "confirmed") {
    return (
      <Badge className="bg-success/20 text-success border-success/30 text-xs">
        Confirmed
      </Badge>
    );
  }
  if (status === "cancelled") {
    return (
      <Badge className="bg-destructive/20 text-destructive border-destructive/30 text-xs">
        Cancelled
      </Badge>
    );
  }
  return (
    <Badge className="bg-warning/20 text-warning-foreground border-warning/30 text-xs">
      Pending
    </Badge>
  );
}

function BookingCard({
  booking,
  index,
}: { booking: SalonBooking; index: number }) {
  const { mutateAsync: deleteBooking, isPending: isDeleting } =
    useDeleteBooking();

  const handleDelete = async () => {
    if (!confirm("Delete this booking?")) return;
    try {
      await deleteBooking(booking.id as unknown as bigint);
      toast.success("Booking deleted.");
    } catch {
      toast.error("Failed to delete booking.");
    }
  };

  const createdDate = new Date(Number(booking.createdAt) / 1_000_000);

  return (
    <div
      data-ocid={`bookings.item.${index + 1}`}
      className="p-5 rounded-xl gold-border bg-card hover:bg-card/80 transition-colors"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 gold-text" />
          </div>
          <div>
            <div className="font-semibold text-foreground">
              {(booking as any).clientName || (booking as any).name}
            </div>
            <a
              href={`tel:${(booking as any).clientPhone || (booking as any).phone}`}
              className="flex items-center gap-1 text-muted-foreground text-sm hover:gold-text transition-colors"
            >
              <Phone className="w-3 h-3" />
              {(booking as any).clientPhone || (booking as any).phone}
            </a>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status="pending" />
          <Button
            data-ocid={`bookings.delete_button.${index + 1}`}
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
          >
            {isDeleting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Scissors className="w-3.5 h-3.5 gold-text flex-shrink-0" />
          <span className="truncate">{booking.service}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="w-3.5 h-3.5 gold-text flex-shrink-0" />
          <span className="truncate">
            {(booking as any).appointmentDate || (booking as any).preferredDate}
          </span>
        </div>
        {(booking as any).message && (
          <div className="col-span-2 flex items-start gap-2 text-muted-foreground">
            <FileText className="w-3.5 h-3.5 gold-text flex-shrink-0 mt-0.5" />
            <span className="text-xs">
              {(booking as any).notes || (booking as any).message || ""}
            </span>
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-border">
        <span className="text-xs text-muted-foreground">
          Submitted:{" "}
          {createdDate.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}

export default function Admin() {
  const { identity, login, clear, isLoggingIn, isInitializing } =
    useInternetIdentity();
  const isLoggedIn = !!identity && !identity.getPrincipal().isAnonymous();

  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: bookings, isLoading: bookingsLoading } = useSalonBookings();

  const pendingCount = bookings?.length ?? 0;

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-sm mx-auto px-6">
          <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-6">
            <Scissors className="w-6 h-6 gold-text" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">
            Admin Access
          </h1>
          <p className="text-muted-foreground text-sm mb-8">
            Log in with Internet Identity to access the SANRIX SALON admin
            dashboard.
          </p>
          <Button
            data-ocid="admin.primary_button"
            onClick={login}
            disabled={isLoggingIn || isInitializing}
            className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold gold-glow"
          >
            {isLoggingIn || isInitializing ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Connecting...
              </>
            ) : (
              "Log In to Admin"
            )}
          </Button>
          <div className="mt-6">
            <Link
              to="/"
              className="text-muted-foreground text-sm hover:gold-text transition-colors flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Salon
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (adminLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 gold-text animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-sm mx-auto px-6">
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">
            Access Denied
          </h1>
          <p className="text-muted-foreground text-sm mb-6">
            You don't have admin access. Please contact the salon owner.
          </p>
          <Button
            onClick={clear}
            variant="outline"
            className="gold-border gold-text"
          >
            Log Out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 glass-dark border-b border-primary/10">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-muted-foreground hover:gold-text transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <Scissors className="w-4 h-4 gold-text" />
            <span className="font-display font-semibold text-foreground">
              SANRIX SALON{" "}
              <span className="text-muted-foreground font-normal">— Admin</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            {pendingCount > 0 && (
              <Badge className="bg-warning/20 text-warning-foreground border-warning/30">
                {pendingCount} booking{pendingCount !== 1 ? "s" : ""}
              </Badge>
            )}
            <Button
              data-ocid="admin.secondary_button"
              variant="outline"
              size="sm"
              onClick={clear}
              className="gold-border gold-text hover:bg-primary/10 text-xs"
            >
              <LogOut className="w-3.5 h-3.5 mr-1.5" />
              Log Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-10">
        {/* Summary */}
        <div className="mb-8">
          <h2 className="font-display text-3xl font-bold text-foreground mb-1">
            Appointment <span className="gold-gradient italic">Bookings</span>
          </h2>
          <p className="text-muted-foreground text-sm">
            {bookingsLoading
              ? "Loading..."
              : `${bookings?.length ?? 0} total appointment${(bookings?.length ?? 0) !== 1 ? "s" : ""}`}
          </p>
        </div>

        {bookingsLoading ? (
          <div
            data-ocid="bookings.loading_state"
            className="flex items-center justify-center py-20"
          >
            <Loader2 className="w-8 h-8 gold-text animate-spin" />
          </div>
        ) : !bookings || bookings.length === 0 ? (
          <div data-ocid="bookings.empty_state" className="text-center py-20">
            <Calendar className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              No Bookings Yet
            </h3>
            <p className="text-muted-foreground text-sm">
              Appointments will appear here as clients book.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {bookings.map((booking, i) => (
              <BookingCard key={booking.id} booking={booking} index={i} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
