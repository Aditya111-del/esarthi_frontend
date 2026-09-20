import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  User,
  LogOut,
  LogIn,
  Building,
  BarChart3,
  X,
  Zap,
  Menu,
  Users,
  Briefcase,
  Store,
  ChevronRight,
  ShieldCheck,
  UserPlus,
  Plus,
} from "lucide-react";
import { UserSession, Employee, Shop } from "../../types";

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  user: UserSession | null;
  onSelectPersona: (persona: UserSession | null) => void;
  employees: Employee[];
  shops: Shop[];
  onViewEmployee: (emp: Employee) => void;
  onOpenLoginModal: () => void;
  onOpenAddEmployee?: () => void;
  onOpenCreateShop?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  user,
  onSelectPersona,
  employees,
  shops,
  onViewEmployee,
  onOpenLoginModal,
  onOpenAddEmployee,
  onOpenCreateShop,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

  // Filter employees for search
  const searchResults = searchQuery.trim()
    ? employees.filter((emp) => {
        const q = searchQuery.toLowerCase();
        return (
          emp.name.toLowerCase().includes(q) ||
          emp.employeeId.toLowerCase().includes(q) ||
          emp.roleTitle.toLowerCase().includes(q) ||
          emp.department.toLowerCase().includes(q) ||
          (emp.shopName && emp.shopName.toLowerCase().includes(q))
        );
      })
    : [];

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu or mobile search is open
  useEffect(() => {
    if (isMobileMenuOpen || isMobileSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen, isMobileSearchOpen]);

  // Focus mobile input on open
  useEffect(() => {
    if (isMobileSearchOpen && mobileSearchInputRef.current) {
      mobileSearchInputRef.current.focus();
    }
  }, [isMobileSearchOpen]);

  const navItems = [
    { id: "overview", label: "Overview", icon: BarChart3, badge: "Live" },
    { id: "roster", label: "Technicians", icon: Users, count: employees.length },
    { id: "shops", label: "Charging Hubs", icon: Store, count: shops.length },
    { id: "roles", label: "Roles", icon: Briefcase },
    { id: "profile", label: "My Profile", icon: User },
  ];

  const handleNavClick = (tabId: string) => {
    onTabChange(tabId);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/90 backdrop-blur-md transition-all">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3.5 sm:px-6 lg:px-8 gap-3">
          {/* Brand & Logo */}
          <div
            onClick={() => handleNavClick("overview")}
            className="cursor-pointer select-none shrink-0 flex items-center gap-2.5 tap-active"
          >
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20">
              <Zap size={18} className="fill-primary-foreground text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-display text-lg font-black tracking-tight text-foreground hover:text-primary transition-colors leading-none">
                  ESARTHI
                </span>
                <span className="hidden sm:inline-flex items-center rounded-full bg-primary/10 px-1.5 py-0.5 font-mono text-[8.5px] font-bold text-primary border border-primary/20">
                  EV-OPS
                </span>
              </div>
              <span className="font-mono text-[9px] text-muted-foreground tracking-wider uppercase">
                ECOPLUG EV Network
              </span>
            </div>
          </div>

          {/* Desktop Centre: Global Employee Search Bar */}
          <div ref={searchRef} className="relative hidden md:flex flex-1 max-w-md mx-auto">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-2.5 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search staff by name, role, ID, or station..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                className="h-9.5 w-full rounded-xl border border-border bg-secondary/40 pl-10 pr-9 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:bg-secondary/70 focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setIsSearchOpen(false);
                  }}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Desktop Search Results Dropdown Overlay */}
            {isSearchOpen && searchQuery.trim() && (
              <div className="absolute left-0 right-0 top-11 rounded-xl border border-border bg-card shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto">
                <div className="p-2 border-b border-border/60 font-mono text-[10px] text-muted-foreground uppercase px-3">
                  {searchResults.length} {searchResults.length === 1 ? "Employee" : "Employees"} Found
                </div>

                {searchResults.length > 0 ? (
                  <div className="divide-y divide-border/40">
                    {searchResults.map((emp) => (
                      <div
                        key={emp._id}
                        onClick={() => {
                          onViewEmployee(emp);
                          setIsSearchOpen(false);
                          setSearchQuery("");
                        }}
                        className="flex items-center justify-between p-3 hover:bg-secondary/50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {emp.image ? (
                            <img
                              src={emp.image}
                              alt={emp.name}
                              className="size-8.5 rounded-full object-cover border border-border"
                            />
                          ) : (
                            <div className="flex size-8.5 items-center justify-center rounded-full bg-secondary text-xs font-bold text-foreground">
                              {emp.firstName?.[0] || emp.name?.[0] || "E"}
                            </div>
                          )}
                          <div>
                            <p className="text-xs font-bold text-foreground">{emp.name}</p>
                            <p className="text-[11px] text-muted-foreground">
                              {emp.roleTitle} · {emp.shopName}
                            </p>
                          </div>
                        </div>

                        <div className="text-right font-mono text-[10.5px]">
                          <span className="text-primary font-semibold">{emp.employeeId}</span>
                          <p className="text-[10px] text-muted-foreground">{emp.department}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-muted-foreground">
                    No employee matches "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? "bg-primary/15 text-primary font-bold shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                  }`}
                >
                  <Icon size={14} className={isActive ? "text-primary" : "text-muted-foreground"} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Mobile Search Trigger Button */}
            <button
              onClick={() => setIsMobileSearchOpen(true)}
              className="flex md:hidden items-center justify-center size-9 rounded-xl border border-border/80 bg-secondary/50 text-muted-foreground hover:text-foreground cursor-pointer tap-active transition-colors"
              title="Search Personnel"
            >
              <Search size={16} />
            </button>

            {/* Desktop User Status & Switch Persona */}
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-border/80">
              {user ? (
                <div className="flex items-center gap-2">
                  <div
                    onClick={() => handleNavClick("profile")}
                    className="flex items-center gap-2 rounded-lg bg-secondary/40 px-2.5 py-1 border border-border/60 hover:bg-secondary/70 transition-colors cursor-pointer"
                  >
                    <div className="flex size-6 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
                      {user.name[0]}
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-semibold text-foreground leading-tight">
                        {user.name.split(" ")[0]}
                      </span>
                      <span className="text-[9.5px] text-muted-foreground font-mono leading-none">
                        {user.type === "superadmin" ? "Superadmin" : user.type === "shopadmin" ? "Store Admin" : "Staff"}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectPersona(null)}
                    className="flex items-center gap-1 rounded-lg border border-border bg-secondary/50 px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
                    title="Log out"
                  >
                    <LogOut size={13} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onOpenLoginModal}
                  className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer shadow-sm"
                >
                  <LogIn size={13} />
                  <span>Login</span>
                </button>
              )}
            </div>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex lg:hidden items-center justify-center size-9 rounded-xl border border-border/80 bg-secondary/60 text-foreground hover:bg-secondary transition-all cursor-pointer tap-active shadow-xs"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MOBILE SEARCH OVERLAY MODAL                                               */}
      {/* ========================================================================= */}
      {isMobileSearchOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background/98 backdrop-blur-xl p-4 rise">
          <div className="flex items-center gap-2 pb-3 border-b border-border">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
              <input
                ref={mobileSearchInputRef}
                type="text"
                placeholder="Search staff, ID, station..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 w-full rounded-xl border border-primary/50 bg-secondary/50 pl-10 pr-9 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <button
              onClick={() => {
                setIsMobileSearchOpen(false);
                setSearchQuery("");
              }}
              className="px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer rounded-lg bg-secondary/40"
            >
              Cancel
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pt-3 divide-y divide-border/40">
            {searchQuery.trim() ? (
              searchResults.length > 0 ? (
                searchResults.map((emp) => (
                  <div
                    key={emp._id}
                    onClick={() => {
                      onViewEmployee(emp);
                      setIsMobileSearchOpen(false);
                      setSearchQuery("");
                    }}
                    className="flex items-center justify-between py-3 px-1 active:bg-secondary/40 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      {emp.image ? (
                        <img
                          src={emp.image}
                          alt={emp.name}
                          className="size-9 rounded-full object-cover border border-border"
                        />
                      ) : (
                        <div className="flex size-9 items-center justify-center rounded-full bg-secondary font-bold text-xs text-foreground">
                          {emp.firstName?.[0] || emp.name?.[0] || "E"}
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-bold text-foreground">{emp.name}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {emp.roleTitle} · {emp.shopName}
                        </p>
                      </div>
                    </div>
                    <div className="text-right font-mono text-[10px]">
                      <span className="text-primary font-semibold">{emp.employeeId}</span>
                      <p className="text-muted-foreground">{emp.department}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-xs text-muted-foreground">
                  No employee matching "{searchQuery}"
                </div>
              )
            ) : (
              <div className="py-8 text-center text-xs text-muted-foreground">
                Type an employee name, job title, department, or station code to search.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LUXURY MOBILE SLIDE-OUT DRAWER / SHEET                                    */}
      {/* ========================================================================= */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop Blur */}
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
          />

          {/* Slide-out Drawer Panel */}
          <div className="absolute inset-y-0 right-0 w-[86vw] max-w-sm bg-card/98 border-l border-border/80 flex flex-col h-full overflow-y-auto shadow-2xl p-5 rise">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border/80">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                  <Zap size={16} className="fill-primary-foreground text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-display text-base font-black tracking-tight text-foreground">
                    ESARTHI
                  </h3>
                  <p className="font-mono text-[9px] text-primary uppercase font-bold flex items-center gap-1">
                    <span className="size-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                    ECOPLUG EV Network
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex size-8 items-center justify-center rounded-xl bg-secondary/80 text-muted-foreground hover:text-foreground cursor-pointer tap-active"
              >
                <X size={16} />
              </button>
            </div>

            {/* User Session Banner Card */}
            <div className="my-4 rounded-xl border border-border/80 bg-secondary/40 p-3.5 space-y-2.5">
              {user ? (
                <>
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/20 text-primary font-display font-bold text-sm border border-primary/30">
                      {user.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-foreground truncate">{user.name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                      <span className="mt-0.5 inline-block rounded bg-primary/10 border border-primary/25 px-1.5 py-0.2 font-mono text-[9px] font-semibold text-primary">
                        {user.type === "superadmin" ? "Platform Superadmin" : user.type === "shopadmin" ? "Store Manager" : "Field Specialist"}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-2">
                    <button
                      onClick={onOpenLoginModal}
                      className="flex-1 py-1.5 text-center rounded-lg border border-border bg-card text-[11px] font-medium text-foreground hover:bg-secondary cursor-pointer transition-colors"
                    >
                      Switch Profile
                    </button>
                    <button
                      onClick={() => {
                        onSelectPersona(null);
                        setIsMobileMenuOpen(false);
                      }}
                      className="px-3 py-1.5 rounded-lg border border-destructive/30 bg-destructive/10 text-[11px] font-semibold text-destructive hover:bg-destructive/20 cursor-pointer transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-2 space-y-2">
                  <p className="text-xs text-muted-foreground">You are currently browsing as Guest</p>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenLoginModal();
                    }}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90 cursor-pointer"
                  >
                    <LogIn size={13} />
                    Sign In to Account
                  </button>
                </div>
              )}
            </div>

            {/* Navigation Menu List */}
            <div className="space-y-1 py-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground px-2">
                Navigation Modules
              </span>

              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer tap-active ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                        : "text-foreground hover:bg-secondary/60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={16} className={isActive ? "text-primary-foreground" : "text-primary"} />
                      <span>{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.count !== undefined && (
                        <span
                          className={`rounded-full px-2 py-0.5 font-mono text-[10px] ${
                            isActive
                              ? "bg-primary-foreground/20 text-primary-foreground"
                              : "bg-secondary text-muted-foreground"
                          }`}
                        >
                          {item.count}
                        </span>
                      )}
                      {item.badge && (
                        <span
                          className={`rounded-full px-2 py-0.5 font-mono text-[9px] font-bold ${
                            isActive
                              ? "bg-primary-foreground/25 text-primary-foreground"
                              : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight size={14} className={isActive ? "text-primary-foreground/80" : "text-muted-foreground"} />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="pt-3 border-t border-border/80 space-y-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground px-2">
                Quick Actions
              </span>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onOpenAddEmployee) onOpenAddEmployee();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-primary/10 border border-primary/25 text-xs font-semibold text-primary hover:bg-primary/20 transition-all cursor-pointer tap-active"
              >
                <UserPlus size={15} />
                <span>+ Onboard Technician</span>
              </button>

              {user?.type === "superadmin" && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onOpenCreateShop) onOpenCreateShop();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-secondary/50 border border-border text-xs font-semibold text-foreground hover:bg-secondary transition-all cursor-pointer tap-active"
                >
                  <Plus size={15} />
                  <span>+ Provision New Store Hub</span>
                </button>
              )}
            </div>

            {/* Live Telemetry Info Card */}
            <div className="mt-auto pt-4 border-t border-border/80">
              <div className="rounded-xl border border-border/60 bg-secondary/30 p-3 space-y-1.5 font-mono text-[10px]">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Connected Grid Load</span>
                  <span className="text-amber-400 font-bold">1,380 kW DC</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Ultra-Fast Bays</span>
                  <span className="text-emerald-400 font-bold">38 / 46 Online</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Network SLA</span>
                  <span className="text-foreground font-bold">99.8% Uptime</span>
                </div>
              </div>
              <p className="mt-3 text-center font-mono text-[9px] text-muted-foreground">
                ESARTHI EV OS v1.4 · Enterprise Architecture
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
