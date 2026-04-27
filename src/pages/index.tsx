import { subtitle, title } from "@/components/primitives";
import SoundCloudAlbumEmbed from "@/components/SoundCloudAlbumEmbed";
import SoundCloudEmbed from "@/components/SoundCloudEmbed";
import { features, operationSteps } from "@/data/features";
import DefaultLayout from "@/layouts/default";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import {
  BadgeDollarSign,
  Brain,
  FileDown,
  Route,
  SlidersHorizontal,
  Sparkles,
  X,
  type LucideIcon,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

// Simple spacer component
const Spacer = ({ y }: { y: number }) => (
  <div style={{ height: `${y * 0.25}rem` }} />
);

const featureIcons: Record<string, LucideIcon> = {
  BadgeDollarSign,
  Brain,
  Route,
  FileDown,
  Sparkles,
  SlidersHorizontal,
};

export default function IndexPage() {
  useEffect(() => {
    document.title = "LucidHarmony - AI-Powered Chord Progression Generator";
  }, []);

  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [lightboxAlt, setLightboxAlt] = useState<string>("");

  const openLightbox = useCallback((src: string, alt: string) => {
    setLightboxSrc(src);
    setLightboxAlt(alt);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxSrc(null);
  }, []);

  const trackOutboundClickConversion = useCallback(() => {
    type GtagFunction = (...args: unknown[]) => void;

    const gtag = (globalThis as unknown as { gtag?: GtagFunction }).gtag;

    if (!gtag) return;

    gtag("event", "conversion", {
      send_to: "AW-951228427/rn08CMKM5PECEIuwysUD",
    });
  }, []);

  useEffect(() => {
    if (!lightboxSrc) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
    };

    window.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [closeLightbox, lightboxSrc]);

  return (
    <DefaultLayout>
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center gap-4 py-16 md:py-24 px-4">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-violet-500/20 via-violet-500/5 to-transparent" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-600/20 via-transparent to-transparent" />

        <div className="max-w-5xl text-center">
          <h1 className={title({ size: "lg" })}>
            <span className="bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent text-5xl md:text-7xl lg:text-8xl font-bold">
              Gorgeous Infinite Harmony
            </span>
          </h1>
          <Spacer y={12} />
          
          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 via-content1 to-content1 p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-600">
                  <Sparkles className="h-7 w-7" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-bold text-default-900 mb-3">
                  Infinite Variety
                </h3>
                <p className="text-lg text-default-700 leading-relaxed">
                  Every sequence unique. Clever voicing, always configurable. Any key, tempo, note length.
                </p>
            </div>

            <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 via-content1 to-content1 p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-600">
                  <Brain className="h-7 w-7" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-bold text-default-900 mb-3">
                  Theory Built-In
                </h3>
                <p className="text-lg text-default-700 leading-relaxed">
                  Steeped in music theory, so you don't have to be. From drifting ambient to choral to cinematic.
                </p>
            </div>

            <div className="rounded-2xl border border-green-500/30 bg-gradient-to-br from-green-500/10 via-content1 to-content1 p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/20 text-green-600">
                  <BadgeDollarSign className="h-7 w-7" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-bold text-default-900 mb-3">
                  Fair & Forever
                </h3>
                <p className="text-lg text-default-700 leading-relaxed">
                  Pay what you want. No-risk 30-day guarantee. Free updates forever.
                </p>
            </div>
          </div>

          <Spacer y={12} />

          {/* Platform badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-violet-500/20 to-violet-600/20 border border-violet-500/30">
              <span className="text-2xl">🪟</span>
              <span className="text-lg md:text-xl font-semibold text-default-800">
                Windows
              </span>
            </div>
            <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-violet-500/20 to-violet-600/20 border border-violet-500/30">
              <span className="text-2xl">🍎</span>
              <span className="text-lg md:text-xl font-semibold text-default-800">
                Mac
              </span>
            </div>
            <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-violet-500/20 to-violet-600/20 border border-violet-500/30">
              <span className="text-2xl">🐧</span>
              <span className="text-lg md:text-xl font-semibold text-default-800">
                Linux
              </span>
            </div>
          </div>
        </div>

        <Spacer y={4} />
        {/* Hero Image */}
        <div className="w-full max-w-5xl">
          <button
            type="button"
            className="block w-full cursor-zoom-in"
            onClick={() =>
              openLightbox(
                "/lucid-harmony-hero.com.png",
                "LucidHarmony Plugin Interface",
              )
            }
          >
            <img
              src="/lucid-harmony-hero.com.png"
              alt="LucidHarmony Plugin Interface"
              className="w-full h-auto rounded-2xl shadow-2xl"
            />
          </button>
        </div>
        <Spacer y={8} />
        <Button
          as={Link}
          href="https://lucidmusician.gumroad.com/l/lucid-harmony"
          size="lg"
          radius="full"
          className="bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold text-lg px-8 py-6 shadow-lg hover:shadow-xl"
          onPress={trackOutboundClickConversion}
        >
          Get LucidHarmony - Pay What You Like
        </Button>
        <p
          className={subtitle({
            class:
              "mt-6 md:mt-8 !w-full text-center text-base md:text-xl font-semibold",
          })}
        >
          <span className="mx-auto px-5 py-3">
            ✨ Pay-what-you-want 🛡️ No-risk 30-day money-back guarantee
          </span>
        </p>
      </section>

      {/* Video Hero Section */}
      <section className="relative py-20 px-4">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-violet-500/10 via-transparent to-transparent" />

        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className={title({ size: "lg", class: "mb-6" })}>
              <span className="bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent">
                LucidHarmony Makes Ambient Easy
              </span>
            </h1>
          </div>

          <Spacer y={8} />

          {/* Large YouTube Video Embed */}
          <div className="w-full max-w-6xl mx-auto">
            <div className="aspect-video overflow-hidden rounded-3xl border-2 border-violet-500/30 bg-content1 shadow-2xl">
              <iframe
                className="h-full w-full"
                src="https://www.youtube.com/embed/zZXODsd1zlY"
                title="LucidHarmony Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                loading="lazy"
              />
            </div>

            <Spacer y={8} />

            <div className="text-center">
              <p
                className={subtitle({
                  class: "text-lg md:text-xl max-w-4xl mx-auto leading-relaxed",
                })}
              >
                🎹 Drag MIDI straight from the plugin · 🌊 Pads, bass &
                windchimes · ⏱️ 60 BPM · ♾️ Infinite mode engaged · 🚫 No MIDI
                controller · ✋ Zero hand editing · ✨ Unique harmony out of the
                box
              </p>
            </div>

            <Spacer y={8} />

            <div className="text-center">
              <Button
                as={Link}
                href="https://lucidmusician.gumroad.com/l/lucid-harmony"
                size="lg"
                radius="full"
                className="bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold text-lg px-8 py-6 shadow-lg hover:shadow-xl"
                onPress={trackOutboundClickConversion}
              >
                Get LucidHarmony - Pay What You Like
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center gap-6">
            <div className="max-w-3xl text-center">
              <h2 className={title({ size: "lg", color: "violet" })}>
                In 30 seconds...
              </h2>
            </div>

            <Spacer y={6} />

            <div className="w-full max-w-5xl">
              <div className="aspect-video overflow-hidden rounded-2xl border border-divider bg-content1 shadow-2xl">
                <iframe
                  className="h-full w-full"
                  src="https://www.youtube.com/embed/sSWSHgycSkk"
                  title="LucidHarmony in 30 seconds"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center gap-6">
            <div className="max-w-3xl text-center">
              <h2 className={title({ size: "lg", color: "violet" })}>
                In 5 minutes...
              </h2>
            </div>

            <Spacer y={6} />

            <div className="w-full max-w-5xl">
              <div className="aspect-video overflow-hidden rounded-2xl border border-divider bg-content1 shadow-2xl">
                <iframe
                  className="h-full w-full"
                  src="https://www.youtube.com/embed/HgQNWbGRb7M"
                  title="LucidHarmony in 5 minutes"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center gap-6">
            <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-10 items-stretch">
              <div className="flex h-full flex-col gap-4">
                <div className="flex min-h-0 flex-col gap-2 text-center lg:min-h-[160px] lg:text-left">
                  <h3
                    className={title({
                      size: "sm",
                      color: "violet",
                      class: "leading-tight text-balance",
                    })}
                  >
                    1. Generate
                  </h3>
                  <div className="text-sm leading-snug text-default-600 text-pretty">
                    Pick an AI model, starting chord and key. Click "Generate".
                    Get a random, harmonically-interesting story with any number
                    of chords.
                  </div>
                </div>
                <img
                  src="/images/four-chord-harmony.png"
                  alt="A harmonic story"
                  className="w-full h-auto rounded-2xl shadow-2xl object-cover lg:h-[320px]"
                />
              </div>
              <div className="flex h-full flex-col gap-4">
                <div className="flex min-h-0 flex-col gap-2 text-center lg:min-h-[160px] lg:text-left">
                  <h3
                    className={title({
                      size: "sm",
                      color: "violet",
                      class: "leading-tight text-balance",
                    })}
                  >
                    2. Drag MIDI
                  </h3>
                  <div className="text-sm leading-snug text-default-600 text-pretty">
                    Drop it into Logic. Everything is beautifully voiced,
                    including that stepwise bass line you've always wanted.
                  </div>
                </div>
                <img
                  src="/images/beautifully-voiced.png"
                  alt="Beautifuly voiced"
                  className="w-full h-auto rounded-2xl shadow-2xl object-cover lg:h-[320px]"
                />
              </div>
              <div className="flex h-full flex-col gap-4">
                <div className="flex min-h-0 flex-col gap-2 text-center lg:min-h-[160px] lg:text-left">
                  <h3
                    className={title({
                      size: "sm",
                      color: "violet",
                      class: "leading-tight text-balance",
                    })}
                  >
                    3. Any Instrument!
                  </h3>
                  <div className="text-sm leading-snug text-default-600 text-pretty">
                    Asign your favorite instrument for lush pads, choir, or ear
                    candy. Here is a quick sketch made from one generated
                    progression. No editing MIDI or keyboard required.
                  </div>
                </div>
                <SoundCloudEmbed
                  trackId={2234115233}
                  height={220}
                  visual
                  label=""
                  className="w-full overflow-hidden rounded-2xl border border-divider shadow-2xl h-[220px] sm:h-[260px] lg:h-[320px]"
                  attribution={{
                    userName: "lucidharmony",
                    userUrl: "https://soundcloud.com/lucidharmony",
                    trackTitle: "Listen on SoundCloud",
                    trackUrl: "https://soundcloud.com/lucidharmony/train-ride",
                  }}
                />
              </div>
            </div>
          </div>

          <Spacer y={16} />

          <div className="flex flex-col items-center gap-6">
            {/* <div className="w-full max-w-[480px]">
              <h1 className={title({ size: "sm", color: "violet" })}>
                Watch the Demo
              </h1>
              <a
                href="https://youtu.be/KAqe6vDsilo?si=KcentyJlQ8SDeNw7"
                target="_blank"
                rel="noopener noreferrer"
                className="block overflow-hidden rounded-xl border border-divider bg-content1 shadow-md transition-shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-violet-500/60"
                aria-label="Watch the LucidHarmony demo on YouTube"
              >
                <img
                  src="https://img.youtube.com/vi/KAqe6vDsilo/hqdefault.jpg"
                  alt="LucidHarmony demo video thumbnail"
                  className="h-[360px] w-full max-w-[480px] object-cover"
                  loading="lazy"
                />
              </a>
            </div> */}
            <Button
              as={Link}
              href="https://lucidmusician.gumroad.com/l/lucid-harmony"
              size="lg"
              radius="full"
              className="bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold text-lg px-8 py-6 shadow-lg hover:shadow-xl"
              onPress={trackOutboundClickConversion}
            >
              Get LucidHarmony - Pay What You Like
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2
            className={title({
              size: "lg",
              class: "text-center",
              color: "violet",
            })}
          >
            Key Features
          </h2>
          <Spacer y={16} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) =>
              (() => {
                const Icon = featureIcons[feature.icon];

                return (
                  <div
                    key={feature.title}
                    className="relative overflow-visible p-6 pt-12 rounded-xl bg-gradient-to-br from-content1 to-content2 border border-divider hover:shadow-lg transition-shadow"
                  >
                      <div className="absolute -top-6 -left-6 z-10 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-content1/80 backdrop-blur border border-divider shadow-md">
                        {Icon ? (
                          <Icon
                            className={`h-9 w-9 ${feature.iconColorClass}`}
                            aria-hidden="true"
                          />
                        ) : null}
                      </div>
                      <h3
                        className={title({
                          size: "sm",
                          class: feature.iconColorClass,
                        })}
                      >
                        {feature.title}
                      </h3>
                      <Spacer y={3} />
                      <p
                        className={`text-default-600 ${feature.iconColorClass}/80`}
                      >
                        {feature.description}
                      </p>
                  </div>
                );
              })(),
            )}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-content2">
        <div className="max-w-6xl mx-auto">
          <h2
            className={title({
              size: "lg",
              class: "text-center",
              color: "violet",
            })}
          >
            How It Works
          </h2>
          <Spacer y={16} />

          <div className="space-y-16">
            {operationSteps.map((step, index) => (
              <div
                key={step.title}
                className={`flex flex-col ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } gap-8 items-center`}
              >
                {/* Image Placeholder */}
                <div className="flex-1 w-full">
                  <div className="aspect-video rounded-xl shadow-xl bg-content1 border border-divider overflow-hidden">
                    <button
                      type="button"
                      className="block h-full w-full cursor-zoom-in"
                      onClick={() => openLightbox(`/${step.image}`, step.title)}
                    >
                      <img
                        src={`/${step.image}`}
                        alt={step.title}
                        className="h-full w-full object-contain"
                        loading="lazy"
                      />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className={title({ size: "md", color: "violet" })}>
                    {step.title}
                  </h3>
                  <Spacer y={4} />
                  <p className={subtitle({ class: "text-lg" })}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Audio Samples Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2
            className={title({
              size: "lg",
              class: "text-center",
              color: "violet",
            })}
          >
            Listen to more samples
          </h2>
          <Spacer y={16} />

          <div className="w-full max-w-4xl mx-auto">
            <p className={subtitle({ class: "text-xl md:text-2xl" })}>
              All samples in this album were created using LucidHarmony. MIDI
              was exported unedited into DAW tracks. No keyboards, no editing,
              no tweaking. It's beautiful from the very beginning.
            </p>
            <p className={subtitle({ class: "text-xl md:text-2xl" })}>
              The instruments are Omnisphere 3, Pigments 7, and Ashlight 2 in
              Kontakt 8 by Native Instruments. All this in Logic Pro, but works
              in any DAW.
            </p>
            <SoundCloudAlbumEmbed
              albumId={2162448524}
              height={300}
              visual
              color="#0066cc"
              label=""
              albumTitle="LucidHarmony Samples"
              albumUrl="https://soundcloud.com/lucidharmony/sets/lucid-harmony-samples"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={title({ size: "lg", color: "violet" })}>
            Ready to Transform Your Workflow?
          </h2>
          <Spacer y={6} />
          <p className={subtitle()}>
            Join musicians and composers using LucidHarmony to create beautiful,
            sophisticated harmonies in seconds.
          </p>
          <Spacer y={8} />
          <Button
            as={Link}
            href="https://lucidmusician.gumroad.com/l/lucid-harmony"
            size="lg"
            radius="full"
            className="bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold text-lg px-8 py-6 shadow-lg hover:shadow-xl"
            onPress={trackOutboundClickConversion}
          >
            Get LucidHarmony - Pay What You Like
          </Button>
        </div>
      </section>

      {lightboxSrc ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/70"
            onClick={closeLightbox}
            aria-label="Close image"
          />
          <div className="relative z-10 max-h-[90vh] max-w-[90vw] overflow-hidden rounded-2xl bg-content1 shadow-2xl">
            <button
              type="button"
              className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-content1/80 backdrop-blur border border-divider"
              onClick={closeLightbox}
              aria-label="Close image"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
            <img
              src={lightboxSrc}
              alt={lightboxAlt}
              className="max-h-[90vh] max-w-[90vw] object-contain"
            />
          </div>
        </div>
      ) : null}
    </DefaultLayout>
  );
}
