import React, { useState } from "react";
import {
  Building,
  Users,
  UserPlus,
  Plus,
  ArrowRight,
  ArrowLeft,
  Search,
  Eye,
  Edit2,
  Trash2,
  Zap,
  Phone,
  Mail,
  CheckCircle2,
} from "lucide-react";
import { DashboardStats, Employee, Shop, UserSession } from "../../types";
import ecoplugDayImage from "../../assets/ecoplug-day-station.jpeg";
import ecoplugBusImage from "../../assets/ecoplug-bus-fleet.jpeg";
import ecoplugNightImage from "../../assets/ecoplug-night-hub.jpeg";

export function getStationImage(shop?: Partial<Shop> | null, index = 0): string {
  if (!shop) return ecoplugDayImage;
  const text = `${shop.name || ""} ${shop.city || ""}`.toLowerCase();
  if (text.includes("fleet") || text.includes("bus") || text.includes("mumbai") || text.includes("bkc")) {
    return ecoplugBusImage;
  }
  if (text.includes("connaught") || text.includes("delhi") || text.includes("plaza")) {
    return ecoplugDayImage;
  }
  if (text.includes("bengaluru") || text.includes("silicon") || text.includes("hitec") || text.includes("express")) {
    return ecoplugNightImage;
  }
  const list = [ecoplugNightImage, ecoplugDayImage, ecoplugBusImage];
  return list[index % list.length];
}

interface AnalyticsOverviewProps {
  stats: DashboardStats | null;
  employees: Employee[];
  shops: Shop[];
  currentUser: UserSession | null;
  isSuperadmin: boolean;
  onOpenAddEmployeeForShop: (shop: Shop) => void;
  onOpenCreateShop: () => void;
  onEditShop: (shop: Shop) => void;
  onDeleteShop: (id: string) => void;
  onViewEmployee: (emp: Employee) => void;
  onEditEmployee: (emp: Employee) => void;
  onDeleteEmployee: (id: string) => void;
}

