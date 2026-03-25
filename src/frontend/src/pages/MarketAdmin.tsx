import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Route } from "../App";
import type {
  _SERVICE as BackendService,
  CryptoPayment,
} from "../declarations/backend.did.d";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface Props {
  navigate: (r: Route) => void;
}

const MOCK_ACTIVITY = [
  {
    id: 1,
    event: "New subscriber",
    time: "2 min ago",
    detail: "User joined MarketPulse Pro",
  },
  {
    id: 2,
    event: "Signal generated",
    time: "8 min ago",
    detail: "EUR/USD LONG signal triggered",
  },
  {
    id: 3,
    event: "New subscriber",
    time: "15 min ago",
    detail: "User joined MarketPulse Pro",
  },
  {
    id: 4,
    event: "Signal generated",
    time: "22 min ago",
    detail: "XAU/USD SHORT signal triggered",
  },
  {
    id: 5,
    event: "New subscriber",
    time: "31 min ago",
    detail: "User joined MarketPulse Pro",
  },
  {
    id: 6,
    event: "New subscriber",
    time: "1 hr ago",
    detail: "User joined MarketPulse Pro",
  },
  {
    id: 7,
    event: "Signal generated",
    time: "1 hr 10 min ago",
    detail: "AAPL LONG signal triggered",
  },
  {
    id: 8,
    event: "New subscriber",
    time: "2 hrs ago",
    detail: "User joined MarketPulse Pro",
  },
];

const MOCK_SUBSCRIBER_COUNT = 142;

const ADMIN_STATS = [
  {
    label: "Total Subscribers",
    value: MOCK_SUBSCRIBER_COUNT.toString(),
    sub: "Active users",
  },
  {
    label: "Monthly Revenue",
    value: `$${MOCK_SUBSCRIBER_COUNT}`,
    sub: "$1 × subscribers",
  },
  { label: "Active Signals", value: "19", sub: "Across 4 markets" },
];

function truncate(s: string, n = 16) {
  return s.length > n ? `${s.slice(0, n)}...` : s;
}

function formatDate(ts: bigint) {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString();
}

function StatusBadge({ status }: { status: CryptoPayment["status"] }) {
  if ("pending" in status)
    return (
      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
        Pending
      </Badge>
    );
  if ("approved" in status)
    return (
      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
        Approved
      </Badge>
    );
  return (
    <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
      Rejected
    </Badge>
  );
}

