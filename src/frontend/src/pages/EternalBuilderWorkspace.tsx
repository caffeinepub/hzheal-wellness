import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Clock,
  ExternalLink,
  Loader2,
  Lock,
  Sparkles,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import Starfield from "../components/Starfield";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsSubscribed, useMyPaymentStatus } from "../hooks/useQueries";

const TEMPLATES = [
  {
    id: 1,
    name: "Business Pro",
    category: "Business",
    color: "rgba(138,61,255,0.3)",
    border: "rgba(138,61,255,0.5)",
  },
  {
    id: 2,
    name: "Portfolio Edge",
    category: "Portfolio",
    color: "rgba(52,214,255,0.3)",
    border: "rgba(52,214,255,0.5)",
  },
  {
    id: 3,
    name: "Shop Launch",
    category: "Ecommerce",
    color: "rgba(255,79,216,0.3)",
    border: "rgba(255,79,216,0.5)",
  },
  {
    id: 4,
    name: "Blog Modern",
    category: "Blog",
    color: "rgba(138,61,255,0.3)",
    border: "rgba(138,61,255,0.5)",
  },
  {
    id: 5,
    name: "Resto Luxe",
    category: "Restaurant",
    color: "rgba(52,214,255,0.3)",
    border: "rgba(52,214,255,0.5)",
  },
  {
    id: 6,
    name: "Agency Bold",
    category: "Agency",
    color: "rgba(255,79,216,0.3)",
    border: "rgba(255,79,216,0.5)",
  },
];

