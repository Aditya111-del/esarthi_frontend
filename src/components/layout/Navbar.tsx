import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  User,
  LogOut,
  LogIn,
  BarChart3,
  X,
  Menu,
  Users,
  Briefcase,
  Store,
  ChevronRight,
  UserPlus,
  Plus,
  Zap,
  ShieldCheck,
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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen || isMobileSearchOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen, isMobileSearchOpen]);

  useEffect(() => {
    if (isMobileSearchOpen && mobileSearchInputRef.current) {
      mobileSearchInputRef.current.focus();
    }
  }, [isMobileSearchOpen]);

  const navItems = [
    { id: "overview",  label: "Overview",   icon: BarChart3 },
    { id: "roster",    label: "Staff",       icon: Users,    count: employees.length },
    { id: "shops",     label: "Shops",       icon: Store,    count: shops.length },
    { id: "roles",     label: "Roles",       icon: Briefcase },
    { id: "profile",   label: "Profile",     icon: User },
  ];

  const handleNavClick = (tabId: string) => {
    onTabChange(tabId);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const initials = (name: string) =>
    name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  return (
    <>
      {/* ───────────────────────────── TOPBAR ───────────────────────────── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          width: "100%",
          borderBottom: "1px solid oklch(0.220 0.012 240 / 0.40)",
          background: "oklch(0.085 0.010 240 / 0.92)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 1.25rem",
            height: "3.75rem",
            gap: "1rem",
          }}
        >
          {/* Brand */}
          <div
            onClick={() => handleNavClick("overview")}
            style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "0.625rem", flexShrink: 0, userSelect: "none" }}
            className="tap-active"
          >
            <div
              style={{
                width: "2.125rem",
                height: "2.125rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "10px",
                background: "oklch(0.680 0.158 155)",
                boxShadow: "0 2px 10px oklch(0.680 0.158 155 / 0.35)",
                flexShrink: 0,
              }}
            >
              <Zap size={16} style={{ color: "white", fill: "white" }} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.375rem" }}>
                <span
                  style={{
                    fontFamily: '"Outfit", sans-serif',
                    fontSize: "1.0625rem",
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                    color: "oklch(0.970 0.004 240)",
                    lineHeight: 1,
                  }}
                >
                  ESARTHI
                </span>
                <span
                  className="hidden sm:inline-flex"
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: "0.625rem",
                    fontWeight: 600,
                    color: "oklch(0.680 0.158 155)",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    background: "oklch(0.680 0.158 155 / 0.10)",
                    border: "1px solid oklch(0.680 0.158 155 / 0.22)",
                    borderRadius: "4px",
                    padding: "1px 5px",
                  }}
                >
                  v2
                </span>
              </div>
              <div
                className="hidden sm:block"
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: "0.5625rem",
                  fontWeight: 500,
                  color: "oklch(0.420 0.012 240)",
                  letterSpacing: "0.05em",
                  marginTop: "1px",
                  textTransform: "uppercase",
                }}
              >
                Workforce Management
              </div>
            </div>
          </div>

          {/* Desktop search */}
          <div ref={searchRef} className="relative hidden md:flex flex-1" style={{ maxWidth: "28rem" }}>
            <div style={{ position: "relative", width: "100%" }}>
              <Search
                size={14}
                style={{
                  position: "absolute",
                  left: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "oklch(0.420 0.012 240)",
                  pointerEvents: "none",
                }}
              />
              <input
                type="text"
                placeholder="Search by name, ID, role…"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setIsSearchOpen(true); }}
                onFocus={() => setIsSearchOpen(true)}
                className="es-input"
                style={{ paddingLeft: "2.25rem", paddingRight: searchQuery ? "2rem" : "3.5rem" }}
              />
              {searchQuery ? (
                <button
                  onClick={() => { setSearchQuery(""); setIsSearchOpen(false); }}
                  style={{
                    position: "absolute", right: "0.625rem", top: "50%", transform: "translateY(-50%)",
                    color: "oklch(0.420 0.012 240)", cursor: "pointer", border: "none", background: "none", padding: 0,
                    display: "flex",
                  }}
                >
                  <X size={13} />
                </button>
              ) : (
                <div
                  className="hidden lg:flex"
                  style={{
                    position: "absolute", right: "0.625rem", top: "50%", transform: "translateY(-50%)",
                    fontFamily: '"JetBrains Mono", monospace', fontSize: "0.625rem",
                    color: "oklch(0.380 0.010 240)",
                    background: "oklch(0.140 0.010 240)",
                    border: "1px solid oklch(0.240 0.012 240 / 0.50)",
                    borderRadius: "4px", padding: "1px 5px", pointerEvents: "none",
                    alignItems: "center",
                  }}
                >
                  ⌘K
                </div>
              )}
            </div>

            {/* Search dropdown */}
            {isSearchOpen && searchQuery.trim() && (
              <div
                style={{
                  position: "absolute", left: 0, right: 0, top: "calc(100% + 6px)",
                  background: "oklch(0.118 0.012 240)",
                  border: "1px solid oklch(0.240 0.012 240 / 0.50)",
                  borderRadius: "12px",
                  boxShadow: "0 16px 48px -8px oklch(0 0 0 / 0.60)",
                  overflow: "hidden", zIndex: 50, maxHeight: "20rem", overflowY: "auto",
                }}
                className="scale-in"
              >
                <div style={{
                  padding: "0.5rem 0.875rem",
                  borderBottom: "1px solid oklch(0.220 0.012 240 / 0.40)",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                  <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.625rem", color: "oklch(0.420 0.012 240)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}
                  </span>
                  <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.5625rem", color: "oklch(0.680 0.158 155)" }}>
                    LIVE
                  </span>
                </div>
                {searchResults.length > 0 ? (
                  <div>
                    {searchResults.map((emp) => (
                      <div
                        key={emp._id}
                        onClick={() => { onViewEmployee(emp); setIsSearchOpen(false); setSearchQuery(""); }}
                        style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          padding: "0.625rem 0.875rem", cursor: "pointer",
                          borderBottom: "1px solid oklch(0.200 0.010 240 / 0.30)",
                          transition: "background 0.10s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "oklch(0.145 0.012 240 / 0.80)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                          {emp.image ? (
                            <img src={emp.image} alt={emp.name} style={{ width: "2rem", height: "2rem", borderRadius: "9999px", objectFit: "cover" }} />
                          ) : (
                            <div className="es-avatar es-avatar-sm">{(emp.firstName?.[0] || emp.name?.[0] || "E").toUpperCase()}</div>
                          )}
                          <div>
                            <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: "oklch(0.970 0.004 240)", margin: 0, lineHeight: 1.3 }}>{emp.name}</p>
                            <p style={{ fontSize: "0.6875rem", color: "oklch(0.500 0.012 240)", margin: 0, marginTop: "1px" }}>{emp.roleTitle} · {emp.shopName}</p>
                          </div>
                        </div>
                        <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.6875rem", color: "oklch(0.680 0.158 155)", fontWeight: 600 }}>
                          {emp.employeeId}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: "1.5rem", textAlign: "center", fontSize: "0.8125rem", color: "oklch(0.420 0.012 240)" }}>
                    No matches for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop nav */}
          <nav className="hidden lg:flex" style={{ alignItems: "center", gap: "2px" }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="es-nav-item tap-active"
                  style={isActive ? {
                    background: "oklch(0.680 0.158 155 / 0.10)",
                    color: "oklch(0.760 0.150 155)",
                    border: "1px solid oklch(0.680 0.158 155 / 0.20)",
                    fontWeight: 600,
                  } : {}}
                >
                  <Icon size={14} />
                  <span>{item.label}</span>
                  {item.count !== undefined && (
                    <span style={{
                      fontFamily: '"JetBrains Mono", monospace', fontSize: "0.5625rem", fontWeight: 600,
                      padding: "1px 5px", borderRadius: "4px",
                      background: isActive ? "oklch(0.680 0.158 155 / 0.18)" : "oklch(0.155 0.012 240)",
                      color: isActive ? "oklch(0.760 0.150 155)" : "oklch(0.420 0.012 240)",
                    }}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
            {/* Mobile search */}
            <button
              onClick={() => setIsMobileSearchOpen(true)}
              className="flex md:hidden tap-active"
              style={{
                width: "2.25rem", height: "2.25rem", display: "flex", alignItems: "center", justifyContent: "center",
                borderRadius: "9px", border: "1px solid oklch(0.240 0.012 240 / 0.50)",
                background: "oklch(0.118 0.012 240)", color: "oklch(0.560 0.014 240)", cursor: "pointer",
              }}
            >
              <Search size={15} />
            </button>

            {/* User pill */}
            <div className="hidden sm:flex" style={{ alignItems: "center", gap: "0.5rem", paddingLeft: "0.5rem", borderLeft: "1px solid oklch(0.220 0.012 240 / 0.40)" }}>
              {user ? (
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div
                    onClick={() => handleNavClick("profile")}
                    style={{
                      display: "flex", alignItems: "center", gap: "0.5rem",
                      background: "oklch(0.118 0.012 240)",
                      border: "1px solid oklch(0.240 0.012 240 / 0.50)",
                      borderRadius: "9px", padding: "0.3125rem 0.625rem",
                      cursor: "pointer", transition: "border-color 0.15s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "oklch(0.300 0.012 240 / 0.70)")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "oklch(0.240 0.012 240 / 0.50)")}
                  >
                    <div style={{
                      width: "1.625rem", height: "1.625rem", borderRadius: "7px", flexShrink: 0,
                      background: "linear-gradient(135deg, oklch(0.680 0.158 155), oklch(0.580 0.158 170))",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.625rem", fontWeight: 700, color: "white",
                      fontFamily: '"Outfit", sans-serif',
                    }}>
                      {initials(user.name)}
                    </div>
                    <div>
                      <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "oklch(0.970 0.004 240)", lineHeight: 1.2 }}>
                        {user.name.split(" ")[0]}
                      </div>
                      <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.5625rem", color: "oklch(0.420 0.012 240)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                        {user.type === "superadmin" ? "Super Admin" : user.type === "shopadmin" ? "Store Admin" : "Staff"}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onSelectPersona(null)}
                    title="Sign out"
                    style={{
                      width: "2rem", height: "2rem", display: "flex", alignItems: "center", justifyContent: "center",
                      borderRadius: "8px", border: "1px solid oklch(0.240 0.012 240 / 0.50)",
                      background: "oklch(0.118 0.012 240)", color: "oklch(0.420 0.012 240)",
                      cursor: "pointer", transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "oklch(0.580 0.230 27 / 0.10)";
                      (e.currentTarget as HTMLElement).style.borderColor = "oklch(0.580 0.230 27 / 0.30)";
                      (e.currentTarget as HTMLElement).style.color = "oklch(0.680 0.200 27)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "oklch(0.118 0.012 240)";
                      (e.currentTarget as HTMLElement).style.borderColor = "oklch(0.240 0.012 240 / 0.50)";
                      (e.currentTarget as HTMLElement).style.color = "oklch(0.420 0.012 240)";
                    }}
                  >
                    <LogOut size={13} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onOpenLoginModal}
                  className="es-btn es-btn-primary"
                  style={{ height: "2rem", padding: "0 0.875rem", fontSize: "0.75rem" }}
                >
                  <LogIn size={13} />
                  Sign in
                </button>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex lg:hidden tap-active"
              style={{
                width: "2.25rem", height: "2.25rem", display: "flex", alignItems: "center", justifyContent: "center",
                borderRadius: "9px", border: "1px solid oklch(0.240 0.012 240 / 0.50)",
                background: "oklch(0.118 0.012 240)", color: "oklch(0.970 0.004 240)", cursor: "pointer",
              }}
              aria-label="Navigation menu"
            >
              {isMobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </header>

      {/* ─────────────── MOBILE SEARCH OVERLAY ─────────────── */}
      {isMobileSearchOpen && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 50,
            display: "flex", flexDirection: "column",
            background: "oklch(0.085 0.010 240 / 0.98)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            padding: "1rem",
          }}
          className="fade-in"
        >
          <div style={{ display: "flex", gap: "0.75rem", paddingBottom: "0.75rem", borderBottom: "1px solid oklch(0.220 0.012 240 / 0.40)" }}>
            <div style={{ position: "relative", flex: 1 }}>
              <Search size={15} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "oklch(0.420 0.012 240)", pointerEvents: "none" }} />
              <input
                ref={mobileSearchInputRef}
                type="text"
                placeholder="Search staff by name, role, ID…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="es-input"
                style={{ paddingLeft: "2.25rem", height: "2.75rem", fontSize: "0.9375rem" }}
              />
            </div>
            <button
              onClick={() => { setIsMobileSearchOpen(false); setSearchQuery(""); }}
              style={{
                padding: "0 0.875rem", borderRadius: "10px", border: "1px solid oklch(0.240 0.012 240 / 0.50)",
                background: "oklch(0.118 0.012 240)", fontSize: "0.8125rem", fontWeight: 600,
                color: "oklch(0.560 0.014 240)", cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>

          <div style={{ flex: 1, overflowY: "auto", paddingTop: "0.75rem" }}>
            {searchQuery.trim() ? (
              searchResults.length > 0 ? (
                searchResults.map((emp) => (
                  <div
                    key={emp._id}
                    onClick={() => { onViewEmployee(emp); setIsMobileSearchOpen(false); setSearchQuery(""); }}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "0.75rem 0.25rem", cursor: "pointer",
                      borderBottom: "1px solid oklch(0.200 0.010 240 / 0.25)",
                    }}
                    className="tap-active"
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      {emp.image ? (
                        <img src={emp.image} alt={emp.name} style={{ width: "2.5rem", height: "2.5rem", borderRadius: "9999px", objectFit: "cover" }} />
                      ) : (
                        <div className="es-avatar es-avatar-md">{(emp.firstName?.[0] || emp.name?.[0] || "E").toUpperCase()}</div>
                      )}
                      <div>
                        <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "oklch(0.970 0.004 240)", margin: 0 }}>{emp.name}</p>
                        <p style={{ fontSize: "0.75rem", color: "oklch(0.500 0.012 240)", margin: "2px 0 0" }}>{emp.roleTitle} · {emp.shopName}</p>
                      </div>
                    </div>
                    <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.6875rem", color: "oklch(0.680 0.158 155)", fontWeight: 600 }}>
                      {emp.employeeId}
                    </span>
                  </div>
                ))
              ) : (
                <div style={{ padding: "3rem 1rem", textAlign: "center", fontSize: "0.875rem", color: "oklch(0.420 0.012 240)" }}>
                  No results for "{searchQuery}"
                </div>
              )
            ) : (
              <div style={{ padding: "3rem 1rem", textAlign: "center", fontSize: "0.8125rem", color: "oklch(0.380 0.010 240)" }}>
                Type a name, title, or employee ID to search
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─────────────── MOBILE DRAWER ─────────────── */}
      {isMobileMenuOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50 }} className="lg:hidden">
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            style={{ position: "absolute", inset: 0, background: "oklch(0 0 0 / 0.65)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}
          />
          {/* Drawer */}
          <div
            style={{
              position: "absolute", inset: "0 0 0 auto",
              width: "min(82vw, 22rem)",
              background: "oklch(0.098 0.010 240)",
              borderLeft: "1px solid oklch(0.220 0.012 240 / 0.40)",
              display: "flex", flexDirection: "column", height: "100%", overflowY: "auto",
              padding: "1.25rem",
              boxShadow: "-24px 0 80px oklch(0 0 0 / 0.50)",
            }}
            className="slide-up"
          >
            {/* Drawer header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "1rem", borderBottom: "1px solid oklch(0.220 0.012 240 / 0.40)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                <div style={{ width: "2rem", height: "2rem", borderRadius: "8px", background: "oklch(0.680 0.158 155)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Zap size={14} style={{ color: "white", fill: "white" }} />
                </div>
                <span style={{ fontFamily: '"Outfit", sans-serif', fontSize: "1rem", fontWeight: 800, letterSpacing: "-0.03em", color: "oklch(0.970 0.004 240)" }}>
                  ESARTHI
                </span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ width: "2rem", height: "2rem", borderRadius: "8px", border: "1px solid oklch(0.240 0.012 240 / 0.50)", background: "oklch(0.118 0.012 240)", display: "flex", alignItems: "center", justifyContent: "center", color: "oklch(0.560 0.014 240)", cursor: "pointer" }}
              >
                <X size={15} />
              </button>
            </div>

            {/* User card */}
            <div style={{ margin: "1rem 0", padding: "0.875rem", background: "oklch(0.118 0.012 240)", border: "1px solid oklch(0.240 0.012 240 / 0.45)", borderRadius: "12px" }}>
              {user ? (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ width: "2.5rem", height: "2.5rem", borderRadius: "10px", background: "linear-gradient(135deg, oklch(0.680 0.158 155), oklch(0.580 0.158 170))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8125rem", fontWeight: 700, color: "white", fontFamily: '"Outfit", sans-serif', flexShrink: 0 }}>
                      {initials(user.name)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "oklch(0.970 0.004 240)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</p>
                      <p style={{ fontSize: "0.6875rem", color: "oklch(0.420 0.012 240)", margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</p>
                      <span style={{ display: "inline-block", marginTop: "4px", fontFamily: '"JetBrains Mono", monospace', fontSize: "0.5625rem", fontWeight: 600, color: "oklch(0.680 0.158 155)", textTransform: "uppercase", letterSpacing: "0.05em", background: "oklch(0.680 0.158 155 / 0.10)", border: "1px solid oklch(0.680 0.158 155 / 0.20)", borderRadius: "4px", padding: "1px 5px" }}>
                        {user.type === "superadmin" ? "Superadmin" : user.type === "shopadmin" ? "Store Admin" : "Staff"}
                      </span>
                    </div>
                  </div>
                  <div style={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid oklch(0.220 0.012 240 / 0.40)", display: "flex", gap: "0.5rem" }}>
                    <button onClick={onOpenLoginModal} style={{ flex: 1, padding: "0.4375rem 0", borderRadius: "8px", border: "1px solid oklch(0.240 0.012 240 / 0.50)", background: "transparent", fontSize: "0.75rem", fontWeight: 600, color: "oklch(0.560 0.014 240)", cursor: "pointer", transition: "all 0.15s ease" }}>
                      Switch
                    </button>
                    <button onClick={() => { onSelectPersona(null); setIsMobileMenuOpen(false); }} style={{ flex: 1, padding: "0.4375rem 0", borderRadius: "8px", border: "1px solid oklch(0.580 0.230 27 / 0.25)", background: "oklch(0.580 0.230 27 / 0.10)", fontSize: "0.75rem", fontWeight: 600, color: "oklch(0.680 0.200 27)", cursor: "pointer" }}>
                      Sign out
                    </button>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: "0.8125rem", color: "oklch(0.420 0.012 240)", marginBottom: "0.75rem" }}>Not signed in</p>
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); onOpenLoginModal(); }}
                    className="es-btn es-btn-primary"
                    style={{ width: "100%", justifyContent: "center" }}
                  >
                    <LogIn size={13} /> Sign In
                  </button>
                </div>
              )}
            </div>

            {/* Nav items */}
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.5625rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "oklch(0.380 0.010 240)", margin: "0 0 0.5rem 0.25rem" }}>
                Navigation
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className="es-nav-item tap-active"
                      style={{
                        width: "100%",
                        justifyContent: "space-between",
                        ...(isActive ? {
                          background: "oklch(0.680 0.158 155 / 0.10)",
                          color: "oklch(0.760 0.150 155)",
                          border: "1px solid oklch(0.680 0.158 155 / 0.20)",
                          fontWeight: 600,
                        } : {}),
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                        <Icon size={15} />
                        <span>{item.label}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                        {item.count !== undefined && (
                          <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.5625rem", background: "oklch(0.155 0.012 240)", color: "oklch(0.420 0.012 240)", borderRadius: "4px", padding: "1px 5px" }}>
                            {item.count}
                          </span>
                        )}
                        <ChevronRight size={13} style={{ opacity: 0.4 }} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick actions */}
            <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid oklch(0.220 0.012 240 / 0.40)", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.5625rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "oklch(0.380 0.010 240)", margin: "0 0 0.25rem 0.25rem" }}>
                Quick Actions
              </p>
              <button
                onClick={() => { setIsMobileMenuOpen(false); onOpenAddEmployee?.(); }}
                className="es-nav-item tap-active"
                style={{ width: "100%", background: "oklch(0.680 0.158 155 / 0.08)", color: "oklch(0.680 0.158 155)", border: "1px solid oklch(0.680 0.158 155 / 0.18)" }}
              >
                <UserPlus size={14} />
                <span>Onboard Employee</span>
              </button>
              {user?.type === "superadmin" && (
                <button
                  onClick={() => { setIsMobileMenuOpen(false); onOpenCreateShop?.(); }}
                  className="es-nav-item tap-active"
                  style={{ width: "100%" }}
                >
                  <Plus size={14} />
                  <span>New Shop</span>
                </button>
              )}
            </div>

            {/* Footer */}
            <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid oklch(0.220 0.012 240 / 0.40)" }}>
              <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.5625rem", color: "oklch(0.340 0.010 240)", textAlign: "center" }}>
                ESARTHI · Workforce Management · v2
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
