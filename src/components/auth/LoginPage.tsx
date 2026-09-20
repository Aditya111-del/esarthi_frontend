import React, { useState } from "react";
import {
  Zap,
  ShieldCheck,
  Building2,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Lock,
  Radio,
  CheckCircle2,
  ChevronRight,
  Shield,
  Layers,
  Fuel,
} from "lucide-react";
import { UserSession, Shop } from "../../types";
import { api, defaultSuperadmin } from "../../services/api";

interface LoginPageProps {
  onLogin: (user: UserSession) => void;
  shops: Shop[];
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, shops }) => {
  const [emailInput, setEmailInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Standard preset 4 branch admin IDs
  const presetBranches = [
    {
      code: "EV-DEL-01",
      city: "Delhi",
      stationName: "Connaught Plaza EV Superhub",
      adminName: "Rajesh Kumar",
      email: "delhi.admin@esarthi.com",
      color: "from-emerald-500/20 to-teal-500/10",
      accent: "text-emerald-400",
    },
    {
      code: "EV-BLR-01",
      city: "Bengaluru",
      stationName: "Silicon Expressway Charging Depot",
      adminName: "Vikram Malhotra",
      email: "bengaluru.admin@esarthi.com",
      color: "from-blue-500/20 to-cyan-500/10",
      accent: "text-cyan-400",
    },
    {
      code: "EV-MUM-01",
      city: "Mumbai",
      stationName: "BKC Green Fleet Supercharger",
      adminName: "Sneha Patel",
      email: "mumbai.admin@esarthi.com",
      color: "from-purple-500/20 to-indigo-500/10",
      accent: "text-indigo-400",
    },
    {
      code: "EV-HYD-01",
      city: "Hyderabad",
      stationName: "HITEC City EV Transit Hub",
      adminName: "Karthik Reddy",
      email: "hyderabad.admin@esarthi.com",
      color: "from-amber-500/20 to-orange-500/10",
      accent: "text-amber-400",
    },
  ];

  // Dynamic shops (including newly created ones by superadmin)
  const additionalShops = shops.filter(
    (s) =>
      !["EV-DEL-01", "EV-BLR-01", "EV-MUM-01", "EV-HYD-01"].includes(s.code?.toUpperCase()) &&
      s.adminEmail?.endsWith("@esarthi.com")
  );

  const handleAuthorize = async (emailToTry?: string) => {
    const targetEmail = (emailToTry || emailInput).trim().toLowerCase();
    setErrorMessage("");

    if (!targetEmail) {
      setErrorMessage("Please enter an authorized @esarthi.com ID");
      return;
    }

    setIsLoading(true);

    try {
      const authenticatedUser = await api.login(targetEmail, shops);
      onLogin(authenticatedUser);
    } catch (err: any) {
      setErrorMessage(
        err.message ||
          "Authentication failed. Only superadmin@esarthi.com and provisioned @esarthi.com store admin accounts have access."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSelect = (email: string) => {
    setEmailInput(email);
    handleAuthorize(email);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between bg-[#080d12] text-foreground font-sans overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      {/* Dynamic Ambient Mesh Glows */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[90vw] max-w-4xl h-[450px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[40vw] h-[300px] bg-emerald-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] left-[-5%] w-[35vw] h-[300px] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Brand Bar */}
      <header className="relative z-10 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-9 sm:size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-emerald-600 text-primary-foreground shadow-md shadow-primary/25 ring-1 ring-white/20">
            <Zap size={20} className="fill-primary-foreground text-primary-foreground animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-base sm:text-lg font-black tracking-tight text-foreground">
                ESARTHI
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary font-mono">
                <span className="size-1.5 rounded-full bg-emerald-400 inline-block animate-ping" />
                GRID OS v2.4
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground font-medium">
              ECOPLUG Intelligent EV Workforce & Station Network
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
          <div className="hidden md:flex items-center gap-2 rounded-lg bg-secondary/50 border border-border/60 px-3 py-1.5">
            <Radio size={12} className="text-primary animate-pulse" />
            <span>4 Primary Hubs Online</span>
          </div>
        </div>
      </header>

      {/* Main Authentication Core */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12 max-w-5xl mx-auto w-full">
        {/* Hero Title & Subtext */}
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2.5">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-secondary/60 px-3.5 py-1 text-xs font-semibold text-muted-foreground shadow-xs">
            <ShieldCheck size={14} className="text-primary" />
            <span>Authorized Enterprise Access Portal</span>
          </div>
          <h1 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Sign In to <span className="text-primary">ESARTHI</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Direct access enabled for verified <span className="font-mono text-foreground font-semibold">@esarthi.com</span> identity IDs. No OTP or password required.
          </p>
        </div>

        {/* Central Authentication Card */}
        <div className="w-full max-w-xl rounded-2xl sm:rounded-3xl border border-border/80 bg-card/85 backdrop-blur-2xl p-5 sm:p-8 shadow-2xl shadow-black/50 space-y-6 rise">
          {/* Identity Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAuthorize();
            }}
            className="space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5 font-mono">
                  <Lock size={12} className="text-primary" /> Corporate Admin ID
                </label>
                <span className="text-[10px] text-muted-foreground font-mono">
                  Must end with @esarthi.com
                </span>
              </div>

              <div className="relative">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => {
                    setEmailInput(e.target.value);
                    if (errorMessage) setErrorMessage("");
                  }}
                  placeholder="superadmin@esarthi.com or branch.admin@esarthi.com"
                  className="w-full h-12 rounded-xl border border-border/90 bg-secondary/50 px-4 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                  autoFocus
                />
              </div>
            </div>

            {/* Error Message Box */}
            {errorMessage && (
              <div className="flex items-start gap-2.5 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <p className="leading-snug">{errorMessage}</p>
              </div>
            )}

            {/* Authorize Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs sm:text-sm tracking-wide uppercase flex items-center justify-center gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center gap-2 font-mono">
                  <span className="size-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                  <span>Authorizing Identity...</span>
                </div>
              ) : (
                <>
                  <span>Authorize & Launch Dashboard</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Quick Access Divider */}
          <div className="relative flex items-center justify-center pt-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/70" />
            </div>
            <span className="relative bg-card px-3 text-[10px] uppercase tracking-wider font-mono font-bold text-muted-foreground">
              Or Instant One-Click Login
            </span>
          </div>

          {/* Dedicated Superadmin Keypad Card */}
          <div className="space-y-3">
            <button
              onClick={() => handleQuickSelect("superadmin@esarthi.com")}
              className="w-full group rounded-2xl border border-primary/40 bg-gradient-to-r from-primary/15 via-primary/5 to-transparent p-3.5 sm:p-4 text-left transition-all hover:border-primary hover:bg-primary/20 cursor-pointer shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/30">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors">
                        Suraj Sev Sagar
                      </span>
                      <span className="rounded bg-primary/20 px-1.5 py-0.5 text-[9px] font-mono font-bold text-primary">
                        SUPERADMIN
                      </span>
                    </div>
                    <p className="font-mono text-[11px] text-muted-foreground mt-0.5">
                      superadmin@esarthi.com
                    </p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-primary">
                  <span>Enter All Hubs</span>
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              <p className="mt-2 text-[10.5px] text-muted-foreground/80 pl-1 border-t border-primary/15 pt-1.5">
                Full platform governance · Multi-station control · Shop admin provisioning
              </p>
            </button>

            {/* 4 Branch Hub Admins Grid */}
            <div className="pt-1">
              <p className="text-[10.5px] font-mono uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                <Building2 size={12} className="text-primary" /> Branch Station Administrators (4 Hubs)
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {presetBranches.map((branch) => (
                  <button
                    key={branch.code}
                    onClick={() => handleQuickSelect(branch.email)}
                    className="group rounded-xl border border-border/80 bg-secondary/35 p-3 text-left transition-all hover:border-primary/50 hover:bg-secondary/70 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-primary">
                        {branch.city} Hub
                      </span>
                      <span className="text-[9px] font-mono text-muted-foreground/70">
                        {branch.code}
                      </span>
                    </div>
                    <p className="font-bold text-xs text-foreground mt-1 group-hover:text-primary transition-colors truncate">
                      {branch.adminName}
                    </p>
                    <p className="font-mono text-[10px] text-muted-foreground truncate">
                      {branch.email}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Any Additional Configured Shops */}
            {additionalShops.length > 0 && (
              <div className="pt-2">
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                  Additional Configured Hubs
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {additionalShops.map((s) => (
                    <button
                      key={s._id}
                      onClick={() => handleQuickSelect(s.adminEmail)}
                      className="group rounded-xl border border-border/60 bg-secondary/30 p-2.5 text-left transition-all hover:border-primary/50 hover:bg-secondary/60 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-foreground truncate">
                          {s.name}
                        </span>
                        <span className="text-[9px] font-mono text-primary">{s.city}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground font-mono truncate">
                        {s.adminEmail}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Security & Audit Certifications */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-muted-foreground font-mono text-[10px] sm:text-[11px]">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-primary" />
            <span>256-Bit TLS Encrypted</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Shield size={13} className="text-primary" />
            <span>Role-Scoped Permissions</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Layers size={13} className="text-primary" />
            <span>Multi-Hub Synchronization</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-border/40 py-4 px-4 text-center font-mono text-[10px] text-muted-foreground">
        <p>ESARTHI Workforce & Grid Operating System · Powered by ECOPLUG Technology</p>
      </footer>
    </div>
  );
};
