import { Sparkles } from "lucide-react";

export default function SiteFooter() {
  const year = new Date().getFullYear();
  const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer className="border-t border-border mt-20">
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg btn-gradient flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-display font-bold text-lg">FitAI</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your AI-powered virtual dressing room. Try on any outfit
              instantly.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">
              Product
            </h4>
            <ul className="space-y-2">
              {["Try On", "Catalog", "Pricing", "Features"].map((item) => (
                <li key={item}>
                  <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">
              Company
            </h4>
            <ul className="space-y-2">
              {["About", "Blog", "Careers", "Press"].map((item) => (
                <li key={item}>
                  <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">
              Legal
            </h4>
            <ul className="space-y-2">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
                (item) => (
                  <li key={item}>
                    <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                      {item}
                    </span>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            © {year} FitAI. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with ❤️ using{" "}
            <a
              href={utmLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neon-cyan hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
