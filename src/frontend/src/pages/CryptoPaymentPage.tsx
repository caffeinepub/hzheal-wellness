import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import type { Route } from "../App";
import type {
  _SERVICE as BackendService,
  CryptoPaymentStatus,
} from "../declarations/backend.did.d";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const BTC_ADDRESS = "bc1qjul98jt5seacq6ljkrc28ueew69sz79x2m72vm";
const QR_IMAGE =
  "/assets/uploads/screenshot_20260325-182124-019d250d-e4fa-7168-a7e9-9a55a3f1456f-2.png";

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
  const [copied, setCopied] = useState(false);

  const { data: isSubscribed } = useQuery({
    queryKey: ["isSubscribed"],
    queryFn: () => actor?.isSubscribed() ?? Promise.resolve(false),
    enabled: !!actor && !isFetching && isLoggedIn,
  });

  const { data: paymentStatus } = useQuery({
    queryKey: ["paymentStatus"],
    queryFn: async (): Promise<[] | [CryptoPaymentStatus]> => {
      const svc = actor as unknown as BackendService | null;
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
    "pending" in (paymentStatus[0] as CryptoPaymentStatus);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(BTC_ADDRESS).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!actor || !txId.trim()) return;
    setSubmitting(true);
    try {
      await (actor as unknown as BackendService).submitCryptoPayment(
        txId.trim(),
        "BTC",
      );
      setSubmitted(true);
      toast.success("Payment submitted! Awaiting admin verification.");
    } catch (_e) {
      toast.error("Failed to submit payment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [actor, txId]);

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
              $1 / month — Pay in Bitcoin (BTC)
            </p>
          </div>

          {/* Not logged in */}
          {!isLoggedIn && (
            <Card className="glass-card" data-ocid="payment.login.modal">
              <CardHeader>
                <CardTitle>Login Required</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Please log in to subscribe with crypto.
                </p>
                <Button
                  className="w-full bg-primary"
                  onClick={login}
                  data-ocid="payment.login.button"
                >
                  Log In
                </Button>
              </CardContent>
            </Card>
          )}

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

          {/* Payment form */}
          {isLoggedIn && !isSubscribed && !isPending && !submitted && (
            <Card className="glass-card" data-ocid="payment.panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-orange-400">₿</span> Bitcoin (BTC)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* QR Code */}
                <div className="flex flex-col items-center gap-3">
                  <div className="bg-white p-3 rounded-xl">
                    <img
                      src={QR_IMAGE}
                      alt="BTC Wallet QR Code"
                      className="w-48 h-48 object-contain"
                    />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Scan QR or copy address below
                  </Badge>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    BTC Wallet Address
                  </p>
                  <div className="flex gap-2">
                    <div
                      className="flex-1 bg-muted/40 border border-border rounded-md px-3 py-2 text-xs font-mono break-all"
                      data-ocid="payment.address.panel"
                    >
                      {BTC_ADDRESS}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCopy}
                      className="shrink-0"
                      data-ocid="payment.copy.button"
                    >
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <p className="text-sm text-blue-300">
                    Send exactly <strong>$1 worth of BTC</strong> to the address
                    above. After sending, paste your Transaction ID below.
                  </p>
                </div>

                {/* Coin selector (BTC only) */}
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Coin
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-orange-500/50 text-orange-400 bg-orange-500/10"
                      data-ocid="payment.btc.toggle"
                    >
                      ₿ BTC
                    </Button>
                  </div>
                </div>

                {/* Transaction ID */}
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Transaction ID
                  </p>
                  <Input
                    placeholder="Paste your BTC transaction ID here..."
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
