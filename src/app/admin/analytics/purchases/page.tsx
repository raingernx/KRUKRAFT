import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import {
  getPurchaseAnalytics,
  type FunnelStep,
} from "@/services/analytics/purchase-analytics.service";
import { formatPrice } from "@/lib/format";
import {
  DollarSign,
  CheckCircle,
  TrendingUp,
  Gift,
  Package,
  Download,
  CreditCard,
  ArrowDown,
} from "lucide-react";

export const metadata = {
  title: "Purchase Analytics – Admin",
  description: "Purchase funnel, revenue, and resource performance.",
};

export const dynamic = "force-dynamic";

// ── Formatters ────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return new Intl.NumberFormat().format(n);
}

function fmtPct(n: number | null): string {
  if (n === null) return "—";
  return `${n.toFixed(1)}%`;
}

function daysAgo(n: number) {
  return new Date(Date.now() - n * 86_400_000).toISOString().slice(0, 10);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

// ── Rate colour ───────────────────────────────────────────────────────────────

/**
 * Returns a Tailwind colour pair for a conversion rate badge.
 * Thresholds are intentionally generous — these vary wildly by step.
 */
function rateTone(rate: number | null): string {
  if (rate === null) return "bg-zinc-100 text-zinc-500";
  if (rate >= 70) return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
  if (rate >= 35) return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
  return "bg-red-50 text-red-600 ring-1 ring-red-200";
}

// ── Preset buttons ────────────────────────────────────────────────────────────

const PRESETS = [
  { label: "7d", start: () => daysAgo(7), end: today },
  { label: "30d", start: () => daysAgo(30), end: today },
  { label: "90d", start: () => daysAgo(90), end: today },
  { label: "All", start: () => "", end: () => "" },
] as const;

function PresetButtons({
  start,
  end,
}: {
  start: string | null;
  end: string | null;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {PRESETS.map((p) => {
        const pStart = p.start();
        const pEnd = p.end();
        const href =
          pStart || pEnd
            ? `/admin/analytics/purchases?start=${pStart}&end=${pEnd}`
            : "/admin/analytics/purchases";
        const isActive =
          p.label === "All"
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

// ── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5">
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-xl ${accent}`}
      >
        <Icon className="h-4 w-4" />
      </span>
      <p className="mt-3 text-2xl font-bold tabular-nums tracking-tight text-zinc-900">
        {value}
      </p>
      <p className="mt-0.5 text-xs font-medium text-zinc-600">{label}</p>
      {sub && <p className="mt-1 text-[11px] text-zinc-400">{sub}</p>}
    </div>
  );
}

// ── Spark bar ─────────────────────────────────────────────────────────────────

function SparkBar({
  data,
  colorClass = "bg-violet-400",
}: {
  data: { date: string; value: number }[];
  colorClass?: string;
}) {
  if (data.length === 0) {
    return (
      <div className="flex h-12 items-center justify-center text-xs text-zinc-300">
        No data
      </div>
    );
  }
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="flex h-12 items-end gap-px">
      {data.map((d) => {
        const pct = Math.round((d.value / max) * 100);
        return (
          <div
            key={d.date}
            title={`${d.date}: ${d.value}`}
            className={`flex-1 rounded-t ${colorClass} opacity-70 transition-opacity hover:opacity-100`}
            style={{ height: `${Math.max(pct, 2)}%` }}
          />
        );
      })}
    </div>
  );
}

// ── Funnel row ────────────────────────────────────────────────────────────────

function FunnelRow({
  step,
  isLast,
  topCount,
}: {
  step: FunnelStep;
  isLast: boolean;
  /** Count of step[0] — used to compute bar width relative to entry. */
  topCount: number;
}) {
  const barPct = topCount > 0 ? Math.min(Math.round((step.count / topCount) * 100), 100) : 0;

  return (
    <>
      <tr className="group transition-colors hover:bg-zinc-50/60">
        {/* Stage label */}
        <td className="px-5 py-4">
          <p className="text-sm font-semibold text-zinc-800">{step.label}</p>
          <p className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-zinc-400">
            {step.action}
          </p>
        </td>

        {/* Count + inline bar */}
        <td className="px-5 py-4">
          <p className="text-xl font-bold tabular-nums text-zinc-900">{fmt(step.count)}</p>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
            <div
              className="h-full rounded-full bg-violet-400 transition-all"
              style={{ width: `${barPct}%` }}
            />
          </div>
        </td>

        {/* Rate badge */}
        <td className="px-5 py-4 text-right">
          {step.rateFromPrev !== null ? (
            <div className="inline-flex flex-col items-end gap-0.5">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-sm font-bold tabular-nums ${rateTone(step.rateFromPrev)}`}
              >
                {fmtPct(step.rateFromPrev)}
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                {step.rateLabel}
              </span>
            </div>
          ) : (
            <span className="text-xs text-zinc-300">—</span>
          )}
        </td>
      </tr>

      {/* Arrow connector between steps */}
      {!isLast && (
        <tr aria-hidden>
          <td colSpan={3} className="px-5 py-0">
            <div className="flex items-center gap-2 py-1">
              <ArrowDown className="h-3.5 w-3.5 shrink-0 text-zinc-300" />
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function PurchaseAnalyticsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | undefined>>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/login?next=/admin/analytics/purchases");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const params = searchParams ? await searchParams : {};
  const start = params.start || null;
  const end = params.end || null;

  const report = await getPurchaseAnalytics({ start, end });

  const rangeLabel = report.isDefaultRange
    ? `Last 30 days · ${report.filterStart} → ${report.filterEnd}`
    : start || end
      ? `${report.filterStart} → ${report.filterEnd}`
      : "All time";

  // Provider breakdown: compute % of total completed purchases per row
  const totalProviderPurchases = report.providerBreakdown.reduce(
    (sum, r) => sum + r.purchaseCount,
    0,
  );

  // Daily series as {date, value} arrays for SparkBar
  const dailyPaidData = report.dailySeries.map((d) => ({
    date: d.date,
    value: d.paidCount,
  }));
  const dailyFreeData = report.dailySeries.map((d) => ({
    date: d.date,
    value: d.freeCount,
  }));

  // Entry count for funnel bar widths
  const funnelTopCount = report.funnelSteps[0]?.count ?? 0;

  return (
    <div className="space-y-10 px-6 py-8">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Purchase Analytics
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Full purchase funnel, revenue, and resource performance.
          </p>
        </div>

        {/* Date range controls */}
        <div className="shrink-0">
          <PresetButtons start={start} end={end} />
          <form method="get" className="mt-2 flex items-end gap-2">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="start"
                className="text-[10px] font-medium uppercase tracking-wide text-zinc-400"
              >
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
              <label
                htmlFor="end"
                className="text-[10px] font-medium uppercase tracking-wide text-zinc-400"
              >
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
          <p className="mt-2 flex items-center gap-1.5 text-[11px] text-zinc-400">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {rangeLabel}
            {report.isDefaultRange && <span>(default)</span>}
          </p>
        </div>
      </div>

      {/* ── Summary cards ───────────────────────────────────────────────────── */}
      <section aria-label="Summary">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
          Summary
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7">
          <StatCard
            label="Revenue"
            value={formatPrice(report.totalRevenue / 100)}
            sub="confirmed paid purchases"
            icon={DollarSign}
            accent="bg-emerald-50 text-emerald-600"
          />
          <StatCard
            label="Completed purchases"
            value={fmt(report.sessionsCompleted)}
            sub="paid · webhook confirmed"
            icon={CheckCircle}
            accent="bg-violet-50 text-violet-600"
          />
          <StatCard
            label="Conversion rate"
            value={fmtPct(report.paidConversionRate)}
            sub="completed / started"
            icon={TrendingUp}
            accent="bg-blue-50 text-blue-600"
          />
          <StatCard
            label="Free claims"
            value={fmt(report.freeClaims)}
            sub="free resource adds"
            icon={Gift}
            accent="bg-amber-50 text-amber-600"
          />
          <StatCard
            label="Total acquisitions"
            value={fmt(report.totalAcquisitions)}
            sub="paid + free"
            icon={Package}
            accent="bg-zinc-100 text-zinc-600"
          />
          <StatCard
            label="Downloads started"
            value={fmt(report.downloadsStarted)}
            sub="all resource types"
            icon={Download}
            accent="bg-sky-50 text-sky-600"
          />
          <StatCard
            label="Paid activations"
            value={fmt(report.firstPaidDownload)}
            sub={`${fmtPct(report.paidActivationRate)} of completed`}
            icon={TrendingUp}
            accent="bg-teal-50 text-teal-600"
          />
        </div>
      </section>

      {/* ── Funnel table ─────────────────────────────────────────────────────── */}
      <section aria-label="Purchase funnel">
        <div className="mb-3 flex items-baseline justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
            Checkout funnel
          </p>
          <p className="text-[11px] text-zinc-400">
            Source: ActivityLog events · step-to-step conversion
          </p>
        </div>

        {funnelTopCount === 0 ? (
          <div className="rounded-2xl border border-zinc-200 bg-white px-6 py-10 text-center text-sm text-zinc-400">
            No checkout events recorded in this date range.
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">
                    Stage
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">
                    Events
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-zinc-400">
                    vs previous
                  </th>
                </tr>
              </thead>
              <tbody>
                {report.funnelSteps.map((step, i) => (
                  <FunnelRow
                    key={step.action}
                    step={step}
                    isLast={i === report.funnelSteps.length - 1}
                    topCount={funnelTopCount}
                  />
                ))}
              </tbody>
            </table>

            {/* Rates summary strip */}
            <div className="border-t border-zinc-100 bg-zinc-50 px-5 py-3">
              <div className="flex flex-wrap gap-x-6 gap-y-1.5">
                {[
                  { label: "Redirect rate", value: report.redirectRate },
                  { label: "Completion rate", value: report.completionRate },
                  { label: "Return rate", value: report.returnRate },
                  { label: "Activation rate", value: report.activationRate },
                  { label: "Paid activation rate", value: report.paidActivationRate },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className="text-[11px] text-zinc-500">{label}</span>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${rateTone(value)}`}
                    >
                      {fmtPct(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ── Provider breakdown ───────────────────────────────────────────────── */}
      <section aria-label="Provider breakdown">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
          Provider breakdown
        </p>
        {report.providerBreakdown.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 bg-white px-6 py-10 text-center text-sm text-zinc-400">
            No completed purchases in this date range.
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">
                    Provider
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-zinc-400">
                    Purchases
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-zinc-400">
                    Share
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-zinc-400">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {report.providerBreakdown.map((row) => {
                  const sharePct =
                    totalProviderPurchases > 0
                      ? Math.round((row.purchaseCount / totalProviderPurchases) * 1000) / 10
                      : null;

                  return (
                    <tr
                      key={row.provider}
                      className="transition-colors hover:bg-zinc-50/60"
                    >
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center gap-2 font-medium text-zinc-700">
                          <CreditCard className="h-3.5 w-3.5 text-zinc-400" />
                          {row.provider}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums font-semibold text-zinc-900">
                        {fmt(row.purchaseCount)}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold tabular-nums text-zinc-600">
                          {sharePct !== null ? `${sharePct}%` : "—"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums font-semibold text-zinc-900">
                        {formatPrice(row.revenue / 100)}
                      </td>
                    </tr>
                  );
                })}

                {/* Revenue split rows */}
                {(report.platformFee > 0 || report.creatorShare > 0) && (
                  <>
                    <tr className="bg-zinc-50/60">
                      <td
                        colSpan={4}
                        className="px-5 py-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-400"
                      >
                        Revenue split (all providers)
                      </td>
                    </tr>
                    <tr className="transition-colors hover:bg-zinc-50/60">
                      <td className="px-5 py-2 text-zinc-500">Platform fee</td>
                      <td colSpan={2} />
                      <td className="px-5 py-2 text-right tabular-nums text-zinc-700">
                        {formatPrice(report.platformFee / 100)}
                      </td>
                    </tr>
                    <tr className="transition-colors hover:bg-zinc-50/60">
                      <td className="px-5 py-2 text-zinc-500">Creator share</td>
                      <td colSpan={2} />
                      <td className="px-5 py-2 text-right tabular-nums text-zinc-700">
                        {formatPrice(report.creatorShare / 100)}
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── Daily charts ─────────────────────────────────────────────────────── */}
      {report.dailySeries.length > 0 && (
        <section aria-label="Daily trends">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
            Daily trends
          </p>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Paid completions */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-5">
              <p className="text-sm font-semibold text-zinc-900">
                Paid completions per day
              </p>
              <p className="mt-0.5 text-[11px] text-zinc-400">
                Confirmed paid purchases by day of session.
              </p>
              <div className="mt-4">
                <SparkBar data={dailyPaidData} colorClass="bg-violet-400" />
              </div>
              <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-400">
                <span>{dailyPaidData[0]?.date ?? ""}</span>
                <span>Total: {fmt(report.sessionsCompleted)}</span>
                <span>{dailyPaidData[dailyPaidData.length - 1]?.date ?? ""}</span>
              </div>
            </div>

            {/* Free claims */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-5">
              <p className="text-sm font-semibold text-zinc-900">
                Free claims per day
              </p>
              <p className="mt-0.5 text-[11px] text-zinc-400">
                Free resource adds by day.
              </p>
              <div className="mt-4">
                <SparkBar data={dailyFreeData} colorClass="bg-amber-400" />
              </div>
              <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-400">
                <span>{dailyFreeData[0]?.date ?? ""}</span>
                <span>Total: {fmt(report.freeClaims)}</span>
                <span>{dailyFreeData[dailyFreeData.length - 1]?.date ?? ""}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Top resources ────────────────────────────────────────────────────── */}
      <section aria-label="Top resources">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
          Top paid resources
        </p>
        {report.topResources.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 bg-white px-6 py-10 text-center text-sm text-zinc-400">
            No paid purchases in this date range.
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">
                    #
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">
                    Resource
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-zinc-400">
                    Purchases
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-zinc-400">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {report.topResources.map((r, i) => (
                  <tr
                    key={r.resourceId}
                    className="transition-colors hover:bg-zinc-50/60"
                  >
                    <td className="w-10 px-5 py-3 text-[11px] font-bold tabular-nums text-zinc-400">
                      {i + 1}
                    </td>
                    <td className="px-5 py-3">
                      <Link
                        href={`/resources/${r.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-zinc-800 hover:text-blue-600 hover:underline"
                      >
                        {r.title}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums font-semibold text-zinc-900">
                      {fmt(r.purchaseCount)}
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums text-zinc-700">
                      {formatPrice(r.revenue / 100)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <div className="border-t border-zinc-100 pt-4 text-[11px] text-zinc-400">
        Generated at {report.generatedAt}
      </div>
    </div>
  );
}
