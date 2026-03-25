import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Shield, Sparkles, Zap } from "lucide-react";
import { motion } from "motion/react";
import type { Page } from "../App";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";

const staticCatalog = [
  {
    name: "Classic White Tee",
    category: "Tops",
    image: "/assets/generated/clothing-top-1.dim_400x400.jpg",
  },
  {
    name: "Floral Summer Dress",
    category: "Dresses",
    image: "/assets/generated/clothing-dress-1.dim_400x400.jpg",
  },
  {
    name: "Slim Dark Jeans",
    category: "Bottoms",
    image: "/assets/generated/clothing-bottom-1.dim_400x400.jpg",
  },
  {
    name: "Leather Crossbody Bag",
    category: "Accessories",
    image: "/assets/generated/clothing-accessory-1.dim_400x400.jpg",
  },
];

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Try-On",
    desc: "See exactly how clothes look on you with cutting-edge AI overlay technology.",
  },
  {
    icon: Zap,
    title: "Real-Time Preview",
    desc: "Instant rendering directly through your device camera—no upload delays.",
  },
  {
    icon: Shield,
    title: "Private & Secure",
    desc: "All processing happens on-device. Your images never leave your phone.",
  },
];

const pricingFeatures = [
  "Unlimited virtual try-ons per day",
  "Access to full clothing catalog (500+ items)",
  "Save and share your favorite looks",
  "Premium style recommendations",
  "Early access to new collections",
  "Priority customer support",
];

interface LandingPageProps {
  onNavigate: (page: Page) => void;
  isLoggedIn: boolean;
  isSubscribed: boolean;
}

export default function LandingPage({
  onNavigate,
  isLoggedIn,
  isSubscribed,
}: LandingPageProps) {
  return (
    <div className="min-h-screen">
      <SiteHeader
        currentPage="landing"
        onNavigate={onNavigate}
        isLoggedIn={isLoggedIn}
      />

      {/* Hero */}
      <section className="pt-24 pb-20 px-6 max-w-[1200px] mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Badge className="mb-6 bg-primary/10 text-neon-fuchsia border-primary/20 rounded-full px-3 py-1">
              ✨ AI-Powered Fashion Technology
            </Badge>
            <h1 className="font-display text-5xl md:text-6xl font-bold leading-tight mb-6">
              Your Virtual{" "}
              <span className="gradient-text-fitai">Dressing Room</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Try on thousands of outfits instantly using your phone camera. No
              more guessing — see exactly how clothes look on you before you
              buy.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                onClick={() => onNavigate("tryon")}
                className="btn-gradient text-white border-0 rounded-full px-8 font-semibold text-base"
                data-ocid="landing.primary_button"
              >
                Try On Now <Sparkles className="ml-2 w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => onNavigate("catalog")}
                className="text-muted-foreground hover:text-foreground rounded-full"
                data-ocid="landing.secondary_button"
              >
                See How It Works <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-10 flex gap-8">
              {[
                ["50K+", "Users"],
                ["500+", "Styles"],
                ["4.9★", "Rating"],
              ].map(([val, label]) => (
                <div key={label}>
                  <div className="text-2xl font-display font-bold gradient-text-fitai">
                    {val}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative flex justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl neon-glow-fuchsia blur-xl opacity-40" />
              <img
                src="/assets/generated/hero-model.dim_600x700.jpg"
                alt="Virtual try-on model"
                className="relative rounded-2xl w-full max-w-[420px] object-cover shadow-glow"
              />
              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 surface-panel rounded-xl p-3 flex items-center gap-2">
                <div className="w-8 h-8 btn-gradient rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-xs font-semibold">Live Try-On</div>
                  <div className="text-xs text-muted-foreground">
                    Real-time AI
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Value Prop */}
      <section className="py-20 px-6">
        <div className="max-w-[1200px] mx-auto text-center">
          <p className="text-xs font-semibold tracking-widest text-neon-purple uppercase mb-4">
            POWERED BY AI
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Transform Your Style with AI
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-16">
            Skip the dressing room lines. FitAI lets you try on any outfit from
            the comfort of home using just your camera.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="card-dark rounded-xl p-6 text-left"
              >
                <div className="w-10 h-10 btn-gradient rounded-lg flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Catalog Preview */}
      <section className="py-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest text-neon-purple uppercase mb-4">
              CATALOG
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Explore The Collection
            </h2>
            <p className="text-muted-foreground text-lg">
              From casual to formal — try it all before you buy.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {staticCatalog.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-dark rounded-xl overflow-hidden group cursor-pointer"
                data-ocid={`catalog.item.${i + 1}`}
              >
                <div className="aspect-square overflow-hidden bg-muted/20">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <Badge className="mb-2 bg-primary/10 text-neon-fuchsia border-primary/20 text-xs rounded-full">
                    {item.category}
                  </Badge>
                  <h3 className="font-medium text-sm">{item.name}</h3>
                  <Button
                    size="sm"
                    onClick={() => onNavigate("tryon")}
                    className="w-full mt-3 btn-gradient text-white border-0 rounded-lg text-xs"
                    data-ocid={`catalog.item.${i + 1}`}
                  >
                    Try On
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button
              variant="outline"
              onClick={() => onNavigate("catalog")}
              className="border-border rounded-full px-8"
              data-ocid="catalog.secondary_button"
            >
              View Full Catalog <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6" id="pricing">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest text-neon-purple uppercase mb-4">
              PRICING
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Start Looking Your Best
            </h2>
            <p className="text-muted-foreground text-lg">
              One simple plan. Unlimited style.
            </p>
          </div>

          <div className="flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="gradient-border rounded-2xl p-8 max-w-md w-full"
            >
              <div className="text-center mb-6">
                <Badge className="mb-4 bg-primary/10 text-neon-fuchsia border-primary/20 rounded-full">
                  Most Popular
                </Badge>
                <div className="flex items-end justify-center gap-2">
                  <span className="font-display text-6xl font-bold gradient-text-fitai">
                    $10
                  </span>
                  <span className="text-muted-foreground text-lg mb-2">
                    / month
                  </span>
                </div>
                <p className="text-muted-foreground mt-2 text-sm">
                  Everything you need for unlimited style
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {pricingFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-neon-cyan flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                size="lg"
                onClick={() => onNavigate("pricing")}
                className="w-full btn-gradient text-white border-0 rounded-full font-semibold"
                data-ocid="pricing.primary_button"
              >
                {isSubscribed ? "Manage Subscription" : "Get Started — $10/mo"}
              </Button>
              <p className="text-center text-xs text-muted-foreground mt-3">
                Cancel anytime. No hidden fees.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
