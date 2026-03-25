import { subtitle, title } from "@/components/primitives";
import { teamMembers } from "@/data/team";
import DefaultLayout from "@/layouts/default";

export default function AboutPage() {
  return (
    <DefaultLayout>
      <section className="relative flex flex-col items-center justify-center gap-8 py-10 px-4">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-violet-500/10 to-transparent" />
        <div className="w-full max-w-6xl">
          <div className="text-center mb-10">
            <h1 className={title({ size: "lg", color: "violet" })}>The Team</h1>
            <p className={subtitle({ class: "mx-auto mt-4 max-w-3xl" })}>
              A dedicated and eclectic team of specialists, who are not at all
              the same person really.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member) => (
              <div
                key={`${member.jobTitle}-${member.name}`}
                className="overflow-hidden rounded-2xl border border-divider bg-content1 shadow-sm"
              >
                <div className="aspect-square w-full bg-default-100">
                  <img
                    src={member.imageSrc}
                    alt={member.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <div className="text-xs font-semibold tracking-wide text-default-500">
                    {member.jobTitle}
                  </div>
                  <div className="mt-1 text-xl font-semibold text-default-900">
                    {member.name}
                  </div>
                  <div className="mt-3 text-sm text-default-600">
                    “{member.motto}”
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-default-700">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
