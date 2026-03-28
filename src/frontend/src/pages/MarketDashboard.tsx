import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Route } from "../App";
// Legacy declarations removed
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface Props {
  navigate: (r: Route) => void;
}

interface Signal {
  symbol: string;
  name: string;
  category: string;
  direction: "LONG" | "SHORT";
  entry: number;
  sl: number;
  tp1: number;
  tp2: number;
  rr: string;
  strength: number;
  price: number;
  change: number;
  tvSymbol?: string;
}

const SIGNALS: Signal[] = [
  // Forex
  {
    symbol: "EUR/USD",
    name: "Euro / Dollar",
    category: "forex",
    direction: "LONG",
    entry: 1.0851,
    sl: 1.082,
    tp1: 1.089,
    tp2: 1.093,
    rr: "1:2.9",
    strength: 82,
    price: 1.0847,
    change: 0.32,
    tvSymbol: "FX:EURUSD",
  },
  {
    symbol: "GBP/USD",
    name: "Pound / Dollar",
    category: "forex",
    direction: "SHORT",
    entry: 1.2748,
    sl: 1.278,
    tp1: 1.27,
    tp2: 1.265,
    rr: "1:3.0",
    strength: 75,
    price: 1.2734,
    change: -0.18,
    tvSymbol: "FX:GBPUSD",
  },
  {
    symbol: "USD/JPY",
    name: "Dollar / Yen",
    category: "forex",
    direction: "LONG",
    entry: 154.2,
    sl: 153.5,
    tp1: 155.2,
    tp2: 156.0,
    rr: "1:2.3",
    strength: 68,
    price: 154.35,
    change: 0.21,
    tvSymbol: "FX:USDJPY",
  },
  {
    symbol: "AUD/USD",
    name: "Aussie / Dollar",
    category: "forex",
    direction: "SHORT",
    entry: 0.6542,
    sl: 0.658,
    tp1: 0.649,
    tp2: 0.644,
    rr: "1:2.7",
    strength: 71,
    price: 0.6538,
    change: -0.44,
    tvSymbol: "FX:AUDUSD",
  },
  {
    symbol: "USD/CAD",
    name: "Dollar / Loonie",
    category: "forex",
    direction: "LONG",
    entry: 1.3621,
    sl: 1.359,
    tp1: 1.368,
    tp2: 1.374,
    rr: "1:3.1",
    strength: 79,
    price: 1.3628,
    change: 0.15,
    tvSymbol: "FX:USDCAD",
  },
  {
    symbol: "EUR/GBP",
    name: "Euro / Pound",
    category: "forex",
    direction: "SHORT",
    entry: 0.8512,
    sl: 0.854,
    tp1: 0.847,
    tp2: 0.843,
    rr: "1:2.6",
    strength: 64,
    price: 0.8508,
    change: -0.09,
    tvSymbol: "FX:EURGBP",
  },
  {
    symbol: "USD/CHF",
    name: "Dollar / Franc",
    category: "forex",
    direction: "LONG",
    entry: 0.9048,
    sl: 0.902,
    tp1: 0.909,
    tp2: 0.914,
    rr: "1:3.3",
    strength: 88,
    price: 0.9052,
    change: 0.37,
    tvSymbol: "FX:USDCHF",
  },
  {
    symbol: "NZD/USD",
    name: "Kiwi / Dollar",
    category: "forex",
    direction: "SHORT",
    entry: 0.611,
    sl: 0.6145,
    tp1: 0.606,
    tp2: 0.601,
    rr: "1:2.9",
    strength: 72,
    price: 0.6105,
    change: -0.28,
    tvSymbol: "FX:NZDUSD",
  },
  // Metals
  {
    symbol: "XAU/USD",
    name: "Gold Spot",
    category: "metals",
    direction: "LONG",
    entry: 2335.0,
    sl: 2310.0,
    tp1: 2380.0,
    tp2: 2420.0,
    rr: "1:3.4",
    strength: 91,
    price: 2341.5,
    change: 0.74,
    tvSymbol: "OANDA:XAUUSD",
  },
  {
    symbol: "XAG/USD",
    name: "Silver Spot",
    category: "metals",
    direction: "LONG",
    entry: 29.0,
    sl: 28.5,
    tp1: 29.8,
    tp2: 30.5,
    rr: "1:3.0",
    strength: 85,
    price: 29.14,
    change: 1.12,
    tvSymbol: "OANDA:XAGUSD",
  },
  {
    symbol: "XPT/USD",
    name: "Platinum",
    category: "metals",
    direction: "SHORT",
    entry: 985.0,
    sl: 1005.0,
    tp1: 950.0,
    tp2: 920.0,
    rr: "1:2.8",
    strength: 67,
    price: 981.0,
    change: -0.52,
    tvSymbol: "OANDA:XPTUSD",
  },
  {
    symbol: "XPD/USD",
    name: "Palladium",
    category: "metals",
    direction: "LONG",
    entry: 1020.0,
    sl: 990.0,
    tp1: 1065.0,
    tp2: 1100.0,
    rr: "1:2.5",
    strength: 61,
    price: 1025.0,
    change: 0.48,
    tvSymbol: "OANDA:XPDUSD",
  },
  {
    symbol: "COPPER",
    name: "Copper",
    category: "metals",
    direction: "LONG",
    entry: 4.45,
    sl: 4.32,
    tp1: 4.62,
    tp2: 4.78,
    rr: "1:2.6",
    strength: 73,
    price: 4.47,
    change: 0.31,
    tvSymbol: "COMEX:HG1!",
  },
  // Indices
  {
    symbol: "SPX500",
    name: "S&P 500",
    category: "indices",
    direction: "LONG",
    entry: 5220.0,
    sl: 5175.0,
    tp1: 5290.0,
    tp2: 5360.0,
    rr: "1:3.1",
    strength: 87,
    price: 5234.18,
    change: 0.41,
    tvSymbol: "SP:SPX",
  },
  {
    symbol: "NAS100",
    name: "NASDAQ 100",
    category: "indices",
    direction: "LONG",
    entry: 18200.0,
    sl: 17980.0,
    tp1: 18550.0,
    tp2: 18900.0,
    rr: "1:3.2",
    strength: 84,
    price: 18342.0,
    change: 0.68,
    tvSymbol: "NASDAQ:NDX",
  },
  {
    symbol: "DOW30",
    name: "Dow Jones",
    category: "indices",
    direction: "LONG",
    entry: 39200.0,
    sl: 38800.0,
    tp1: 39800.0,
    tp2: 40400.0,
    rr: "1:3.0",
    strength: 78,
    price: 39340.0,
    change: 0.29,
    tvSymbol: "TVC:DJI",
  },
  {
    symbol: "GER40",
    name: "DAX 40",
    category: "indices",
    direction: "SHORT",
    entry: 18450.0,
    sl: 18600.0,
    tp1: 18200.0,
    tp2: 18000.0,
    rr: "1:2.7",
    strength: 70,
    price: 18420.0,
    change: -0.31,
    tvSymbol: "XETR:DAX",
  },
  {
    symbol: "UK100",
    name: "FTSE 100",
    category: "indices",
    direction: "LONG",
    entry: 8320.0,
    sl: 8260.0,
    tp1: 8420.0,
    tp2: 8520.0,
    rr: "1:3.3",
    strength: 76,
    price: 8335.0,
    change: 0.22,
    tvSymbol: "TVC:UKX",
  },
  {
    symbol: "NKY225",
    name: "Nikkei 225",
    category: "indices",
    direction: "SHORT",
    entry: 38500.0,
    sl: 39000.0,
    tp1: 37800.0,
    tp2: 37000.0,
    rr: "1:2.8",
    strength: 66,
    price: 38420.0,
    change: -0.47,
    tvSymbol: "TVC:NI225",
  },
  {
    symbol: "CAC40",
    name: "CAC 40",
    category: "indices",
    direction: "LONG",
    entry: 8050.0,
    sl: 7980.0,
    tp1: 8180.0,
    tp2: 8300.0,
    rr: "1:3.2",
    strength: 74,
    price: 8065.0,
    change: 0.18,
    tvSymbol: "EURONEXT:PX1",
  },
  {
    symbol: "HSI",
    name: "Hang Seng",
    category: "indices",
    direction: "SHORT",
    entry: 17200.0,
    sl: 17600.0,
    tp1: 16700.0,
    tp2: 16200.0,
    rr: "1:2.9",
    strength: 63,
    price: 17150.0,
    change: -0.62,
    tvSymbol: "TVC:HSI",
  },
  // Shares
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    category: "shares",
    direction: "LONG",
    entry: 189.5,
    sl: 185.0,
    tp1: 196.0,
    tp2: 202.0,
    rr: "1:2.9",
    strength: 83,
    price: 190.2,
    change: 0.55,
    tvSymbol: "NASDAQ:AAPL",
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    category: "shares",
    direction: "SHORT",
    entry: 174.0,
    sl: 181.0,
    tp1: 163.0,
    tp2: 155.0,
    rr: "1:2.7",
    strength: 69,
    price: 172.5,
    change: -1.34,
    tvSymbol: "NASDAQ:TSLA",
  },
  {
    symbol: "AMZN",
    name: "Amazon.com",
    category: "shares",
    direction: "LONG",
    entry: 182.0,
    sl: 178.0,
    tp1: 190.0,
    tp2: 198.0,
    rr: "1:4.0",
    strength: 90,
    price: 183.45,
    change: 1.02,
    tvSymbol: "NASDAQ:AMZN",
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    category: "shares",
    direction: "LONG",
    entry: 166.0,
    sl: 162.5,
    tp1: 173.0,
    tp2: 180.0,
    rr: "1:3.5",
    strength: 86,
    price: 167.2,
    change: 0.78,
    tvSymbol: "NASDAQ:GOOGL",
  },
];

