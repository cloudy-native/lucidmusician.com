import DefaultLayout from "@/layouts/default";
import {
	AlertOctagon,
	AlertTriangle,
	Info,
	Lightbulb,
	Sparkles,
} from "lucide-react";
import mermaid from "mermaid";
import {
	isValidElement,
	useEffect,
	useRef,
	useState,
	type ComponentProps,
	type ReactNode,
} from "react";
import type { ExtraProps } from "react-markdown";
import ReactMarkdown from "react-markdown";
import { Link as RouterLink } from "react-router-dom";
import { useTheme } from "@heroui/use-theme";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

let mermaidDiagramId = 0;

interface MarkdownPageProps {
	markdownPath: string;
}

const MermaidDiagram = ({ chart }: { chart: string }) => {
	const ref = useRef<HTMLDivElement>(null);
	const { theme } = useTheme();
	const renderSeq = useRef(0);
	const idRef = useRef(`mermaid-diagram-${++mermaidDiagramId}`);

	useEffect(() => {
		if (!ref.current) return;
		const seq = ++renderSeq.current;

		const isDark =
			theme === "dark" ||
			(!theme && document.documentElement.classList.contains("dark"));

		mermaid.initialize({
			startOnLoad: false,
			theme: isDark ? "dark" : "default",
			themeVariables: {
				background: "transparent",
				fontFamily: "inherit",
			},
		});

		ref.current.removeAttribute("data-processed");
		ref.current.innerHTML = "";

		void (async () => {
			try {
				const { svg, bindFunctions } = await mermaid.render(
					idRef.current,
					chart,
				);
				if (!ref.current) return;
				if (renderSeq.current !== seq) return;

				ref.current.innerHTML = svg;
				bindFunctions?.(ref.current);
			} catch (e) {
				// If the diagram is mid-update (theme toggle / strict mode), ignore stale renders.
				if (!ref.current) return;
				if (renderSeq.current !== seq) return;
				console.error("Failed to render mermaid diagram", e);
			}
		})();
	}, [chart, theme]);

	return (
		<div className="mermaid" ref={ref} />
	);
};

const getNodeText = (node: ReactNode): string => {
	if (node === null || node === undefined || typeof node === "boolean")
		return "";
	if (typeof node === "string" || typeof node === "number") return String(node);
	if (Array.isArray(node)) return node.map(getNodeText).join("");
	if (isValidElement(node)) return getNodeText(node.props.children);
	return "";
};

