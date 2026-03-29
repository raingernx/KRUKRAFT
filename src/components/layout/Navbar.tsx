"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  BookOpen,
  ShoppingBag,
  Settings,
  Sparkles,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { AccountTrigger } from "@/components/layout/account/AccountTrigger";
import { Container } from "@/components/layout/container";
import { NavbarBrand } from "@/components/layout/NavbarBrand";
import { NavbarItem } from "@/components/layout/navbar/NavbarItem";
import { beginResourcesNavigation } from "@/components/marketplace/resourcesNavigationState";

const NAV_LINKS: { href: string; label: string }[] = [
  { href: "/resources", label: "มาร์เก็ตเพลส" },
  { href: "/dashboard/library", label: "คลังของฉัน" },
];

export function Navbar({
  secondaryRow,
  headerSearch,
}: {
  secondaryRow?: ReactNode;
  headerSearch?: ReactNode;
}) {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  function closeAll() {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }

  function handleHomeNavigation(href: string) {
    if (href === "/resources") {
      beginResourcesNavigation("discover", href);
    }
  }

  async function handleSignOut() {
    if (isSigningOut) {
      return;
    }

    setIsSigningOut(true);
    closeAll();

    try {
      await signOut({ callbackUrl: "/" });
    } catch {
      setIsSigningOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-surface-200 bg-white">
      <Container
        className={
          headerSearch
            ? "grid gap-2 py-2 lg:grid-cols-[auto_minmax(0,680px)_auto] lg:items-center lg:justify-between lg:gap-4 lg:py-0"
            : "flex h-16 items-center justify-between gap-4 lg:gap-8"
        }
      >
        <div className="flex h-10 items-center lg:h-12 lg:origin-left lg:scale-[0.9]">
          <NavbarBrand />
        </div>

        {headerSearch ? (
          <div className="order-3 min-w-0 lg:order-2 lg:mx-auto lg:w-full lg:max-w-[680px]">
            {headerSearch}
          </div>
        ) : null}

        <div className={headerSearch ? "order-2 ml-auto lg:order-3 lg:ml-0" : "ml-auto"}>
          <div className="hidden shrink-0 items-center gap-3 lg:flex">
            <nav className="hidden items-center gap-1.5 lg:flex" aria-label="Main navigation">
              {NAV_LINKS.map(({ href, label }) => (
                <NavbarItem
                  key={href}
                  href={href}
                  onClick={() => handleHomeNavigation(href)}
                  variant="default"
                  className="h-9 rounded-full px-3.5 text-[13px] font-semibold"
                >
                  {label}
                </NavbarItem>
              ))}
            </nav>

            <NavbarItem
              href="/membership"
              variant="default"
              className="h-9 rounded-full border border-amber-200 bg-[linear-gradient(135deg,#fff8dc,#fff4bf)] px-3.5 text-[13px] font-semibold text-amber-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] hover:border-amber-300 hover:bg-[linear-gradient(135deg,#fff9e7,#fff1b0)] hover:text-amber-950"
            >
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" aria-hidden />
                <span>KC Plus</span>
              </span>
            </NavbarItem>
            <div className="mx-0.5 h-5 w-px bg-surface-200/70" aria-hidden />

            {isLoading ? (
              <div className="h-10 w-20 animate-pulse rounded-lg bg-surface-100" />
            ) : session?.user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="group transition"
                >
                  <AccountTrigger
                    name={session.user.name?.split(" ")[0] ?? "Account"}
                    image={session.user.image}
                    email={session.user.email}
                    isOpen={userMenuOpen}
                  />
                </button>

                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      aria-hidden
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-lg border border-surface-200 bg-white shadow-card-lg">
                      <div className="border-b border-surface-100 px-4 py-3">
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-semibold text-text-primary">
                            {session.user.name}
                          </p>
                          <p className="mt-0.5 truncate text-[11px] text-text-muted">
                            {session.user.email}
                          </p>
                        </div>
                      </div>

                      <div className="p-1.5">
                        <Link
                          href="/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] text-text-secondary transition-colors hover:bg-surface-50 hover:text-text-primary"
                        >
                          <span className="inline-flex items-center gap-2.5">
                            <LayoutDashboard className="h-3.5 w-3.5 text-text-muted" aria-hidden />
                            <span>Dashboard</span>
                          </span>
                        </Link>
                        <Link
                          href="/dashboard/library"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] text-text-secondary transition-colors hover:bg-surface-50 hover:text-text-primary"
                        >
                          <span className="inline-flex items-center gap-2.5">
                            <BookOpen className="h-3.5 w-3.5 text-text-muted" aria-hidden />
                            <span>My Library</span>
                          </span>
                        </Link>
                        <Link
                          href="/dashboard/purchases"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] text-text-secondary transition-colors hover:bg-surface-50 hover:text-text-primary"
                        >
                          <span className="inline-flex items-center gap-2.5">
                            <ShoppingBag className="h-3.5 w-3.5 text-text-muted" aria-hidden />
                            <span>Purchases</span>
                          </span>
                        </Link>

                        <div className="my-1.5 border-t border-surface-100" />

                        <Link
                          href="/settings"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] text-text-secondary transition-colors hover:bg-surface-50 hover:text-text-primary"
                        >
                          <span className="inline-flex items-center gap-2.5">
                            <Settings className="h-3.5 w-3.5 text-text-muted" aria-hidden />
                            <span>Settings</span>
                          </span>
                        </Link>
                        <button
                          type="button"
                          disabled={isSigningOut}
                          onClick={() => void handleSignOut()}
                          className="mt-1 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          <LogOut className="h-3.5 w-3.5" aria-hidden />
                          {isSigningOut ? "Signing out…" : "Sign out"}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <NavbarItem href="/auth/login">เข้าสู่ระบบ</NavbarItem>
                <NavbarItem href="/auth/register" variant="secondary">
                  เริ่มต้นใช้งาน
                </NavbarItem>
              </div>
            )}
          </div>

          <button
            type="button"
            className="ml-auto rounded-lg p-1.5 text-text-secondary hover:bg-surface-100 lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      {mobileOpen && (
        <div className="border-b border-surface-200 bg-white px-4 pb-5 pt-3 shadow-card-md lg:hidden">
          <nav className="flex flex-col gap-0.5" aria-label="Mobile navigation">
            {NAV_LINKS.map(({ href, label }) => (
              <NavbarItem
                key={href}
                href={href}
                onClick={() => {
                  handleHomeNavigation(href);
                  closeAll();
                }}
                variant="default"
                mobile
              >
                {label}
              </NavbarItem>
            ))}
          </nav>

          <div className="mt-4">
            <NavbarItem
              href="/membership"
              onClick={closeAll}
              variant="default"
              mobile
              className="border border-amber-200 bg-[linear-gradient(135deg,#fff8dc,#fff4bf)] text-amber-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] hover:border-amber-300 hover:bg-[linear-gradient(135deg,#fff9e7,#fff1b0)] hover:text-amber-950"
            >
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" aria-hidden />
                <span>KC Plus</span>
              </span>
            </NavbarItem>
          </div>

          <div className="mt-4 flex flex-col gap-2 border-t border-surface-100 pt-4">
            {session?.user ? (
              <>
                <div className="flex items-center gap-3 rounded-lg bg-surface-50 px-3 py-2.5">
                  <Avatar
                    src={session.user.image}
                    name={session.user.name}
                    email={session.user.email}
                    size={28}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-text-primary">
                      {session.user.name}
                    </p>
                    <p className="truncate text-xs text-text-muted">{session.user.email}</p>
                  </div>
                </div>

                <Link
                  href="/dashboard"
                  onClick={closeAll}
                  className="flex items-center gap-2.5 rounded-lg border border-surface-200 px-4 py-2.5 text-sm font-medium text-text-secondary hover:bg-surface-50"
                >
                  <span className="inline-flex items-center gap-2.5">
                    <LayoutDashboard className="h-4 w-4 text-text-muted" aria-hidden />
                    <span>Dashboard</span>
                  </span>
                </Link>

                <button
                  type="button"
                  disabled={isSigningOut}
                  onClick={() => void handleSignOut()}
                  className="flex items-center gap-2.5 rounded-lg px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <LogOut className="h-4 w-4" aria-hidden />
                  {isSigningOut ? "Signing out…" : "Sign out"}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={closeAll}
                  className="rounded-lg border border-surface-200 px-4 py-2.5 text-center text-sm font-medium text-text-secondary hover:bg-surface-50 font-thai"
                >
                  เข้าสู่ระบบ
                </Link>
                <Link
                  href="/auth/register"
                  onClick={closeAll}
                  className="rounded-lg bg-brand-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-brand-700 font-thai"
                >
                  เริ่มต้นใช้งาน
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {secondaryRow}
    </header>
  );
}
