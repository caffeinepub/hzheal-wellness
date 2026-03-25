import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef } from "react";
import type { Route } from "../App";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface Props {
  navigate: (r: Route) => void;
}

const NAV_LINKS = [
  "Forex",
  "Metals",
  "Indices",
  "Shares",
  "Signals",
  "Pricing",
];

interface Quote {
  symbol: string;
  name: string;
  tvSymbol: string;
}

const INITIAL_QUOTES: Quote[] = [
  { symbol: "EUR/USD", name: "Euro / US Dollar", tvSymbol: "FX:EURUSD" },
  { symbol: "GBP/USD", name: "British Pound", tvSymbol: "FX:GBPUSD" },
  { symbol: "XAU/USD", name: "Gold Spot", tvSymbol: "OANDA:XAUUSD" },
  { symbol: "XAG/USD", name: "Silver Spot", tvSymbol: "OANDA:XAGUSD" },
  { symbol: "SPX500", name: "S&P 500 Index", tvSymbol: "SP:SPX" },
  { symbol: "BTC/USD", name: "Bitcoin", tvSymbol: "BITSTAMP:BTCUSD" },
];

const LOCKED_SIGNALS = [
  {
    symbol: "EUR/USD",
    direction: "LONG" as const,
    entry: 1.0851,
    sl: 1.082,
    tp1: 1.089,
    tp2: 1.093,
  },
  {
    symbol: "XAU/USD",
    direction: "SHORT" as const,
    entry: 2345.0,
    sl: 2358.0,
    tp1: 2325.0,
    tp2: 2305.0,
  },
  {
    symbol: "SPX500",
    direction: "LONG" as const,
    entry: 5240.0,
    sl: 5195.0,
    tp1: 5290.0,
    tp2: 5340.0,
  },
];

const FEATURES = [
  "Live SL & TP signals for 20+ instruments",
  "89.9% verified signal accuracy",
  "Forex, Metals, Indices & Shares",
  "Real-time price alerts",
  "Instant access after login",
  "Cancel anytime",
];

const FOOTER_LINKS: Array<[string, string[]]> = [
  ["Markets", ["Forex", "Metals", "Indices", "Shares"]],
  ["Platform", ["Signals", "Dashboard", "Pricing", "API"]],
  ["Legal", ["Terms", "Privacy", "Disclaimer", "Contact"]],
];

function TradingViewTickerTape() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = "";
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: "OANDA:XAUUSD", title: "Gold" },
        { proName: "OANDA:XAGUSD", title: "Silver" },
        { proName: "FX:EURUSD", title: "EUR/USD" },
        { proName: "FX:GBPUSD", title: "GBP/USD" },
        { proName: "CRYPTOCAP:BTC", title: "Bitcoin" },
        { proName: "SP:SPX", title: "S&P 500" },
        { proName: "NASDAQ:NDX", title: "NASDAQ" },
        { proName: "FX:USDJPY", title: "USD/JPY" },
      ],
      showSymbolLogo: true,
      isTransparent: true,
      displayMode: "adaptive",
      colorTheme: "dark",
      locale: "en",
    });
    ref.current.appendChild(script);
  }, []);
  return (
    <div className="tradingview-widget-container" ref={ref}>
      <div className="tradingview-widget-container__widget" />
    </div>
  );
}

function TradingViewMiniChart({
  symbol,
}: {
  symbol: string;
  title: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = "";
    const container = document.createElement("div");
    container.className = "tradingview-widget-container";
    const widget = document.createElement("div");
    widget.className = "tradingview-widget-container__widget";
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol,
      width: "100%",
      height: "220",
      locale: "en",
      dateRange: "1D",
      colorTheme: "dark",
      isTransparent: true,
      autosize: true,
      largeChartUrl: "",
    });
    container.appendChild(widget);
    container.appendChild(script);
    ref.current.appendChild(container);
  }, [symbol]);
  return <div ref={ref} style={{ minHeight: 220 }} />;
}

function TradingViewSingleQuote({ symbol }: { symbol: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = "";
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol,
      width: "100%",
      isTransparent: true,
      colorTheme: "dark",
      locale: "en",
    });
    ref.current.appendChild(script);
  }, [symbol]);
  return (
    <div className="tradingview-widget-container" ref={ref}>
      <div className="tradingview-widget-container__widget" />
    </div>
  );
}

