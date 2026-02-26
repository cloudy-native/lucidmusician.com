import { Navbar } from "@/components/navbar";
import { type ReactNode, useEffect } from "react";

export default function DefaultLayout({
	children,
}: {
	children: ReactNode;
}) {
	useEffect(() => {
		if (typeof window === "undefined") return;

		type ZohoWindow = Window & {
			$zoho?: {
				salesiq?: {
					ready: () => void;
				};
			};
		};

		const zohoWindow = window as unknown as ZohoWindow;
		zohoWindow.$zoho = zohoWindow.$zoho || {};
		zohoWindow.$zoho.salesiq = zohoWindow.$zoho.salesiq || {
			ready: () => {},
		};

		if (document.getElementById("zsiqscript")) return;

		const script = document.createElement("script");
		script.id = "zsiqscript";
		script.src =
			"https://salesiq.zoho.com/widget?wc=siqdf47e495f388af9ebb6313380d12b6d6e4ddba171f75f59d971f83f9c8b6d9ad";
		script.defer = true;
		document.body.appendChild(script);
	}, []);

	return (
		<div className="relative flex flex-col h-screen">
			<Navbar />
			<main className="container mx-auto max-w-7xl px-6 flex-grow pt-16">
				{children}
			</main>
			<footer className="w-full flex items-center justify-center py-3">
				<p>Copyright &copy; {new Date().getFullYear()} Lucid Musician, all rights reserved</p>
			</footer>
		</div>
	);
}
