import { Reveal } from "./Reveal";

/**
 * Renders the heading with its last word in an elegant italic serif —
 * echoing the hero's "bold grotesque + italic serif" pairing site-wide.
 */
function SplitTitle({ title }: { title: string }) {
  const words = title.trim().split(/\s+/);
  if (words.length < 2) {
    return <span className="font-serif font-normal italic tracking-normal">{title}</span>;
  }
  const last = words.pop();
  const head = words.join(" ");
  return (
    <>
      {head}{" "}
      <span className="font-serif font-normal italic tracking-normal">
        {last}
      </span>
    </>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={
        align === "center"
          ? "mx-auto max-w-2xl text-center"
          : "max-w-2xl text-left"
      }
    >
      <Reveal>
        <span className="eyebrow">
          <span className="h-px w-6 bg-accent" />
          {eyebrow}
        </span>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="mt-4 text-3xl font-bold leading-[1.05] sm:text-4xl lg:text-5xl">
          <SplitTitle title={title} />
        </h2>
      </Reveal>
      {description ? (
        <Reveal delay={0.1}>
          <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">
            {description}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
