import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  User,
  LogOut,
  LogIn,
  Building,
  BarChart3,
  X,
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
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Filter employees for the center search bar
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

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
        {/* Left: Clean Company Name & Brand */}
        <div
          onClick={() => onTabChange("overview")}
          className="cursor-pointer select-none shrink-0 flex items-center gap-2.5"
        >
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold shadow-sm">
            ⚡
          </div>
          <div className="flex flex-col">
            <span className="font-display text-lg font-black tracking-tight text-foreground hover:text-primary transition-colors leading-none">
              ESARTHI
            </span>
            <span className="font-mono text-[9px] text-muted-foreground tracking-wider uppercase">
              ECOPLUG EV Network
            </span>
          </div>
        </div>

        {/* Centre: Global Employee Search Bar */}
        <div ref={searchRef} className="relative flex-1 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3.5 top-2.5 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search any employee by name, role, ID, or shop..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              className="h-10 w-full rounded-xl border border-border bg-secondary/40 pl-10 pr-9 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:bg-secondary/70 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setIsSearchOpen(false);
                }}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Search Results Dropdown Overlay */}
          {isSearchOpen && searchQuery.trim() && (
            <div className="absolute left-0 right-0 top-12 rounded-xl border border-border bg-card shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto">
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

        {/* Right: Navigation Tabs (Overview & My Profile) + Login / Logout */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <button
            onClick={() => onTabChange("overview")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              currentTab === "overview"
                ? "bg-primary/10 text-primary font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Overview
          </button>

          <button
            onClick={() => onTabChange("profile")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              currentTab === "profile"
                ? "bg-primary/10 text-primary font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            My Profile
          </button>

          {/* User Session & Login/Logout button */}
          <div className="pl-2 border-l border-border flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                <span className="hidden lg:inline text-xs font-medium text-foreground">
                  {user.name.split(" ")[0]}
                  <span className="ml-1 text-[10px] text-muted-foreground font-mono">
                    ({user.type === "superadmin" ? "Superadmin" : user.type === "shopadmin" ? "Store Admin" : "Staff"})
                  </span>
                </span>
                <button
                  onClick={() => onSelectPersona(null)}
                  className="flex items-center gap-1 rounded-lg border border-border bg-secondary/50 px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
                  title="Log out from current session"
                >
                  <LogOut size={13} />
                  <span className="hidden sm:inline">Logout</span>
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
        </div>
      </div>
    </header>
  );
};
