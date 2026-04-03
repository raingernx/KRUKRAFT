"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";
import { ChevronDown, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import {
  Button,
  Card,
  Input,
  PageContent,
  PickerActionButton,
  PickerActions,
  Select,
  Switch,
  Textarea,
  useToast,
} from "@/design-system";
import { HeroSurface } from "@/components/marketplace/HeroSurface";
import {
  HERO_COLOR_TOKEN_OPTIONS,
  HERO_STYLE_DEFAULTS,
  HERO_STYLE_OPTIONS,
  type HeroColorTokenOption,
  type HeroBadgeBgColor,
  type HeroBadgeTextColor,
  type HeroBodyFont,
  type HeroContentWidth,
  type HeroHeadingFont,
  type HeroHeight,
  type HeroMobileSubtitleSize,
  type HeroMobileTitleSize,
  type HeroOverlayColor,
  type HeroPrimaryCtaColor,
  type HeroPrimaryCtaVariant,
  type HeroSecondaryCtaColor,
  type HeroSecondaryCtaVariant,
  type HeroSpacingPreset,
  type HeroSubtitleColor,
  type HeroSubtitleSize,
  type HeroSubtitleWeight,
  type HeroTextAlign,
  type HeroTitleColor,
  type HeroTitleSize,
  type HeroTitleWeight,
} from "@/lib/heroes/hero-style";

const HERO_MEDIA_ACCEPT = "image/png,image/jpeg,image/jpg,image/webp,image/gif";
const HERO_MEDIA_MAX_BYTES = 5 * 1024 * 1024;
const HERO_TYPES = [
  { value: "fallback", label: "Fallback" },
  { value: "featured", label: "Featured" },
  { value: "promotion", label: "Promotion" },
  { value: "seasonal", label: "Seasonal" },
  { value: "search", label: "Search" },
] as const;

type HeroTypeValue = (typeof HERO_TYPES)[number]["value"];
type MediaTypeValue = "" | "image" | "gif";

export interface HeroFormValues {
  name: string;
  type: HeroTypeValue;
  title: string;
  subtitle: string;
  badgeText: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  imageUrl: string;
  mediaUrl: string;
  mediaType: MediaTypeValue;
  textAlign: HeroTextAlign;
  contentWidth: HeroContentWidth;
  heroHeight: HeroHeight;
  spacingPreset: HeroSpacingPreset;
  headingFont: HeroHeadingFont;
  bodyFont: HeroBodyFont;
  titleSize: HeroTitleSize;
  subtitleSize: HeroSubtitleSize;
  titleWeight: HeroTitleWeight;
  subtitleWeight: HeroSubtitleWeight;
  mobileTitleSize: HeroMobileTitleSize;
  mobileSubtitleSize: HeroMobileSubtitleSize;
  titleColor: HeroTitleColor;
  subtitleColor: HeroSubtitleColor;
  badgeTextColor: HeroBadgeTextColor;
  badgeBgColor: HeroBadgeBgColor;
  primaryCtaVariant: HeroPrimaryCtaVariant;
  secondaryCtaVariant: HeroSecondaryCtaVariant;
  primaryCtaColor: HeroPrimaryCtaColor;
  secondaryCtaColor: HeroSecondaryCtaColor;
  overlayColor: HeroOverlayColor;
  overlayOpacity: number;
  priority: number;
  weight: number;
  experimentId: string;
  variant: string;
  abGroup: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

interface HeroFormProps {
  mode: "create" | "edit";
  heroId?: string;
  initialValues: HeroFormValues;
  isFallback?: boolean;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return <p className="text-xs text-red-600">{message}</p>;
}

function HeroColorField<T extends string>({
  label,
  name,
  value,
  options,
  helper,
  onChange,
}: {
  label: string;
  name: string;
  value: T;
  options: readonly HeroColorTokenOption<T>[];
  helper?: string;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-text-primary">{label}</legend>
      {helper ? <p className="text-xs text-text-secondary">{helper}</p> : null}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const checked = option.value === value;

          return (
            <label
              key={option.value}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 transition-colors",
                checked
                  ? "border-brand-500 bg-brand-50 shadow-sm"
                  : "border-surface-200 bg-white hover:border-surface-300 hover:bg-surface-50",
              )}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={checked}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              <span
                aria-hidden
                className={cn("h-5 w-5 shrink-0 rounded-full", option.swatchClassName)}
              />
              <span className="min-w-0 text-sm font-medium text-text-primary">
                {option.label}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Card className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <div className="space-y-1 border-b border-surface-100 px-5 py-4 sm:px-6">
        <h3 className="text-base font-semibold text-text-primary">{title}</h3>
        {description ? (
          <p className="text-sm leading-6 text-text-secondary">{description}</p>
        ) : null}
      </div>
      <div className="space-y-4 p-5 sm:p-6">{children}</div>
    </Card>
  );
}

function CollapsibleSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <details className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 px-5 py-4 sm:px-6 [&::-webkit-details-marker]:hidden">
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-text-primary">{title}</h3>
          {description ? (
            <p className="text-sm leading-6 text-text-secondary">{description}</p>
          ) : null}
        </div>
        <ChevronDown
          aria-hidden
          className="mt-1 h-4 w-4 shrink-0 text-text-muted transition-transform duration-200 ease-out"
        />
      </summary>
      <div className="border-t border-surface-100 p-5 sm:p-6">{children}</div>
    </details>
  );
}

