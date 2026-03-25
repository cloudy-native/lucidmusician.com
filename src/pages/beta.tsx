import { subtitle, title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import {
  AlertCircle,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Download,
} from "lucide-react";
import { useEffect, useState } from "react";

interface BetaDownload {
  name: string;
  fileName: string;
  releaseDate: string;
  requirements: string;
  installationInstructions?: string;
}

interface BetaVersion {
  version: string;
  changelog: string[];
  downloads: BetaDownload[];
}

interface BetaManifest {
  versions: BetaVersion[];
}

export default function BetaPage() {
  const [versions, setVersions] = useState<BetaVersion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/data/beta-downloads.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load beta downloads");
        }
        return response.json();
      })
      .then((data: BetaManifest) => {
        setVersions(data.versions);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading beta downloads:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const getPlatformIcon = (name: string) => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes("macos") || nameLower.includes("mac")) {
      return "🍎";
    }
    if (nameLower.includes("linux")) {
      return "🐧";
    }
    if (nameLower.includes("windows")) {
      return "🪟";
    }
    return "💻";
  };

  return (
    <DefaultLayout>
      <section className="relative flex flex-col items-center justify-center gap-8 py-10 px-4">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-violet-500/10 to-transparent" />
        <div className="w-full max-w-6xl">
          <div className="text-center mb-10">
            <h1 className={title({ size: "lg", color: "violet" })}>
              Beta Downloads
            </h1>
            <p className={subtitle({ class: "mx-auto mt-4 max-w-3xl" })}>
              Early access to the latest LucidHarmony builds. These are beta
              releases—expect some rough edges.
            </p>
          </div>

          {loading && (
            <div className="text-center py-12">
              <p className="text-lg text-default-600">Loading downloads...</p>
            </div>
          )}

          {error && (
            <div className="max-w-2xl mx-auto">
              <div className="rounded-xl border border-red-500/50 bg-red-500/10 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <h3 className="font-semibold text-red-900 dark:text-red-100">
                    Error Loading Downloads
                  </h3>
                </div>
                <p className="text-sm text-red-800 dark:text-red-200">
                  {error}
                </p>
              </div>
            </div>
          )}

          {!loading && !error && versions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-default-600">
                No beta downloads available at this time.
              </p>
            </div>
          )}

          {!loading && !error && versions.length > 0 && (
            <div className="space-y-12">
              {versions.map((versionData) => (
                <div
                  key={versionData.version}
                  className="overflow-hidden rounded-2xl border border-divider bg-content1 shadow-sm"
                >
                  <div className="p-6">
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-default-900 mb-1">
                        Version {versionData.version}
                      </h2>
                    </div>

                    {versionData.changelog &&
                      versionData.changelog.length > 0 && (
                        <div className="mb-6">
                          <h3 className="text-sm font-semibold text-default-800 mb-3">
                            What's New
                          </h3>
                          <ul className="space-y-2">
                            {versionData.changelog.map((item: string) => (
                              <li
                                key={`${versionData.version}-${item}`}
                                className="flex items-start gap-2 text-sm text-default-600"
                              >
                                <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600 dark:text-green-400 shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-default-800">
                        Available Downloads
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {versionData.downloads.map((download) => (
                          <div
                            key={`${versionData.version}-${download.fileName}`}
                            className="rounded-xl border border-divider bg-default-50 dark:bg-default-50/5 p-4"
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <div className="text-3xl">
                                {getPlatformIcon(download.name)}
                              </div>
                              <div>
                                <h4 className="font-semibold text-default-900">
                                  {download.name}
                                </h4>
                                <p className="text-xs text-default-500 font-mono">
                                  {download.fileName}
                                </p>
                              </div>
                            </div>

                            <div className="space-y-2 mb-4">
                              <div className="flex items-center gap-2 text-xs text-default-600">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>
                                  {new Date(
                                    download.releaseDate,
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="text-xs text-default-600">
                                <span className="font-semibold">
                                  Requirements:
                                </span>{" "}
                                {download.requirements}
                              </div>
                            </div>

                            {download.installationInstructions && (
                              <div className="mb-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                                <p className="text-xs text-blue-900 dark:text-blue-100">
                                  <span className="font-semibold">
                                    Installation:
                                  </span>{" "}
                                  {download.installationInstructions}
                                </p>
                              </div>
                            )}

                            <a
                              href={`/assets/beta/${download.fileName}`}
                              download
                              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-colors"
                            >
                              <Download className="h-4 w-4" />
                              Download
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-12 max-w-3xl mx-auto">
            <a
              href="https://lucidmusician.zohodesk.com/portal/en/newticket"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full px-6 py-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-lg transition-colors shadow-lg hover:shadow-xl mb-8"
            >
              <AlertTriangle className="h-6 w-6" />
              Please report any issues, no matter how small you think it is.
            </a>
          </div>

          <div className="mt-4 max-w-3xl mx-auto">
            <div className="rounded-xl border border-amber-500/50 bg-amber-500/10 p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                    Beta Software Notice
                  </h3>
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    These are pre-release versions intended for testing and
                    feedback. They may contain bugs, incomplete features, or
                    stability issues. Always back up your projects before using
                    beta software in production environments.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