export default function MarketLanding({ navigate }: Props) {
  const { login, loginStatus, identity } = useInternetIdentity();

  const isLoggedIn = loginStatus === "success" && !!identity;

  const handleSubscribe = useCallback(() => {
    navigate("payment");
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* TradingView Ticker Tape */}
      <div
        className="border-b border-border"
        style={{ background: "oklch(0.10 0.02 240)" }}
      >
        <TradingViewTickerTape />
      </div>

      {/* Header */}
      <header
        className="sticky top-0 z-50 border-b border-border"
        style={{
          background: "oklch(0.10 0.02 240 / 0.95)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 fill-primary-foreground"
                aria-hidden="true"
                role="presentation"
              >
                <circle cx="12" cy="12" r="10" />
                <path
                  d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"
                  fill="none"
                  stroke="oklch(0.10 0.02 240)"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight">
              MarketPulse
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-ocid={`nav.${link.toLowerCase()}.link`}
              >
                {link}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("admin")}
              data-ocid="nav.admin.button"
              className="border-primary/50 text-primary hover:bg-primary/10"
            >
              <svg
                className="w-3.5 h-3.5 mr-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              Admin
            </Button>
            {isLoggedIn ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("dashboard")}
                data-ocid="nav.dashboard.button"
              >
                Dashboard
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={login}
                data-ocid="nav.login.button"
              >
                Log in
              </Button>
            )}
            <Button
              size="sm"
              className="bg-primary text-primary-foreground rounded-full px-4"
              onClick={handleSubscribe}
              data-ocid="nav.subscribe.button"
            >
              Subscribe — $1/mo
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section
        id="home"
        className="relative overflow-hidden py-28 px-4"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.10 0.02 240) 0%, oklch(0.14 0.04 250) 100%)",
        }}
      >
        {/* Faint candlestick backdrop */}
        <svg
          className="absolute inset-0 w-full h-full opacity-5 pointer-events-none"
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 800 400"
          aria-hidden="true"
          role="presentation"
        >
          {[50, 130, 210, 290, 370, 450, 530, 610, 690].map((x, i) => {
            const heights = [80, 120, 60, 100, 140, 70, 110, 90, 130];
            const tops = [160, 120, 180, 140, 100, 170, 130, 150, 110];
            const isUp = i % 2 === 0;
            return (
              <g key={x}>
                <line
                  x1={x}
                  y1={tops[i] - 20}
                  x2={x}
                  y2={tops[i] + heights[i] + 20}
                  stroke="white"
                  strokeWidth="1"
                />
                <rect
                  x={x - 12}
                  y={tops[i]}
                  width={24}
                  height={heights[i]}
                  fill={isUp ? "oklch(0.72 0.19 145)" : "oklch(0.577 0.245 27)"}
                  rx={2}
                />
              </g>
            );
          })}
        </svg>

        <div className="relative container mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Badge className="mb-4 bg-primary/20 text-primary border-primary/30 px-4 py-1">
              89.9% Signal Accuracy
            </Badge>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              Real-Time Global
              <br />
              <span className="text-primary">Market Intelligence</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Professional SL &amp; TP trade signals for Forex, Metals, Indices
              &amp; Shares. Start trading smarter for just $1/month.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 glow-blue"
                onClick={handleSubscribe}
                data-ocid="hero.subscribe.button"
              >
                Subscribe — $1/mo
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border hover:bg-muted"
                onClick={() => navigate("dashboard")}
                data-ocid="hero.dashboard.button"
              >
                Explore Dashboard
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* XAU/USD Featured Chart */}
      <section
        className="py-12 px-4"
        style={{ background: "oklch(0.12 0.025 240)" }}
      >
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 rounded-full bg-primary" />
              <div>
                <h2 className="text-2xl font-bold">
                  Gold (XAU/USD) Live Price
                </h2>
                <p className="text-sm text-muted-foreground">
                  Real-time gold price chart powered by TradingView
                </p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="glass-card border-primary/30 overflow-hidden">
              <CardContent className="p-4">
                <TradingViewMiniChart
                  symbol="OANDA:XAUUSD"
                  title="Gold (XAU/USD)"
                />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Live Quotes */}
      <section id="forex" className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-2">Live Market Quotes</h2>
            <p className="text-muted-foreground mb-8">
              Live prices from TradingView
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {INITIAL_QUOTES.map((q, i) => (
              <motion.div
                key={q.symbol}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Card className="glass-card hover:border-primary/40 transition-all">
                  <CardContent className="p-4">
                    <TradingViewSingleQuote symbol={q.tvSymbol} />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Locked Signals Preview */}
      <section
        id="signals"
        className="py-16 px-4"
        style={{ background: "oklch(0.14 0.025 237)" }}
      >
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold mb-2">Trade Signals</h2>
            <p className="text-muted-foreground mb-8">
              Professional SL &amp; TP signals with 89.9% accuracy. Subscribe to
              unlock.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {LOCKED_SIGNALS.map((sig, i) => (
              <motion.div
                key={sig.symbol}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <Card className="glass-card overflow-hidden">
                  <div className="blur-sm select-none pointer-events-none">
                    <CardContent className="p-5">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-bold">{sig.symbol}</span>
                        <Badge
                          className={
                            sig.direction === "LONG"
                              ? "bg-positive text-positive"
                              : "bg-negative text-negative"
                          }
                          style={{ border: "none" }}
                        >
                          {sig.direction}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Entry</span>
                          <span className="font-mono">{sig.entry}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Stop Loss
                          </span>
                          <span className="font-mono text-negative">
                            {sig.sl}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">TP1</span>
                          <span className="font-mono text-positive">
                            {sig.tp1}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">TP2</span>
                          <span className="font-mono text-positive">
                            {sig.tp2}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/70 backdrop-blur-sm">
                    <svg
                      className="w-8 h-8 mb-2 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                      role="presentation"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    <p className="text-sm text-muted-foreground mb-3">
                      Subscribe to unlock
                    </p>
                    <Button
                      size="sm"
                      onClick={handleSubscribe}
                      data-ocid={`signal.subscribe.button.${i + 1}`}
                    >
                      Unlock Signals
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4">
        <div className="container mx-auto max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold mb-2">Simple Pricing</h2>
            <p className="text-muted-foreground">
              Everything you need for just $1/month
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Card className="glass-card border-primary/40 glow-blue">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="text-5xl font-extrabold mb-1">
                    $1
                    <span className="text-lg font-normal text-muted-foreground">
                      /month
                    </span>
                  </div>
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    MarketPulse Pro
                  </Badge>
                </div>
                <ul className="space-y-3 mb-8">
                  {FEATURES.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm">
                      <svg
                        className="w-5 h-5 text-positive flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                        role="presentation"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full bg-primary text-primary-foreground glow-blue"
                  size="lg"
                  onClick={handleSubscribe}
                  data-ocid="pricing.subscribe.button"
                >
                  Subscribe — $1/mo
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-3">
                  Log in to get instant access. Cancel anytime.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Admin Access Section */}
      <motion.section
        data-ocid="admin.access.section"
        className="py-14 px-4 border-t border-border"
        style={{ background: "oklch(0.10 0.02 240)" }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto max-w-md">
          <div
            className="rounded-2xl border border-primary/20 p-8 text-center"
            style={{ background: "oklch(0.13 0.025 240)" }}
          >
            {/* Shield icon */}
            <div className="flex items-center justify-center mb-5">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: "oklch(0.18 0.04 250)" }}
              >
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-2 tracking-tight">
              Admin Dashboard
            </h3>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Site administrators can log in here to manage subscribers and
              verify crypto payments.
            </p>

            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("admin")}
              data-ocid="admin.access.button"
              className="border-primary/40 text-primary hover:bg-primary/10 hover:border-primary/60 transition-all w-full sm:w-auto px-8"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              Go to Admin Dashboard
            </Button>

            <p className="text-xs text-muted-foreground mt-4">
              Login required · Internet Identity
            </p>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer
        className="border-t border-border py-12 px-4"
        style={{ background: "oklch(0.10 0.02 240)" }}
      >
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-primary" />
                <span className="font-bold">MarketPulse</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Professional market analysis and trade signals.
              </p>
            </div>
            {FOOTER_LINKS.map(([section, links]) => (
              <div key={section}>
                <h4 className="font-semibold text-sm mb-3">{section}</h4>
                <ul className="space-y-2">
                  {links.map((l) => (
                    <li key={l}>
                      <span className="text-xs text-muted-foreground cursor-default">
                        {l}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-6 space-y-3">
            <p className="text-xs text-muted-foreground">
              <strong>Risk Disclaimer:</strong> Trading forex, metals, indices,
              and shares carries significant risk. Past performance is not
              indicative of future results. The 89.9% accuracy figure is based
              on historical back-testing and does not guarantee future returns.
              Never trade more than you can afford to lose.
            </p>
            <p className="text-xs text-muted-foreground">
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
        </div>
      </footer>
    </div>
  );
}
