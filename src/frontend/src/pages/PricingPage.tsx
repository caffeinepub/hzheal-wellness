import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Page } from "../App";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const FEATURES = [
  "Unlimited virtual try-ons per day",
  "Access to full clothing catalog (500+ items)",
  "Save & share your favorite looks",
  "Premium AI style recommendations",
  "Early access to new collections",
  "Priority customer support",
  "Multi-device sync",
];

interface PricingPageProps {
  onNavigate: (page: Page) => void;
  isLoggedIn: boolean;
  isSubscribed: boolean;
}

export default function PricingPage({
  onNavigate,
  isLoggedIn,
  isSubscribed,
}: PricingPageProps) {
  const [isActivating, setIsActivating] = useState(false);
  const { actor } = useActor();
  const { login } = useInternetIdentity();

  const handleSubscribe = async () => {
    if (!isLoggedIn) {
      toast.info("Please log in first to subscribe.");
      login();
      return;
    }

    if (!actor) {
      toast.error("Connection error. Please try again.");
      return;
    }

    setIsActivating(true);
    try {
      await actor.activateSubscription();
      toast.success("Subscription activated! Enjoy unlimited try-ons.");
    } catch {
      toast.error("Failed to activate subscription. Please try again.");
    } finally {
      setIsActivating(false);
    }
  };

  return (
    <div className="min-h-screen">
      <SiteHeader
        currentPage="pricing"
        onNavigate={onNavigate}
        isLoggedIn={isLoggedIn}
      />

      <main className="pt-24 pb-20 px-6 max-w-[1200px] mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold tracking-widest text-neon-purple uppercase mb-4">
            PRICING
          </p>
          <h1 className="font-display text-5xl font-bold mb-4">
            Start Looking Your Best
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            One simple, affordable plan. Unlimited access to every feature.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="gradient-border rounded-2xl p-10 max-w-md w-full"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 btn-gradient rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-display text-2xl font-bold mb-1">
                FitAI Pro
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                Everything you need for unlimited style
              </p>
              <div className="flex items-end justify-center gap-2">
                <span className="font-display text-7xl font-bold gradient-text-fitai">
                  $10
                </span>
                <span className="text-muted-foreground text-xl mb-3">
                  / month
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Billed monthly. Cancel anytime.
              </p>
            </div>

            <ul className="space-y-3.5 mb-8">
              {FEATURES.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-neon-cyan flex-shrink-0" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            {isSubscribed ? (
              <div
                className="text-center py-3 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan text-sm font-medium"
                data-ocid="pricing.success_state"
              >
                ✓ You're subscribed to FitAI Pro
              </div>
            ) : (
              <Button
                size="lg"
                onClick={handleSubscribe}
                disabled={isActivating}
                className="w-full btn-gradient text-white border-0 rounded-full font-semibold text-base"
                data-ocid="pricing.primary_button"
              >
                {isActivating ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />{" "}
                    Activating...
                  </>
                ) : (
                  <>Get Started — $10/mo</>
                )}
              </Button>
            )}

            <p className="text-center text-xs text-muted-foreground mt-4">
              Log in to get instant access. No hidden fees.
            </p>
          </motion.div>
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-2xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Can I cancel anytime?",
                a: "Yes! Cancel your subscription at any time with no penalties. You keep access until the end of your billing period.",
              },
              {
                q: "How does the AI try-on work?",
                a: "FitAI uses your device camera to create a live overlay of clothing items on your body in real time using computer vision.",
              },
              {
                q: "Is my camera data stored?",
                a: "No. All camera processing happens on your device. We never store or transmit your camera feed.",
              },
              {
                q: "How do I get access after subscribing?",
                a: "Once you log in and activate your subscription, you get instant unlimited access to all features.",
              },
            ].map((item) => (
              <div key={item.q} className="card-dark rounded-xl p-5">
                <h3 className="font-medium text-sm mb-2">{item.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