export const AnalyticsOverview: React.FC<AnalyticsOverviewProps> = ({
  stats,
  employees,
  shops,
  currentUser,
  isSuperadmin,
  onOpenAddEmployeeForShop,
  onOpenCreateShop,
  onEditShop,
  onDeleteShop,
  onViewEmployee,
  onEditEmployee,
  onDeleteEmployee,
}) => {
  // Check if current user is Shop Admin
  const isShopAdmin = currentUser?.type === "shopadmin";

  // If Shop Admin, automatically lock to their assigned store
  const assignedShop = isShopAdmin
    ? shops.find(
        (s) =>
          s._id === currentUser.assignedShopId ||
          (currentUser.assignedShopName && s.name.toLowerCase() === currentUser.assignedShopName.toLowerCase()) ||
          (currentUser.email && s.adminEmail?.toLowerCase() === currentUser.email.toLowerCase()) ||
          (currentUser.name && s.adminName?.toLowerCase() === currentUser.name.toLowerCase())
      ) || shops[0]
    : null;

  // State for joined store view (Superadmin can join any store)
  const [selectedStore, setSelectedStore] = useState<Shop | null>(null);
  const [storeSearch, setStoreSearch] = useState("");
  const [employeeSearch, setEmployeeSearch] = useState("");

  // Active store:
  // For a Shop Admin, it is ALWAYS their assigned store (no multi-shop overview)
  // For a Superadmin, it is whatever store they joined (selectedStore) or null for all shops
  const activeStore = isShopAdmin ? assignedShop : selectedStore;

  const totalEmployees = stats?.totalEmployees ?? employees.length;
  const activeEmployees = stats?.activeEmployees ?? employees.filter((e) => e.status === "Active").length;
  const totalPower = stats?.totalPowerCapacityKw ?? 1380;
  const totalBays = stats?.totalChargingBays ?? 46;

  // Filtered stores for Superadmin overview
  const filteredShops = shops.filter(
    (s) =>
      s.name.toLowerCase().includes(storeSearch.toLowerCase()) ||
      s.city.toLowerCase().includes(storeSearch.toLowerCase()) ||
      s.code.toLowerCase().includes(storeSearch.toLowerCase()) ||
      s.adminName.toLowerCase().includes(storeSearch.toLowerCase())
  );

  // Employees for currently active store
  const storeEmployees = activeStore
    ? employees.filter(
        (e) =>
          e.shopId === activeStore._id ||
          (activeStore.code && e.shopId === activeStore.code.toLowerCase()) ||
          (e.shopName && activeStore.name && e.shopName.toLowerCase() === activeStore.name.toLowerCase()) ||
          (activeStore.city && e.shopName?.toLowerCase().includes(activeStore.city.toLowerCase()))
      )
    : [];

  const filteredStoreEmployees = storeEmployees.filter(
    (e) =>
      e.name.toLowerCase().includes(employeeSearch.toLowerCase()) ||
      e.employeeId.toLowerCase().includes(employeeSearch.toLowerCase()) ||
      e.roleTitle.toLowerCase().includes(employeeSearch.toLowerCase()) ||
      e.department.toLowerCase().includes(employeeSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 rise">
      {/* ========================================================================= */}
      {/* MODE 1: ALL STORES & GLOBAL DASHBOARD OVERVIEW (Superadmin Only)          */}
      {/* ========================================================================= */}
      {!activeStore ? (
        <>
          {/* Visual Upper Image Board with EV Charging Hub Showcase */}
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
            {/* Background Image with Dark Vignette Gradient */}
            <div className="absolute inset-0 z-0">
              <img
                src={ecoplugNightImage}
                alt="ECOPLUG Energy India EV Charging Network"
                className="h-full w-full object-cover object-center brightness-60 contrast-110"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/50" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 p-4 sm:p-8">
              <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                <div className="max-w-2xl space-y-2">
                  <div className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-border bg-card/80 px-2.5 py-1 font-mono text-[9.5px] sm:text-[11px] font-semibold text-primary backdrop-blur-md">
                    <span className="size-1.5 rounded-full bg-emerald-400 inline-block animate-pulse shrink-0" />
                    <span className="truncate">ECOPLUG Energy India · National Fast-Charging Grid</span>
                  </div>

                  <h1 className="font-display text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                    ESARTHI EV Power Network
                  </h1>

                  <p className="text-xs sm:text-sm leading-relaxed text-slate-300 font-normal max-w-xl">
                    Enterprise workforce and charging grid operations: Monitor 400V/800V DC fast chargers, dispatch certified high-voltage field technicians, and optimize multi-city store capacity.
                  </p>

                  {/* Live Telemetry Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5 pt-1">
                    <div className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/50 px-2.5 py-1 sm:px-3 sm:py-1.5 backdrop-blur-md">
                      <Zap size={13} className="text-amber-400 fill-amber-400" />
                      <span className="font-mono text-[11px] sm:text-xs text-white">
                        <strong>{totalPower} kW</strong> Load
                      </span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/50 px-2.5 py-1 sm:px-3 sm:py-1.5 backdrop-blur-md">
                      <Zap size={13} className="text-emerald-400 fill-emerald-400" />
                      <span className="font-mono text-[11px] sm:text-xs text-white">
                        <strong>{totalBays}</strong> Fast Bays
                      </span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/50 px-2.5 py-1 sm:px-3 sm:py-1.5 backdrop-blur-md">
                      <span className="size-1.5 rounded-full bg-emerald-400 inline-block" />
                      <span className="font-mono text-[11px] sm:text-xs text-white">
                        <strong>99.9%</strong> SLA
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto pt-2 lg:pt-0">
                  <button
                    onClick={() => onOpenAddEmployeeForShop(shops[0])}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-md transition-all hover:bg-primary/90 cursor-pointer tap-active"
                  >
                    <UserPlus size={15} />
                    Onboard Technician
                  </button>

                  {isSuperadmin && (
                    <button
                      onClick={onOpenCreateShop}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-black/50 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-md transition-all hover:bg-black/70 cursor-pointer tap-active"
                    >
                      <Plus size={15} />
                      New Store
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Top Dashboard Metrics - Ultra Luxury Specular Cards */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 sm:grid-cols-4">
            <div className="rounded-2xl luxury-card luxury-card-hover p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] sm:text-[10.5px] uppercase tracking-wider text-muted-foreground/80 font-bold">
                  Total Hubs
                </span>
                <div className="size-7 sm:size-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xs">
                  <Building size={14} />
                </div>
              </div>
              <div className="mt-3">
                <p className="font-display text-2xl sm:text-3xl font-black tracking-tight text-foreground tabular-nums">
                  {shops.length}
                </p>
                <div className="mt-1 flex items-center gap-1.5 font-mono text-[10px] text-emerald-400">
                  <span className="size-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  <span>100% Operational</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl luxury-card luxury-card-hover p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] sm:text-[10.5px] uppercase tracking-wider text-muted-foreground/80 font-bold">
                  Total Staff
                </span>
                <div className="size-7 sm:size-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-xs">
                  <Users size={14} />
                </div>
              </div>
              <div className="mt-3">
                <p className="font-display text-2xl sm:text-3xl font-black tracking-tight text-foreground tabular-nums">
                  {totalEmployees}
                </p>
                <div className="mt-1 flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
                  <span>Across {shops.length} Hubs</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl luxury-card luxury-card-hover p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] sm:text-[10.5px] uppercase tracking-wider text-muted-foreground/80 font-bold">
                  Active Duty
                </span>
                <div className="size-7 sm:size-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-xs">
                  <CheckCircle2 size={14} />
                </div>
              </div>
              <div className="mt-3">
                <p className="font-display text-2xl sm:text-3xl font-black tracking-tight text-emerald-400 tabular-nums">
                  {activeEmployees}
                </p>
                <div className="mt-1 flex items-center gap-1.5 font-mono text-[10px] text-emerald-400/80">
                  <span>On-Shift Technicians</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl luxury-card luxury-card-hover p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] sm:text-[10.5px] uppercase tracking-wider text-muted-foreground/80 font-bold">
                  Fast Grid Power
                </span>
                <div className="size-7 sm:size-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-xs">
                  <Zap size={14} />
                </div>
              </div>
              <div className="mt-3">
                <p className="font-display text-2xl sm:text-3xl font-black tracking-tight text-amber-400 tabular-nums">
                  {totalPower} <span className="text-base font-normal font-sans text-amber-400/70">kW</span>
                </p>
                <div className="mt-1 flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
                  <span>{totalBays} Fast Bays Online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stores Directory Section */}
          <div className="space-y-4">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center border-b border-white/[0.08] pb-3">
              <div>
                <h3 className="font-display text-base sm:text-lg font-bold text-foreground">
                  Operating Stores & Hubs
                </h3>
                <p className="text-xs text-muted-foreground">
                  Select any store to join, view assigned staff, or register technicians
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-2.5 size-3.5 text-muted-foreground/60" />
                  <input
                    type="text"
                    placeholder="Filter stores by city, code..."
                    value={storeSearch}
                    onChange={(e) => setStoreSearch(e.target.value)}
                    className="h-9 w-full rounded-xl luxury-input pl-8.5 pr-3 text-xs text-foreground placeholder:text-muted-foreground/50 transition-all font-sans"
                  />
                </div>

                {isSuperadmin && (
                  <button
                    onClick={onOpenCreateShop}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl luxury-button px-3.5 py-2 text-xs font-bold text-primary-foreground transition-all cursor-pointer shadow-md tap-active"
                  >
                    <Plus size={14} />
                    New Store
                  </button>
                )}
              </div>
            </div>

            {/* Stores Cards Grid */}
            <div className="grid gap-4 md:grid-cols-2">
              {filteredShops.map((shop, idx) => {
                const cleanName = shop.name
                  .replace(/^ESARTHI\s+/i, "")
                  .replace(/\s*[-—]\s*[^—-]+$/, "")
                  .trim();

                const count = employees.filter(
                  (e) =>
                    e.shopId === shop._id ||
                    e.shopId === shop.code.toLowerCase() ||
                    e.shopName?.toLowerCase().includes(shop.city.toLowerCase())
                ).length;

                return (
                  <div
                    key={shop._id}
                    className="rounded-2xl luxury-card luxury-card-hover p-5 flex flex-col justify-between group overflow-hidden relative"
                  >
                    <div>
                      {/* Store Visual Header Banner */}
                      <div className="relative h-32 w-full overflow-hidden rounded-xl mb-3.5 border border-white/[0.08]">
                        <img
                          src={getStationImage(shop, idx)}
                          alt={shop.name}
                          className="h-full w-full object-cover brightness-85 group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                          <span className="rounded-lg bg-black/70 backdrop-blur-md px-2 py-0.5 font-mono text-[9.5px] font-bold text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                            <Zap size={10} className="fill-emerald-400" /> {shop.powerCapacityKw || 300} kW DC
                          </span>
                          <span className="rounded-lg bg-black/70 backdrop-blur-md px-2 py-0.5 font-mono text-[9.5px] text-slate-200 border border-white/10">
                            {shop.totalBays || 10} Fast Bays
                          </span>
                        </div>
                        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
                          <span className="font-display text-xs sm:text-sm font-bold text-white tracking-wide drop-shadow">
                            {shop.city} Station
                          </span>
                          <span className="font-mono text-[10px] text-emerald-300 font-semibold drop-shadow bg-black/50 px-2 py-0.5 rounded border border-emerald-500/20">
                            {count} Staff on duty
                          </span>
                        </div>
                      </div>

                      {/* Store Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
                              {cleanName}
                            </span>
                            <span className="rounded-md bg-white/[0.04] border border-white/[0.08] px-2 py-0.5 font-mono text-[9.5px] text-primary">
                              {shop.city}
                            </span>
                          </div>
                          <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                            {shop.code} · {shop.powerCapacityKw || 240} kW DC · {shop.totalBays || 8} Fast Bays
                          </p>
                        </div>

                        {isSuperadmin && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => onEditShop(shop)}
                              className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-white/[0.06] cursor-pointer rounded-lg transition-colors"
                              title="Edit Store Particulars"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => onDeleteShop(shop._id)}
                              className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer rounded-lg transition-colors"
                              title="Delete Store"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Store Manager Info */}
                      <div className="mt-3 pt-3 border-t border-white/[0.06] text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">Manager / Admin:</span> {shop.adminName}
                        <span className="ml-2 font-mono text-[11px] text-muted-foreground/80">({shop.adminPhone || shop.adminEmail})</span>
                      </div>
                    </div>

                    {/* Store Card Actions */}
                    <div className="mt-4 pt-3 border-t border-white/[0.06] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                      <span className="font-mono text-xs font-semibold text-primary">
                        {count} {count === 1 ? "Employee" : "Employees"}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onOpenAddEmployeeForShop(shop)}
                          className="flex-1 sm:flex-initial rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/20 px-3 py-2 text-xs font-semibold text-foreground transition-all cursor-pointer tap-active text-center"
                        >
                          + Staff
                        </button>
                        <button
                          onClick={() => setSelectedStore(shop)}
                          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl luxury-button px-3.5 py-2 text-xs font-bold text-primary-foreground transition-all cursor-pointer shadow-md tap-active"
                        >
                          Join Store <ArrowRight size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        /* ========================================================================= */
        /* MODE 2: INSIDE STORE VIEW (Shop Admin Portal OR Superadmin Joined Store)   */
        /* ========================================================================= */
        <div className="space-y-6">
          {/* Back Navigation & Store Upper Image Board */}
          {(() => {
            const cleanStoreName = activeStore.name
              .replace(/^ESARTHI\s+/i, "")
              .replace(/\s*[-—]\s*[^—-]+$/, "")
              .trim();

            return (
              <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
                <div className="absolute inset-0 z-0">
                  <img
                    src={getStationImage(activeStore, 0)}
                    alt={activeStore.name}
                    className="h-full w-full object-cover object-center brightness-60 contrast-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/50" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                </div>

                <div className="relative z-10 p-4 sm:p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                      {!isShopAdmin && (
                        <button
                          onClick={() => {
                            setSelectedStore(null);
                            setEmployeeSearch("");
                          }}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-black/40 px-3 py-1.5 text-xs font-medium text-white hover:bg-black/60 transition-colors cursor-pointer mb-3 backdrop-blur-md tap-active"
                        >
                          <ArrowLeft size={14} /> Back to All Stores
                        </button>
                      )}

                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-display text-xl sm:text-3xl font-bold text-white">
                          {cleanStoreName}
                        </h2>
                        <span className="rounded-full bg-primary/20 border border-primary/40 px-2.5 py-0.5 font-mono text-[9.5px] sm:text-[10px] text-primary font-bold">
                          {isShopAdmin ? "Store Admin Portal" : "Joined Store"} · {activeStore.city}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-slate-300 font-mono">
                        Station Code: {activeStore.code} · {activeStore.powerCapacityKw || 300} kW DC · {activeStore.totalBays || 10} Fast Bays
                      </p>

                      <div className="mt-2 text-xs text-slate-300">
                        <span className="text-white font-medium">Store Manager:</span> {activeStore.adminName}
                        <span className="ml-2 font-mono text-[11px] text-slate-400">({activeStore.adminPhone || activeStore.adminEmail})</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto">
                      <div className="relative flex-1 sm:w-48">
                        <Search className="absolute left-3 top-2.5 size-3.5 text-muted-foreground" />
                        <input
                          type="text"
                          placeholder="Search store staff..."
                          value={employeeSearch}
                          onChange={(e) => setEmployeeSearch(e.target.value)}
                          className="h-9 w-full rounded-xl border border-white/20 bg-black/50 pl-8 pr-3 text-xs text-white placeholder:text-slate-400 focus:border-primary/60 focus:outline-none backdrop-blur-md"
                        />
                      </div>

                      <button
                        onClick={() => onOpenAddEmployeeForShop(activeStore)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer shadow-md tap-active"
                      >
                        <UserPlus size={14} />
                        Add Staff to Store
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Store Quick Telemetry KPI Cards */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-border bg-card/70 p-3 sm:p-4">
              <span className="font-mono text-[9.5px] sm:text-[10px] uppercase text-muted-foreground">Store Employees</span>
              <p className="mt-1 font-display text-xl sm:text-2xl font-bold text-foreground">{storeEmployees.length}</p>
              <span className="text-[10px] sm:text-[11px] text-muted-foreground">Assigned staff</span>
            </div>

            <div className="rounded-xl border border-border bg-card/70 p-3 sm:p-4">
              <span className="font-mono text-[9.5px] sm:text-[10px] uppercase text-muted-foreground">Active On Duty</span>
              <p className="mt-1 font-display text-xl sm:text-2xl font-bold text-emerald-400">
                {storeEmployees.filter((e) => e.status === "Active").length}
              </p>
              <span className="text-[10px] sm:text-[11px] text-muted-foreground">Verified on site</span>
            </div>

            <div className="rounded-xl border border-border bg-card/70 p-3 sm:p-4">
              <span className="font-mono text-[9.5px] sm:text-[10px] uppercase text-muted-foreground">Power Capacity</span>
              <p className="mt-1 font-display text-xl sm:text-2xl font-bold text-amber-400">{activeStore.powerCapacityKw || 300} kW</p>
              <span className="text-[10px] sm:text-[11px] text-muted-foreground">DC Ultra-Fast</span>
            </div>

            <div className="rounded-xl border border-border bg-card/70 p-3 sm:p-4">
              <span className="font-mono text-[9.5px] sm:text-[10px] uppercase text-muted-foreground">Charging Bays</span>
              <p className="mt-1 font-display text-xl sm:text-2xl font-bold text-emerald-400">{activeStore.totalBays || 10}</p>
              <span className="text-[10px] sm:text-[11px] text-muted-foreground">Fast stalls</span>
            </div>
          </div>

          {/* Store Employees Table Section Header */}
          <div className="flex items-center justify-between border-b border-border pb-2">
            <div>
              <h3 className="font-display text-base font-bold text-foreground">
                Store Employee Roster ({filteredStoreEmployees.length})
              </h3>
              <p className="text-xs text-muted-foreground">
                {isShopAdmin
                  ? `Viewing personnel assigned to your store: ${activeStore.name}`
                  : `Personnel assigned exclusively to ${activeStore.name}`}
              </p>
            </div>
          </div>

          {/* MOBILE VIEW: Luxury Card Stack for Personnel (Shown on Mobile screens) */}
          <div className="block md:hidden space-y-3">
            {filteredStoreEmployees.length > 0 ? (
              filteredStoreEmployees.map((emp) => (
                <div
                  key={emp._id}
                  className="rounded-xl border border-border/80 bg-card/80 p-4 space-y-3 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      {emp.image ? (
                        <img
                          src={emp.image}
                          alt={emp.name}
                          className="size-10 rounded-full object-cover border border-border"
                        />
                      ) : (
                        <div className="flex size-10 items-center justify-center rounded-full bg-secondary font-bold text-xs text-foreground">
                          {emp.firstName?.[0] || emp.name?.[0] || "E"}
                        </div>
                      )}
                      <div>
                        <h4
                          onClick={() => onViewEmployee(emp)}
                          className="font-bold text-sm text-foreground hover:text-primary cursor-pointer"
                        >
                          {emp.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">{emp.roleTitle}</p>
                      </div>
                    </div>

                    <span
                      className={`rounded-full px-2 py-0.5 font-mono text-[9px] font-semibold ${
                        emp.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {emp.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50 text-[11px] font-mono">
                    <div>
                      <span className="text-muted-foreground uppercase text-[9px]">ID: </span>
                      <span className="text-primary font-bold">{emp.employeeId}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground uppercase text-[9px]">Level: </span>
                      <span className="text-foreground">{emp.level || "L3"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground uppercase text-[9px]">Dept: </span>
                      <span className="text-foreground truncate block">{emp.department}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground uppercase text-[9px]">Salary: </span>
                      <span className="text-foreground font-semibold">{emp.salary || "Standard"}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/50">
                    <button
                      onClick={() => onViewEmployee(emp)}
                      className="flex-1 rounded-lg bg-primary/10 border border-primary/20 py-1.5 text-center text-xs font-semibold text-primary hover:bg-primary/20 transition-colors cursor-pointer tap-active"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => onEditEmployee(emp)}
                      className="rounded-lg p-2 bg-secondary/50 text-muted-foreground hover:text-foreground cursor-pointer tap-active"
                      title="Edit"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => onDeleteEmployee(emp._id)}
                      className="rounded-lg p-2 bg-destructive/10 text-destructive hover:bg-destructive/20 cursor-pointer tap-active"
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-border bg-card/40 p-8 text-center text-xs text-muted-foreground space-y-2">
                <p>No employees found in {activeStore?.name || "this store"}.</p>
                <button
                  onClick={() => onOpenAddEmployeeForShop(activeStore)}
                  className="text-xs text-primary font-semibold hover:underline cursor-pointer"
                >
                  + Add Staff Now
                </button>
              </div>
            )}
          </div>

          {/* DESKTOP VIEW: Full Data Table (Shown on md+ screens) */}
          <div className="hidden md:block overflow-hidden rounded-xl border border-border bg-card/70 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-secondary/40 font-mono text-[10px] uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Employee Name</th>
                    <th className="px-4 py-3">Employee ID</th>
                    <th className="px-4 py-3">Role & Level</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Monthly Salary</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredStoreEmployees.length > 0 ? (
                    filteredStoreEmployees.map((emp) => (
                      <tr key={emp._id} className="hover:bg-secondary/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            {emp.image ? (
                              <img
                                src={emp.image}
                                alt={emp.name}
                                className="size-8 rounded-full object-cover border border-border"
                              />
                            ) : (
                              <div className="flex size-8 items-center justify-center rounded-full bg-secondary font-bold text-foreground">
                                {emp.firstName?.[0] || emp.name?.[0] || "E"}
                              </div>
                            )}
                            <div>
                              <p
                                onClick={() => onViewEmployee(emp)}
                                className="font-bold text-foreground hover:text-primary cursor-pointer transition-colors"
                              >
                                {emp.name}
                              </p>
                              <p className="font-mono text-[10px] text-muted-foreground">{emp.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3 font-mono text-primary font-semibold">
                          {emp.employeeId}
                        </td>

                        <td className="px-4 py-3">
                          <span className="font-medium text-foreground">{emp.roleTitle}</span>
                          <span className="ml-1 text-muted-foreground font-mono text-[10px]">({emp.level || "L3"})</span>
                        </td>

                        <td className="px-4 py-3 text-muted-foreground">
                          {emp.department}
                        </td>

                        <td className="px-4 py-3 font-medium text-foreground">
                          {emp.salary || "Standard"}
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-2 py-0.5 font-mono text-[9px] font-semibold ${
                              emp.status === "Active"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-secondary text-muted-foreground"
                            }`}
                          >
                            {emp.status}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => onViewEmployee(emp)}
                              className="rounded px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                              title="View Full Details"
                            >
                              View Details
                            </button>
                            <button
                              onClick={() => onEditEmployee(emp)}
                              className="rounded p-1 text-muted-foreground hover:text-foreground cursor-pointer"
                              title="Edit"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => onDeleteEmployee(emp._id)}
                              className="rounded p-1 text-muted-foreground hover:text-destructive cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                        No employees found in {activeStore?.name || "this store"}.
                        <div className="mt-2">
                          <button
                            onClick={() => onOpenAddEmployeeForShop(activeStore)}
                            className="text-xs text-primary font-semibold hover:underline cursor-pointer"
                          >
                            + Add Employee Now
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
