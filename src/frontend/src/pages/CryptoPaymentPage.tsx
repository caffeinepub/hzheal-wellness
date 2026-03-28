import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import type { Route } from "../App";
// Legacy declarations removed
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const BTC_ADDRESS = "bc1qjul98jt5seacq6ljkrc28ueew69sz79x2m72vm";
const TRC20_ADDRESS = "TV1v2KY7SDmjQE5affXYDsaML3KvKPFDLR";

interface Props {
  navigate: (r: Route) => void;
}

export default function CryptoPaymentPage({ navigate }: Props) {
  const { login, loginStatus, identity } = useInternetIdentity();
  const { actor, isFetching } = useActor();
  const isLoggedIn = loginStatus === "success" && !!identity;

  const [txId, setTxId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState<"btc" | "trc20" | null>(null);
  const [selectedCoin, setSelectedCoin] = useState<"BTC" | "TRC20">("BTC");

  const { data: isSubscribed } = useQuery({
    queryKey: ["isSubscribed"],
    queryFn: () => actor?.isSubscribed() ?? Promise.resolve(false),
    enabled: !!actor && !isFetching && isLoggedIn,
  });

  const { data: paymentStatus } = useQuery({
    queryKey: ["paymentStatus"],
    queryFn: async (): Promise<unknown[]> => {
      const svc = actor as any;
      if (!svc) return [];
      return svc.getMyPaymentStatus();
    },
    enabled: !!actor && !isFetching && isLoggedIn,
  });

  const isPending =
    Array.isArray(paymentStatus) &&
    paymentStatus.length > 0 &&
    paymentStatus[0] !== null &&
    paymentStatus[0] !== undefined &&
    "pending" in (paymentStatus[0] as object);

  const handleCopy = useCallback((type: "btc" | "trc20") => {
    const addr = type === "btc" ? BTC_ADDRESS : TRC20_ADDRESS;
    navigator.clipboard.writeText(addr).then(() => {
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!actor || !txId.trim()) return;
    setSubmitting(true);
    try {
      await (actor as any).submitCryptoPayment(txId.trim(), selectedCoin);
      setSubmitted(true);
      toast.success("Payment submitted! Awaiting admin verification.");
    } catch (_e) {
      toast.error("Failed to submit payment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [actor, txId, selectedCoin]);

  const currentAddress = selectedCoin === "BTC" ? BTC_ADDRESS : TRC20_ADDRESS;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header
        className="sticky top-0 z-50 border-b border-border"
        style={{
          background: "oklch(0.10 0.02 240 / 0.95)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("landing")}
            className="flex items-center gap-2"
            data-ocid="payment.home.link"
          >
            <div className="w-7 h-7 rounded-full bg-primary" />
            <span className="font-bold">MarketPulse</span>
          </button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("landing")}
            data-ocid="payment.back.button"
          >
            ← Back to Home
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Subscribe with Crypto</h1>
            <p className="text-muted-foreground">
              $1 / month — Pay in Bitcoin (BTC) or TRC-20 (USDT)
            </p>
          </div>

          {/* Already subscribed */}
          {isLoggedIn && isSubscribed && (
            <Card
              className="glass-card border-green-500/30"
              data-ocid="payment.success_state"
            >
              <CardContent className="p-6 text-center space-y-4">
                <div className="text-4xl">✅</div>
                <p className="font-semibold text-lg">
                  You already have active access!
                </p>
                <Button
                  className="w-full bg-primary"
                  onClick={() => navigate("dashboard")}
                  data-ocid="payment.dashboard.button"
                >
                  Go to Dashboard
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Payment pending */}
          {isLoggedIn && !isSubscribed && (isPending || submitted) && (
            <Card
              className="glass-card border-yellow-500/30"
              data-ocid="payment.pending.panel"
            >
              <CardContent className="p-6 text-center space-y-4">
                <div className="text-4xl">⏳</div>
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                  Pending Verification
                </Badge>
                <p className="font-semibold">
                  {submitted
                    ? "Payment submitted! Your access will be activated within 24 hours after admin verification."
                    : "Payment pending verification. Access will be activated within 24 hours."}
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("landing")}
                  data-ocid="payment.back2.button"
                >
                  Back to Home
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Payment form - always visible */}
          {!(isLoggedIn && isSubscribed) &&
            !(isLoggedIn && !isSubscribed && (isPending || submitted)) && (
              <Card className="glass-card" data-ocid="payment.panel">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-orange-400">₿</span> Crypto Payment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Coin selector */}
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                      Select Coin
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedCoin("BTC")}
                        className={
                          selectedCoin === "BTC"
                            ? "border-orange-500/50 text-orange-400 bg-orange-500/10"
                            : ""
                        }
                        data-ocid="payment.btc.toggle"
                      >
                        ₿ BTC
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedCoin("TRC20")}
                        className={
                          selectedCoin === "TRC20"
                            ? "border-green-500/50 text-green-400 bg-green-500/10"
                            : ""
                        }
                        data-ocid="payment.trc20.toggle"
                      >
                        ₮ TRC-20 (USDT)
                      </Button>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                      {selectedCoin === "BTC"
                        ? "BTC Wallet Address"
                        : "TRC-20 (USDT) Wallet Address"}
                    </p>
                    <div className="flex gap-2">
                      <div
                        className="flex-1 bg-muted/40 border border-border rounded-md px-3 py-2 text-xs font-mono break-all"
                        data-ocid="payment.address.panel"
                      >
                        {currentAddress}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleCopy(selectedCoin === "BTC" ? "btc" : "trc20")
                        }
                        className="shrink-0"
                        data-ocid="payment.copy.button"
                      >
                        {copied === (selectedCoin === "BTC" ? "btc" : "trc20")
                          ? "Copied!"
                          : "Copy"}
                      </Button>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <p className="text-sm text-blue-300">
                      Send exactly{" "}
                      <strong>
                        $1 worth of{" "}
                        {selectedCoin === "BTC" ? "BTC" : "USDT (TRC-20)"}
                      </strong>{" "}
                      to the address above. After sending, log in and paste your
                      Transaction ID below.
                    </p>
                  </div>

                  {/* Transaction ID submission - requires login */}
                  {!isLoggedIn ? (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground text-center">
                        After sending payment, log in to submit your Transaction
                        ID for verification.
                      </p>
                      <Button
                        className="w-full bg-primary"
                        onClick={login}
                        data-ocid="payment.login.button"
                      >
                        Log In to Submit Payment
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">
                          Transaction ID
                        </p>
                        <Input
                          placeholder="Paste your transaction ID here..."
                          value={txId}
                          onChange={(e) => setTxId(e.target.value)}
                          className="font-mono text-sm"
                          data-ocid="payment.txid.input"
                        />
                      </div>

                      <Button
                        className="w-full bg-primary glow-blue"
                        size="lg"
                        onClick={handleSubmit}
                        disabled={submitting || !txId.trim()}
                        data-ocid="payment.submit.button"
                      >
                        {submitting ? "Submitting..." : "Submit Payment"}
                      </Button>
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground text-center">
                    Admin will verify your payment within 24 hours and activate
                    your access.
                  </p>
                </CardContent>
              </Card>
            )}
        </motion.div>
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