// Chart groups used in the dedicated Charts tab
const CHART_GROUPS = [
  {
    group: "Crypto",
    charts: [
      { label: "BTC/USD", value: "BITSTAMP:BTCUSD" },
      { label: "ETH/USD", value: "BITSTAMP:ETHUSD" },
      { label: "BTC/EUR", value: "COINBASE:BTCEUR" },
    ],
  },
  {
    group: "Forex",
    charts: [
      { label: "EUR/USD", value: "FX:EURUSD" },
      { label: "GBP/USD", value: "FX:GBPUSD" },
      { label: "USD/JPY", value: "FX:USDJPY" },
      { label: "USD/CHF", value: "FX:USDCHF" },
      { label: "AUD/USD", value: "FX:AUDUSD" },
      { label: "USD/CAD", value: "FX:USDCAD" },
      { label: "NZD/USD", value: "FX:NZDUSD" },
      { label: "USD Index", value: "TVC:DXY" },
    ],
  },
  {
    group: "Metals",
    charts: [
      { label: "XAU/USD", value: "OANDA:XAUUSD" },
      { label: "XAG/USD", value: "OANDA:XAGUSD" },
      { label: "XPT/USD", value: "OANDA:XPTUSD" },
      { label: "XPD/USD", value: "OANDA:XPDUSD" },
      { label: "Copper", value: "COMEX:HG1!" },
    ],
  },
  {
    group: "Indices",
    charts: [
      { label: "S&P 500", value: "SP:SPX" },
      { label: "NASDAQ 100", value: "NASDAQ:NDX" },
      { label: "DOW JONES", value: "TVC:DJI" },
      { label: "DAX 40", value: "XETR:DAX" },
      { label: "FTSE 100", value: "TVC:UKX" },
      { label: "Nikkei 225", value: "TVC:NI225" },
      { label: "CAC 40", value: "EURONEXT:PX1" },
      { label: "Hang Seng", value: "TVC:HSI" },
    ],
  },
];

