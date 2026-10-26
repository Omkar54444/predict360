import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, Menu, Search, Settings, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { Logo } from "./logo";
import { navGroups } from "./nav-items";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center px-5">
        <Link to="/dashboard" onClick={onNavigate}>
          <Logo />
        </Link>
      </div>

      <nav className="no-scrollbar flex-1 space-y-6 overflow-y-auto px-3 pb-4">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 pb-2 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname === item.to;
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      onClick={onNavigate}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] transition-colors duration-150",
                        active
                          ? "bg-lavender-soft font-semibold text-foreground"
                          : "font-medium text-muted-foreground hover:bg-secondary hover:text-foreground",
                      )}
                    >
                      <item.icon
                        className={cn("size-4", active ? "text-indigo" : "text-muted-foreground")}
                        strokeWidth={1.75}
                      />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-border p-3">
        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-indigo-soft text-[12px] font-bold text-indigo">
            IS
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-semibold text-foreground">
              Isha Sable
            </span>
            <span className="block text-[11.5px] text-muted-foreground">Student</span>
          </span>
          <Button variant="ghost" size="icon" aria-label="Settings">
            <Settings strokeWidth={1.75} />
          </Button>
        </div>
      </div>
    </div>
  );
}

function TopBar({ title, onMenu }: { title: ReactNode; onMenu: () => void }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-5 backdrop-blur-md lg:px-8">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenu} aria-label="Menu">
        <Menu strokeWidth={1.75} />
      </Button>
      <div className="min-w-0 flex-1 truncate text-[15px] font-semibold text-foreground">
        {title}
      </div>
      <label className="relative hidden md:block">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          strokeWidth={1.75}
        />
        <input
          type="search"
          placeholder="Search datasets, models…"
          aria-label="Search"
          className="h-10 w-64 rounded-full border border-border bg-card pl-10 pr-4 text-[13px] text-foreground placeholder:text-muted-foreground/80 focus-visible:border-ring/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20"
        />
      </label>
      <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
        <Bell strokeWidth={1.75} />
        <span className="absolute right-2 top-2 size-1.5 rounded-full bg-blue" />
      </Button>
      <span className="grid size-9 place-items-center rounded-full bg-indigo-soft text-[12px] font-bold text-indigo">
        IS
      </span>
    </header>
  );
}

export function AppShell({ title, children }: { title: ReactNode; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[240px] border-r border-border bg-surface lg:block">
        <SidebarNav />
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            aria-label="Close navigation"
            className="absolute inset-0 bg-primary/25 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[260px] bg-surface shadow-lift">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-3.5"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              <X strokeWidth={1.75} />
            </Button>
            <SidebarNav onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className="lg:pl-[240px]">
        <TopBar title={title} onMenu={() => setOpen(true)} />
        <main className="mx-auto max-w-[1240px] px-5 py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
