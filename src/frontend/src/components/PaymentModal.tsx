import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Copy, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useSubmitPayment } from "../hooks/useQueries";
import SimpleQRCode from "./SimpleQRCode";

const BTC_ADDRESS = "bc1qjul98jt5seacq6ljkrc28ueew69sz79x2m72vm";
const USDT_ADDRESS = "0x2eB62C0f593eD713b5338c456702C70493834fbB";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
}

export default function PaymentModal({ open, onClose }: PaymentModalProps) {
  const { identity, login } = useInternetIdentity();
  const navigate = useNavigate();
  const [txId, setTxId] = useState("");
  const [coin, setCoin] = useState("BTC");
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const submitPayment = useSubmitPayment();

  const address = coin === "BTC" ? BTC_ADDRESS : USDT_ADDRESS;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
    toast.success("Address copied!");
  };

  const handleSubmit = async () => {
    if (!identity) {
      login();
      return;
    }
    if (!txId.trim()) {
      toast.error("Please enter your Transaction ID");
      return;
    }
    try {
      await submitPayment.mutateAsync({ txId: txId.trim(), coin });
      setSubmitted(true);
    } catch {
      toast.error("Failed to submit payment. Please try again.");
    }
  };

  const handleGoToBuilder = () => {
    onClose();
    navigate({ to: "/workspace" });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-md glass-card border-0 text-foreground"
        style={{
          background: "rgba(10, 12, 30, 0.97)",
          border: "1px solid rgba(138, 61, 255, 0.4)",
        }}
        data-ocid="payment.dialog"
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold neon-gradient-text">
            Subscribe to Eternal Builder
          </DialogTitle>
        </DialogHeader>

        {submitted ? (
          <div
            className="flex flex-col items-center gap-4 py-6 text-center"
            data-ocid="payment.success_state"
          >
            <div className="w-16 h-16 rounded-full neon-gradient flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              🎉 Access Granted!
            </h3>
            <p className="text-muted-foreground text-sm">
              Your payment has been verified. You can now start building your
              website with AI immediately!
            </p>
            <Button
              className="btn-neon px-8 py-3 text-base w-full"
              onClick={handleGoToBuilder}
              data-ocid="payment.primary_button"
            >
              Go to Builder →
            </Button>
          </div>
        ) : (
          <div className="space-y-5">
            <Tabs value={coin} onValueChange={setCoin}>
              <TabsList
                className="w-full"
                style={{ background: "rgba(20,25,45,0.8)" }}
              >
                <TabsTrigger
                  value="BTC"
                  className="flex-1"
                  data-ocid="payment.tab"
                >
                  ₿ Bitcoin (BTC)
                </TabsTrigger>
                <TabsTrigger
                  value="USDT_ERC20"
                  className="flex-1"
                  data-ocid="payment.tab"
                >
                  ◈ USDT (ERC20)
                </TabsTrigger>
              </TabsList>

              <TabsContent value={coin} className="mt-4">
                <div className="flex flex-col items-center gap-4">
                  <div
                    className="p-3 rounded-xl"
                    style={{
                      background: "white",
                      boxShadow: "0 0 30px rgba(138,61,255,0.3)",
                    }}
                  >
                    <SimpleQRCode value={address} size={160} />
                  </div>

                  <div className="w-full">
                    <Label className="text-xs text-muted-foreground mb-1 block">
                      {coin === "BTC" ? "Bitcoin" : "USDT ERC20"} Address
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        readOnly
                        value={address}
                        className="text-xs font-mono"
                        style={{
                          background: "rgba(20,25,45,0.8)",
                          border: "1px solid rgba(138,61,255,0.3)",
                        }}
                      />
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleCopy(address, "addr")}
                        className="shrink-0"
                        style={{
                          border: "1px solid rgba(138,61,255,0.4)",
                          background: "transparent",
                        }}
                      >
                        {copied === "addr" ? (
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground text-center">
                    Send exactly{" "}
                    <span className="neon-gradient-text font-bold">
                      $5 worth of {coin === "BTC" ? "Bitcoin" : "USDT"}
                    </span>{" "}
                    to this address, then submit your Transaction ID below.
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            <div className="space-y-2">
              <Label htmlFor="txid" className="text-sm font-medium">
                Transaction ID
              </Label>
              <Input
                id="txid"
                placeholder="Enter your Transaction ID..."
                value={txId}
                onChange={(e) => setTxId(e.target.value)}
                className="font-mono text-sm"
                style={{
                  background: "rgba(20,25,45,0.8)",
                  border: "1px solid rgba(138,61,255,0.3)",
                }}
                data-ocid="payment.input"
              />
            </div>

            {!identity ? (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground text-center">
                  Please log in to submit your payment proof.
                </p>
                <Button
                  className="w-full btn-neon"
                  onClick={() => login()}
                  data-ocid="payment.primary_button"
                >
                  Log In to Submit
                </Button>
              </div>
            ) : (
              <Button
                className="w-full btn-neon"
                onClick={handleSubmit}
                disabled={submitPayment.isPending}
                data-ocid="payment.submit_button"
              >
                {submitPayment.isPending && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Submit Payment & Get Instant Access
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