export default function MarkdownPage({ markdownPath }: MarkdownPageProps) {
	const [content, setContent] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		setLoading(true);
		setError(null);

		fetch(markdownPath)
			.then((response) => {
				if (!response.ok) {
					throw new Error(
						`Failed to load markdown file: ${response.statusText}`,
					);
				}
				return response.text();
			})
			.then((text) => {
				setContent(text);
				setLoading(false);
			})
			.catch((err) => {
				console.error("Error loading markdown:", err);
				setError(err.message);
				setLoading(false);
			});
	}, [markdownPath]);

	return (
		<DefaultLayout>
			<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
				<div className="w-full max-w-4xl px-4">
					{loading && (
						<div className="text-center">
							<p>Loading...</p>
						</div>
					)}
					{error && (
						<div className="text-center text-red-500">
							<p>Error: {error}</p>
						</div>
					)}
					{!loading && !error && (
						<article className="prose prose-md prose-p:leading-normal dark:prose-invert max-w-none prose-code:before:content-none prose-code:after:content-none">
							<ReactMarkdown
								remarkPlugins={[remarkGfm, remarkMath]}
								rehypePlugins={[rehypeKatex]}
								components={{
									pre({ children, className, ...rest }: ComponentProps<"pre"> & ExtraProps) {
										const childrenArray = Array.isArray(children)
											? children
											: [children];
										const mermaidChild = childrenArray.find(
											(child) => isValidElement(child) && child.type === MermaidDiagram,
										);

										if (mermaidChild && isValidElement(mermaidChild)) {
											return (
												<div className="not-prose my-6 overflow-x-auto rounded-xl border border-default-200 bg-default-50 p-4 dark:border-default-800 dark:bg-default-900/30">
													{mermaidChild}
												</div>
											);
										}

										return (
											<pre className={className} {...rest}>
												{children}
											</pre>
										);
									},
									a({
										href,
										className,
										children,
										...rest
									}: ComponentProps<"a"> & ExtraProps) {
										if (!href) {
											return (
												<a className={className} {...rest}>
													{children}
												</a>
											);
										}

										const isExternal =
											/^https?:\/\//i.test(href) || href.startsWith("//");

										if (isExternal) {
											return (
												<a
													href={href}
													className={className}
													target="_blank"
													rel="noopener noreferrer"
													{...rest}
												>
													{children}
												</a>
											);
										}

										if (href.startsWith("/")) {
											return (
												<RouterLink to={href} className={className} {...rest}>
													{children}
												</RouterLink>
											);
										}

										return (
											<a href={href} className={className} {...rest}>
												{children}
											</a>
										);
									},
									blockquote({
										className,
										children,
										...rest
									}: ComponentProps<"blockquote"> & ExtraProps) {
										const childrenArray = Array.isArray(children)
											? children
											: [children];
										const firstIndex = childrenArray.findIndex(
											(child) => getNodeText(child).trim().length > 0,
										);
										const first =
											firstIndex >= 0 ? childrenArray[firstIndex] : null;
										const firstText = getNodeText(first).trim();

										const match =
											/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\](?:\s+([^\n]+))?\s*([\s\S]*)$/i.exec(
												firstText,
											);

										if (!match) {
											return (
												<blockquote className={className} {...rest}>
													{children}
												</blockquote>
											);
										}

										const kind = match[1].toUpperCase();
										const customTitle = (match[2] || "").trim();
										const remainder = (match[3] || "").trim();

										const style =
											kind === "TIP"
												? "border-emerald-500/50 bg-emerald-500/10"
												: kind === "IMPORTANT"
													? "border-violet-500/50 bg-violet-500/10"
													: kind === "WARNING"
														? "border-amber-500/50 bg-amber-500/10"
														: kind === "CAUTION"
															? "border-red-500/50 bg-red-500/10"
															: "border-sky-500/50 bg-sky-500/10";

										const remainderLines = remainder
											? remainder
													.split(/\n{2,}/)
													.map((line) => line.trim())
													.filter(Boolean)
											: [];

										const body: ReactNode[] = [
											...remainderLines.map((line) => (
												<p key={`admonition-line-${kind}-${line}`}>{line}</p>
											)),
											...childrenArray.slice(firstIndex + 1),
										];

										const titleText = customTitle || kind.toLowerCase();
										const Icon =
											kind === "TIP"
												? Lightbulb
												: kind === "IMPORTANT"
													? Sparkles
													: kind === "WARNING"
														? AlertTriangle
														: kind === "CAUTION"
															? AlertOctagon
															: Info;

										const iconColor =
											kind === "TIP"
												? "text-emerald-600 dark:text-emerald-400"
												: kind === "IMPORTANT"
													? "text-violet-600 dark:text-violet-400"
													: kind === "WARNING"
														? "text-amber-600 dark:text-amber-400"
														: kind === "CAUTION"
															? "text-red-600 dark:text-red-400"
															: "text-sky-600 dark:text-sky-400";

										return (
											<blockquote
												className={`not-prose my-6 rounded-xl border-l-4 p-4 ${style} ${className || ""}`}
												{...rest}
											>
												<div className="mb-2 flex items-center gap-2 text-xs tracking-wide text-default-700">
													<Icon
														className={`h-4 w-4 shrink-0 ${iconColor}`}
														aria-hidden="true"
													/>
													{titleText}
												</div>
												<div className="prose prose-sm dark:prose-invert max-w-none">
													{body}
												</div>
											</blockquote>
										);
									},
									code({
										inline,
										className,
										children,
										...rest
									}: ComponentProps<"code"> &
										ExtraProps & { inline?: boolean }) {
										const match = /language-(\w+)/.exec(className || "");
										const language = match ? match[1] : "";

										if (!inline && language === "mermaid") {
											return (
												<MermaidDiagram
													chart={String(children).replace(/\n$/, "")}
												/>
											);
										}

										return (
											<code className={className} {...rest}>
												{children}
											</code>
										);
									},
								}}
							>
								{content}
							</ReactMarkdown>
						</article>
					)}
				</div>
			</section>
		</DefaultLayout>
	);
}
