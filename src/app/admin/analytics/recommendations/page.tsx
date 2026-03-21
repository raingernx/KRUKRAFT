import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getRecommendationReport, type VariantMetrics } from "@/services/analytics/recommendation-report.service";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/design-system/primitives/Card";

export const metadata = {
  title: "Recommendation Experiment – Admin",
  description: "Phase 1 vs Phase 2 A/B experiment report.",
};

export const dynamic = "force-dynamic";

// ── Formatters ────────────────────────────────────────────────────────────────

function fmt(n: number)    { return new Intl.NumberFormat().format(n); }
function fmtPct(n: number) { return `${n.toFixed(2)}%`; }

function daysAgo(n: number) {
  return new Date(Date.now() - n * 86_400_000).toISOString().slice(0, 10);
}
function today() { return new Date().toISOString().slice(0, 10); }

// ── Delta helpers ─────────────────────────────────────────────────────────────

/** Relative % change from a to b. Returns null when a === 0. */
function relativeDelta(a: number, b: number): string | null {
  if (a === 0) return b === 0 ? null : null;
  const d = ((b - a) / a) * 100;
  return `${d >= 0 ? "+" : ""}${d.toFixed(1)}%`;
}

/** Absolute pp change for CTR values that are already percentages. */
function ppDelta(a: number, b: number): string {
  const d = b - a;
  return `${d >= 0 ? "+" : ""}${d.toFixed(2)} pp`;
}

function deltaColor(a: number, b: number): string {
  if (b > a) return "text-emerald-600";
  if (b < a) return "text-red-500";
  return "text-zinc-400";
}

// ── Sub-components ────────────────────────────────────────────────────────────

const PRESETS = [
  { label: "Last 7 days",  start: () => daysAgo(7),  end: today      },
  { label: "Last 30 days", start: () => daysAgo(30), end: today      },
  { label: "All time",     start: () => "",           end: () => ""   },
] as const;

