import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Loader2,
  Lock,
  ShieldCheck,
  Users,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { CryptoPayment } from "../backend";
import { Variant_pending_approved_rejected } from "../backend";
import Starfield from "../components/Starfield";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useApprovePayment,
  useIsAdmin,
  usePendingPayments,
  useRejectPayment,
} from "../hooks/useQueries";

function truncatePrincipal(p: string): string {
  if (p.length <= 16) return p;
  return `${p.slice(0, 8)}...${p.slice(-6)}`;
}

function formatDate(nanoseconds: bigint): string {
  const ms = Number(nanoseconds / 1_000_000n);
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function StatusBadge({
  status,
}: { status: Variant_pending_approved_rejected }) {
  if (status === Variant_pending_approved_rejected.approved) {
    return (
      <Badge
        className="text-xs"
        style={{
          background: "rgba(52,214,255,0.15)",
          border: "1px solid rgba(52,214,255,0.4)",
          color: "#34D6FF",
        }}
      >
        Approved
      </Badge>
    );
  }
  if (status === Variant_pending_approved_rejected.rejected) {
    return (
      <Badge
        className="text-xs"
        style={{
          background: "rgba(255,79,79,0.15)",
          border: "1px solid rgba(255,79,79,0.4)",
          color: "#ff4f4f",
        }}
      >
        Rejected
      </Badge>
    );
  }
  return (
    <Badge
      className="text-xs"
      style={{
        background: "rgba(255,200,50,0.15)",
        border: "1px solid rgba(255,200,50,0.4)",
        color: "#ffc832",
      }}
    >
      Pending
    </Badge>
  );
}

function PaymentRow({
  payment,
  onApprove,
  onReject,
  isApproving,
  isRejecting,
}: {
  payment: CryptoPayment;
  onApprove: (id: bigint) => void;
  onReject: (id: bigint) => void;
  isApproving: boolean;
  isRejecting: boolean;
}) {
  return (
    <TableRow style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <TableCell className="font-mono text-xs text-muted-foreground">
        {truncatePrincipal(payment.user.toString())}
      </TableCell>
      <TableCell className="font-mono text-xs max-w-32 truncate">
        {payment.txId}
      </TableCell>
      <TableCell>
        <Badge
          variant="outline"
          className="text-xs"
          style={{
            background:
              payment.coin === "BTC"
                ? "rgba(255,150,50,0.15)"
                : "rgba(52,214,255,0.15)",
            borderColor:
              payment.coin === "BTC"
                ? "rgba(255,150,50,0.4)"
                : "rgba(52,214,255,0.4)",
            color: payment.coin === "BTC" ? "#ff9632" : "#34D6FF",
          }}
        >
          {payment.coin}
        </Badge>
      </TableCell>
      <TableCell className="text-xs text-muted-foreground">
        {formatDate(payment.createdAt)}
      </TableCell>
      <TableCell>
        <StatusBadge status={payment.status} />
      </TableCell>
      <TableCell>
        {payment.status === Variant_pending_approved_rejected.pending && (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="h-7 text-xs"
              style={{
                background: "rgba(52,214,255,0.2)",
                border: "1px solid rgba(52,214,255,0.4)",
                color: "#34D6FF",
              }}
              onClick={() => onApprove(payment.id)}
              disabled={isApproving}
              data-ocid="admin.confirm_button"
            >
              {isApproving ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <CheckCircle2 className="w-3 h-3" />
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs"
              style={{
                border: "1px solid rgba(255,79,79,0.4)",
                color: "#ff4f4f",
                background: "rgba(255,79,79,0.1)",
              }}
              onClick={() => onReject(payment.id)}
              disabled={isRejecting}
              data-ocid="admin.delete_button"
            >
              {isRejecting ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <XCircle className="w-3 h-3" />
              )}
            </Button>
          </div>
        )}
      </TableCell>
    </TableRow>
  );
}

export default function EternalBuilderAdmin() {
  const navigate = useNavigate();
  const { identity, login } = useInternetIdentity();
  const { actor } = useActor();
  const qc = useQueryClient();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: payments = [], isLoading: paymentsLoading } =
    usePendingPayments();
  const approvePayment = useApprovePayment();
  const rejectPayment = useRejectPayment();
  const [claiming, setClaiming] = useState(false);

  const pending = payments.filter(
    (p) => p.status === Variant_pending_approved_rejected.pending,
  );
  const approved = payments.filter(
    (p) => p.status === Variant_pending_approved_rejected.approved,
  );
  const rejected = payments.filter(
    (p) => p.status === Variant_pending_approved_rejected.rejected,
  );

  const handleApprove = async (id: bigint) => {
    try {
      await approvePayment.mutateAsync(id);
      toast.success("Payment approved! User now has access.");
    } catch {
      toast.error("Failed to approve payment.");
    }
  };

  const handleReject = async (id: bigint) => {
    try {
      await rejectPayment.mutateAsync(id);
      toast.error("Payment rejected.");
    } catch {
      toast.error("Failed to reject payment.");
    }
  };

  const handleClaimAdmin = async () => {
    if (!actor) return;
    setClaiming(true);
    try {
      const success = await (actor as any).claimAdminIfNone();
      if (success) {
        toast.success("You are now the admin!");
        qc.invalidateQueries({ queryKey: ["isAdmin"] });
      } else {
        toast.error("Admin already exists. You cannot claim admin access.");
      }
    } catch {
      toast.error("Failed to claim admin access.");
    } finally {
      setClaiming(false);
    }
  };

  if (!identity) {
    return (
      <div
        className="min-h-screen flex items-center justify-center relative"
        style={{ background: "linear-gradient(135deg, #070A14, #0B1030)" }}
      >
        <Starfield />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-2xl p-10 text-center max-w-sm z-10 neon-border-purple"
        >
          <Lock
            className="w-10 h-10 mx-auto mb-4"
            style={{ color: "#8A3DFF" }}
          />
          <h2 className="text-xl font-bold mb-2">Admin Access Required</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Please log in with Internet Identity to access admin dashboard.
          </p>
          <Button
            className="btn-neon w-full"
            onClick={login}
            data-ocid="admin.primary_button"
          >
            Log In
          </Button>
        </motion.div>
      </div>
    );
  }

  if (adminLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #070A14, #0B1030)" }}
      >
        <Starfield />
        <Loader2
          className="w-8 h-8 animate-spin z-10"
          style={{ color: "#8A3DFF" }}
          data-ocid="admin.loading_state"
        />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div
        className="min-h-screen flex items-center justify-center relative"
        style={{ background: "linear-gradient(135deg, #070A14, #0B1030)" }}
      >
        <Starfield />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-2xl p-10 text-center max-w-sm z-10"
          style={{ border: "1px solid rgba(138,61,255,0.4)" }}
          data-ocid="admin.error_state"
        >
          <ShieldCheck
            className="w-10 h-10 mx-auto mb-4"
            style={{ color: "#8A3DFF" }}
          />
          <h2 className="text-xl font-bold mb-3">First Time Admin Setup</h2>
          <p className="text-muted-foreground text-sm mb-6">
            No admin has been set yet. Click below to claim admin access for
            your account. This can only be done once.
          </p>
          <Button
            className="btn-neon w-full mb-3"
            onClick={handleClaimAdmin}
            disabled={claiming}
            data-ocid="admin.primary_button"
          >
            {claiming ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" /> Claiming...
              </>
            ) : (
              "Claim Admin Access"
            )}
          </Button>
          <Button
            variant="ghost"
            className="w-full text-muted-foreground text-sm"
            onClick={() => navigate({ to: "/" })}
            data-ocid="admin.secondary_button"
          >
            Go Home
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative"
      style={{ background: "linear-gradient(135deg, #070A14, #0B1030)" }}
    >
      <Starfield />

      {/* Header */}
      <header className="sticky top-0 z-50 px-4 py-3">
        <div className="glass-header rounded-2xl max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={() => navigate({ to: "/" })}
              data-ocid="admin.nav.link"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" style={{ color: "#8A3DFF" }} />
              <span className="font-bold font-display neon-gradient-text text-sm">
                Admin Dashboard
              </span>
            </div>
          </div>
          <span
            className="text-xs px-2.5 py-1 rounded-full font-medium"
            style={{
              background: "rgba(138,61,255,0.15)",
              border: "1px solid rgba(138,61,255,0.4)",
              color: "#8A3DFF",
            }}
          >
            Admin
          </span>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-4 py-10 space-y-8">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 gap-4"
        >
          {[
            {
              label: "Pending",
              value: pending.length,
              icon: Clock,
              color: "#ffc832",
              bg: "rgba(255,200,50,0.1)",
              border: "rgba(255,200,50,0.3)",
            },
            {
              label: "Approved",
              value: approved.length,
              icon: CheckCircle2,
              color: "#34D6FF",
              bg: "rgba(52,214,255,0.1)",
              border: "rgba(52,214,255,0.3)",
            },
            {
              label: "Rejected",
              value: rejected.length,
              icon: XCircle,
              color: "#ff4f4f",
              bg: "rgba(255,79,79,0.1)",
              border: "rgba(255,79,79,0.3)",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="glass-card rounded-2xl p-5 flex items-center gap-4"
              style={{ border: `1px solid ${stat.border}` }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: stat.bg }}
              >
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: stat.color }}>
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground">
                  {stat.label} Payments
                </p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Payments Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs defaultValue="pending">
            <TabsList style={{ background: "rgba(20,25,45,0.8)" }}>
              <TabsTrigger value="pending" data-ocid="admin.tab">
                <Clock className="w-3.5 h-3.5 mr-1.5" />
                Pending ({pending.length})
              </TabsTrigger>
              <TabsTrigger value="all" data-ocid="admin.tab">
                <Users className="w-3.5 h-3.5 mr-1.5" />
                All Payments ({payments.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="mt-4">
              <div
                className="glass-card rounded-2xl overflow-hidden"
                style={{ border: "1px solid rgba(138,61,255,0.2)" }}
              >
                {paymentsLoading ? (
                  <div
                    className="p-6 space-y-3"
                    data-ocid="admin.loading_state"
                  >
                    {(["sk1", "sk2", "sk3"] as const).map((sk) => (
                      <Skeleton
                        key={sk}
                        className="h-12 rounded-xl"
                        style={{ background: "rgba(138,61,255,0.1)" }}
                      />
                    ))}
                  </div>
                ) : pending.length === 0 ? (
                  <div
                    className="flex flex-col items-center justify-center py-16 text-center"
                    data-ocid="admin.empty_state"
                  >
                    <CheckCircle2
                      className="w-10 h-10 mb-3"
                      style={{ color: "#34D6FF", opacity: 0.4 }}
                    />
                    <p className="text-muted-foreground">No pending payments</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      All caught up!
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow
                        style={{
                          borderBottom: "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        <TableHead className="text-xs text-muted-foreground">
                          User
                        </TableHead>
                        <TableHead className="text-xs text-muted-foreground">
                          Transaction ID
                        </TableHead>
                        <TableHead className="text-xs text-muted-foreground">
                          Network
                        </TableHead>
                        <TableHead className="text-xs text-muted-foreground">
                          Date
                        </TableHead>
                        <TableHead className="text-xs text-muted-foreground">
                          Status
                        </TableHead>
                        <TableHead className="text-xs text-muted-foreground">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pending.map((payment, i) => (
                        <PaymentRow
                          key={payment.id.toString()}
                          payment={payment}
                          onApprove={handleApprove}
                          onReject={handleReject}
                          isApproving={
                            approvePayment.isPending &&
                            approvePayment.variables === payment.id
                          }
                          isRejecting={
                            rejectPayment.isPending &&
                            rejectPayment.variables === payment.id
                          }
                          data-ocid={`admin.row.${i + 1}`}
                        />
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </TabsContent>

            <TabsContent value="all" className="mt-4">
              <div
                className="glass-card rounded-2xl overflow-hidden"
                style={{ border: "1px solid rgba(138,61,255,0.2)" }}
              >
                {paymentsLoading ? (
                  <div
                    className="p-6 space-y-3"
                    data-ocid="admin.loading_state"
                  >
                    {(["sk1", "sk2", "sk3"] as const).map((sk) => (
                      <Skeleton
                        key={sk}
                        className="h-12 rounded-xl"
                        style={{ background: "rgba(138,61,255,0.1)" }}
                      />
                    ))}
                  </div>
                ) : payments.length === 0 ? (
                  <div
                    className="flex flex-col items-center justify-center py-16 text-center"
                    data-ocid="admin.empty_state"
                  >
                    <Users
                      className="w-10 h-10 mb-3"
                      style={{ color: "#8A3DFF", opacity: 0.4 }}
                    />
                    <p className="text-muted-foreground">No payments yet</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow
                        style={{
                          borderBottom: "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        <TableHead className="text-xs text-muted-foreground">
                          User
                        </TableHead>
                        <TableHead className="text-xs text-muted-foreground">
                          Transaction ID
                        </TableHead>
                        <TableHead className="text-xs text-muted-foreground">
                          Network
                        </TableHead>
                        <TableHead className="text-xs text-muted-foreground">
                          Date
                        </TableHead>
                        <TableHead className="text-xs text-muted-foreground">
                          Status
                        </TableHead>
                        <TableHead className="text-xs text-muted-foreground">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.map((payment, i) => (
                        <PaymentRow
                          key={payment.id.toString()}
                          payment={payment}
                          onApprove={handleApprove}
                          onReject={handleReject}
                          isApproving={
                            approvePayment.isPending &&
                            approvePayment.variables === payment.id
                          }
                          isRejecting={
                            rejectPayment.isPending &&
                            rejectPayment.variables === payment.id
                          }
                          data-ocid={`admin.row.${i + 1}`}
                        />
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}