const ALL_CHARTS = CHART_GROUPS.flatMap((g) => g.charts);

const CATEGORIES = [
  { key: "all", label: "All Signals" },
  { key: "forex", label: "Forex" },
  { key: "metals", label: "Metals" },
  { key: "indices", label: "Indices" },
  { key: "shares", label: "Shares" },
  { key: "charts", label: "📈 Charts" },
];

const STATS = [
  { label: "Active Signals", value: SIGNALS.length.toString() },
  { label: "Accuracy Rate", value: "89.9%" },
  { label: "Markets Covered", value: "4" },
  { label: "Instruments", value: "20+" },
];

// ── TradingView chart embed ─────────────────────────────────────────────────
function TradingViewChart({
  symbol,
  height = 420,
}: { symbol: string; height?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = "";
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol,
      interval: "H1",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      gridColor: "rgba(255,255,255,0.04)",
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      calendar: false,
      support_host: "https://www.tradingview.com",
    });
    ref.current.appendChild(script);
  }, [symbol]);
  return (
    <div className="tradingview-widget-container" ref={ref} style={{ height }}>
      <div
        className="tradingview-widget-container__widget"
        style={{ height: "100%" }}
      />
    </div>
  );
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

// ── Signal card WITH live quote + embedded TradingView chart ───────────────
function SignalWithChart({ sig, index }: { sig: Signal; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="space-y-0"
      data-ocid={`signals.chart.${index + 1}`}
    >
      <Card className="glass-card hover:border-primary/40 transition-all overflow-hidden">
        {/* Signal info header */}
        <CardContent className="p-5 pb-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="font-bold text-lg">{sig.symbol}</div>
              <div className="text-xs text-muted-foreground">{sig.name}</div>
            </div>
            <div className="flex gap-2">
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
              <Badge
                className="bg-primary/20 text-primary"
                style={{ border: "none" }}
              >
                89.9%
              </Badge>
            </div>
          </div>
          {/* Live real-time price widget */}
          {sig.tvSymbol && (
            <div className="mb-4 border border-border/40 rounded-lg overflow-hidden">
              <TradingViewSingleQuote symbol={sig.tvSymbol} />
            </div>
          )}
          <div className="grid grid-cols-4 gap-2 text-xs mb-1">
            <div className="text-center">
              <div className="text-muted-foreground mb-0.5">Entry</div>
              <div className="font-mono font-semibold">
                {sig.entry.toFixed(sig.entry > 100 ? 2 : 4)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground mb-0.5">Stop Loss</div>
              <div className="font-mono font-semibold text-negative">
                {sig.sl.toFixed(sig.sl > 100 ? 2 : 4)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground mb-0.5">TP1</div>
              <div className="font-mono font-semibold text-positive">
                {sig.tp1.toFixed(sig.tp1 > 100 ? 2 : 4)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground mb-0.5">TP2</div>
              <div className="font-mono font-semibold text-positive">
                {sig.tp2.toFixed(sig.tp2 > 100 ? 2 : 4)}
              </div>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Signal Strength</span>
              <span>
                {sig.strength}% &nbsp; R/R {sig.rr}
              </span>
            </div>
            <Progress value={sig.strength} className="h-1.5" />
          </div>
        </CardContent>
        {/* Live TradingView chart */}
        {sig.tvSymbol && (
          <div className="border-t border-border/50">
            <TradingViewChart symbol={sig.tvSymbol} height={380} />
          </div>
        )}
      </Card>
    </motion.div>
  );
}

// ── Full Charts browser tab ─────────────────────────────────────────────────
function ChartsTab() {
  const [activeSymbol, setActiveSymbol] = useState(ALL_CHARTS[0].value);
  const activeLabel =
    ALL_CHARTS.find((s) => s.value === activeSymbol)?.label ?? "";

  return (
    <div className="space-y-6">
      {CHART_GROUPS.map((group) => (
        <div key={group.group}>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2 px-1">
            {group.group}
          </div>
          <div className="flex flex-wrap gap-2">
            {group.charts.map((sym) => (
              <button
                key={sym.value}
                type="button"
                onClick={() => setActiveSymbol(sym.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                  activeSymbol === sym.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/50 text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {sym.label}
              </button>
            ))}
          </div>
        </div>
      ))}
      <Card className="glass-card overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">
            {activeLabel} — Live Chart
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <TradingViewChart symbol={activeSymbol} height={500} />
        </CardContent>
      </Card>
    </div>
  );
}

// ── Main dashboard ──────────────────────────────────────────────────────────
export default function MarketDashboard({ navigate }: Props) {
  const { login, loginStatus, identity } = useInternetIdentity();
  const { actor, isFetching } = useActor();
  const isLoggedIn = loginStatus === "success" && !!identity;

  const { data: isSubscribed } = useQuery({
    queryKey: ["isSubscribed"],
    queryFn: () => actor?.isSubscribed() ?? Promise.resolve(false),
    enabled: !!actor && !isFetching,
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

  const isPaymentPending =
    Array.isArray(paymentStatus) &&
    paymentStatus.length > 0 &&
    paymentStatus[0] !== null &&
    paymentStatus[0] !== undefined &&
    "pending" in (paymentStatus[0] as object);
  const { data: isAdmin } = useQuery({
    queryKey: ["isAdmin"],
    queryFn: () => actor?.isCallerAdmin() ?? Promise.resolve(false),
    enabled: !!actor && !isFetching,
  });

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card
          className="glass-card w-full max-w-sm"
          data-ocid="dashboard.login.modal"
        >
          <CardHeader>
            <CardTitle>Access Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Please log in to access your MarketPulse dashboard.
            </p>
            <Button
              className="w-full"
              onClick={login}
              data-ocid="dashboard.login.button"
            >
              Log In
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => navigate("landing")}
              data-ocid="dashboard.back.button"
            >
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isSubscribed) {
    if (isPaymentPending) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Card
            className="glass-card w-full max-w-sm border-yellow-500/30"
            data-ocid="dashboard.pending.panel"
          >
            <CardHeader>
              <CardTitle>Payment Pending</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Your payment is being verified. Access will be activated within
                24 hours.
              </p>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => navigate("landing")}
                data-ocid="dashboard.back.button"
              >
                Back to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card
          className="glass-card w-full max-w-sm"
          data-ocid="dashboard.subscribe.modal"
        >
          <CardHeader>
            <CardTitle>Subscribe to Access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Get full access to all trade signals for just $1/month.
            </p>
            <Button
              className="w-full bg-primary"
              onClick={() => navigate("payment")}
              data-ocid="dashboard.subscribe.button"
            >
              Subscribe with Crypto &mdash; $1/mo
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => navigate("landing")}
              data-ocid="dashboard.back.button"
            >
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const liveQuoteSignals = [
    ...SIGNALS.filter((s) => s.category === "forex"),
    ...SIGNALS.filter((s) => s.category === "metals"),
  ];

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
            <Badge
              className="bg-primary/20 text-primary text-xs"
              style={{ border: "none" }}
            >
              PRO
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("admin")}
                data-ocid="header.admin.button"
              >
                Admin
              </Button>
            )}
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
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {STATS.map((stat) => (
            <Card key={stat.label} className="glass-card">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Live Quotes */}
        <Card className="glass-card mb-8">
          <CardHeader>
            <CardTitle className="text-base">
              Live Quotes — Real-Time from TradingView
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {liveQuoteSignals.map((sig, i) => (
                <div
                  key={sig.symbol}
                  className="border border-border/50 rounded-lg p-2"
                  data-ocid={`quotes.item.${i + 1}`}
                >
                  {sig.tvSymbol ? (
                    <TradingViewSingleQuote symbol={sig.tvSymbol} />
                  ) : (
                    <span className="text-sm font-medium">{sig.symbol}</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="all" data-ocid="signals.category.tab">
          <TabsList className="mb-6 bg-muted/50 flex-wrap h-auto">
            {CATEGORIES.map((c) => (
              <TabsTrigger
                key={c.key}
                value={c.key}
                className="text-xs md:text-sm"
              >
                {c.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* All Signals — 2-column grid with charts */}
          <TabsContent value="all">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {SIGNALS.map((sig, i) => (
                <SignalWithChart key={sig.symbol} sig={sig} index={i} />
              ))}
            </div>
          </TabsContent>

          {/* Forex — with charts */}
          <TabsContent value="forex">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {SIGNALS.filter((s) => s.category === "forex").map((sig, i) => (
                <SignalWithChart key={sig.symbol} sig={sig} index={i} />
              ))}
            </div>
          </TabsContent>

          {/* Metals — signal card + live TradingView chart */}
          <TabsContent value="metals">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {SIGNALS.filter((s) => s.category === "metals").map((sig, i) => (
                <SignalWithChart key={sig.symbol} sig={sig} index={i} />
              ))}
            </div>
          </TabsContent>

          {/* Indices — signal card + live TradingView chart */}
          <TabsContent value="indices">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {SIGNALS.filter((s) => s.category === "indices").map((sig, i) => (
                <SignalWithChart key={sig.symbol} sig={sig} index={i} />
              ))}
            </div>
          </TabsContent>

          {/* Shares — with charts */}
          <TabsContent value="shares">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {SIGNALS.filter((s) => s.category === "shares").map((sig, i) => (
                <SignalWithChart key={sig.symbol} sig={sig} index={i} />
              ))}
            </div>
          </TabsContent>

          {/* Full chart browser */}
          <TabsContent value="charts">
            <ChartsTab />
          </TabsContent>
        </Tabs>
      </main>

      <footer
        className="border-t border-border py-6 px-4 mt-8"
        style={{ background: "oklch(0.10 0.02 240)" }}
      >
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            Trading involves significant risk. Signals are for informational
            purposes only.
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
      </footer>
    </div>
  );
}
