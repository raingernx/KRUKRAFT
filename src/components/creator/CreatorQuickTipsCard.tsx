import { Lightbulb } from "@/lib/icons";

const TIPS = [
  "Use a clear, descriptive title — buyers search for specific terms.",
  "Add multiple preview images to increase listing conversion rate.",
  "Price competitively for your niche and check similar resources in the marketplace.",
  "Write a detailed description covering what's included and who it's for.",
];

export function CreatorQuickTipsCard() {
  return (
    <div className="rounded-2xl border border-amber-100 bg-amber-50 px-6 py-5">
      <div className="flex items-center gap-2">
        <Lightbulb className="h-4 w-4 text-amber-600" />
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
          Quick tips
        </p>
      </div>

      <ul className="mt-4 space-y-3">
        {TIPS.map((tip, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-amber-800">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
}
