import { Button } from "@heroui/button";
import DefaultLayout from "@/layouts/default";
import { subtitle, title } from "@/components/primitives";
import { Link as RouterLink } from "react-router-dom";

export default function NotFoundPage() {
	return (
		<DefaultLayout>
			<section className="relative flex flex-col items-center justify-center py-20">
				<div className="absolute inset-0 -z-10 bg-gradient-to-b from-violet-500/10 to-transparent" />
				<div className="max-w-2xl px-4 text-center">
					<div className="mx-auto mb-8 w-48 md:w-64 lg:w-80">
						<img
							src="/images/sad-music-note.png"
							alt="Sad music note"
							className="h-auto w-full"
							loading="lazy"
						/>
					</div>
					<div className="text-7xl md:text-8xl font-bold tracking-tight text-default-300">
						404
					</div>
					<h1 className={title({ size: "lg", color: "violet", class: "mt-4" })}>
						Page not found
					</h1>
					<p className={subtitle({ class: "mt-4" })}>
						The page you’re looking for doesn’t exist (or it may have moved).
					</p>
					<div className="mt-10 flex flex-wrap items-center justify-center gap-4">
						<Button
							as={RouterLink}
							to="/"
							size="lg"
							color="primary"
							variant="shadow"
							className="font-semibold"
						>
							Go Home
						</Button>
						<Button
							as={RouterLink}
							to="/docs"
							size="lg"
							variant="bordered"
							className="font-semibold"
						>
							Docs
						</Button>
					</div>
				</div>
			</section>
		</DefaultLayout>
	);
}
