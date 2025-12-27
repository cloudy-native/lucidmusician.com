export interface Feature {
	title: string;
	description: string;
	icon: string;
	iconColorClass: string;
}

export interface OperationStep {
	title: string;
	description: string;
	image: string;
}

export const features: Feature[] = [
	{
		title: "Pay What You Like",
		description:
			"Fair pricing with a 30-day money-back guarantee and unlimited lifetime updates. You decide what it's worth. We really put our backs into this, and we hope you like it. If not, we'll be sorry to see you go, but grateful you gave it a shot.",
		icon: "BadgeDollarSign",
		iconColorClass: "text-emerald-600 dark:text-emerald-400",
	},
	{
		title: "Trained on 3,700+ Compositions",
		description:
			"We trained a powerful AI model on over 290,000 chords and sequences, expertly extracted from more than 18MB of MIDI data. We pulled a few stunts to make the LucidHarmony plugin generate beautiful harmonies efficiently.",
		icon: "Brain",
		iconColorClass: "text-sky-600 dark:text-sky-400",
	},
	{
		title: "Intelligent Voice Leading",
		description:
			"Automatic voice leading that follows traditional counterpoint rules, or explores modern harmonic possibilities with customizable parameters. Dial in what matters to you—like contrary motion and stepwise movement.",
		icon: "Route",
		iconColorClass: "text-fuchsia-600 dark:text-fuchsia-400",
	},
	{
		title: "Instant MIDI Export",
		description:
			"Drag and drop harmonic sequences into your DAW as single or multi-track MIDI, with configurable voice separation. If you like the sequence but the voicing needs work, tweak the voicing parameters and export again.",
		icon: "FileDown",
		iconColorClass: "text-amber-600 dark:text-amber-400",
	},
	{
		title: "Intuitive Harmony Explorer",
		description:
			"Edit progressions with scored alternatives, re-voicing, and parameter adjustments. Regenerate and revoice as many times as you like.",
		icon: "Sparkles",
		iconColorClass: "text-rose-600 dark:text-rose-400",
	},
	{
		title: "Flexible & Customizable",
		description:
			"Fine-tune generation with controls for creativity, voicing preferences, parallel intervals, harmonic styles, key, mode, and more.",
		icon: "SlidersHorizontal",
		iconColorClass: "text-indigo-600 dark:text-indigo-400",
	},
];

export const operationSteps: OperationStep[] = [
	{
		title: "1. Set Your Parameters",
		description:
			"Choose your key, mode, and harmonic style. Adjust creativity and voicing preferences to taste.",
		image: "set-harmonic-foundation.png",
	},
	{
		title: "2. Generate Harmonies",
		description:
			"Click Generate to create AI-powered chord progressions. Each generation is unique and musically coherent. Think it could be better? Regenerate as many times as you like.",
		image: "generate-sequence.png",
	},
	{
		title: "3. Refine & Voice",
		description:
			"Adjust voicing parameters to explore different voice leading options. You can build your sequences using an intuitive harmony explorer.",
		image: "refine-voicing.png",
	},
	{
		title: "4. Export to Your DAW",
		description:
			"Drag the MIDI directly into your project. Single or multi-track export with perfect voice separation.",
		image: "export-midi.png",
	},
	{
		title: "5. Become a harmonic wizard",
		description:
			"Drop into Edit Mode to create your own sequences interactively, guided by the same AI used by the generator. The intuitive Harmony Explorer makes it easy and fun to explore nearby and distant chords.",
		image: "edit-mode.png",
	},
];
