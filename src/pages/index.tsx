import { subtitle, title } from "@/components/primitives";
import SoundCloudEmbed from "@/components/SoundCloudEmbed";
import SoundCloudAlbumEmbed from "@/components/SoundCloudAlbumEmbed";
import { features, operationSteps } from "@/data/features";
import DefaultLayout from "@/layouts/default";
import { Button } from "@heroui/button";
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
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [lightboxAlt, setLightboxAlt] = useState<string>("");

  const openLightbox = useCallback((src: string, alt: string) => {
    setLightboxSrc(src);
    setLightboxAlt(alt);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxSrc(null);
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
      <section className="relative flex flex-col items-center justify-center gap-8 py-8 md:py-8 px-4">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-violet-500/10 to-transparent" />

        <div className="max-w-3xl text-center">
          <h1 className={title({ size: "lg", color: "violet" })}>
            Introducing LucidHarmony
          </h1>
          <Spacer y={6} />
          <div className="grid grid-cols-1 gap-4 text-left md:grid-cols-3">
            <div className="rounded-2xl border border-divider bg-gradient-to-br from-violet-500/15 via-content1 to-content2 p-5 shadow-sm">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 text-violet-600">
                <Brain className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="text-base md:text-lg font-semibold text-default-800">
                Centuries of harmony
              </div>
              <p
                className={subtitle({ class: "text-base md:text-lg !w-full" })}
              >
                An innovative AI-powered harmony generation plugin. Centuries of
                harmonic knowledge at your fingertips.
              </p>
            </div>

            <div className="rounded-2xl border border-divider bg-gradient-to-br from-cyan-500/15 via-content1 to-content2 p-5 shadow-sm">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-600">
                <Sparkles className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="text-base md:text-lg font-semibold text-default-800">
                Always surprising
              </div>
              <p
                className={subtitle({ class: "text-base md:text-lg !w-full" })}
              >
                Always random, always harmonious. One click to create anything
                from Renaissance polyphony to swirling ambient.
              </p>
            </div>

            <div className="rounded-2xl border border-divider bg-gradient-to-br from-green-500/15 via-content1 to-content2 p-5 shadow-sm">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/15 text-green-600">
                <SlidersHorizontal className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="text-base md:text-lg font-semibold text-default-800">
                No fiddling required
              </div>
              <p
                className={subtitle({ class: "text-base md:text-lg !w-full" })}
              >
                No music theory required. No editing. No tweaking. No fiddling.
                It's beautiful from the very beginning.
              </p>
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
                "LucidHarmony Plugin Interface"
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
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center gap-6">
            <div className="max-w-3xl text-center">
              <h1 className={title({ size: "lg", color: "violet" })}>
                If you only listen to one thing...
              </h1>
            </div>
            <Spacer y={6} />

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
                    3. Listen!
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
              size="lg"
              color="primary"
              variant="shadow"
              className="font-semibold"
              as="a"
              href="https://lucidmusician.gumroad.com/l/lucid-harmony"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download Now
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
              })()
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
              was exported unedited into DAW tracks.
            </p>
            <p className={subtitle({ class: "text-xl md:text-2xl" })}>
              The instruments are Omnisphere 3, Pigments 7, and Ashlight 2 in
              Kontakt 8 by Native Instruments. All this in Logic Pro.
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
            size="lg"
            color="primary"
            variant="shadow"
            className="font-semibold"
            as="a"
            href="https://lucidmusician.gumroad.com/l/lucid-harmony"
            target="_blank"
            rel="noopener noreferrer"
          >
            Get LucidHarmony
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