function PresetButtons({ start, end }: { start: string | null; end: string | null }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {PRESETS.map((p) => {
        const pStart = p.start();
        const pEnd   = p.end();
        const href   = pStart || pEnd
          ? `/admin/analytics/recommendations?start=${pStart}&end=${pEnd}`
          : "/admin/analytics/recommendations";
        const isActive =
          p.label === "All time"
            ? !start && !end
            : start === pStart && end === pEnd;
        return (
          <a
            key={p.label}
            href={href}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              isActive
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-700"
            }`}
          >
            {p.label}
          </a>
        );
      })}
    </div>
  );
}

function StatRow({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-zinc-500">{label}</span>
      <span className="text-sm font-semibold tabular-nums text-zinc-900">
        {value}
        {sub && <span className="ml-1.5 text-[11px] font-normal text-zinc-400">{sub}</span>}
      </span>
    </div>
  );
}

function VariantCard({
  phase,
  metrics,
  accent,
}: {
  phase:   string;
  metrics: VariantMetrics;
  accent:  "neutral" | "blue";
}) {
  const [title, desc] =
    accent === "blue"
      ? ["Phase 2", "Behavior-based · treatment arm"]
      : ["Phase 1", "Category-trending · control arm"];

  const accentBorder = accent === "blue" ? "border-blue-200" : "border-zinc-200";
  const ctrColor     = accent === "blue" ? "text-blue-600" : "text-zinc-800";

  return (
    <Card className={`rounded-2xl border ${accentBorder} p-0`}>
      <CardHeader className="border-b border-surface-100 px-6 pb-4 pt-5">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-zinc-900">{title}</CardTitle>
            <CardDescription className="mt-0.5 text-xs text-zinc-400">{desc}</CardDescription>
          </div>
          <span
            className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
              accent === "blue"
                ? "bg-blue-50 text-blue-600"
                : "bg-zinc-100 text-zinc-500"
            }`}
          >
            {phase}
          </span>
        </div>

        {/* CTR — primary KPI, prominent */}
        <div className="mt-4">
          <p className={`text-3xl font-bold tabular-nums ${ctrColor}`}>
            {fmtPct(metrics.ctr)}
          </p>
          <p className="mt-0.5 text-xs text-zinc-400">Click-through rate</p>
        </div>
      </CardHeader>

      <CardContent className="px-6 py-1">
        <div className="divide-y divide-zinc-100">
          <StatRow label="Impressions" value={fmt(metrics.impressions)} />
          <StatRow label="Clicks"      value={fmt(metrics.clicks)} />
          <StatRow label="Users"       value={fmt(metrics.users)}     sub="unique" />
          <StatRow label="Purchases"   value={fmt(metrics.purchases)} sub="post-click" />
        </div>
      </CardContent>
    </Card>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function RecommendationExperimentPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | undefined>>;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect("/auth/login?next=/admin/analytics/recommendations");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const params = searchParams ? await searchParams : {};
  const start  = params.start || null;
  const end    = params.end   || null;

  const report = await getRecommendationReport({ start, end });
  const { phase1, phase2 } = report;

  // ── Derived ────────────────────────────────────────────────────────────────

  const ctrDiff    = phase2.ctr - phase1.ctr;
  const ctrDiffAbs = Math.abs(ctrDiff).toFixed(2);
  const winner     = ctrDiff > 0 ? "Phase 2" : ctrDiff < 0 ? "Phase 1" : null;

  const totalImpressions = phase1.impressions + phase2.impressions;
  const totalClicks      = phase1.clicks + phase2.clicks;
  const overallCtr       = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

  const rangeLabel = report.isDefaultRange
    ? `Last 7 days  ·  ${report.filterStart} → ${report.filterEnd}`
    : start || end
      ? `${report.filterStart} → ${report.filterEnd}`
      : "All time";

  const bannerBg =
    winner === "Phase 2" ? "bg-emerald-50 border-emerald-200 text-emerald-800" :
    winner === "Phase 1" ? "bg-red-50 border-red-200 text-red-800"             :
                           "bg-zinc-50 border-zinc-200 text-zinc-600";

  const rawJsonHref = `/api/admin/recommendation-report${
    start || end ? `?start=${report.filterStart}&end=${report.filterEnd}` : ""
  }`;

  // Table rows: [label, p1 display, p2 display, delta string, sign]
  type TableRow = { label: string; p1: string; p2: string; delta: string | null; positive: boolean | null };
  const tableRows: TableRow[] = [
    {
      label:    "Impressions",
      p1:       fmt(phase1.impressions),
      p2:       fmt(phase2.impressions),
      delta:    relativeDelta(phase1.impressions, phase2.impressions),
      positive: phase2.impressions >= phase1.impressions,
    },
    {
      label:    "Clicks",
      p1:       fmt(phase1.clicks),
      p2:       fmt(phase2.clicks),
      delta:    relativeDelta(phase1.clicks, phase2.clicks),
      positive: phase2.clicks >= phase1.clicks,
    },
    {
      label:    "CTR",
      p1:       fmtPct(phase1.ctr),
      p2:       fmtPct(phase2.ctr),
      delta:    ppDelta(phase1.ctr, phase2.ctr),
      positive: phase2.ctr >= phase1.ctr,
    },
    {
      label:    "Users",
      p1:       fmt(phase1.users),
      p2:       fmt(phase2.users),
      delta:    relativeDelta(phase1.users, phase2.users),
      positive: phase2.users >= phase1.users,
    },
    {
      label:    "Purchases",
      p1:       fmt(phase1.purchases),
      p2:       fmt(phase2.purchases),
      delta:    relativeDelta(phase1.purchases, phase2.purchases),
      positive: phase2.purchases >= phase1.purchases,
    },
  ];

  return (
    <div className="space-y-8 px-6 py-8">

      {/* ── 1. Header ────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Recommendation Experiment
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Phase 1 vs Phase 2 performance ·{" "}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-600">
              {report.experimentId}
            </code>
          </p>
        </div>

        {/* Date range controls */}
        <div className="shrink-0">
          <PresetButtons start={start} end={end} />
          <form method="get" className="mt-2 flex items-end gap-2">
            <div className="flex flex-col gap-1">
              <label htmlFor="start" className="text-[10px] font-medium uppercase tracking-wide text-zinc-400">
                From
              </label>
              <input
                id="start"
                name="start"
                type="date"
                defaultValue={start ?? ""}
                className="w-36 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-400"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="end" className="text-[10px] font-medium uppercase tracking-wide text-zinc-400">
                To
              </label>
              <input
                id="end"
                name="end"
                type="date"
                defaultValue={end ?? ""}
                className="w-36 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-400"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
            >
              Apply
            </button>
          </form>
          {/* Active range indicator */}
          <p className="mt-2 flex items-center gap-1.5 text-[11px] text-zinc-400">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {rangeLabel}
            {report.isDefaultRange && <span>(default)</span>}
          </p>
        </div>
      </div>

      {/* ── 2. Top-level summary numbers ─────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total impressions", value: fmt(totalImpressions),  sub: "Both variants" },
          { label: "Total clicks",      value: fmt(totalClicks),       sub: "Both variants" },
          { label: "Overall CTR",       value: fmtPct(overallCtr),     sub: "clicks / impressions" },
        ].map(({ label, value, sub }) => (
          <div key={label} className="rounded-2xl border border-zinc-200 bg-white p-5">
            <p className="text-2xl font-bold tabular-nums text-zinc-900">{value}</p>
            <p className="mt-0.5 text-xs font-medium text-zinc-500">{label}</p>
            <p className="mt-1 text-[11px] text-zinc-400">{sub}</p>
          </div>
        ))}
      </div>

      {/* ── 3. Comparison banner ─────────────────────────────────────────── */}
      <div className={`rounded-2xl border px-6 py-4 ${bannerBg}`}>
        {winner === null ? (
          <p className="text-sm font-medium">
            Both variants have equal CTR — not enough data yet to determine a winner.
          </p>
        ) : (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-sm font-bold">{winner}</span>
            <span className="text-sm">outperforms the other variant by</span>
            <span className="text-lg font-bold tabular-nums">+{ctrDiffAbs}% CTR</span>
            <span className="text-xs opacity-60">· {rangeLabel}</span>
          </div>
        )}
      </div>

      {/* ── 4. KPI cards — Phase 1 | Phase 2 ────────────────────────────── */}
      <div>
        <h2 className="mb-4 text-lg font-medium text-zinc-700">Variant breakdown</h2>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <VariantCard phase="phase1" metrics={phase1} accent="neutral" />
          <VariantCard phase="phase2" metrics={phase2} accent="blue" />
        </div>
      </div>

      {/* ── 5. Comparison table ──────────────────────────────────────────── */}
      <div>
        <h2 className="mb-4 text-lg font-medium text-zinc-700">Side-by-side comparison</h2>
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">
                  Metric
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-zinc-400">
                  Phase 1
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-zinc-400">
                  Phase 2
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-zinc-400">
                  Delta
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {tableRows.map((row) => (
                <tr key={row.label} className="hover:bg-zinc-50/60 transition-colors">
                  <td className="px-5 py-3 font-medium text-zinc-700">{row.label}</td>
                  <td className="px-5 py-3 text-right tabular-nums text-zinc-500">{row.p1}</td>
                  <td className="px-5 py-3 text-right tabular-nums font-semibold text-zinc-900">{row.p2}</td>
                  <td className="px-5 py-3 text-right tabular-nums">
                    {row.delta === null ? (
                      <span className="text-zinc-300">—</span>
                    ) : (
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                          row.positive
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {row.delta}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-[11px] text-zinc-400">
          Delta = Phase 2 vs Phase 1. CTR delta shown in percentage points (pp).
          Positive is better for all metrics.
        </p>
      </div>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-t border-zinc-100 pt-4 text-[11px] text-zinc-400">
        <span>Generated at {report.generatedAt}</span>
        <a
          href={rawJsonHref}
          className="underline hover:text-zinc-600"
          target="_blank"
          rel="noopener noreferrer"
        >
          raw JSON
        </a>
      </div>

    </div>
  );
}
