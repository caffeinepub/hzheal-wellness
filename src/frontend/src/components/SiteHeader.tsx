import { Button } from "@/components/ui/button";
import { Menu, Sparkles, X } from "lucide-react";
import { useState } from "react";
import type { Page } from "../App";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface SiteHeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isLoggedIn: boolean;
}

export default function SiteHeader({
  currentPage,
  onNavigate,
  isLoggedIn,
}: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { login, clear, loginStatus } = useInternetIdentity();
  const isLoggingIn = loginStatus === "logging-in";

  const navLinks: { label: string; page: Page }[] = [
    { label: "Home", page: "landing" },
    { label: "Explore", page: "catalog" },
    { label: "Pricing", page: "pricing" },
    { label: "Try On", page: "tryon" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 surface-panel">
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          type="button"
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => onNavigate("landing")}
          data-ocid="nav.link"
        >
          <div className="w-8 h-8 rounded-lg btn-gradient flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-xl text-foreground">
            FitAI
          </span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <button
              key={link.page}
              type="button"
              onClick={() => onNavigate(link.page)}
              className={`text-sm transition-colors ${
                currentPage === link.page
                  ? "text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-ocid="nav.link"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Auth Controls */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <Button
              variant="outline"
              size="sm"
              onClick={clear}
              className="border-border text-muted-foreground hover:text-foreground rounded-full"
              data-ocid="nav.link"
            >
              Log Out
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={login}
              disabled={isLoggingIn}
              className="border-border text-muted-foreground hover:text-foreground rounded-full"
              data-ocid="nav.link"
            >
              {isLoggingIn ? "Signing in..." : "Log In"}
            </Button>
          )}
          <Button
            size="sm"
            onClick={() => onNavigate("pricing")}
            className="btn-gradient text-white rounded-full border-0 font-medium"
            data-ocid="nav.primary_button"
          >
            Start Free Trial
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          className="md:hidden text-muted-foreground"
          onClick={() => setMenuOpen(!menuOpen)}
          data-ocid="nav.toggle"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden surface-panel border-t border-border px-6 py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <button
              key={link.page}
              type="button"
              onClick={() => {
                onNavigate(link.page);
                setMenuOpen(false);
              }}
              className="text-sm text-left text-muted-foreground hover:text-foreground transition-colors py-1"
              data-ocid="nav.link"
            >
              {link.label}
            </button>
          ))}
          {isLoggedIn ? (
            <Button
              variant="outline"
              size="sm"
              onClick={clear}
              className="rounded-full w-fit"
              data-ocid="nav.link"
            >
              Log Out
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={login}
              disabled={isLoggingIn}
              className="rounded-full w-fit"
              data-ocid="nav.link"
            >
              {isLoggingIn ? "Signing in..." : "Log In"}
            </Button>
          )}
          <Button
            size="sm"
            onClick={() => {
              onNavigate("pricing");
              setMenuOpen(false);
            }}
            className="btn-gradient text-white rounded-full border-0 w-fit"
            data-ocid="nav.primary_button"
          >
            Start Free Trial
          </Button>
        </div>
      )}
    </header>
  );
}