function buildPreviewConfig(values: HeroFormValues) {
  return {
    title: values.title,
    subtitle: values.subtitle,
    badgeText: values.badgeText || null,
    primaryCtaText: values.primaryCtaText,
    primaryCtaLink: values.primaryCtaLink,
    secondaryCtaText: values.secondaryCtaText || null,
    secondaryCtaLink: values.secondaryCtaLink || null,
    imageUrl: values.imageUrl || null,
    mediaUrl: values.mediaUrl || null,
    mediaType: values.mediaType || null,
    textAlign: values.textAlign,
    contentWidth: values.contentWidth,
    heroHeight: values.heroHeight,
    spacingPreset: values.spacingPreset,
    headingFont: values.headingFont,
    bodyFont: values.bodyFont,
    titleSize: values.titleSize,
    subtitleSize: values.subtitleSize,
    titleWeight: values.titleWeight,
    subtitleWeight: values.subtitleWeight,
    mobileTitleSize: values.mobileTitleSize,
    mobileSubtitleSize: values.mobileSubtitleSize,
    titleColor: values.titleColor,
    subtitleColor: values.subtitleColor,
    badgeTextColor: values.badgeTextColor,
    badgeBgColor: values.badgeBgColor,
    primaryCtaVariant: values.primaryCtaVariant,
    secondaryCtaVariant: values.secondaryCtaVariant,
    primaryCtaColor: values.primaryCtaColor,
    secondaryCtaColor: values.secondaryCtaColor,
    overlayColor: values.overlayColor,
    overlayOpacity: values.overlayOpacity,
  };
}