export default function EternalBuilderWorkspace() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: isSubscribed, isLoading } = useIsSubscribed();
  const { data: paymentStatus } = useMyPaymentStatus();
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 2500));
    setGenerating(false);
    setGenerated(true);
  };

  if (!identity) {
    return (
      <div
        className="min-h-screen flex items-center justify-center relative"
        style={{ background: "linear-gradient(135deg, #070A14, #0B1030)" }}
      >
        <Starfield />
        <div className="glass-card rounded-2xl p-10 text-center max-w-sm z-10 neon-border-purple">
          <Lock
            className="w-10 h-10 mx-auto mb-4"
            style={{ color: "#8A3DFF" }}
          />
          <h2 className="text-xl font-bold mb-2">Login Required</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Please log in to access your workspace.
          </p>
          <Button
            className="btn-neon w-full"
            onClick={() => navigate({ to: "/" })}
            data-ocid="workspace.primary_button"
          >
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #070A14, #0B1030)" }}
      >
        <Starfield />
        <Loader2
          className="w-8 h-8 animate-spin z-10"
          style={{ color: "#8A3DFF" }}
          data-ocid="workspace.loading_state"
        />
      </div>
    );
  }

  if (!isSubscribed) {
    return (
      <div
        className="min-h-screen flex items-center justify-center relative"
        style={{ background: "linear-gradient(135deg, #070A14, #0B1030)" }}
      >
        <Starfield />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-2xl p-10 text-center max-w-md z-10"
          style={{ border: "1px solid rgba(255,79,216,0.4)" }}
          data-ocid="workspace.error_state"
        >
          <Clock
            className="w-12 h-12 mx-auto mb-4"
            style={{ color: "#FF4FD8" }}
          />
          <h2 className="text-2xl font-bold mb-2">
            {paymentStatus === "pending"
              ? "Payment Under Review"
              : "Subscription Required"}
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            {paymentStatus === "pending"
              ? "Your payment is being verified by admin. You'll have access within 24 hours."
              : "Subscribe to the Pro Builder plan to access the AI workspace."}
          </p>
          <Button
            className="btn-neon w-full"
            onClick={() => navigate({ to: "/" })}
            data-ocid="workspace.secondary_button"
          >
            {paymentStatus === "pending" ? "Back to Home" : "Subscribe Now"}
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
              data-ocid="workspace.nav.link"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md neon-gradient flex items-center justify-center">
                <Zap className="w-3 h-3 text-white" />
              </div>
              <span className="font-bold font-display neon-gradient-text text-sm">
                AI Builder
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{
                background: "rgba(52,214,255,0.15)",
                border: "1px solid rgba(52,214,255,0.4)",
                color: "#34D6FF",
              }}
            >
              Pro Active
            </span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-4 py-10 space-y-12">
        {/* AI Prompt Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-5"
        >
          <div className="text-center">
            <h1 className="text-3xl font-bold font-display neon-gradient-text mb-2">
              AI Website Builder
            </h1>
            <p className="text-muted-foreground text-sm">
              Describe your website and let AI build it for you
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 space-y-4 neon-border-purple">
            <Textarea
              placeholder="Describe the website you want to build... e.g. 'A modern SaaS landing page for a project management tool with pricing, features, and testimonials'"
              className="min-h-32 resize-none text-sm"
              style={{
                background: "rgba(20,25,45,0.5)",
                border: "1px solid rgba(138,61,255,0.3)",
              }}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              data-ocid="workspace.textarea"
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Be specific for best results
              </p>
              <button
                type="button"
                className="btn-neon px-6 py-2.5 text-sm flex items-center gap-2"
                onClick={handleGenerate}
                disabled={generating || !prompt.trim()}
                data-ocid="workspace.primary_button"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Generate Website
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Preview Panel */}
          <div
            className="glass-card rounded-2xl overflow-hidden"
            style={{
              minHeight: "280px",
              border: "1px solid rgba(52,214,255,0.25)",
            }}
            data-ocid="workspace.canvas_target"
          >
            {generating ? (
              <div
                className="p-8 space-y-4"
                data-ocid="workspace.loading_state"
              >
                <Skeleton
                  className="h-10 w-2/3"
                  style={{ background: "rgba(138,61,255,0.15)" }}
                />
                <Skeleton
                  className="h-4 w-full"
                  style={{ background: "rgba(138,61,255,0.1)" }}
                />
                <Skeleton
                  className="h-4 w-4/5"
                  style={{ background: "rgba(138,61,255,0.1)" }}
                />
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {(["sk1", "sk2", "sk3"] as const).map((sk) => (
                    <Skeleton
                      key={sk}
                      className="h-24 rounded-xl"
                      style={{ background: "rgba(52,214,255,0.1)" }}
                    />
                  ))}
                </div>
              </div>
            ) : generated ? (
              <div className="p-8" data-ocid="workspace.success_state">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-sm font-medium text-green-400">
                      Website Generated!
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn-ghost-pill px-4 py-1.5 text-xs flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3 h-3" /> Preview
                  </button>
                </div>
                <div
                  className="rounded-xl overflow-hidden"
                  style={{
                    background: "rgba(20,25,45,0.6)",
                    border: "1px solid rgba(138,61,255,0.2)",
                  }}
                >
                  <div
                    className="px-4 py-3 flex items-center gap-2"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-400" />
                      <div className="w-2 h-2 rounded-full bg-yellow-400" />
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                    </div>
                    <div
                      className="flex-1 h-4 rounded-full mx-2"
                      style={{ background: "rgba(255,255,255,0.06)" }}
                    />
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="h-20 rounded-xl neon-gradient opacity-60 flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        AI Generated Hero Section
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {(["g1", "g2", "g3"] as const).map((gk) => (
                        <div
                          key={gk}
                          className="h-16 rounded-lg"
                          style={{
                            background: "rgba(138,61,255,0.15)",
                            border: "1px solid rgba(138,61,255,0.3)",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center p-8">
                <div className="w-16 h-16 rounded-2xl neon-gradient opacity-30 flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <p className="text-muted-foreground text-sm">
                  Website preview will appear here
                </p>
                <p className="text-muted-foreground text-xs mt-1">
                  Describe your website above and click Generate
                </p>
              </div>
            )}
          </div>
        </motion.section>

        {/* Templates Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-5"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-display">
              Starter Templates
            </h2>
            <span className="text-xs text-muted-foreground">
              6 templates available
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TEMPLATES.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="glass-card rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300"
                style={{
                  border: `1px solid ${t.border.replace("0.5", "0.3")}`,
                }}
                data-ocid={`workspace.item.${i + 1}`}
              >
                <div
                  className="h-32 flex items-center justify-center"
                  style={{ background: t.color }}
                >
                  <span className="text-xs font-semibold uppercase tracking-wider opacity-60">
                    {t.category}
                  </span>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-sm">{t.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {t.category}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn-ghost-pill px-3 py-1.5 text-xs"
                    onClick={() =>
                      setPrompt(
                        `Build a ${t.category.toLowerCase()} website similar to ${t.name} template`,
                      )
                    }
                    data-ocid="workspace.secondary_button"
                  >
                    Use Template
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>
    </div>
  );
}