export default function MarketAdmin({ navigate }: Props) {
  const { login, loginStatus, identity } = useInternetIdentity();
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();
  const isLoggedIn = loginStatus === "success" && !!identity;

  const { data: isAdmin, isLoading: checkingAdmin } = useQuery({
    queryKey: ["isAdmin"],
    queryFn: () => actor?.isCallerAdmin() ?? Promise.resolve(false),
    enabled: !!actor && !isFetching,
  });

  const { data: cryptoPayments = [] } = useQuery({
    queryKey: ["cryptoPayments"],
    queryFn: () =>
      (actor as unknown as BackendService | null)?.getCryptoPendingPayments() ??
      Promise.resolve([]),
    enabled: !!actor && !isFetching && !!isAdmin,
    refetchInterval: 30_000,
  });

  const [clearingData, setClearingData] = useState(false);
  const [actionLoading, setActionLoading] = useState<bigint | null>(null);
  const [copiedTx, setCopiedTx] = useState<bigint | null>(null);

  const handleClearData = async () => {
    if (!actor) return;
    setClearingData(true);
    try {
      await actor.clearAllData();
      queryClient.invalidateQueries();
      toast.success("All data cleared");
    } catch (_e) {
      toast.error("Failed to clear data");
    } finally {
      setClearingData(false);
    }
  };

  const handleApprove = async (id: bigint) => {
    if (!actor) return;
    setActionLoading(id);
    try {
      await (actor as unknown as BackendService).approveCryptoPayment(id);
      queryClient.invalidateQueries({ queryKey: ["cryptoPayments"] });
      toast.success("Payment approved");
    } catch (_e) {
      toast.error("Failed to approve payment");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: bigint) => {
    if (!actor) return;
    setActionLoading(id);
    try {
      await (actor as unknown as BackendService).rejectCryptoPayment(id);
      queryClient.invalidateQueries({ queryKey: ["cryptoPayments"] });
      toast.success("Payment rejected");
    } catch (_e) {
      toast.error("Failed to reject payment");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCopyTx = (id: bigint, txId: string) => {
    navigator.clipboard.writeText(txId);
    setCopiedTx(id);
    setTimeout(() => setCopiedTx(null), 2000);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card
          className="glass-card w-full max-w-sm"
          data-ocid="admin.login.modal"
        >
          <CardHeader>
            <CardTitle>Admin Access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Please log in to access the admin dashboard.
            </p>
            <Button
              className="w-full"
              onClick={login}
              data-ocid="admin.login.button"
            >
              Log In
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => navigate("landing")}
              data-ocid="admin.back.button"
            >
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (checkingAdmin) {
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center"
        data-ocid="admin.loading_state"
      >
        <div className="text-muted-foreground">Verifying access...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card
          className="glass-card w-full max-w-sm"
          data-ocid="admin.error_state"
        >
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              You do not have admin privileges.
            </p>
            <Button
              className="w-full"
              onClick={() => navigate("landing")}
              data-ocid="admin.home.button"
            >
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header
        className="sticky top-0 z-50 border-b border-border"
        style={{
          background: "oklch(0.10 0.02 240 / 0.95)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("landing")}
              className="flex items-center gap-2"
              data-ocid="header.home.link"
            >
              <div className="w-7 h-7 rounded-full bg-primary" />
              <span className="font-bold">MarketPulse</span>
            </button>
            <span className="text-xs text-muted-foreground px-2 py-0.5 rounded border border-border">
              Admin
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("dashboard")}
              data-ocid="header.dashboard.button"
            >
              Dashboard
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("landing")}
              data-ocid="header.home.button"
            >
              Home
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {ADMIN_STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="glass-card">
                <CardContent className="p-5">
                  <div className="text-3xl font-bold text-primary">
                    {stat.value}
                  </div>
                  <div className="font-medium mt-1">{stat.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {stat.sub}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Tabs defaultValue="overview" data-ocid="admin.tab">
          <TabsList className="mb-6">
            <TabsTrigger value="overview" data-ocid="admin.overview.tab">
              Overview
            </TabsTrigger>
            <TabsTrigger value="crypto" data-ocid="admin.crypto.tab">
              Crypto Payments
              {cryptoPayments.filter((p) => "pending" in p.status).length >
                0 && (
                <Badge className="ml-2 bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                  {cryptoPayments.filter((p) => "pending" in p.status).length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-base">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {MOCK_ACTIVITY.map((item, i) => (
                      <div
                        key={item.id}
                        className="px-5 py-3 flex justify-between items-start"
                        data-ocid={`activity.item.${i + 1}`}
                      >
                        <div>
                          <div className="text-sm font-medium">
                            {item.event}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {item.detail}
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                          {item.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-destructive/30">
                <CardHeader>
                  <CardTitle className="text-base text-destructive">
                    Danger Zone
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Clear all application data. This action cannot be undone.
                  </p>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={handleClearData}
                    disabled={clearingData}
                    data-ocid="admin.clear.delete_button"
                  >
                    {clearingData ? "Clearing..." : "Clear All Data"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="crypto">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">
                Crypto Payment Submissions
              </h2>
              {cryptoPayments.length === 0 ? (
                <Card className="glass-card" data-ocid="crypto.empty_state">
                  <CardContent className="p-8 text-center text-muted-foreground">
                    No payment submissions yet
                  </CardContent>
                </Card>
              ) : (
                cryptoPayments.map((payment, i) => (
                  <motion.div
                    key={String(payment.id)}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    data-ocid={`crypto.item.${i + 1}`}
                  >
                    <Card className="glass-card">
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <StatusBadge status={payment.status} />
                              <Badge
                                variant="outline"
                                className="text-xs font-mono"
                              >
                                {payment.coin}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(payment.createdAt)}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground font-mono">
                              User: {truncate(payment.user.toString(), 20)}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground font-mono">
                                TxID: {truncate(payment.txId, 24)}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleCopyTx(payment.id, payment.txId)
                                }
                                className="text-xs text-primary hover:underline"
                                data-ocid={`crypto.copy.button.${i + 1}`}
                              >
                                {copiedTx === payment.id ? "Copied!" : "Copy"}
                              </button>
                            </div>
                          </div>

                          {"pending" in payment.status && (
                            <div className="flex gap-2 shrink-0">
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => handleApprove(payment.id)}
                                disabled={actionLoading === payment.id}
                                data-ocid={`crypto.approve.button.${i + 1}`}
                              >
                                {actionLoading === payment.id
                                  ? "..."
                                  : "Approve"}
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleReject(payment.id)}
                                disabled={actionLoading === payment.id}
                                data-ocid={`crypto.reject.button.${i + 1}`}
                              >
                                {actionLoading === payment.id
                                  ? "..."
                                  : "Reject"}
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer
        className="border-t border-border py-6 px-4 mt-8"
        style={{ background: "oklch(0.10 0.02 240)" }}
      >
        <div className="container mx-auto">
          <p className="text-xs text-muted-foreground text-center">
            &copy; {new Date().getFullYear()}{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Built with love using caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
