import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import postcss from "postcss";
import tailwindConfig from "../tailwind.config";
import { radius } from "../src/design-system/tokens/radius";
import { spacing } from "../src/design-system/tokens/spacing";

type TokenType = "boxShadow" | "color" | "number" | "string" | "typography";

type TokenValue = {
  value: unknown;
  type: TokenType;
};

type TokenTree = {
  [key: string]: TokenTree | TokenValue;
};

type CssVariableMap = Record<string, string>;

type TypographyValue = {
  fontFamily: string;
  fontWeight: number;
  fontSize: number | string;
  lineHeight: number | string;
  letterSpacing: number | string;
};

type BoxShadowLayer = {
  x: string;
  y: string;
  blur: string;
  spread: string;
  color: string;
  type: "dropShadow" | "innerShadow";
};

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const globalsCssPath = path.join(repoRoot, "src/app/globals.css");
const tokensDir = path.join(repoRoot, "tokens");
const shouldValidate = process.argv.includes("--validate");

const COLOR_VALUE_RE =
  /^(#[0-9a-fA-F]{6}|#[0-9a-fA-F]{8}|rgb\([^)]+\)|rgba\([^)]+\)|\{[A-Za-z0-9._-]+\})$/;

function isTokenValue(input: unknown): input is TokenValue {
  return (
    typeof input === "object" &&
    input !== null &&
    "value" in input &&
    "type" in input &&
    typeof (input as { type: unknown }).type === "string"
  );
}

function colorToken(value: string): TokenValue {
  return { value, type: "color" };
}

function numberToken(value: number): TokenValue {
  return { value, type: "number" };
}

function stringToken(value: string): TokenValue {
  return { value, type: "string" };
}

function typographyToken(value: TypographyValue): TokenValue {
  return { value, type: "typography" };
}

function boxShadowToken(value: BoxShadowLayer | BoxShadowLayer[]): TokenValue {
  return { value, type: "boxShadow" };
}

function sortKeys<T extends Record<string, unknown>>(record: T): T {
  return Object.keys(record)
    .sort((left, right) => left.localeCompare(right, "en"))
    .reduce((acc, key) => {
      acc[key as keyof T] = record[key] as T[keyof T];
      return acc;
    }, {} as T);
}

function serializeTokenTree(tree: TokenTree | TokenValue): TokenTree | TokenValue {
  if (isTokenValue(tree)) {
    if (tree.type === "typography") {
      const value = tree.value as TypographyValue;
      return {
        value: {
          fontFamily: value.fontFamily,
          fontWeight: value.fontWeight,
          fontSize: value.fontSize,
          lineHeight: value.lineHeight,
          letterSpacing: value.letterSpacing,
        },
        type: tree.type,
      };
    }

    if (tree.type === "boxShadow") {
      const normalizeLayer = (layer: BoxShadowLayer) => ({
        x: layer.x,
        y: layer.y,
        blur: layer.blur,
        spread: layer.spread,
        color: layer.color,
        type: layer.type,
      });

      return {
        value: Array.isArray(tree.value)
          ? tree.value.map((layer) => normalizeLayer(layer as BoxShadowLayer))
          : normalizeLayer(tree.value as BoxShadowLayer),
        type: tree.type,
      };
    }

    return {
      value: tree.value,
      type: tree.type,
    };
  }

  return sortKeys(tree as TokenTree);
}

function deepSort(tree: TokenTree | TokenValue): TokenTree | TokenValue {
  if (isTokenValue(tree)) {
    return serializeTokenTree(tree);
  }

  const sorted = sortKeys(tree);
  const next: TokenTree = {};

  for (const [key, value] of Object.entries(sorted)) {
    next[key] = deepSort(value as TokenTree | TokenValue);
  }

  return next;
}

function normalizePathSegment(segment: string): string {
  return segment.replace(/([a-z0-9])([A-Z])/g, "$1.$2").replace(/-/g, ".").toLowerCase();
}

function setNestedToken(target: TokenTree, tokenPath: string, token: TokenValue) {
  const parts = tokenPath.split(".").filter(Boolean);

  if (parts.length === 0) {
    throw new Error("Token path cannot be empty.");
  }

  let cursor = target;

  for (const part of parts.slice(0, -1)) {
    const existing = cursor[part];
    if (!existing) {
      cursor[part] = {};
    } else if (isTokenValue(existing)) {
      cursor[part] = { default: existing };
    }
    cursor = cursor[part] as TokenTree;
  }

  const leaf = parts.at(-1) as string;
  const existingLeaf = cursor[leaf];
  if (existingLeaf && !isTokenValue(existingLeaf)) {
    (cursor[leaf] as TokenTree).default = token;
    return;
  }

  cursor[leaf] = token;
}

function parsePxNumber(value: string): number {
  const normalized = value.trim();

  if (/^-?\d+(\.\d+)?px$/.test(normalized)) {
    return Number.parseFloat(normalized);
  }

  if (/^-?\d+(\.\d+)?rem$/.test(normalized)) {
    return Number.parseFloat(normalized) * 16;
  }

  if (/^-?\d+(\.\d+)?$/.test(normalized)) {
    return Number.parseFloat(normalized);
  }

  throw new Error(`Expected a px/rem/unitless numeric value, received "${value}".`);
}

function parseNumberish(value: string): number | string {
  const normalized = value.trim();

  if (/^-?\d+(\.\d+)?$/.test(normalized)) {
    return Number.parseFloat(normalized);
  }

  if (/^-?\d+(\.\d+)?rem$/.test(normalized)) {
    return Number.parseFloat(normalized) * 16;
  }

  return normalized;
}

function hslComponentsToHex(input: string): string {
  const match = input
    .trim()
    .match(/^(-?\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%$/);

  if (!match) {
    throw new Error(`Unsupported HSL token value "${input}".`);
  }

  const hue = (((Number.parseFloat(match[1]) % 360) + 360) % 360) / 360;
  const saturation = Number.parseFloat(match[2]) / 100;
  const lightness = Number.parseFloat(match[3]) / 100;

  const hueToRgb = (p: number, q: number, t: number) => {
    let next = t;
    if (next < 0) next += 1;
    if (next > 1) next -= 1;
    if (next < 1 / 6) return p + (q - p) * 6 * next;
    if (next < 1 / 2) return q;
    if (next < 2 / 3) return p + (q - p) * (2 / 3 - next) * 6;
    return p;
  };

  let red = lightness;
  let green = lightness;
  let blue = lightness;

  if (saturation !== 0) {
    const q =
      lightness < 0.5
        ? lightness * (1 + saturation)
        : lightness + saturation - lightness * saturation;
    const p = 2 * lightness - q;

    red = hueToRgb(p, q, hue + 1 / 3);
    green = hueToRgb(p, q, hue);
    blue = hueToRgb(p, q, hue - 1 / 3);
  }

  const toHex = (channel: number) =>
    Math.round(channel * 255)
      .toString(16)
      .padStart(2, "0")
      .toUpperCase();

  return `#${toHex(red)}${toHex(green)}${toHex(blue)}`;
}

function splitCommaLayers(input: string): string[] {
  const layers: string[] = [];
  let current = "";
  let depth = 0;

  for (const char of input) {
    if (char === "(") depth += 1;
    if (char === ")") depth -= 1;

    if (char === "," && depth === 0) {
      layers.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  if (current.trim()) {
    layers.push(current.trim());
  }

  return layers;
}

function parseBoxShadow(input: string): BoxShadowLayer | BoxShadowLayer[] {
  const layers = splitCommaLayers(input).map((layer) => {
    const tokens = layer.split(/\s+/).filter(Boolean);
    const first = tokens[0];
    const inset = first === "inset";
    const color = tokens.at(-1);

    if (!color) {
      throw new Error(`Invalid box shadow "${input}".`);
    }

    const offsets = tokens.slice(inset ? 1 : 0, -1);

    if (offsets.length < 3 || offsets.length > 4) {
      throw new Error(`Unsupported box shadow layer "${layer}".`);
    }

    return {
      x: offsets[0] ?? "0",
      y: offsets[1] ?? "0",
      blur: offsets[2] ?? "0",
      spread: offsets[3] ?? "0",
      color,
      type: inset ? "innerShadow" : "dropShadow",
    } satisfies BoxShadowLayer;
  });

  return layers.length === 1 ? layers[0] : layers;
}

async function parseCssVariables() {
  const css = await fs.readFile(globalsCssPath, "utf8");
  const root = postcss.parse(css);

  const rootVariables: CssVariableMap = {};
  const darkVariables: CssVariableMap = {};

  root.walkRules((rule) => {
    if (rule.selector !== ":root" && rule.selector !== ".dark") {
      return;
    }

    const target = rule.selector === ":root" ? rootVariables : darkVariables;

    rule.walkDecls((decl) => {
      if (decl.prop.startsWith("--")) {
        target[decl.prop] = decl.value.trim();
      }
    });
  });

  return { darkVariables, rootVariables };
}

function getExtendTheme() {
  return ((tailwindConfig as { theme?: { extend?: Record<string, unknown> } }).theme?.extend ??
    {}) as Record<string, unknown>;
}

function collectPrimitiveColors(colorsConfig: Record<string, unknown>): TokenTree {
  const output: TokenTree = {};

  for (const [groupName, value] of Object.entries(colorsConfig)) {
    if (
      ["accent", "brand", "danger", "highlight", "info", "neutral", "primary", "success", "surface", "warning"].includes(
        groupName,
      ) === false
    ) {
      continue;
    }

    if (typeof value !== "object" || value === null || Array.isArray(value)) {
      continue;
    }

    const group: TokenTree = {};

    for (const [shade, shadeValue] of Object.entries(value as Record<string, unknown>)) {
      if (typeof shadeValue !== "string") {
        continue;
      }

      if (!shadeValue.startsWith("#") && !shadeValue.startsWith("rgb")) {
        continue;
      }

      setNestedToken(group, normalizePathSegment(shade), colorToken(shadeValue.toUpperCase()));
    }

    if (Object.keys(group).length > 0) {
      output[normalizePathSegment(groupName)] = group;
    }
  }

  return output;
}

function buildChartCore(rootVariables: CssVariableMap): TokenTree {
  const chart: TokenTree = {};

  for (const key of ["--chart-1", "--chart-2", "--chart-3", "--chart-4", "--chart-5"]) {
    if (!rootVariables[key]) {
      continue;
    }

    chart[key.replace("--chart-", "")] = colorToken(hslComponentsToHex(rootVariables[key]));
  }

  return chart;
}

function buildSpacingTokens(): TokenTree {
  const output: TokenTree = {};

  for (const [key, value] of Object.entries(spacing)) {
    setNestedToken(output, normalizePathSegment(key), numberToken(parsePxNumber(value)));
  }

  return output;
}

function buildRadiusTokens(extendTheme: Record<string, unknown>): TokenTree {
  const output: TokenTree = {};

  for (const [key, value] of Object.entries(radius)) {
    setNestedToken(output, normalizePathSegment(key), numberToken(parsePxNumber(value)));
  }

  const extraRadius = extendTheme.borderRadius as Record<string, string> | undefined;

  for (const key of ["3xl", "4xl"]) {
    const value = extraRadius?.[key];
    if (typeof value === "string") {
      setNestedToken(output, normalizePathSegment(key), numberToken(parsePxNumber(value)));
    }
  }

  return output;
}

function buildTypographyTokens(rootVariables: CssVariableMap): TokenTree {
  const fontHeading = rootVariables["--font-heading"];
  const fontBody = rootVariables["--font-body"];
  const fontUi = rootVariables["--font-ui"];
  const fontMono = rootVariables["--font-mono"];

  if (!fontHeading || !fontBody || !fontUi || !fontMono) {
    throw new Error("Missing font variables in globals.css.");
  }

  return {
    body: typographyToken({
      fontFamily: fontBody,
      fontWeight: Number(parseNumberish(rootVariables["--font-weight-body"] ?? "400")),
      fontSize: parseNumberish(rootVariables["--font-size-body"] ?? "16px"),
      lineHeight: parseNumberish(rootVariables["--line-height-body"] ?? "1.65"),
      letterSpacing: parseNumberish(rootVariables["--letter-spacing-body"] ?? "0"),
    }),
    caption: typographyToken({
      fontFamily: fontUi,
      fontWeight: Number(parseNumberish(rootVariables["--font-weight-caption"] ?? "500")),
      fontSize: parseNumberish(rootVariables["--font-size-caption"] ?? "12px"),
      lineHeight: parseNumberish(rootVariables["--line-height-caption"] ?? "1.45"),
      letterSpacing: parseNumberish(rootVariables["--letter-spacing-body"] ?? "0"),
    }),
    display: typographyToken({
      fontFamily: fontHeading,
      fontWeight: Number(parseNumberish(rootVariables["--font-weight-heading"] ?? "600")),
      fontSize: rootVariables["--font-size-display"] ?? "clamp(2.75rem, 5vw, 4.5rem)",
      lineHeight: parseNumberish(rootVariables["--line-height-display"] ?? "1.05"),
      letterSpacing: parseNumberish(rootVariables["--letter-spacing-heading"] ?? "-0.02em"),
    }),
    h1: typographyToken({
      fontFamily: fontHeading,
      fontWeight: Number(parseNumberish(rootVariables["--font-weight-heading"] ?? "600")),
      fontSize: parseNumberish(rootVariables["--font-size-h1"] ?? "2.5rem"),
      lineHeight: parseNumberish(rootVariables["--line-height-heading"] ?? "1.1"),
      letterSpacing: parseNumberish(rootVariables["--letter-spacing-heading"] ?? "-0.02em"),
    }),
    h2: typographyToken({
      fontFamily: fontHeading,
      fontWeight: Number(parseNumberish(rootVariables["--font-weight-heading"] ?? "600")),
      fontSize: parseNumberish(rootVariables["--font-size-h2"] ?? "2rem"),
      lineHeight: parseNumberish(rootVariables["--line-height-h2"] ?? "1.2"),
      letterSpacing: parseNumberish(rootVariables["--letter-spacing-heading"] ?? "-0.02em"),
    }),
    h3: typographyToken({
      fontFamily: fontHeading,
      fontWeight: Number(parseNumberish(rootVariables["--font-weight-heading"] ?? "600")),
      fontSize: parseNumberish(rootVariables["--font-size-h3"] ?? "1.5rem"),
      lineHeight: parseNumberish(rootVariables["--line-height-h3"] ?? "1.3"),
      letterSpacing: parseNumberish(rootVariables["--letter-spacing-heading"] ?? "-0.02em"),
    }),
    mono: typographyToken({
      fontFamily: fontMono,
      fontWeight: Number(parseNumberish(rootVariables["--font-weight-body"] ?? "400")),
      fontSize: parseNumberish(rootVariables["--font-size-body"] ?? "16px"),
      lineHeight: parseNumberish(rootVariables["--line-height-body"] ?? "1.65"),
      letterSpacing: parseNumberish(rootVariables["--letter-spacing-body"] ?? "0"),
    }),
    small: typographyToken({
      fontFamily: fontUi,
      fontWeight: Number(parseNumberish(rootVariables["--font-weight-small"] ?? "400")),
      fontSize: parseNumberish(rootVariables["--font-size-small"] ?? "0.875rem"),
      lineHeight: parseNumberish(rootVariables["--line-height-small"] ?? "1.5"),
      letterSpacing: parseNumberish(rootVariables["--letter-spacing-body"] ?? "0"),
    }),
  };
}

function buildShadowTokens(extendTheme: Record<string, unknown>): TokenTree {
  const shadows = (extendTheme.boxShadow ?? {}) as Record<string, string>;
  const output: TokenTree = {};

  for (const [key, value] of Object.entries(shadows)) {
    setNestedToken(output, normalizePathSegment(key), boxShadowToken(parseBoxShadow(value)));
  }

  return output;
}

function buildSemanticTokens(): TokenTree {
  return {
    bg: {
      dark: colorToken("{colors.surface.900}"),
      default: colorToken("#FFFFFF"),
      soft: colorToken("{colors.surface.50}"),
    },
    border: {
      default: colorToken("{colors.surface.200}"),
      subtle: colorToken("{colors.surface.200}"),
    },
    info: {
      default: colorToken("{colors.info.500}"),
      strong: colorToken("{colors.info.600}"),
    },
    primary: {
      default: colorToken("{colors.brand.900}"),
      foreground: colorToken("#FFFFFF"),
    },
    success: {
      default: colorToken("{colors.success.500}"),
      strong: colorToken("{colors.success.600}"),
    },
    text: {
      muted: colorToken("{colors.neutral.400}"),
      onDark: colorToken("{colors.surface.50}"),
      primary: colorToken("{colors.neutral.900}"),
      secondary: colorToken("{colors.surface.600}"),
    },
    warning: {
      default: colorToken("{colors.warning.500}"),
      strong: colorToken("{colors.warning.600}"),
    },
  };
}

function buildThemeColorGroup(
  variables: CssVariableMap,
  fallbackVariables: CssVariableMap,
  references: Partial<Record<string, string>>,
): TokenTree {
  const pick = (name: string) => variables[name] ?? fallbackVariables[name];
  const colorOrReference = (name: string) => {
    const reference = references[name];
    if (reference) {
      return colorToken(reference);
    }

    return colorToken(hslComponentsToHex(pick(name) ?? ""));
  };

  return {
    accent: colorOrReference("--accent"),
    accentForeground: colorOrReference("--accent-foreground"),
    background: colorOrReference("--background"),
    border: colorOrReference("--border"),
    card: colorOrReference("--card"),
    cardForeground: colorOrReference("--card-foreground"),
    chart: {
      "1": colorOrReference("--chart-1"),
      "2": colorOrReference("--chart-2"),
      "3": colorOrReference("--chart-3"),
      "4": colorOrReference("--chart-4"),
      "5": colorOrReference("--chart-5"),
    },
    destructive: colorOrReference("--destructive"),
    destructiveForeground: colorOrReference("--destructive-foreground"),
    foreground: colorOrReference("--foreground"),
    input: colorOrReference("--input"),
    muted: colorOrReference("--muted"),
    mutedForeground: colorOrReference("--muted-foreground"),
    popover: colorOrReference("--popover"),
    popoverForeground: colorOrReference("--popover-foreground"),
    primary: colorOrReference("--primary"),
    primaryForeground: colorOrReference("--primary-foreground"),
    ring: colorOrReference("--ring"),
    secondary: colorOrReference("--secondary"),
    secondaryForeground: colorOrReference("--secondary-foreground"),
    sidebar: {
      accent: colorOrReference("--sidebar-accent"),
      accentForeground: colorOrReference("--sidebar-accent-foreground"),
      border: colorOrReference("--sidebar-border"),
      default: colorOrReference("--sidebar"),
      foreground: colorOrReference("--sidebar-foreground"),
      primary: colorOrReference("--sidebar-primary"),
      primaryForeground: colorOrReference("--sidebar-primary-foreground"),
      ring: colorOrReference("--sidebar-ring"),
    },
  };
}

function buildThemes(rootVariables: CssVariableMap, darkVariables: CssVariableMap): TokenTree {
  const lightReferences: Partial<Record<string, string>> = {
    "--accent": "{bg.soft}",
    "--accent-foreground": "{text.primary}",
    "--background": "{bg.default}",
    "--border": "{border.default}",
    "--card": "{bg.default}",
    "--card-foreground": "{text.primary}",
    "--chart-1": "{colors.chart.1}",
    "--chart-2": "{colors.chart.2}",
    "--chart-3": "{colors.chart.3}",
    "--chart-4": "{colors.chart.4}",
    "--chart-5": "{colors.chart.5}",
    "--foreground": "{text.primary}",
    "--input": "{border.default}",
    "--muted": "{bg.soft}",
    "--muted-foreground": "{text.secondary}",
    "--popover": "{bg.default}",
    "--popover-foreground": "{text.primary}",
    "--primary": "{primary.default}",
    "--primary-foreground": "{primary.foreground}",
    "--ring": "{primary.default}",
    "--secondary": "{bg.soft}",
    "--secondary-foreground": "{text.primary}",
    "--sidebar": "{bg.soft}",
    "--sidebar-accent": "{bg.soft}",
    "--sidebar-accent-foreground": "{text.primary}",
    "--sidebar-border": "{border.default}",
    "--sidebar-foreground": "{text.primary}",
    "--sidebar-primary": "{primary.default}",
    "--sidebar-primary-foreground": "{primary.foreground}",
    "--sidebar-ring": "{primary.default}",
  };

  const darkReferences: Partial<Record<string, string>> = {
    "--background": "{bg.dark}",
    "--chart-1": "{colors.chart.1}",
    "--chart-2": "{colors.chart.2}",
    "--chart-3": "{colors.chart.3}",
    "--chart-4": "{colors.chart.4}",
    "--chart-5": "{colors.chart.5}",
    "--foreground": "{text.onDark}",
  };

  return {
    dark: {
      colors: buildThemeColorGroup(darkVariables, rootVariables, darkReferences),
    },
    light: {
      colors: buildThemeColorGroup(rootVariables, rootVariables, lightReferences),
    },
  };
}

async function writeJson(relativePath: string, value: TokenTree) {
  const targetPath = path.join(repoRoot, relativePath);
  const json = `${JSON.stringify(deepSort(value), null, 2)}\n`;
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await fs.writeFile(targetPath, json, "utf8");
}

function validateTypographyValue(value: unknown, filePath: string, tokenPath: string) {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`${filePath}: ${tokenPath} must be a typography object.`);
  }

  const candidate = value as Record<string, unknown>;
  for (const key of ["fontFamily", "fontWeight", "fontSize", "lineHeight", "letterSpacing"]) {
    if (!(key in candidate)) {
      throw new Error(`${filePath}: ${tokenPath} is missing "${key}".`);
    }
  }
}

function validateBoxShadowValue(value: unknown, filePath: string, tokenPath: string) {
  const layers = Array.isArray(value) ? value : [value];

  for (const layer of layers) {
    if (typeof layer !== "object" || layer === null || Array.isArray(layer)) {
      throw new Error(`${filePath}: ${tokenPath} must be a boxShadow object or array.`);
    }

    const candidate = layer as Record<string, unknown>;
    for (const key of ["x", "y", "blur", "spread", "color", "type"]) {
      if (!(key in candidate)) {
        throw new Error(`${filePath}: ${tokenPath} boxShadow layer is missing "${key}".`);
      }
    }

    const color = String(candidate.color);
    if (!COLOR_VALUE_RE.test(color)) {
      throw new Error(`${filePath}: ${tokenPath} has invalid shadow color "${color}".`);
    }
  }
}

function validateTokenTree(tree: TokenTree | TokenValue, filePath: string, tokenPath = "") {
  if (isTokenValue(tree)) {
    if (tree.value === undefined || tree.value === null) {
      throw new Error(`${filePath}: ${tokenPath || "<root>"} has an undefined/null value.`);
    }

    switch (tree.type) {
      case "color": {
        const color = String(tree.value);
        if (!COLOR_VALUE_RE.test(color)) {
          throw new Error(`${filePath}: ${tokenPath} has invalid color "${color}".`);
        }
        return;
      }
      case "number":
        if (typeof tree.value !== "number" || Number.isNaN(tree.value)) {
          throw new Error(`${filePath}: ${tokenPath} must be a number.`);
        }
        return;
      case "string":
        if (typeof tree.value !== "string" || tree.value.trim().length === 0) {
          throw new Error(`${filePath}: ${tokenPath} must be a non-empty string.`);
        }
        return;
      case "typography":
        validateTypographyValue(tree.value, filePath, tokenPath);
        return;
      case "boxShadow":
        validateBoxShadowValue(tree.value, filePath, tokenPath);
        return;
      default:
        throw new Error(`${filePath}: ${tokenPath} has unsupported token type "${tree.type}".`);
    }
  }

  for (const [key, value] of Object.entries(tree)) {
    const nextPath = tokenPath ? `${tokenPath}.${key}` : key;
    validateTokenTree(value as TokenTree | TokenValue, filePath, nextPath);
  }
}

async function main() {
  const extendTheme = getExtendTheme();
  const { darkVariables, rootVariables } = await parseCssVariables();

  const core: TokenTree = {
    colors: {
      ...collectPrimitiveColors((extendTheme.colors ?? {}) as Record<string, unknown>),
      chart: buildChartCore(rootVariables),
    },
    radius: buildRadiusTokens(extendTheme),
    shadows: buildShadowTokens(extendTheme),
    spacing: buildSpacingTokens(),
    typography: buildTypographyTokens(rootVariables),
  };

  const semantic = buildSemanticTokens();
  const themes = buildThemes(rootVariables, darkVariables);

  if (shouldValidate) {
    validateTokenTree(core, "tokens/core.json");
    validateTokenTree(semantic, "tokens/semantic.json");
    validateTokenTree(themes, "tokens/themes.json");
  }

  await writeJson("tokens/core.json", core);
  await writeJson("tokens/semantic.json", semantic);
  await writeJson("tokens/themes.json", themes);

  console.log("Exported Tokens Studio token sets to /tokens.");
  if (shouldValidate) {
    console.log("Validation passed.");
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