export function HeroForm({ mode, heroId, initialValues, isFallback = false }: HeroFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [values, setValues] = useState<HeroFormValues>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const previewConfig = useMemo(() => buildPreviewConfig(values), [values]);
  const visibleHeroTypes = isFallback
    ? HERO_TYPES
    : HERO_TYPES.filter((type) => type.value !== "fallback");
  const secondaryCtaColorOptions = useMemo(
    () =>
      values.secondaryCtaVariant === "secondary"
        ? HERO_COLOR_TOKEN_OPTIONS.secondaryCtaColor
        : HERO_COLOR_TOKEN_OPTIONS.secondaryCtaColor.filter(
            (option) => option.value !== "dark",
          ),
    [values.secondaryCtaVariant],
  );

  function updateValue<K extends keyof HeroFormValues>(key: K, value: HeroFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) {
        return prev;
      }

      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function buildPayload() {
    return {
      ...(mode === "edit" && heroId ? { id: heroId } : {}),
      name: values.name,
      type: values.type,
      title: values.title,
      subtitle: values.subtitle || null,
      badgeText: values.badgeText || null,
      primaryCtaText: values.primaryCtaText || null,
      primaryCtaLink: values.primaryCtaLink || null,
      secondaryCtaText: values.secondaryCtaText || null,
      secondaryCtaLink: values.secondaryCtaLink || null,
      imageUrl: values.imageUrl || null,
      mediaUrl: values.mediaUrl || null,
      mediaType: values.mediaType || null,
      textAlign: values.textAlign,
      contentWidth: values.contentWidth,
      heroHeight: values.heroHeight,
      spacingPreset: values.spacingPreset,
      headingFont: values.headingFont,
      bodyFont: values.bodyFont,
      titleSize: values.titleSize,
      subtitleSize: values.subtitleSize,
      titleWeight: values.titleWeight,
      subtitleWeight: values.subtitleWeight,
      mobileTitleSize: values.mobileTitleSize,
      mobileSubtitleSize: values.mobileSubtitleSize,
      titleColor: values.titleColor,
      subtitleColor: values.subtitleColor,
      badgeTextColor: values.badgeTextColor,
      badgeBgColor: values.badgeBgColor,
      primaryCtaVariant: values.primaryCtaVariant,
      secondaryCtaVariant: values.secondaryCtaVariant,
      primaryCtaColor: values.primaryCtaColor,
      secondaryCtaColor: values.secondaryCtaColor,
      overlayColor: values.overlayColor,
      overlayOpacity: values.overlayOpacity,
      priority: Number.isFinite(values.priority) ? values.priority : 0,
      weight: Number.isFinite(values.weight) ? values.weight : 1,
      experimentId: values.experimentId || null,
      variant: values.variant || null,
      abGroup: values.abGroup || null,
      startDate: values.startDate ? new Date(values.startDate).toISOString() : null,
      endDate: values.endDate ? new Date(values.endDate).toISOString() : null,
      isActive: values.isActive,
    };
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setErrors({});

    try {
      const res = await fetch("/api/admin/heroes", {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErrors(data.fields ?? data.details?.fieldErrors ?? {});
        toast.error(data.error ?? `Failed to ${mode} hero.`);
        return;
      }

      toast.success(mode === "create" ? "Hero created." : "Hero updated.");
      router.push(routes.adminHeroes);
      router.refresh();
    } catch {
      toast.error(`Failed to ${mode} hero.`);
    } finally {
      setSaving(false);
    }
  }

  async function handleMediaUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (file.size > HERO_MEDIA_MAX_BYTES) {
      toast.error("File too large. Maximum size is 5 MB.");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload/image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(data.error ?? "Upload failed.");
        return;
      }

      updateValue("mediaUrl", data.url ?? "");
      updateValue("mediaType", file.type === "image/gif" ? "gif" : "image");
      toast.success("Hero media uploaded.");
    } catch {
      toast.error("Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  function handleRemoveMedia() {
    updateValue("mediaUrl", "");
    updateValue("mediaType", "");
  }

  return (
    <PageContent className="grid gap-6 xl:grid-cols-[minmax(0,1.02fr)_420px]">
      <div className="min-w-0 space-y-6">
        <Card className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <div className="space-y-2 px-5 py-4 sm:px-6">
            <h2 className="text-lg font-semibold text-text-primary">
              {mode === "create" ? "Create hero campaign" : "Update hero campaign"}
            </h2>
            <p className="max-w-3xl text-sm leading-6 text-text-secondary">
              {isFallback
                ? "This protected fallback keeps discover populated whenever no campaign hero is eligible. Focus on headline, artwork, and one clear action."
                : "Use this editor to update the shared marketplace hero surface. Keep the message tight, swap artwork when needed, and tuck visual tuning into the advanced controls."}
            </p>
          </div>
        </Card>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <FormSection
            title="Hero basics"
            description="Give the campaign a clear internal name, choose its role, and define when it can run."
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-primary" htmlFor="hero-name">
                  Name
                </label>
                <Input
                  id="hero-name"
                  value={values.name}
                  onChange={(event) => updateValue("name", event.target.value)}
                  placeholder="Spring exam prep push"
                />
                <FieldError message={errors.name} />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-primary" htmlFor="hero-type">
                  Type
                </label>
                <Select
                  id="hero-type"
                  value={values.type}
                  disabled={isFallback}
                  onChange={(event) =>
                    updateValue("type", event.target.value as HeroTypeValue)
                  }
                >
                  {visibleHeroTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Select>
                <FieldError message={errors.type} />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <span className="text-sm font-medium text-text-primary">Active</span>
                <div className="flex items-center gap-3 rounded-xl border border-surface-200 bg-surface-50 px-3 py-3">
                  <Switch
                    checked={values.isActive}
                    disabled={isFallback}
                    onCheckedChange={(checked) => updateValue("isActive", checked)}
                  />
                  <span className="text-sm text-text-secondary">
                    {isFallback
                      ? "Always active as the marketplace safety net"
                      : values.isActive
                        ? "Eligible for homepage rotation"
                        : "Saved but not currently serving"}
                  </span>
                </div>
                <FieldError message={errors.isActive} />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-primary" htmlFor="hero-start-date">
                  Start date
                </label>
                <Input
                  id="hero-start-date"
                  type="datetime-local"
                  value={values.startDate}
                  disabled={isFallback}
                  onChange={(event) => updateValue("startDate", event.target.value)}
                />
                <FieldError message={errors.startDate} />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-primary" htmlFor="hero-end-date">
                  End date
                </label>
                <Input
                  id="hero-end-date"
                  type="datetime-local"
                  value={values.endDate}
                  disabled={isFallback}
                  onChange={(event) => updateValue("endDate", event.target.value)}
                />
                <FieldError message={errors.endDate} />
              </div>
            </div>
            {isFallback ? (
              <p className="text-xs text-text-muted">
                Fallback heroes ignore campaign timing and stay ready whenever no scheduled hero qualifies.
              </p>
            ) : null}
          </FormSection>

          <FormSection
            title="Copy and actions"
            description="These are the only fields most editors need. The right support card stays structurally fixed so campaigns remain consistent."
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-sm font-medium text-text-primary" htmlFor="hero-title">
                  Headline
                </label>
                <Input
                  id="hero-title"
                  value={values.title}
                  onChange={(event) => updateValue("title", event.target.value)}
                  placeholder="Discover classroom-ready study resources"
                />
                <FieldError message={errors.title} />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-sm font-medium text-text-primary" htmlFor="hero-subtitle">
                  Supporting copy
                </label>
                <Textarea
                  id="hero-subtitle"
                  rows={3}
                  value={values.subtitle}
                  onChange={(event) => updateValue("subtitle", event.target.value)}
                  placeholder="Printable worksheets, flashcards, and fast-prep lesson packs from educators and creators."
                  className="min-h-[112px]"
                />
                <FieldError message={errors.subtitle} />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-sm font-medium text-text-primary" htmlFor="hero-badge">
                  Eyebrow label
                </label>
                <Input
                  id="hero-badge"
                  value={values.badgeText}
                  onChange={(event) => updateValue("badgeText", event.target.value)}
                  placeholder="Built for fast prep and instant access"
                />
                <FieldError message={errors.badgeText} />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-primary" htmlFor="hero-primary-cta-text">
                  Primary CTA text
                </label>
                <Input
                  id="hero-primary-cta-text"
                  value={values.primaryCtaText}
                  onChange={(event) => updateValue("primaryCtaText", event.target.value)}
                  placeholder="Browse resources"
                />
                <FieldError message={errors.primaryCtaText} />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-primary" htmlFor="hero-primary-cta-link">
                  Primary CTA link
                </label>
                <Input
                  id="hero-primary-cta-link"
                  value={values.primaryCtaLink}
                  onChange={(event) => updateValue("primaryCtaLink", event.target.value)}
                  placeholder="/resources"
                />
                <FieldError message={errors.primaryCtaLink} />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-primary" htmlFor="hero-secondary-cta-text">
                  Secondary CTA text
                </label>
                <Input
                  id="hero-secondary-cta-text"
                  value={values.secondaryCtaText}
                  onChange={(event) => updateValue("secondaryCtaText", event.target.value)}
                  placeholder="Sell your study resources"
                />
                <FieldError message={errors.secondaryCtaText} />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-primary" htmlFor="hero-secondary-cta-link">
                  Secondary CTA link
                </label>
                <Input
                  id="hero-secondary-cta-link"
                  value={values.secondaryCtaLink}
                  onChange={(event) => updateValue("secondaryCtaLink", event.target.value)}
                  placeholder="/membership"
                />
                <FieldError message={errors.secondaryCtaLink} />
              </div>
            </div>
          </FormSection>

          <FormSection
            title="Artwork"
            description="Upload campaign art first. Uploaded media overrides the manual image URL on the live hero."
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-primary" htmlFor="hero-media-url">
                  Uploaded media URL
                </label>
                <Input
                  id="hero-media-url"
                  value={values.mediaUrl}
                  onChange={(event) => updateValue("mediaUrl", event.target.value)}
                  placeholder="/uploads/hero-banner.webp"
                />
                <FieldError message={errors.mediaUrl} />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-primary" htmlFor="hero-media-type">
                  Media type
                </label>
                <Select
                  id="hero-media-type"
                  value={values.mediaType}
                  onChange={(event) =>
                    updateValue("mediaType", event.target.value as MediaTypeValue)
                  }
                >
                  <option value="">Auto / none</option>
                  <option value="image">Image</option>
                  <option value="gif">GIF</option>
                </Select>
                <FieldError message={errors.mediaType} />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-sm font-medium text-text-primary" htmlFor="hero-image-url">
                  Fallback image URL
                </label>
                <Input
                  id="hero-image-url"
                  value={values.imageUrl}
                  onChange={(event) => updateValue("imageUrl", event.target.value)}
                  placeholder="https://example.com/hero.jpg"
                />
                <FieldError message={errors.imageUrl} />
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium text-text-primary">Upload media</span>
              <p className="text-xs text-text-muted">
                PNG, JPG, JPEG, WEBP, GIF. Max 5 MB. This artwork is shared by the public discover hero and the admin preview.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept={HERO_MEDIA_ACCEPT}
                className="hidden"
                onChange={handleMediaUpload}
              />
              <PickerActions>
                <PickerActionButton
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  <Upload className="h-4 w-4" />
                  {uploading ? "Uploading..." : "Upload image or GIF"}
                </PickerActionButton>
                {values.mediaUrl ? (
                  <PickerActionButton
                    type="button"
                    tone="danger"
                    onClick={handleRemoveMedia}
                  >
                    <X className="h-4 w-4" />
                    Remove media
                  </PickerActionButton>
                ) : null}
              </PickerActions>
            </div>
          </FormSection>

          <CollapsibleSection
            title="Advanced appearance"
            description="Use these controls when you need to fine-tune layout, typography, color, or button treatment. Most campaigns can leave this alone."
          >
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-text-primary">Layout</h4>
                  <p className="text-xs text-text-secondary">
                    Control alignment, content width, hero height, and spacing without breaking the shared hero composition.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-text-primary" htmlFor="hero-text-align">
                      Text alignment
                    </label>
                    <Select
                      id="hero-text-align"
                      value={values.textAlign}
                      onChange={(event) =>
                        updateValue("textAlign", event.target.value as HeroTextAlign)
                      }
                    >
                      {HERO_STYLE_OPTIONS.textAlign.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-text-primary" htmlFor="hero-content-width">
                      Content width
                    </label>
                    <Select
                      id="hero-content-width"
                      value={values.contentWidth}
                      onChange={(event) =>
                        updateValue("contentWidth", event.target.value as HeroContentWidth)
                      }
                    >
                      {HERO_STYLE_OPTIONS.contentWidth.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-text-primary" htmlFor="hero-height">
                      Hero height
                    </label>
                    <Select
                      id="hero-height"
                      value={values.heroHeight}
                      onChange={(event) =>
                        updateValue("heroHeight", event.target.value as HeroHeight)
                      }
                    >
                      {HERO_STYLE_OPTIONS.heroHeight.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-text-primary" htmlFor="hero-spacing-preset">
                      Vertical spacing
                    </label>
                    <Select
                      id="hero-spacing-preset"
                      value={values.spacingPreset}
                      onChange={(event) =>
                        updateValue("spacingPreset", event.target.value as HeroSpacingPreset)
                      }
                    >
                      {HERO_STYLE_OPTIONS.spacingPreset.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-4 border-t border-surface-100 pt-6">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-text-primary">Typography</h4>
                  <p className="text-xs text-text-secondary">
                    Use bounded font and size presets so the hero stays readable across the shared copy, media, and utility layout.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-text-primary" htmlFor="hero-heading-font">
                      Heading font
                    </label>
                    <Select
                      id="hero-heading-font"
                      value={values.headingFont}
                      onChange={(event) =>
                        updateValue("headingFont", event.target.value as HeroHeadingFont)
                      }
                    >
                      {HERO_STYLE_OPTIONS.headingFont.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-text-primary" htmlFor="hero-body-font">
                      Body font
                    </label>
                    <Select
                      id="hero-body-font"
                      value={values.bodyFont}
                      onChange={(event) =>
                        updateValue("bodyFont", event.target.value as HeroBodyFont)
                      }
                    >
                      {HERO_STYLE_OPTIONS.bodyFont.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-text-primary" htmlFor="hero-title-size">
                      Title size
                    </label>
                    <Select
                      id="hero-title-size"
                      value={values.titleSize}
                      onChange={(event) =>
                        updateValue("titleSize", event.target.value as HeroTitleSize)
                      }
                    >
                      {HERO_STYLE_OPTIONS.titleSize.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-text-primary" htmlFor="hero-subtitle-size">
                      Subtitle size
                    </label>
                    <Select
                      id="hero-subtitle-size"
                      value={values.subtitleSize}
                      onChange={(event) =>
                        updateValue("subtitleSize", event.target.value as HeroSubtitleSize)
                      }
                    >
                      {HERO_STYLE_OPTIONS.subtitleSize.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-text-primary" htmlFor="hero-title-weight">
                      Title weight
                    </label>
                    <Select
                      id="hero-title-weight"
                      value={values.titleWeight}
                      onChange={(event) =>
                        updateValue("titleWeight", event.target.value as HeroTitleWeight)
                      }
                    >
                      {HERO_STYLE_OPTIONS.titleWeight.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-text-primary" htmlFor="hero-subtitle-weight">
                      Subtitle weight
                    </label>
                    <Select
                      id="hero-subtitle-weight"
                      value={values.subtitleWeight}
                      onChange={(event) =>
                        updateValue("subtitleWeight", event.target.value as HeroSubtitleWeight)
                      }
                    >
                      {HERO_STYLE_OPTIONS.subtitleWeight.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-text-primary" htmlFor="hero-mobile-title-size">
                      Mobile title size
                    </label>
                    <Select
                      id="hero-mobile-title-size"
                      value={values.mobileTitleSize}
                      onChange={(event) =>
                        updateValue("mobileTitleSize", event.target.value as HeroMobileTitleSize)
                      }
                    >
                      {HERO_STYLE_OPTIONS.mobileTitleSize.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-text-primary" htmlFor="hero-mobile-subtitle-size">
                      Mobile subtitle size
                    </label>
                    <Select
                      id="hero-mobile-subtitle-size"
                      value={values.mobileSubtitleSize}
                      onChange={(event) =>
                        updateValue(
                          "mobileSubtitleSize",
                          event.target.value as HeroMobileSubtitleSize,
                        )
                      }
                    >
                      {HERO_STYLE_OPTIONS.mobileSubtitleSize.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-4 border-t border-surface-100 pt-6">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-text-primary">Colors</h4>
                  <p className="text-xs text-text-secondary">
                    Use token-based colors only. The preview is the source of truth for contrast across the dark stage and white action card.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <HeroColorField
                    label="Title color"
                    name="hero-title-color"
                    value={values.titleColor}
                    options={HERO_COLOR_TOKEN_OPTIONS.titleColor}
                    helper="Prefer light colors unless you intentionally want the copy block to sit on a lighter surface."
                    onChange={(value) => updateValue("titleColor", value as HeroTitleColor)}
                  />
                  <HeroColorField
                    label="Subtitle color"
                    name="hero-subtitle-color"
                    value={values.subtitleColor}
                    options={HERO_COLOR_TOKEN_OPTIONS.subtitleColor}
                    helper="Subtitle colors stay constrained so supporting copy remains readable over artwork."
                    onChange={(value) =>
                      updateValue("subtitleColor", value as HeroSubtitleColor)
                    }
                  />
                  <HeroColorField
                    label="Badge text color"
                    name="hero-badge-text-color"
                    value={values.badgeTextColor}
                    options={HERO_COLOR_TOKEN_OPTIONS.badgeTextColor}
                    helper="Keep the eyebrow short and high contrast."
                    onChange={(value) =>
                      updateValue("badgeTextColor", value as HeroBadgeTextColor)
                    }
                  />
                  <HeroColorField
                    label="Badge background"
                    name="hero-badge-bg-color"
                    value={values.badgeBgColor}
                    options={HERO_COLOR_TOKEN_OPTIONS.badgeBgColor}
                    helper="Use a small supporting surface rather than a second full-width banner."
                    onChange={(value) =>
                      updateValue("badgeBgColor", value as HeroBadgeBgColor)
                    }
                  />
                </div>
              </div>

              <div className="space-y-4 border-t border-surface-100 pt-6">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-text-primary">Buttons</h4>
                  <p className="text-xs text-text-secondary">
                    Keep the hero actions clean and obvious. One primary action should do most of the work.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-text-primary" htmlFor="hero-primary-cta-variant">
                      Primary CTA style
                    </label>
                    <Select
                      id="hero-primary-cta-variant"
                      value={values.primaryCtaVariant}
                      onChange={(event) =>
                        updateValue(
                          "primaryCtaVariant",
                          event.target.value as HeroPrimaryCtaVariant,
                        )
                      }
                    >
                      {HERO_STYLE_OPTIONS.primaryCtaVariant.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-text-primary" htmlFor="hero-secondary-cta-variant">
                      Secondary CTA style
                    </label>
                    <Select
                      id="hero-secondary-cta-variant"
                      value={values.secondaryCtaVariant}
                      onChange={(event) => {
                        const nextVariant = event.target.value as HeroSecondaryCtaVariant;

                        setValues((prev) => ({
                          ...prev,
                          secondaryCtaVariant: nextVariant,
                        }));
                      }}
                    >
                      {HERO_STYLE_OPTIONS.secondaryCtaVariant.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <HeroColorField
                    label="Primary CTA color"
                    name="hero-primary-cta-color"
                    value={values.primaryCtaColor}
                    options={HERO_COLOR_TOKEN_OPTIONS.primaryCtaColor}
                    helper="Use one dominant action only."
                    onChange={(value) =>
                      updateValue("primaryCtaColor", value as HeroPrimaryCtaColor)
                    }
                  />
                  <HeroColorField
                    label="Secondary CTA color"
                    name="hero-secondary-cta-color"
                    value={values.secondaryCtaColor}
                    options={secondaryCtaColorOptions}
                    helper="Outline and ghost styles only expose compatible contrast-safe tones."
                    onChange={(value) =>
                      updateValue("secondaryCtaColor", value as HeroSecondaryCtaColor)
                    }
                  />
                </div>
              </div>

              <div className="space-y-4 border-t border-surface-100 pt-6">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-text-primary">Background and overlay</h4>
                  <p className="text-xs text-text-secondary">
                    Tweak these only when artwork needs extra help with readability.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <HeroColorField
                    label="Overlay color"
                    name="hero-overlay-color"
                    value={values.overlayColor}
                    options={HERO_COLOR_TOKEN_OPTIONS.overlayColor}
                    helper="Overlays apply to the artwork panel, not the whole card."
                    onChange={(value) =>
                      updateValue("overlayColor", value as HeroOverlayColor)
                    }
                  />
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-text-primary" htmlFor="hero-overlay-opacity">
                      Overlay opacity ({values.overlayOpacity}%)
                    </label>
                    <input
                      id="hero-overlay-opacity"
                      type="range"
                      min={0}
                      max={80}
                      step={5}
                      value={values.overlayOpacity}
                      onChange={(event) =>
                        updateValue(
                          "overlayOpacity",
                          Number.parseInt(
                            event.target.value || String(HERO_STYLE_DEFAULTS.overlayOpacity),
                            10,
                          ),
                        )
                      }
                      className="h-10 w-full accent-brand-600"
                    />
                    <p className="text-xs text-text-muted">
                      Raise this only when the artwork is too bright for the headline.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            title="Experiment and delivery controls"
            description="These govern rotation, weighting, and legacy experiment fields. Most editors can leave them untouched."
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-primary" htmlFor="hero-priority">
                  Priority
                </label>
                <Input
                  id="hero-priority"
                  type="number"
                  value={String(values.priority)}
                  disabled={isFallback}
                  onChange={(event) =>
                    updateValue("priority", Number.parseInt(event.target.value || "0", 10))
                  }
                />
                <FieldError message={errors.priority} />
                {isFallback ? (
                  <p className="text-xs text-text-muted">
                    Fallback hero priority is managed automatically.
                  </p>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-primary" htmlFor="hero-weight">
                  Weight
                </label>
                <Input
                  id="hero-weight"
                  type="number"
                  min={1}
                  value={String(values.weight)}
                  disabled={isFallback}
                  onChange={(event) =>
                    updateValue("weight", Number.parseInt(event.target.value || "1", 10))
                  }
                />
                <FieldError message={errors.weight} />
                {isFallback ? (
                  <p className="text-xs text-text-muted">
                    Fallback hero does not participate in weighted rotation.
                  </p>
                ) : null}
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-sm font-medium text-text-primary" htmlFor="hero-experiment-id">
                  Experiment ID
                </label>
                <Input
                  id="hero-experiment-id"
                  value={values.experimentId}
                  disabled={isFallback}
                  onChange={(event) => updateValue("experimentId", event.target.value)}
                  placeholder="Optional experiment key, e.g. spring-sale"
                />
                <FieldError message={errors.experimentId} />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-primary" htmlFor="hero-variant">
                  Variant
                </label>
                <Input
                  id="hero-variant"
                  value={values.variant}
                  disabled={isFallback}
                  onChange={(event) => updateValue("variant", event.target.value)}
                  placeholder="Optional variant label, e.g. A"
                />
                <FieldError message={errors.variant} />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-primary" htmlFor="hero-ab-group">
                  Legacy A/B group
                </label>
                <Input
                  id="hero-ab-group"
                  value={values.abGroup}
                  disabled={isFallback}
                  onChange={(event) => updateValue("abGroup", event.target.value)}
                  placeholder="Optional group key, e.g. test-a"
                />
                <FieldError message={errors.abGroup} />
                {isFallback ? (
                  <p className="text-xs text-text-muted">
                    Fallback hero is excluded from A/B testing.
                  </p>
                ) : (
                  <p className="text-xs text-text-muted">
                    Prefer Experiment ID plus Variant for new tests.
                  </p>
                )}
              </div>
            </div>
          </CollapsibleSection>

          <div className="flex flex-wrap items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(routes.adminHeroes)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {mode === "create" ? "Create hero" : "Save changes"}
            </Button>
          </div>
        </form>

        <Card className="p-5">
          <div className="space-y-3">
            <p className="text-xs font-semibold text-zinc-500">Render rules</p>
            <div className="space-y-2 text-sm leading-6 text-text-secondary">
              <p>Heroes render only when active and inside their schedule window.</p>
              <p>Lower priority values render first when multiple heroes are eligible.</p>
              <p>Weight distributes traffic within the same priority and experiment bucket.</p>
              <p>If no campaign hero qualifies, the protected fallback hero is used automatically.</p>
            </div>
          </div>
        </Card>
      </div>

      <aside className="min-w-0 xl:sticky xl:top-24 xl:self-start">
        <Card className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <div className="space-y-2 border-b border-surface-100 px-5 py-4 sm:px-6">
            <p className="text-sm font-semibold text-text-primary">Live preview</p>
            <p className="text-sm leading-6 text-text-secondary">
              This preview uses the exact same hero surface as the public discover page, so editors tune one shared experience instead of a separate admin-only layout.
            </p>
          </div>
          <div className="space-y-4 p-4 sm:p-5">
            <HeroSurface config={previewConfig} className="rounded-[1.25rem]" />
            <div className="rounded-2xl border border-surface-200 bg-surface-50 px-4 py-3 text-sm leading-6 text-text-secondary">
              Tip: let the headline, artwork, and one strong CTA carry the hero first. Use the advanced controls only when readability or spacing needs extra tuning.
            </div>
          </div>
        </Card>
      </aside>
    </PageContent>
  );
}
