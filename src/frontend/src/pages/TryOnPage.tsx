import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Camera, CameraOff, Lock, RotateCcw, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Page } from "../App";
import type { ClothingItem } from "../backend.d";
import { useCamera } from "../camera/useCamera";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import {
  useClothingCatalog,
  useRecordTryOn,
  useTryOnCount,
} from "../hooks/useQueries";

const FREE_LIMIT = 3;
const SKELETON_KEYS = ["sk1", "sk2", "sk3", "sk4"];

interface TryOnPageProps {
  onNavigate: (page: Page) => void;
  isLoggedIn: boolean;
  isSubscribed: boolean;
  selectedItemId: bigint | null;
}

export default function TryOnPage({
  onNavigate,
  isLoggedIn,
  isSubscribed,
  selectedItemId,
}: TryOnPageProps) {
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);

  const { data: items, isLoading: itemsLoading } = useClothingCatalog();
  const { data: tryOnCount = 0n, refetch: refetchCount } = useTryOnCount();
  const recordTryOn = useRecordTryOn();

  const {
    isActive,
    isLoading: cameraLoading,
    error: cameraError,
    startCamera,
    stopCamera,
    switchCamera,
    videoRef,
    currentFacingMode,
  } = useCamera({ facingMode: "user", width: 640, height: 480 });

  // Set initial selected item
  useEffect(() => {
    if (!items || items.length === 0) return;
    if (selectedItemId !== null) {
      const found = items.find((i) => i.id === selectedItemId);
      if (found) setSelectedItem(found);
    } else {
      setSelectedItem(items[0]);
    }
  }, [items, selectedItemId]);

  // Draw overlay on canvas
  const drawOverlay = useCallback(() => {
    const video = videoRef.current;
    const canvas = overlayCanvasRef.current;
    if (!video || !canvas || !isActive) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    // Mirror for front camera
    ctx.save();
    if (currentFacingMode === "user") {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    // Draw clothing overlay if selected
    if (selectedItem?.imageUrl) {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        if (!canvas || !ctx) return;
        const overlayW = canvas.width * 0.5;
        const overlayH = overlayW;
        const overlayX = (canvas.width - overlayW) / 2;
        const overlayY = canvas.height * 0.2;
        ctx.globalAlpha = 0.65;
        ctx.drawImage(img, overlayX, overlayY, overlayW, overlayH);
        ctx.globalAlpha = 1.0;
      };
      img.src = selectedItem.imageUrl;
    }

    animFrameRef.current = requestAnimationFrame(drawOverlay);
  }, [isActive, selectedItem, videoRef, currentFacingMode]);

  useEffect(() => {
    if (isActive) {
      animFrameRef.current = requestAnimationFrame(drawOverlay);
    } else if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isActive, drawOverlay]);

  const handleTryOn = async () => {
    if (!selectedItem) return;
    const count = Number(tryOnCount);
    if (!isSubscribed && count >= FREE_LIMIT) {
      toast.error(
        `Free limit reached (${FREE_LIMIT}/day). Subscribe for unlimited try-ons!`,
      );
      onNavigate("pricing");
      return;
    }
    try {
      await recordTryOn.mutateAsync();
      await refetchCount();
      toast.success(`Trying on ${selectedItem.name}!`);
    } catch {
      toast.error("Failed to record try-on. Please try again.");
    }
  };

  const tryOnCount_num = Number(tryOnCount);
  const limitReached = !isSubscribed && tryOnCount_num >= FREE_LIMIT;

  return (
    <div className="min-h-screen">
      <SiteHeader
        currentPage="tryon"
        onNavigate={onNavigate}
        isLoggedIn={isLoggedIn}
      />

      <main className="pt-24 pb-20 px-6 max-w-[1200px] mx-auto">
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-widest text-neon-purple uppercase mb-3">
            VIRTUAL TRY-ON
          </p>
          <h1 className="font-display text-4xl font-bold mb-2">
            AI Dressing Room
          </h1>
          <p className="text-muted-foreground">
            Select an outfit and see it on you in real time.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Camera / Canvas */}
          <div className="lg:col-span-2">
            <div className="card-dark rounded-2xl overflow-hidden">
              <div className="relative bg-muted/10 aspect-video flex items-center justify-center">
                {/* Hidden video element for camera stream */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 opacity-0 w-full h-full"
                />

                {isActive ? (
                  <canvas
                    ref={overlayCanvasRef}
                    className="w-full h-full object-cover"
                    data-ocid="tryon.canvas_target"
                  />
                ) : (
                  <div
                    className="flex flex-col items-center gap-4 py-16"
                    data-ocid="tryon.loading_state"
                  >
                    {cameraLoading ? (
                      <>
                        <div className="w-12 h-12 btn-gradient rounded-full flex items-center justify-center animate-pulse">
                          <Camera className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-muted-foreground text-sm">
                          Accessing camera...
                        </p>
                      </>
                    ) : cameraError ? (
                      <>
                        <CameraOff className="w-12 h-12 text-muted-foreground" />
                        <p className="text-muted-foreground text-sm">
                          Camera access denied
                        </p>
                        <p className="text-xs text-muted-foreground/60">
                          {cameraError.message}
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="w-16 h-16 btn-gradient rounded-full flex items-center justify-center">
                          <Camera className="w-8 h-8 text-white" />
                        </div>
                        <p className="text-muted-foreground text-sm">
                          Start your camera to try on clothes
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Camera Controls */}
              <div className="p-4 flex items-center justify-between border-t border-border">
                <div className="flex gap-3">
                  {isActive ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={stopCamera}
                      className="rounded-full"
                      data-ocid="tryon.secondary_button"
                    >
                      <CameraOff className="w-4 h-4 mr-1" /> Stop Camera
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={startCamera}
                      disabled={cameraLoading}
                      className="btn-gradient text-white border-0 rounded-full"
                      data-ocid="tryon.primary_button"
                    >
                      <Camera className="w-4 h-4 mr-1" />{" "}
                      {cameraLoading ? "Starting..." : "Start Camera"}
                    </Button>
                  )}
                  {isActive && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => switchCamera()}
                      className="rounded-full"
                      data-ocid="tryon.toggle"
                    >
                      <RotateCcw className="w-4 h-4 mr-1" /> Flip
                    </Button>
                  )}
                </div>

                {/* Try-On Count */}
                {!isSubscribed && (
                  <div className="text-xs text-muted-foreground">
                    <span
                      className={
                        limitReached ? "text-destructive" : "text-neon-cyan"
                      }
                    >
                      {tryOnCount_num}/{FREE_LIMIT}
                    </span>{" "}
                    try-ons today
                  </div>
                )}

                <Button
                  size="sm"
                  onClick={handleTryOn}
                  disabled={
                    !isActive ||
                    !selectedItem ||
                    limitReached ||
                    recordTryOn.isPending
                  }
                  className="btn-gradient text-white border-0 rounded-full"
                  data-ocid="tryon.primary_button"
                >
                  <Sparkles className="w-4 h-4 mr-1" />
                  {recordTryOn.isPending ? "Applying..." : "Try On"}
                </Button>
              </div>
            </div>

            {/* Limit Reached Warning */}
            {limitReached && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 gradient-border rounded-xl p-4 flex items-center justify-between"
                data-ocid="tryon.error_state"
              >
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-neon-fuchsia" />
                  <div>
                    <p className="text-sm font-medium">Daily limit reached</p>
                    <p className="text-xs text-muted-foreground">
                      Upgrade to FitAI Pro for unlimited try-ons
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => onNavigate("pricing")}
                  className="btn-gradient text-white border-0 rounded-full"
                  data-ocid="tryon.primary_button"
                >
                  Upgrade
                </Button>
              </motion.div>
            )}
          </div>

          {/* Clothing Picker */}
          <div>
            <h3 className="font-semibold mb-4 text-sm text-muted-foreground uppercase tracking-wide">
              Select Outfit
            </h3>

            {itemsLoading && (
              <div className="space-y-3" data-ocid="catalog.loading_state">
                {SKELETON_KEYS.map((k) => (
                  <div key={k} className="flex gap-3 card-dark rounded-xl p-3">
                    <Skeleton className="w-16 h-16 rounded-lg flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!itemsLoading && items && items.length === 0 && (
              <div
                className="text-center py-8 text-muted-foreground text-sm"
                data-ocid="catalog.empty_state"
              >
                No clothing items available yet.
              </div>
            )}

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {items?.map((item, i) => (
                <button
                  key={String(item.id)}
                  type="button"
                  onClick={() => setSelectedItem(item)}
                  className={`w-full flex gap-3 rounded-xl p-3 transition-all text-left ${
                    selectedItem?.id === item.id
                      ? "gradient-border"
                      : "card-dark hover:border-border/60"
                  }`}
                  data-ocid={`catalog.item.${i + 1}`}
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted/20">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                        No img
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Badge className="mb-1 bg-primary/10 text-neon-fuchsia border-primary/20 text-xs rounded-full">
                      {item.category}
                    </Badge>
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    {item.isPremium && !isSubscribed && (
                      <p className="text-xs text-neon-fuchsia flex items-center gap-1 mt-1">
                        <Lock className="w-3 h-3" /> Pro
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
