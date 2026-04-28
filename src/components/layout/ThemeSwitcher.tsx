"use client";

import { Monitor, Moon, Sun, type AppIcon } from "@/lib/icons";

import {
  Button,
  Dropdown,
  DropdownMenu,
  DropdownRadioGroup,
  DropdownRadioItem,
  DropdownTrigger,
} from "@/design-system";
import { useTheme } from "@/components/providers/ThemeProvider";
import type { Theme } from "@/lib/theme";
import { cn } from "@/lib/utils";

export type ThemeSwitcherVariant = "icon" | "compact";

export interface ThemeSwitcherOption {
  value: Theme;
  label: string;
  icon: AppIcon;
}

export interface ThemeSwitcherProps {
  variant?: ThemeSwitcherVariant;
  ariaLabel?: string;
  align?: "start" | "center" | "end";
  sideOffset?: number;
  persist?: boolean;
  className?: string;
  menuClassName?: string;
  options?: readonly ThemeSwitcherOption[];
  onThemeChange?: (theme: Theme) => void;
}

export const DEFAULT_THEME_SWITCHER_OPTIONS: readonly ThemeSwitcherOption[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

function getThemeIcon(
  theme: Theme,
  options: readonly ThemeSwitcherOption[],
): AppIcon {
  return options.find((option) => option.value === theme)?.icon ?? Monitor;
}

function getThemeLabel(
  theme: Theme,
  options: readonly ThemeSwitcherOption[],
): string {
  return options.find((option) => option.value === theme)?.label ?? "Theme";
}

export function ThemeSwitcher({
  variant = "icon",
  ariaLabel = "Change theme",
  align = "end",
  sideOffset = 8,
  persist = true,
  className,
  menuClassName,
  options = DEFAULT_THEME_SWITCHER_OPTIONS,
  onThemeChange,
}: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();
  const ActiveIcon = getThemeIcon(theme, options);
  const activeLabel = getThemeLabel(theme, options);

  return (
    <Dropdown>
      <DropdownTrigger asChild>
        <Button
          aria-label={ariaLabel}
          className={cn(
            variant === "icon"
              ? "size-11"
              : "h-11 rounded-full px-3 text-sm font-medium",
            className,
          )}
          size={variant === "icon" ? "icon" : "sm"}
          variant="ghost"
        >
          <ActiveIcon className="size-4" aria-hidden />
          {variant === "compact" ? (
            <span className="ml-2">{activeLabel}</span>
          ) : null}
        </Button>
      </DropdownTrigger>

      <DropdownMenu
        align={align}
        className={cn(
          "w-[min(14rem,calc(100vw-1rem))] rounded-xl border-border-subtle bg-shell p-1 shadow-card-lg",
          menuClassName,
        )}
        sideOffset={sideOffset}
      >
        <DropdownRadioGroup
          value={theme}
          onValueChange={(nextTheme) => {
            if (nextTheme !== "light" && nextTheme !== "dark" && nextTheme !== "system") {
              return;
            }

            setTheme(nextTheme, { persist });
            onThemeChange?.(nextTheme);
          }}
        >
          {options.map((option) => {
            const OptionIcon = option.icon;

            return (
              <DropdownRadioItem
                key={option.value}
                value={option.value}
                className="gap-2 rounded-lg"
              >
                <OptionIcon className="size-4" aria-hidden />
                {option.label}
              </DropdownRadioItem>
            );
          })}
        </DropdownRadioGroup>
      </DropdownMenu>
    </Dropdown>
  );
}
