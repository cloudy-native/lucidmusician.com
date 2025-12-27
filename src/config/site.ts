export type SiteConfig = typeof siteConfig;

type NavItem = {
	label: string;
	href: string;
};

const navItems: NavItem[] = [
	{
		label: "Home",
		href: "/",
	},
	{
		label: "Docs",
		href: "/docs",
	},
	{
		label: "Release Notes",
		href: "/release-notes",
	},
	{
		label: "Blog",
		href: "/blog",
	},
	{
		label: "About",
		href: "/about",
	},
];

export const siteConfig = {
	name: "Vite + HeroUI",
	description: "Make beautiful websites regardless of your design experience.",
	navItems,
	navMenuItems: navItems,
	links: {
		github: "https://github.com/heroui-inc/heroui",
		twitter: "https://twitter.com/hero_ui",
		docs: "https://heroui.com",
		discord: "https://discord.gg/9b6yyZKmH4",
		sponsor: "https://patreon.com/jrgarciadev",
	},
};
