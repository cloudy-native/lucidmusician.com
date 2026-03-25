export interface TeamMember {
	name: string;
	jobTitle: string;
	motto: string;
	bio: string;
	imageSrc: string;
}

export const teamMembers: TeamMember[] = [
	{
		name: 'Stephen "SJ" Harrison',
		jobTitle: "Chief Executive Officer",
		motto: "Always delegate",
		bio: "“SJ” keeps Lucid Musician pointed at the right problems and away from the wrong meetings. He studied computer science, then promptly used it to build music tools instead of sensible things. He owns strategy, roadmap, partnerships, and the ongoing negotiation between ‘this would be cool’ and ‘this will ship’.",
		imageSrc: "/images/headshots/ceo.jpeg",
	},
	{
		name: 'Stephen "James Roger" Harrison',
		jobTitle: "Chief Music Officer",
		motto: "You pay extra for black notes",
		bio: "“James Roger” keeps the musical side honest: the chords need to sound good, not just look good on paper. With a practical education in theory and composition (and the humbling realities of the piano roll), he defines musical goals and tests every feature like it’s going into a real session. He translates ‘make it more cinematic’ into constraints the other Stephens can actually implement.",
		imageSrc: "/images/headshots/musician.jpeg",
	},
	{
		name: "S. James Roger Harrison",
		jobTitle: "Lead Software Engineer",
		motto: "It builds, it ships",
		bio: "S. James builds both the LucidHarmony plugin and the website. With a software engineering background and a preference for boring reliability, he owns implementation, integration, and release readiness. His responsibilities include keeping the build green, the UX snappy, and the definition of ‘done’ consistent across all… departments.",
		imageSrc: "/images/headshots/developer.jpeg",
	},
	{
		name: "Stephen James Roger H. Harrison",
		jobTitle: "Brand & Visual Designer",
		motto: "I don't do pixels or RGB",
		bio: "H. Harrison keeps the visuals clean, consistent, and quietly confident. Educated in the school of ‘make it readable first,’ he learned design by shipping real pages and refining what didn’t hold up. He owns brand, layout, UI polish, and the gentle removal of anything that looks like it was done at 2 a.m.",
		imageSrc: "/images/headshots/design.jpeg",
	},
	{
		name: "Stephen J. Roger Harrison",
		jobTitle: "Chief Content Officer",
		motto: "As long as the lighting's good",
		bio: "Stephen J. runs content with one rule: clarity beats hype. With a background in software and a long practice of translating ‘we changed some things’ into ‘here’s why you care,’ he owns documentation, tutorials, screenshots, and release notes. If it can’t survive a demo, it doesn’t survive the copy edit.",
		imageSrc: "/images/headshots/content.jpeg",
	},
	{
		name: "Stephen James R. Harrison",
		jobTitle: "CFO (and Head of Accounting)",
		motto: "No such thing as a rounding error",
		bio: "James R. runs finance with the calm precision of a metronome at 60 BPM. Educated in quantitative methods and permanently scarred by real-world reconciliation, he keeps the books clean and the pricing honest. He’s responsible for payouts, receipts, and ensuring that ‘pay-what-you-want’ still adds up to ‘keep-building-the-plugin’.",
		imageSrc: "/images/headshots/cfo.jpeg",
	},
];
