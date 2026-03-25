import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  CalendarCheck,
  LogIn,
  LogOut,
  ShieldAlert,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface Booking {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  preferredDate: string;
  message: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const { actor } = useActor();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [checking, setChecking] = useState(false);

  const isLoggedIn = loginStatus === "success" && !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  useEffect(() => {
    if (!isLoggedIn || !actor) {
      setIsAdmin(null);
      return;
    }
    setChecking(true);
    actor
      .isCallerAdmin()
      .then((result: boolean) => {
        setIsAdmin(result);
        if (result) {
          (actor as any)
            .getDentalBookings()
            .then((backendBookings: any[]) => {
              const mapped = backendBookings.map((b: any) => ({
                ...b,
                createdAt: Number(BigInt(b.createdAt) / 1_000_000n).toString(),
              }));
              setBookings(mapped);
            })
            .catch(() => setBookings([]));
        }
      })
      .catch(() => setIsAdmin(false))
      .finally(() => setChecking(false));
  }, [isLoggedIn, actor]);

  const handleBack = () => {
    window.location.hash = "";
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F0E8" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-50 shadow-sm"
        style={{ backgroundColor: "#132B45" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors text-sm font-sans"
              data-ocid="admin.back.button"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Site
            </button>
            <div className="w-px h-5 bg-white/20" />
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-5 h-5" style={{ color: "#C8A463" }} />
              <span className="font-serif font-semibold text-white text-lg">
                Admin Dashboard
              </span>
            </div>
          </div>
          {isLoggedIn && (
            <button
              type="button"
              onClick={clear}
              className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors text-sm font-sans"
              data-ocid="admin.logout.button"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Not logged in */}
        {!isLoggedIn && (
          <div
            className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-10 text-center"
            data-ocid="admin.login.panel"
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: "#CFE8E6" }}
            >
              <CalendarCheck className="w-8 h-8" style={{ color: "#132B45" }} />
            </div>
            <h1
              className="font-serif text-2xl font-bold mb-2"
              style={{ color: "#132B45" }}
            >
              209 NYC Dental
            </h1>
            <p className="font-sans text-gray-500 text-sm mb-8">
              Sign in to access the appointment bookings dashboard.
            </p>
            <Button
              onClick={login}
              disabled={isLoggingIn}
              className="w-full font-sans font-semibold py-3 text-sm rounded-lg"
              style={{ backgroundColor: "#132B45", color: "white" }}
              data-ocid="admin.login.button"
            >
              {isLoggingIn ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
                  Signing In…
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Sign In with Internet Identity
                </span>
              )}
            </Button>
            <p className="font-sans text-xs text-gray-400 mt-4">
              Only authorized administrators can access this area.
            </p>
          </div>
        )}

        {/* Checking role */}
        {isLoggedIn && checking && (
          <div className="text-center py-20" data-ocid="admin.loading_state">
            <div
              className="animate-spin rounded-full h-10 w-10 border-4 mx-auto mb-4"
              style={{ borderColor: "#CFE8E6", borderTopColor: "#132B45" }}
            />
            <p className="font-sans text-gray-500">Verifying access…</p>
          </div>
        )}

        {/* Access denied */}
        {isLoggedIn && !checking && isAdmin === false && (
          <div
            className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-10 text-center"
            data-ocid="admin.error_state"
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: "#FEE2E2" }}
            >
              <ShieldAlert className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="font-serif text-xl font-bold text-gray-800 mb-2">
              Access Denied
            </h2>
            <p className="font-sans text-gray-500 text-sm mb-6">
              Your account does not have administrator privileges.
            </p>
            <Button
              variant="outline"
              onClick={clear}
              className="font-sans text-sm"
              data-ocid="admin.logout.button"
            >
              Sign Out
            </Button>
          </div>
        )}

        {/* Admin content */}
        {isLoggedIn && !checking && isAdmin === true && (
          <div data-ocid="admin.panel">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2
                  className="font-serif text-3xl font-bold"
                  style={{ color: "#132B45" }}
                >
                  Appointment Bookings
                </h2>
                <p className="font-sans text-gray-500 text-sm mt-1">
                  {bookings.length} total booking
                  {bookings.length !== 1 ? "s" : ""}
                </p>
              </div>
              <Badge
                className="font-sans text-xs px-3 py-1"
                style={{ backgroundColor: "#CFE8E6", color: "#132B45" }}
              >
                Admin Access
              </Badge>
            </div>

            {bookings.length === 0 ? (
              <div
                className="bg-white rounded-2xl shadow-sm p-16 text-center"
                data-ocid="admin.bookings.empty_state"
              >
                <CalendarCheck
                  className="w-12 h-12 mx-auto mb-4"
                  style={{ color: "#C8A463" }}
                />
                <h3
                  className="font-serif text-lg font-semibold mb-2"
                  style={{ color: "#132B45" }}
                >
                  No bookings yet
                </h3>
                <p className="font-sans text-gray-400 text-sm">
                  Appointment requests will appear here once patients submit the
                  booking form.
                </p>
              </div>
            ) : (
              <div
                className="bg-white rounded-2xl shadow-sm overflow-hidden"
                data-ocid="admin.bookings.table"
              >
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow style={{ backgroundColor: "#F5F0E8" }}>
                        <TableHead
                          className="font-sans font-semibold text-xs uppercase tracking-wide"
                          style={{ color: "#132B45" }}
                        >
                          Name
                        </TableHead>
                        <TableHead
                          className="font-sans font-semibold text-xs uppercase tracking-wide"
                          style={{ color: "#132B45" }}
                        >
                          Phone
                        </TableHead>
                        <TableHead
                          className="font-sans font-semibold text-xs uppercase tracking-wide"
                          style={{ color: "#132B45" }}
                        >
                          Email
                        </TableHead>
                        <TableHead
                          className="font-sans font-semibold text-xs uppercase tracking-wide"
                          style={{ color: "#132B45" }}
                        >
                          Service
                        </TableHead>
                        <TableHead
                          className="font-sans font-semibold text-xs uppercase tracking-wide"
                          style={{ color: "#132B45" }}
                        >
                          Preferred Date
                        </TableHead>
                        <TableHead
                          className="font-sans font-semibold text-xs uppercase tracking-wide"
                          style={{ color: "#132B45" }}
                        >
                          Message
                        </TableHead>
                        <TableHead
                          className="font-sans font-semibold text-xs uppercase tracking-wide"
                          style={{ color: "#132B45" }}
                        >
                          Submitted
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.map((booking, idx) => (
                        <TableRow
                          key={booking.id}
                          className="hover:bg-gray-50 transition-colors"
                          data-ocid={`admin.bookings.row.${idx + 1}`}
                        >
                          <TableCell className="font-sans font-medium text-gray-900">
                            {booking.name}
                          </TableCell>
                          <TableCell className="font-sans text-gray-600">
                            <a
                              href={`tel:${booking.phone}`}
                              className="hover:underline"
                              style={{ color: "#132B45" }}
                            >
                              {booking.phone}
                            </a>
                          </TableCell>
                          <TableCell className="font-sans text-gray-600">
                            <a
                              href={`mailto:${booking.email}`}
                              className="hover:underline"
                              style={{ color: "#132B45" }}
                            >
                              {booking.email}
                            </a>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className="font-sans text-xs"
                              style={{
                                backgroundColor: "#CFE8E6",
                                color: "#132B45",
                              }}
                            >
                              {booking.service}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-sans text-gray-600">
                            {formatDate(booking.preferredDate)}
                          </TableCell>
                          <TableCell
                            className="font-sans text-gray-500 text-sm max-w-xs truncate"
                            title={booking.message}
                          >
                            {booking.message || "—"}
                          </TableCell>
                          <TableCell className="font-sans text-gray-400 text-xs whitespace-nowrap">
                            {formatDateTime(booking.createdAt)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
