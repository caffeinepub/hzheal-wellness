import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import {
  Bot,
  ChevronRight,
  Code2,
  Globe,
  Layers,
  Layout,
  Move,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import PaymentModal from "../components/PaymentModal";
import Starfield from "../components/Starfield";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const FEATURES = [
  {
    icon: Bot,
    title: "AI Website Generation",
    desc: "Describe your vision in plain text. Our AI instantly generates a complete, production-ready website tailored to your needs.",
    glow: "neon-border-purple",
  },
  {
    icon: Layout,
    title: "100+ Templates",
    desc: "Kickstart with professionally designed templates for every industry — from startups to agencies.",
    glow: "neon-border-cyan",
  },
  {
    icon: Move,
    title: "Drag & Drop Editor",
    desc: "Fine-tune every element with an intuitive visual editor. No coding skills required.",
    glow: "neon-border-purple",
  },
  {
    icon: Globe,
    title: "Global Hosting",
    desc: "Deploy your website globally in one click. Ultra-fast CDN, 99.9% uptime, and SSL included.",
    glow: "neon-border-cyan",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Describe Your Website",
    desc: "Tell our AI what kind of website you want — your industry, style, and key features.",
  },
  {
    step: "02",
    title: "AI Generates It",
    desc: "Watch as our AI crafts a complete website with pages, sections, and content tailored for you.",
  },
  {
    step: "03",
    title: "Customize & Publish",
    desc: "Refine the design, add your branding, and publish live with a single click.",
  },
];

const PLAN_FEATURES = [
  "Unlimited AI generations",
  "100+ premium templates",
  "Custom domain support",
  "Global CDN hosting",
  "Drag & drop editor",
  "Priority support",
];

export default function EternalBuilderLanding() {
  const navigate = useNavigate();
  const [paymentOpen, setPaymentOpen] = useState(false);
  const { identity, clear } = useInternetIdentity();

  return (
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={{
        background: "linear-gradient(135deg, #070A14 0%, #0B1030 100%)",
      }}
    >
      <Starfield />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
        <nav className="glass-header rounded-2xl max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg neon-gradient flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg font-display neon-gradient-text">
              Eternal Builder
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {["Features", "Pricing", "How It Works"].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(" ", "-")}`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-ocid="nav.link"
              >
                {link}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="btn-ghost-pill text-xs hidden sm:flex"
              onClick={() => navigate({ to: "/admin" })}
              data-ocid="nav.admin_button"
            >
              Admin
            </Button>
            {identity ? (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  className="btn-ghost-pill text-xs"
                  onClick={() => navigate({ to: "/workspace" })}
                  data-ocid="nav.workspace_button"
                >
                  My Builder
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs text-muted-foreground"
                  onClick={clear}
                  data-ocid="nav.logout_button"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <button
                type="button"
                className="btn-neon px-5 py-2 text-sm"
                onClick={() => setPaymentOpen(true)}
                data-ocid="nav.primary_button"
              >
                Get Started
              </button>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-xs font-medium"
              style={{ border: "1px solid rgba(138,61,255,0.4)" }}
            >
              <Sparkles className="w-3 h-3 text-neon-purple" />
              <span className="neon-gradient-text">Powered by Advanced AI</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold font-display leading-tight">
              Build Your Website with the{" "}
              <span className="neon-gradient-text">Power of AI</span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Describe your dream website in plain language. Our AI builds it in
              seconds. No coding. No design skills. Just results.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="btn-neon px-8 py-3 text-base flex items-center gap-2"
                onClick={() => setPaymentOpen(true)}
                data-ocid="hero.primary_button"
              >
                Start Building Free
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="btn-ghost-pill px-8 py-3 text-base flex items-center gap-2"
                onClick={() =>
                  document
                    .getElementById("how-it-works")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                data-ocid="hero.secondary_button"
              >
                Watch Demo
              </button>
            </div>

            <div className="flex items-center gap-6 pt-2">
              <div className="flex -space-x-2">
                {["p1-#8A3DFF", "c-#34D6FF", "pk-#FF4FD8", "p2-#8A3DFF"].map(
                  (colorKey) => (
                    <div
                      key={colorKey}
                      className="w-8 h-8 rounded-full border-2 border-background"
                      style={{
                        background: colorKey.split("-").slice(1).join("-"),
                      }}
                    />
                  ),
                )}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {(["s1", "s2", "s3", "s4", "s5"] as const).map((sk) => (
                    <Star
                      key={sk}
                      className="w-3 h-3 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Trusted by 10,000+ builders
                </p>
              </div>
            </div>
          </motion.div>

          {/* Floating UI Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative hidden md:flex items-center justify-center"
          >
            {/* Orbit rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-80 h-80 rounded-full"
                style={{
                  border: "1px solid rgba(138,61,255,0.25)",
                  animation: "orbit-ring 20s linear infinite",
                }}
              />
              <div
                className="absolute w-56 h-56 rounded-full"
                style={{
                  border: "1px solid rgba(52,214,255,0.2)",
                  animation: "orbit-ring 14s linear infinite reverse",
                }}
              />
            </div>

            {/* Main mockup card */}
            <div className="animate-float relative z-10 glass-card rounded-2xl p-5 w-72 neon-border-purple">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <div className="w-2 h-2 rounded-full bg-yellow-400" />
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                </div>
                <div
                  className="flex-1 h-4 rounded-full"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                />
              </div>
              <div className="space-y-2">
                <div className="h-16 rounded-xl neon-gradient opacity-80 flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">
                    AI Generated Hero
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {["purple", "cyan", "pink"].map((c) => (
                    <div
                      key={c}
                      className="h-10 rounded-lg"
                      style={{
                        background:
                          c === "purple"
                            ? "rgba(138,61,255,0.3)"
                            : c === "cyan"
                              ? "rgba(52,214,255,0.3)"
                              : "rgba(255,79,216,0.3)",
                        border: `1px solid ${
                          c === "purple"
                            ? "rgba(138,61,255,0.5)"
                            : c === "cyan"
                              ? "rgba(52,214,255,0.5)"
                              : "rgba(255,79,216,0.5)"
                        }`,
                      }}
                    />
                  ))}
                </div>
                <div
                  className="h-2 w-3/4 rounded-full"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                />
                <div
                  className="h-2 w-1/2 rounded-full"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                />
              </div>
            </div>

            {/* Floating mini-cards */}
            <div
              className="animate-float-delayed absolute -top-4 -right-4 glass-card rounded-xl p-3 neon-border-cyan"
              style={{ zIndex: 20 }}
            >
              <div className="flex items-center gap-2">
                <Code2
                  className="w-4 h-4 text-neon-cyan"
                  style={{ color: "#34D6FF" }}
                />
                <span className="text-xs font-semibold">99 templates</span>
              </div>
            </div>

            <div
              className="animate-float absolute -bottom-4 -left-4 glass-card rounded-xl p-3"
              style={{
                border: "1px solid rgba(255,79,216,0.4)",
                zIndex: 20,
                animationDelay: "0.8s",
              }}
            >
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4" style={{ color: "#FF4FD8" }} />
                <span className="text-xs font-semibold">Live Deploy</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trusted by strip */}
      <section className="relative z-10 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="glass-card rounded-2xl px-8 py-6 flex flex-wrap items-center justify-center gap-8">
            <p className="text-muted-foreground text-sm font-medium">
              Trusted by leading companies
            </p>
            {["TechFlow", "BuildCo", "LaunchPad", "PixelStudio"].map((name) => (
              <span
                key={name}
                className="text-muted-foreground font-semibold text-sm opacity-50 hover:opacity-100 transition-opacity"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold font-display mb-4">
              Everything You Need to{" "}
              <span className="neon-gradient-text">Build Faster</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A complete suite of AI-powered tools to design, build, and launch
              your website.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`glass-card rounded-2xl p-6 space-y-3 ${f.glow} hover:scale-105 transition-transform duration-300`}
              >
                <div className="w-10 h-10 rounded-xl neon-gradient flex items-center justify-center">
                  <f.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-base">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative z-10 py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold font-display mb-4">
              How It <span className="neon-gradient-text">Works</span>
            </h2>
            <p className="text-muted-foreground">
              Three simple steps to your dream website.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            <div
              className="hidden md:block absolute top-10 left-1/4 right-1/4 h-px"
              style={{
                background:
                  "linear-gradient(90deg, rgba(138,61,255,0.5), rgba(52,214,255,0.5))",
              }}
            />
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="glass-card rounded-2xl p-7 text-center space-y-4"
              >
                <div className="w-14 h-14 rounded-full neon-gradient mx-auto flex items-center justify-center text-xl font-bold text-white">
                  {step.step}
                </div>
                <h3 className="font-semibold text-lg">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 py-24 px-4">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold font-display mb-4">
              Simple <span className="neon-gradient-text">Pricing</span>
            </h2>
            <p className="text-muted-foreground">
              One plan, unlimited possibilities.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card rounded-3xl p-8 animate-pulse-glow"
            style={{ border: "1px solid rgba(138,61,255,0.5)" }}
          >
            <div className="text-center mb-6">
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4"
                style={{
                  background: "rgba(138,61,255,0.2)",
                  border: "1px solid rgba(138,61,255,0.4)",
                }}
              >
                <Sparkles className="w-3 h-3" style={{ color: "#8A3DFF" }} />
                <span className="neon-gradient-text">Most Popular</span>
              </div>
              <h3 className="text-2xl font-bold font-display">Pro Builder</h3>
              <div className="flex items-baseline justify-center gap-1 mt-3">
                <span className="text-5xl font-bold neon-gradient-text">
                  $5
                </span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Pay via Bitcoin or USDT
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              {PLAN_FEATURES.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full neon-gradient flex items-center justify-center shrink-0">
                    <svg
                      role="img"
                      aria-label="Check"
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <title>Check</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              className="btn-neon w-full py-3 text-base font-semibold"
              onClick={() => setPaymentOpen(true)}
              data-ocid="pricing.primary_button"
            >
              Subscribe Now — $5/mo
            </button>

            <p className="text-xs text-muted-foreground text-center mt-3">
              Pay with BTC or USDT • Instant access after submission
            </p>
          </motion.div>

          {/* Admin Dashboard CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 glass-card rounded-2xl p-6 text-center"
            style={{ border: "1px solid rgba(138,61,255,0.25)" }}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg neon-gradient flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-sm">Site Owner / Admin?</span>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Access your admin dashboard to manage subscriptions and payments.
            </p>
            <Button
              variant="outline"
              className="btn-ghost-pill text-xs w-full"
              onClick={() => navigate({ to: "/admin" })}
              data-ocid="pricing.admin_button"
            >
              Go to Admin Dashboard
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="relative z-10 py-12 px-4 mt-8"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg neon-gradient flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-bold font-display neon-gradient-text">
                  Eternal Builder
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Build professional websites with AI in minutes.
              </p>
            </div>
            {[
              {
                title: "Product",
                links: ["Features", "Templates", "Pricing", "Changelog"],
              },
              {
                title: "Company",
                links: ["About", "Blog", "Careers", "Contact"],
              },
              {
                title: "Legal",
                links: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-semibold text-sm mb-3">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                        {link}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div
            className="pt-6"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <p className="text-xs text-muted-foreground text-center">
              © {new Date().getFullYear()}. Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>

      <PaymentModal open={paymentOpen} onClose={() => setPaymentOpen(false)} />

      <style>{`
        @keyframes orbit-ring {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
