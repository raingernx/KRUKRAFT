import { Lightbulb } from "@/lib/icons";

interface Tip {
  heading: string;
  body: string;
}

const TIPS: Tip[] = [
  {
    heading: "Write a specific title",
    body: "Good titles describe the subject and level. \u201cGrade 5 Fractions Worksheet\u201d converts better than \u201cMath Resource\u201d.",
  },
  {
    heading: "Describe the outcome",
    body: "Tell buyers exactly what they get and who it\u2019s for. A clear outcome removes doubt and improves search ranking.",
  },
  {
    heading: "Start as a draft",
    body: "Save a draft first to make sure all the details look right, then publish when you\u2019re ready. You can publish any time from the resource manager.",
  },
  {
    heading: "Add a preview image",
    body: "Listings with a cover image get significantly more clicks. Use a clean, readable thumbnail that shows the content style.",
  },
];

export function CreatorResourceHelperCard() {
  return (
    <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
          <Lightbulb className="h-3.5 w-3.5" />
        </span>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
          Tips for a strong first listing
        </p>
      </div>

      <ul className="mt-4 space-y-3">
        {TIPS.map((tip) => (
          <li key={tip.heading}>
            <p className="text-xs font-semibold text-amber-800">{tip.heading}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-amber-700">{tip.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
