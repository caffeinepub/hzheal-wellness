import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { Page } from "../App";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { useClothingCatalog } from "../hooks/useQueries";

const CATEGORY_LABELS: Record<string, string> = {
  all: "All",
  tops: "Tops",
  bottoms: "Bottoms",
  dresses: "Dresses",
  accessories: "Accessories",
};

const SKELETON_KEYS = ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6", "sk7", "sk8"];

interface CatalogPageProps {
  onNavigate: (page: Page) => void;
  isLoggedIn: boolean;
  isSubscribed: boolean;
  onTryOn: (itemId: bigint) => void;
}

export default function CatalogPage({
  onNavigate,
  isLoggedIn,
  isSubscribed,
  onTryOn,
}: CatalogPageProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const { data: items, isLoading } = useClothingCatalog();

  const filtered =
    items?.filter((item) => {
      if (activeCategory === "all") return true;
      return item.category === activeCategory;
    }) ?? [];

  return (
    <div className="min-h-screen">
      <SiteHeader
        currentPage="catalog"
        onNavigate={onNavigate}
        isLoggedIn={isLoggedIn}
      />

      <main className="pt-24 pb-20 px-6 max-w-[1200px] mx-auto">
        <div className="mb-10">
          <p className="text-xs font-semibold tracking-widest text-neon-purple uppercase mb-3">
            CATALOG
          </p>
          <h1 className="font-display text-4xl font-bold mb-2">
            Explore The Collection
          </h1>
          <p className="text-muted-foreground">
            Browse and try on hundreds of styles instantly.
          </p>
        </div>

        {/* Category Filters */}
        <Tabs
          value={activeCategory}
          onValueChange={setActiveCategory}
          className="mb-8"
        >
          <TabsList className="bg-card border border-border rounded-full p-1 h-auto">
            {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
              <TabsTrigger
                key={val}
                value={val}
                className="rounded-full px-4 text-sm data-[state=active]:btn-gradient data-[state=active]:text-white"
                data-ocid="catalog.tab"
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Loading */}
        {isLoading && (
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-5"
            data-ocid="catalog.loading_state"
          >
            {SKELETON_KEYS.map((k) => (
              <div key={k} className="card-dark rounded-xl overflow-hidden">
                <Skeleton className="aspect-square w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!isLoading && filtered.length === 0 && (
          <div
            className="text-center py-20 text-muted-foreground"
            data-ocid="catalog.empty_state"
          >
            <p className="text-lg">No items in this category yet.</p>
          </div>
        )}

        {/* Grid */}
        {!isLoading && filtered.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {filtered.map((item, i) => (
              <motion.div
                key={String(item.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card-dark rounded-xl overflow-hidden group"
                data-ocid={`catalog.item.${i + 1}`}
              >
                <div className="aspect-square overflow-hidden bg-muted/20 relative">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                      No Image
                    </div>
                  )}
                  {item.isPremium && !isSubscribed && (
                    <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
                      <Lock className="w-6 h-6 text-neon-fuchsia" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <Badge className="mb-2 bg-primary/10 text-neon-fuchsia border-primary/20 text-xs rounded-full">
                    {CATEGORY_LABELS[item.category] ?? item.category}
                  </Badge>
                  <h3 className="font-medium text-sm mb-1">{item.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                    {item.description}
                  </p>
                  {item.isPremium && !isSubscribed ? (
                    <Button
                      size="sm"
                      onClick={() => onNavigate("pricing")}
                      className="w-full bg-muted/50 text-muted-foreground border border-border rounded-lg text-xs"
                      data-ocid={`catalog.item.${i + 1}`}
                    >
                      <Lock className="w-3 h-3 mr-1" /> Subscribe to Unlock
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => onTryOn(item.id)}
                      className="w-full btn-gradient text-white border-0 rounded-lg text-xs"
                      data-ocid={`catalog.item.${i + 1}`}
                    >
                      Try On
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
